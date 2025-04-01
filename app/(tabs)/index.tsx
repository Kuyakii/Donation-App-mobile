import React, {useCallback, useEffect, useState} from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import Header from '../../components/header';
import SearchBar from '../../components/SearchBar';
import Section from '../../components/Section';
import AssociationItem from '../../components/AssociationItem';
import { IAssociation } from "@/backend/interfaces/IAssociation";
import {estConnecte, getAllAssociation, getAssociationsByType, getAssosPopulaires} from "@/helpers";
import AssociationListModal from "@/components/AssociationListModal";
import AssociationTypeModal from "@/components/AssociationsTypeModal";
import AssociationFavoriteList from "@/components/AssociationFavoriteList";
import {FavoriteProvider} from "@/context/FavoriteContext";
import {useRouter} from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useTranslation } from 'react-i18next';
import FirstTimeModal from "@/components/FirstTimeModal";
import useFontStore from "@/store/fontStore";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import {ThemeColors} from "@/constants/ThemeColor";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre,fontSizeGrosTitre} = useFontStore();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];
    const styles = getStyles(themeColors, {
        fontSizeTresPetit,
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre,
        fontSizeGrosTitre
    });
    const { t } = useTranslation();
    const associations = getAllAssociation();
    const slicedAssociations = associations.slice(0, 3);
    const { associations: mentalHealthAssociations, loading: loadingMentalHealth } = getAssociationsByType(3);
    const { associations: CancerAssociations, loading: loadingCancer } = getAssociationsByType(6);
    const { associations: AddictionAssociations, loading: loadingAddiction } = getAssociationsByType(1);
    const { associations: HandicapAssociations, loading: loadingHandicap } = getAssociationsByType(2);
    const assosPopulaires = getAssosPopulaires();
    console.log("INDEX" + assosPopulaires)

    const [modalVisible, setModalVisible] = useState(false);
    const [mentalHealthModalVisible, setMentalHealthModalVisible] = useState(false);
    const [CancerModalVisible, setCancerModalVisible] = useState(false);
    const [AddictionModalVisible, setAddictionModalVisible] = useState(false);
    const [HandicapModalVisible, setHandicapModalVisible] = useState(false);

    const [token, setToken] = useState<string | null>(null);

    const userConnected = estConnecte();
    console.log(userConnected);

    const router = useRouter();

    const handleNavigate = (idAssos: number) => {
        router.push({
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
                            {t('login_required_for_favorites')} {/* Clé de traduction */}
                        </Text>
                    </View>
                )}

                <Section title={t('all_associations')} icon="list" onSeeAllPress={() => setModalVisible(true)}>
                    {slicedAssociations.map((asso: IAssociation) => (
                        <TouchableOpacity key={asso.idAssociation} onPress={() => handleNavigate(asso.idAssociation)}>
                            <AssociationItem name={asso.nom} description={asso.descriptionCourte} imageName={asso.nomImage} />
                        </TouchableOpacity>
                    ))}
                </Section>

                {/* Autres sections */}
                <Section title={t('popular_associations')} icon="trending-up" onSeeAllPress={undefined}>
                    {assosPopulaires.map((asso: IAssociation) => (
                        <TouchableOpacity key={asso.idAssociation} onPress={() => handleNavigate(asso.idAssociation)}>
                            <AssociationItem name={asso.nom} description={asso.descriptionCourte} imageName={asso.nomImage} />
                        </TouchableOpacity>
                    ))}
                </Section>

                {/* Section des associations de santé mentale */}
                <Section
                    title={t('mental_health_associations')}
                    icon="psychology"
                    onSeeAllPress={() => setMentalHealthModalVisible(true)}
                >
                    {loadingMentalHealth ? (
                        <Text style={styles.loadingText}>{t('loading_associations')}</Text>
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
                        <Text style={styles.noDataText}>{t('no_mental_health_associations')}</Text>
                    )}
                </Section>

                {/* Section des associations d'addictions */}
                <Section
                    title={t('addiction_associations')}
                    icon="no-drinks"
                    onSeeAllPress={() => setAddictionModalVisible(true)}
                >
                    {loadingAddiction ? (
                        <Text style={styles.loadingText}>{t('loading_associations')}</Text>
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
                        <Text style={styles.noDataText}>{t('no_addiction_associations')}</Text>
                    )}
                </Section>
                {/* Section des associations cancers */}
                <Section
                    title={t('cancer_associations')}
                    icon="bloodtype"
                    onSeeAllPress={() => setCancerModalVisible(true)}
                >
                    {loadingCancer ? (
                        <Text style={styles.loadingText}>{t('loading_associations')}</Text>
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
                        <Text style={styles.noDataText}>{t('no_cancer_associations')}</Text>
                    )}
                </Section>
                {/* Section des associations handicap */}
                <Section
                    title={t('disability_associations')}
                    icon="accessible"
                    onSeeAllPress={() => setHandicapModalVisible(true)}
                >
                    {loadingHandicap ? (
                        <Text style={styles.loadingText}>{t('loading_associations')}</Text>
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
                        <Text style={styles.noDataText}>{t('no_disability_associations')}</Text>
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
                typeTitle={t('mental_health_associations')}
            />
            {/* Modal pour afficher les associations de cancer */}
            <AssociationTypeModal
                visible={CancerModalVisible}
                onClose={() => setCancerModalVisible(false)}
                associations={CancerAssociations}
                typeTitle={t('cancer_associations')}
            />{/* Modal pour afficher les associations d'handicap */}
            <AssociationTypeModal
                visible={HandicapModalVisible}
                onClose={() => setHandicapModalVisible(false)}
                associations={HandicapAssociations}
                typeTitle={t('disability_associations')}
            />{/* Modal pour afficher les associations d'addictions */}
            <AssociationTypeModal
                visible={AddictionModalVisible}
                onClose={() => setAddictionModalVisible(false)}
                associations={AddictionAssociations}
                typeTitle={t('addiction_associations')}
            />
        </View>
    );
}

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 15,
        backgroundColor: themeColors.background,
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
        backgroundColor: themeColors.primaryAlt?.background || '#ffcc00',
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    bannerText: {
        color: themeColors.text,
        fontSize: fontSizes.fontSize,
        textAlign: "center",
        paddingVertical: 10,
    },
    loadingText: {
        padding: 10,
        fontStyle: 'italic',
        color: themeColors.text,
        fontSize: fontSizes.fontSizePetit,
    },
    noDataText: {
        padding: 10,
        fontStyle: 'italic',
        color: themeColors.text,
        fontSize: fontSizes.fontSizePetit,
    }
});
