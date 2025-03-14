import React, {useCallback, useEffect, useState} from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Header from '../../components/header';
import SearchBar from '../../components/SearchBar';
import Section from '../../components/Section';
import AssociationItem from '../../components/AssociationItem';
import { IAssociation } from "@/backend/interfaces/IAssociation";
import { estConnecte, getAllAssociation } from "@/helpers";
import AssociationListModal from "@/components/AssociationListModal";
import AssociationFavoriteList from "@/components/AssociationFavoriteList";
import {FavoriteProvider} from "@/context/FavoriteContext";
import {useRouter} from "expo-router";
import * as SplashScreen from 'expo-splash-screen';

// Empêche le splash screen de disparaître automatiquement
SplashScreen.preventAutoHideAsync();


export default function Layout() {
    const associations = getAllAssociation();
    const slicedAssociations = associations.slice(0, 3);
    const [modalVisible, setModalVisible] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    // Vérification de l'état de connexion
    const userConnected = estConnecte();
    console.log(userConnected);

    const router = useRouter();

    const handleNavigate = (idAssos: number) => {
        router.replace({
            pathname: "/detailsAssos",
            params: { id: idAssos},
        });
    };

    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Préparez les ressources ou effectuez des opérations asynchrones
                // ...
            } catch (e) {
                console.warn(e);
            } finally {
                // Marquez l'application comme prête
                setAppIsReady(true);
            }
        }

        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (appIsReady) {
            // Cela masque le splash screen une fois que l'application est prête
            await SplashScreen.hideAsync();
        }
    }, [appIsReady]);

    if (!appIsReady) {
        return null;
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />
            <SearchBar />
            <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Section des associations favorites - visible uniquement si l'utilisateur est connecté */}
                {userConnected ? (
                    <FavoriteProvider>
                        <AssociationFavoriteList />
                    </FavoriteProvider>
                ) : (
                    <View style={styles.banner}>
                        <Text style={styles.bannerText}>
                            Vous devez être connecté pour gérer vos associations favorites de manière plus fine.
                        </Text>
                    </View>
                )}

                {/* Section des associations disponibles */}
                <Section title="Toutes les associations" icon="list" onSeeAllPress={() => setModalVisible(true)}>
                    {slicedAssociations.map((asso: IAssociation) => (
                        <TouchableOpacity key={asso.idAssociation} onPress={() => handleNavigate(asso.idAssociation)}>
                            <AssociationItem name={asso.nom} description={asso.descriptionCourte} imageName={asso.nomImage} />
                        </TouchableOpacity>
                    ))}
                </Section>

                {/* Autres sections */}
                <Section title="Associations populaire" icon="trending-up" onSeeAllPress={undefined}>
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`} description={`Description asso ${num}`} imageName={undefined} />)}
                </Section>

                <Section title="Associations santé mentale" icon="heart" onSeeAllPress={undefined}>
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`} description={`Description asso ${num}`} imageName={undefined} />)}
                </Section>

            </ScrollView>

            {/* Modal pour afficher toutes les associations */}
            <AssociationListModal visible={modalVisible} onClose={() => setModalVisible(false)} associations={associations} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    favoritesList: {
        paddingRight: 16,
    },
    banner: {
        backgroundColor: '#ffcc00',
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    bannerText: {
        color: 'black',
        fontSize: 16,
    },
});
