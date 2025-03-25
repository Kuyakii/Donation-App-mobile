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
import { useTranslation } from 'react-i18next';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const { t } = useTranslation();
    const associations = getAllAssociation();
    const slicedAssociations = associations.slice(0, 3);
    const [modalVisible, setModalVisible] = useState(false);
    const [token, setToken] = useState<string | null>(null);

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
                            {t('login_required_for_favorites')} {/* Clé de traduction */}
                        </Text>
                    </View>
                )}

                {/* Section des associations disponibles */}
                <Section title={t('all_associations')} icon="list" onSeeAllPress={() => setModalVisible(true)}>
                    {slicedAssociations.map((asso: IAssociation) => (
                        <TouchableOpacity key={asso.idAssociation} onPress={() => handleNavigate(asso.idAssociation)}>
                            <AssociationItem name={asso.nom} description={asso.descriptionCourte} imageName={asso.nomImage} />
                        </TouchableOpacity>
                    ))}
                </Section>

                {/* Autres sections */}
                <Section title={t('popular_associations')} icon="trending-up" onSeeAllPress={undefined}>
                    {[1, 2].map(num => <AssociationItem key={num} name={`${t('asso')} ${num}`} description={`${t('description_asso')} ${num}`} imageName={undefined} />)}
                </Section>

                <Section title={t('mental_health_associations')} icon="heart" onSeeAllPress={undefined}>
                    {[1, 2].map(num => <AssociationItem key={num} name={`${t('asso')} ${num}`} description={`${t('description_asso')} ${num}`} imageName={undefined} />)}
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
