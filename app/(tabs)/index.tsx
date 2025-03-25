import React, {useCallback, useEffect, useState} from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Header from '../../components/header';
import SearchBar from '../../components/SearchBar';
import Section from '../../components/Section';
import AssociationItem from '../../components/AssociationItem';
import { IAssociation } from "@/backend/interfaces/IAssociation";
import { estConnecte, getAllAssociation, getAssociationsByType } from "@/helpers";
import AssociationListModal from "@/components/AssociationListModal";
import AssociationTypeModal from "@/components/AssociationsTypeModal";
import AssociationFavoriteList from "@/components/AssociationFavoriteList";
import {FavoriteProvider} from "@/context/FavoriteContext";
import {useRouter} from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import FirstTimeModal from "@/components/FirstTimeModal";

// Empêche le splash screen de disparaître automatiquement
SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const associations = getAllAssociation();
    const slicedAssociations = associations.slice(0, 3);
    const { associations: mentalHealthAssociations, loading: loadingMentalHealth } = getAssociationsByType(3);
    const { associations: CancerAssociations, loading: loadingCancer } = getAssociationsByType(6);
    const { associations: AddictionAssociations, loading: loadingAddiction } = getAssociationsByType(1);
    const { associations: HandicapAssociations, loading: loadingHandicap } = getAssociationsByType(2);


    const [modalVisible, setModalVisible] = useState(false);
    const [mentalHealthModalVisible, setMentalHealthModalVisible] = useState(false);
    const [CancerModalVisible, setCancerModalVisible] = useState(false);
    const [AddictionModalVisible, setAddictionModalVisible] = useState(false);
    const [HandicapModalVisible, setHandicapModalVisible] = useState(false);

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
        <View style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar barStyle="dark-content" />
            <FirstTimeModal/>
            <Header/>
            <SearchBar associations={associations} />
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

                <Section title="Toutes les associations" icon="list" onSeeAllPress={() => setModalVisible(true)}>
                    {slicedAssociations.map((asso: IAssociation) => (
                        <TouchableOpacity key={asso.idAssociation} onPress={() => handleNavigate(asso.idAssociation)}>
                            <AssociationItem name={asso.nom} description={asso.descriptionCourte} imageName={asso.nomImage} />
                        </TouchableOpacity>
                    ))}
                </Section>

                <Section title="Associations populaires" icon="trending-up" onSeeAllPress={undefined}>
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`} description={`Description asso ${num}`} imageName={undefined} />)}
                </Section>

                {/* Section des associations de santé mentale */}
                <Section
                    title="Associations santé mentale"
                    icon="psychology"
                    onSeeAllPress={() => setMentalHealthModalVisible(true)}
                >
                    {loadingMentalHealth ? (
                        <Text style={styles.loadingText}>Chargement des associations...</Text>
                    ) : mentalHealthAssociations.length > 0 ? (
                        mentalHealthAssociations.slice(0, 3).map((asso: IAssociation) => (
                            <TouchableOpacity key={asso.idAssociation} onPress={() => handleNavigate(asso.idAssociation)}>
                                <AssociationItem
                                    name={asso.nom}
                                    description={asso.descriptionCourte}
                                    imageName={asso.nomImage}
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>Aucune association de santé mentale disponible</Text>
                    )}
                </Section>

                {/* Section des associations d'addictions */}
                <Section
                    title="Associations addictions"
                    icon="no-drinks"
                    onSeeAllPress={() => setAddictionModalVisible(true)}
                >
                    {loadingAddiction ? (
                        <Text style={styles.loadingText}>Chargement des associations...</Text>
                    ) : AddictionAssociations.length > 0 ? (
                        AddictionAssociations.slice(0, 3).map((asso: IAssociation) => (
                            <TouchableOpacity key={asso.idAssociation} onPress={() => handleNavigate(asso.idAssociation)}>
                                <AssociationItem
                                    name={asso.nom}
                                    description={asso.descriptionCourte}
                                    imageName={asso.nomImage}
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>Aucune association d'addictions disponible</Text>
                    )}
                </Section>
                {/* Section des associations cancers */}
                <Section
                    title="Associations cancers"
                    icon="bloodtype"
                    onSeeAllPress={() => setCancerModalVisible(true)}
                >
                    {loadingCancer ? (
                        <Text style={styles.loadingText}>Chargement des associations...</Text>
                    ) : CancerAssociations.length > 0 ? (
                       CancerAssociations.slice(0, 3).map((asso: IAssociation) => (
                            <TouchableOpacity key={asso.idAssociation} onPress={() => handleNavigate(asso.idAssociation)}>
                                <AssociationItem
                                    name={asso.nom}
                                    description={asso.descriptionCourte}
                                    imageName={asso.nomImage}
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>Aucune association de cancers disponible</Text>
                    )}
                </Section>
                {/* Section des associations handicap */}
                <Section
                    title="Associations handicap"
                    icon="accessible"
                    onSeeAllPress={() => setHandicapModalVisible(true)}
                >
                    {loadingHandicap ? (
                        <Text style={styles.loadingText}>Chargement des associations...</Text>
                    ) : HandicapAssociations.length > 0 ? (
                        HandicapAssociations.slice(0, 3).map((asso: IAssociation) => (
                            <TouchableOpacity key={asso.idAssociation} onPress={() => handleNavigate(asso.idAssociation)}>
                                <AssociationItem
                                    name={asso.nom}
                                    description={asso.descriptionCourte}
                                    imageName={asso.nomImage}
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>Aucune association d'handicap disponible</Text>
                    )}
                </Section>

            </ScrollView>

            {/* Modal pour afficher toutes les associations */}
            <AssociationListModal visible={modalVisible} onClose={() => setModalVisible(false)} associations={associations} />

            {/* Modal pour afficher les associations de santé mentale */}
            <AssociationTypeModal
                visible={mentalHealthModalVisible}
                onClose={() => setMentalHealthModalVisible(false)}
                associations={mentalHealthAssociations}
                typeTitle="Associations santé mentale"
            />
            {/* Modal pour afficher les associations de cancer */}
            <AssociationTypeModal
                visible={CancerModalVisible}
                onClose={() => setCancerModalVisible(false)}
                associations={CancerAssociations}
                typeTitle="Associations cancers"
            />{/* Modal pour afficher les associations d'handicap */}
            <AssociationTypeModal
                visible={HandicapModalVisible}
                onClose={() => setHandicapModalVisible(false)}
                associations={HandicapAssociations}
                typeTitle="Associations d'handicap"
            />{/* Modal pour afficher les associations d'addictions */}
            <AssociationTypeModal
                visible={AddictionModalVisible}
                onClose={() => setAddictionModalVisible(false)}
                associations={AddictionAssociations}
                typeTitle="Associations d'addictions"
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom : 15,
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
    loadingText: {
        padding: 10,
        fontStyle: 'italic',
        color: '#666',
    },
    noDataText: {
        padding: 10,
        fontStyle: 'italic',
        color: '#666',
    }
});