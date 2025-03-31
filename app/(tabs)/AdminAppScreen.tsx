import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Modal, FlatList, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../../components/header';
import BoutonDeconnexion from "@/components/BoutonDeconnexion";
import Colors from "@/constants/Colors";
import { IDon } from "@/backend/interfaces/IDon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BASE_URL, images} from "@/config";
import { BarChart } from "react-native-chart-kit";
import { IUtilisateur } from "@/backend/interfaces/IUtilisateur";
import {IAssociation} from "@/backend/interfaces/IAssociation";
import AssociationItem from "@/components/AssociationItem";
import {useRouter} from "expo-router";
import { EditAssociationModal } from '@/components/EditAssociationModal';
import {UtilisateursList} from "@/components/UtilisateursList";
import {t} from "i18next";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

export default function AdminAppScreen() {
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre,fontSizeGrosTitre, increaseFontSize, decreaseFontSize } = useFontStore();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors, {
        fontSizeTresPetit,
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre,
    });
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<IUtilisateur | null>(null);
    const [utilisateurs, setUtilisateurs] = useState<IUtilisateur[] | null>(null);
    const [association, setAssociation] = useState<IAssociation[] | null>(null);
    const [donsAssos, setDonsAssos] = useState<IDon[]>([]);
    const [donsRecurentsAssos, setDonsRecurentsAssos] = useState<IDon[]>([]);
    const [meilleursDonateurs, setMeilleursDonateurs] = useState<{ idUtilisateur: number, pseudonyme: string, totalMontant: number }[]>([]);
    const [nbAssosFav, setnbAssosFav] = useState<number>();
    const [selectedYear, setSelectedYear] = useState(2025);
    const [selectedAssociation, setSelectedAssociation] = useState<string | null>("0");
    const scrollViewRef = useRef<ScrollView>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('stats');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedAssociationForEdit, setSelectedAssociationForEdit] = useState<IAssociation | null>(null);
    useEffect(() => {
        const loadUser = async () => {
            try {
                const utilisateurString = await AsyncStorage.getItem('utilisateur');
                if (utilisateurString) {
                    const utilisateur: IUtilisateur = JSON.parse(utilisateurString);
                    setUser(utilisateur);
                }
            } catch (error) {
                console.error("Erreur lors du chargement de l'utilisateur:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        const getAssociation = async () => {
            if (!user) return;

            try {
                const response = await fetch(`${BASE_URL}/associations`);
                const data = await response.json();
                setAssociation(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des associations', error);
            }
        };
        if (user) {
            getAssociation();
        }
    }, [user]);

    const handleNavigate = (idAssos: number) => {
        router.replace({
            pathname: "/detailsAssos",
            params: { id: idAssos},
        });
    };

    useEffect(() => {
        const getUtilisateurs = async () => {
            if (!user) return;

            try {
                const response = await fetch(`${BASE_URL}/getUtilisateurs`);
                const data = await response.json();
                setUtilisateurs(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs', error);
            }
        };
        if (user) {
            getUtilisateurs();
        }
    }, [user]);

    useEffect(() => {
        const fetchDonsAssos = async () => {
            if (!user) return;

            try {
                const response = await fetch(`${BASE_URL}/getDons`);
                const data = await response.json();
                setDonsAssos(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des dons des associations', error);
            }
        };

        if (user) {
            fetchDonsAssos();
        }
    }, [user]);

    useEffect(() => {
        const fetchMeilleursDonateurs = async () => {
            if (!user) return;

            try {
                const response = await fetch(`${BASE_URL}/getMeilleursDonateurs`);
                const data = await response.json();
                setMeilleursDonateurs(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des meilleurs donateurs', error);
            }
        };
        if (user) {
            fetchMeilleursDonateurs();
        }
    }, [user]);

    if (isLoading || !user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>{t('loading_admin')}</Text>
            </View>
        );
    }

    const screenWidth = Dimensions.get("window").width;
    const getSelectedAssociationName = () => {
        // @ts-ignore
        if (selectedAssociation === "0" || selectedAssociation === 0) return "Toutes les associations";
        const asso = association?.find(a => a.idAssociation+"" === selectedAssociation);
        return asso ? asso.nom : "Toutes les associations";
    };

    // @ts-ignore
    const filteredDons = selectedAssociation === "0" || selectedAssociation === 0
        ? donsAssos
        : donsAssos.filter(don => don.idAssociation === parseInt(selectedAssociation as string));

    // Fonction pour calculer les montants par mois
    const getMontantsParMois = (year: number) => {
        const montants: Record<number, number> = {};
        filteredDons.forEach((d) => {
            const donYear = new Date(d.dateDon).getFullYear();
            const month = new Date(d.dateDon).getMonth(); // 0 = Janvier
            if (donYear === year) {
                montants[month] = (montants[month] || 0) + d.montant;
            }
        });
        return montants;
    };

    const montantsParMois = getMontantsParMois(selectedYear);
    const labels = ["JAN", "FEV", "MAR", "AVR", "MAI", "JUI", "JUIL", "AOU", "SEP", "OCT", "NOV", "DEC"];
    const data = labels.map((_, index) => montantsParMois[index] || 0);
    const totalDons = data.reduce((a, b) => a + b, 0);

    // Calculer une valeur maximale appropriée pour l'échelle Y
    const maxValue = Math.max(...data);
    const yAxisMax = maxValue <= 0 ? 100 : Math.ceil(maxValue * 1.2 / 100) * 100;

    // Formatter les valeurs sur l'axe Y pour réduire l'encombrement
    const formatYLabel = (value: number) => {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}k€`;
        }
        return `${value}€`;
    };

    const getRecentDonsCount = (dons: IDon[]) => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        return dons.filter(don => (new Date(don.dateDon) >= thirtyDaysAgo)).length;
    };

    const getRecentDonsCountReccurent = (dons: IDon[]) => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        return dons.filter(don => (new Date(don.dateDon) >= thirtyDaysAgo) && (don.typeDon === 'RECURRENT')).length;
    };

    function getDonsParAssociation(id : number) {
        let somme =0;
        let nbDon = 0;
        donsAssos.forEach((d) => {
            if(d.idAssociation === id) {
                somme += d.montant;
                ++nbDon;
            }
        })
        let moyenne = Math.round(somme/nbDon);
        return [somme, moyenne, nbDon];
    }

    const renderStats = () => (
        <View style={styles.container}>
            {/* Sélecteur d'année */}
            <View style={styles.yearSelector}>
                {[2023, 2024, 2025].map((year) => (
                    <TouchableOpacity
                        key={year}
                        style={[styles.yearButton, selectedYear === year && styles.selectedYear]}
                        onPress={() => setSelectedYear(year)}
                    >
                        <Text style={[styles.yearText, selectedYear === year && styles.selectedYearText]}>
                            {year}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {/* Sélecteur d'association - NOUVEAU */}
            <View style={styles.adminSection}>
                <Text style={[styles.sectionTitle, {fontSize : fontSizeSousTitre}]}>{t('choose_asso')}</Text>

                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setDropdownVisible(true)}
                >
                    <Text style={[styles.dropdownButtonText, {fontSize : fontSize}]}>{getSelectedAssociationName()}</Text>
                    <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>

                <Modal
                    transparent={true}
                    visible={dropdownVisible}
                    onRequestClose={() => setDropdownVisible(false)}
                    animationType="fade"
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setDropdownVisible(false)}
                    >
                        <View style={styles.dropdownListContainer}>
                            <FlatList
                                data={[{idAssociation: 0, nom: "Toutes les associations"}, ...(association || [])]}
                                keyExtractor={(item) => item.idAssociation+""}
                                renderItem={({item}) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.dropdownItem,
                                            item.idAssociation+"" === selectedAssociation ? styles.dropdownItemSelected : null
                                        ]}
                                        onPress={() => {
                                            setSelectedAssociation(item.idAssociation+"");
                                            setDropdownVisible(false);
                                        }}
                                    >
                                        <Text style={[
                                            styles.dropdownItemText,{fontSize : fontSize},
                                            item.idAssociation+"" === selectedAssociation ? styles.dropdownItemTextSelected : null
                                        ]}>
                                            {item.nom}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            {/* Statistiques des dons */}
            <View style={styles.adminSection}>
                <Text style={[styles.sectionTitle, {fontSize : fontSizeSousTitre}]}>{t('stats_dons')}</Text>
                <Text style={[{color : themeColors.text}]}>{t("total_dons")}{selectedYear} : <Text style={styles.highlight}>{totalDons}€</Text></Text>
                <Text style={[{color : themeColors.text}]}>{t('dons_recurrents')} <Text style={styles.highlight}>{donsRecurentsAssos.length}</Text></Text>
            </View>

            {/* Favoris */}
            <View style={styles.adminSection}>
                <Text style={[styles.sectionTitle, {fontSize : fontSizeSousTitre}]}>{t('favorites')}</Text>
                <Text style={[{color : themeColors.text}]}>{t('user_fav')}<Text style={styles.highlight}>{nbAssosFav}</Text></Text>
            </View>
            {/* Graphique des dons - AMÉLIORÉ */}
            <View style={styles.chartContainer}>
                <Text style={[styles.sectionTitle, {fontSize : fontSizeSousTitre}]}>{t('evolution_dons')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <BarChart
                        data={{
                            labels: labels,
                            datasets: [
                                {
                                    data: data,
                                }
                            ]
                        }}
                        width={Math.max(screenWidth, 600)}
                        height={350}
                        yAxisSuffix="€"
                        // @ts-ignore
                        yAxisMax={yAxisMax}
                        yAxisMin={0}
                        fromZero
                        showValuesOnTopOfBars={true}
                        chartConfig={{
                            backgroundColor: themeColors.tabIconDefault,
                            backgroundGradientFrom:  themeColors.background,
                            backgroundGradientTo:  themeColors.background,
                            decimalPlaces: 0,
                            color: () => themeColors.primary.background,
                            labelColor: () => themeColors.text,
                            style: {
                                borderRadius: 16,
                            },
                            barPercentage: 0.7,
                            propsForLabels: {
                                fontSize: fontSizePetit,
                                fontWeight: 'bold',
                            },
                            propsForBackgroundLines: {
                                strokeDasharray: '',
                                stroke: themeColors.text,
                                strokeWidth: 1,
                            },
                        }}
                        yLabelsOffset={10}  // Décale l'affichage des labels Y pour éviter la coupure
                        withInnerLines={true}
                        withHorizontalLabels={true}
                        withVerticalLabels={true}
                        verticalLabelRotation={0}
                        horizontalLabelRotation={0}
                    />
                </ScrollView>

            </View>

            {/* Activités récentes */}
            <View style={styles.adminSection}>
                <Text style={[styles.sectionTitle, {fontSize : fontSizeSousTitre}]}>{t('recent_activity')}</Text>
                <Text style={[{color : themeColors.text}]}>{t('new_dons')} <Text style={styles.highlight}>{getRecentDonsCount(filteredDons)}</Text></Text>
                <Text style={[{color : themeColors.text}]}>{t('new_recurrent_dons')} <Text style={styles.highlight}>{getRecentDonsCountReccurent(filteredDons)}</Text></Text>
            </View>

            {/* Wall of Givers - Meilleurs donateurs */}
            <View style={styles.adminSection}>
                <Text style={[styles.sectionTitle, {fontSize : fontSizeSousTitre}]}>🏆 Wall of Givers 🏆</Text>
                <Text style={[{marginBottom: 10}, {color : themeColors.text}]}>{t('best_donateurs')}</Text>
                {meilleursDonateurs.length > 0 ? (
                    meilleursDonateurs.map((donateur, index) => (
                        <View key={donateur.idUtilisateur} style={styles.donateurItem}>
                            <Text style={[styles.donateurRank, {fontSize : fontSize}]}>{index + 1}.</Text>
                            <Text style={[styles.donateurName, {fontSize : fontSize}]}>{donateur.pseudonyme}</Text>
                            <Text style={[styles.donateurAmount, {fontSize : fontSize}]}>{donateur.totalMontant}€</Text>
                        </View>
                    ))
                ) : (
                    <Text>{t('no_donateurs_yet')}</Text>
                )}
            </View>
            <BoutonDeconnexion />
        </View>
    );
    // @ts-ignore
    const renderUsers = () => (
        <View style={styles.container}>
            <Text style={[styles.title, {fontSize : fontSizeSousTitre}]}>{t('gestion_user')}</Text>
            <UtilisateursList
                // @ts-ignore
                utilisateurs={utilisateurs}
                onUpdateUsers={(updatedUsers) => setUtilisateurs(updatedUsers)}
                user={user}
            />
        </View>
    );
    const handleEditAssociation = (association: IAssociation) => {
        setSelectedAssociationForEdit(association);
        setIsEditModalVisible(true);
    };

    const handleSaveAssociation = async (updatedAssociation: Partial<IAssociation>) => {
        try {
            const response = await fetch(`${BASE_URL}/updateAssociation/${updatedAssociation.idAssociation}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAssociation)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de l\'association');
            }

            // Mettre à jour la liste des associations
            setAssociation(prevAssociations =>
                // @ts-ignore
                prevAssociations.map(asso =>
                    asso.idAssociation === updatedAssociation.idAssociation
                        ? { ...asso, ...updatedAssociation }
                        : asso
                )
            );

            Alert.alert("Succès", "L'association a été mise à jour avec succès");
        } catch (error) {
            console.error('Erreur de mise à jour:', error);
            Alert.alert("Erreur", "Impossible de mettre à jour l'association");
        }
    };


    const handleDeleteAssociation = (id: number) => {
        // Afficher une confirmation avant suppression
        Alert.alert(
            "Confirmation",
            "Êtes-vous sûr de vouloir supprimer cette association?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    onPress: async () => {
                        try {
                            const response = await fetch(`${BASE_URL}/deleteAssociations/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                }
                            });

                            console.log('Response status:', response.status);
                            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
                            const responseText = await response.text();
                            console.log('Response body:', responseText);
                            if (response.status !== 201 && response.status !== 200) {
                                throw new Error(`Erreur de suppression. Statut: ${response.status}, Réponse: ${responseText}`);
                            }
                            let data;
                            setAssociation(prevAssociations =>
                                // @ts-ignore
                                prevAssociations.filter(asso => asso.idAssociation !== id)
                            );
                            Alert.alert("Succès", "L'association a été supprimée avec succès");
                        } catch (error) {
                            console.error('Erreur détaillée de suppression:', error);
                            Alert.alert(
                                "Erreur",
                                // @ts-ignore
                                `Impossible de supprimer l'association. Détails: ${error.message}`,
                                [{ text: "OK" }]
                            );
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };
    const renderAssociations = () => (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={[styles.title, {fontSize : fontSizeSousTitre}]}>{t('gestion_asso')}</Text>
            </View>
            {association.map((asso: IAssociation) => (
                <View key={asso.idAssociation} style={styles.associationCard}>
                    <TouchableOpacity
                        style={styles.associationContent}
                        onPress={() => handleNavigate(asso.idAssociation)}
                    >
                        <AssociationItem
                            name={asso.nom}
                            description={asso.descriptionCourte}
                            imageName={asso.nomImage}
                        />

                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={[styles.statLabel, {fontSize : fontSizeTresPetit}]}>{t('somme_don')}</Text>
                                <Text style={[styles.statValue, {fontSize : fontSize}]}>{getDonsParAssociation(asso.idAssociation)[0]} €</Text>
                            </View>

                            <View style={styles.statItem}>
                                <Text style={[styles.statLabel, {fontSize : fontSizeTresPetit}]}>{t('moyenne')}</Text>
                                <Text style={[styles.statValue, {fontSize : fontSize}]}>{getDonsParAssociation(asso.idAssociation)[1] || 0} €</Text>
                            </View>

                            <View style={styles.statItem}>
                                <Text style={[styles.statLabel, {fontSize : fontSizeTresPetit}]}>{t('nombre')}</Text>
                                <Text style={[styles.statValue, {fontSize : fontSize}]}>{getDonsParAssociation(asso.idAssociation)[2]}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.associationActions}>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.editButton]}
                            onPress={() => handleEditAssociation(asso)}
                        >
                            <Text style={styles.actionButtonText}>{t('edit_amount')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => handleDeleteAssociation(asso.idAssociation)}
                        >
                            <Text style={styles.actionButtonText}>{t('delete')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
            <EditAssociationModal
                isVisible={isEditModalVisible}
                association={selectedAssociationForEdit}
                utilisateurs={utilisateurs}
                onClose={() => setIsEditModalVisible(false)}
                onSave={handleSaveAssociation}
            />
        </View>
    );

    return (
        <View style={styles.container2}>
            <Header />
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollViewContent}>
                <Text style={[styles.welcomeTitle, {fontSize : fontSizeTitre}]}>{t('hello_admin')}{user.pseudonyme}</Text>
                <Text style={[styles.welcomeTitle2, {fontSize : fontSizeSousTitre}]}>{t('admin_app')} </Text>
                <View style={styles.tabs}>
                    <TouchableOpacity
                        onPress={() => setActiveTab('stats')}
                        style={[
                            styles.tabButton,
                            activeTab === 'stats' && styles.activeTab
                        ]}
                    >
                        <Text style={[
                            styles.tabButtonText,
                            activeTab === 'stats' && styles.activeTabButtonText
                        ]}>{t('stats_tab')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('users')}
                        style={[
                            styles.tabButton,
                            activeTab === 'users' && styles.activeTab
                        ]}
                    >
                        <Text style={[
                            styles.tabButtonText,
                            activeTab === 'users' && styles.activeTabButtonText
                        ]}>{t('user_tab')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('associations')}
                        style={[
                            styles.tabButton,
                            activeTab === 'associations' && styles.activeTab
                        ]}
                    >
                        <Text style={[
                            styles.tabButtonText,
                            activeTab === 'associations' && styles.activeTabButtonText
                        ]}>{t('asso_tab')}</Text>
                    </TouchableOpacity>
                </View>
                {activeTab === 'stats' && renderStats()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'associations' && renderAssociations()}
            </ScrollView>
        </View>
    );
}

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.background,
        marginBottom: 125,
        minHeight: 500
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContent: {
        padding: 16
    },
    welcomeTitle: {
        fontSize: fontSizes.fontSizeTitre,
        fontWeight: 'bold',
        marginBottom: 10,
        color: themeColors.text,
    },
    welcomeTitle2: {
        fontSize: fontSizes.fontSize,
        marginBottom: 10,
        color: themeColors.text,
    },
    adminSection: {
        backgroundColor: themeColors.admin_section.background,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: themeColors.card.border,
        marginBottom: 15,
    },
    chartContainer: {
        backgroundColor: themeColors.admin_section.background,
        padding: 15,
        borderWidth: 1,
        borderColor: themeColors.card.border,
        borderRadius: 10,
        marginBottom: 15,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 10,
        paddingRight: 15,
    },
    sectionTitle: {
        fontSize: fontSizes.fontSizeSousTitre,
        fontWeight: "bold",
        marginBottom: 15,
        color: themeColors.text,
    },
    highlight: {
        color: "purple",
        fontWeight: "bold"
    },
    yearSelector: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    yearButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: themeColors.card.border,
    },
    selectedYear: {
        backgroundColor: "purple"
    },
    selectedYearText: {
        color: "white"
    },
    yearText: {
        color: themeColors.text,
        fontWeight: "bold",
    },
    adminButton: {
        backgroundColor: "purple",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginVertical: 10,
        marginBottom: 30,
    },
    adminButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: fontSizes.fontSize,
    },
    propsForLabels: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    donateurItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: themeColors.background,
        padding: 12,
        borderWidth: 1,
        borderColor: themeColors.card.border,
        borderRadius: 8,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    donateurRank: {
        fontSize: fontSizes.fontSize,
        fontWeight: "bold",
        color: "gold",
        width: 30,
    },
    donateurName: {
        fontSize: fontSizes.fontSize,
        fontWeight: "600",
        flex: 1,
        textAlign: "left",
        color: themeColors.text,
    },
    donateurAmount: {
        fontSize: fontSizes.fontSize,
        fontWeight: "bold",
        color: themeColors.primary.background,
    },
    assoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3D9FF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    assoImage: {
        width: 80,
        height: 80,
        marginRight: 15,
    },
    assoName: {
        fontSize: fontSizes.fontSizeSousTitre,
        fontWeight: 'bold',
        flex: 1,
        flexShrink: 1,
        flexWrap: 'wrap',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    keyboardAvoidingView: {
        width: '100%',
        alignItems: 'center',
    },
    modalView: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalScrollView: {
        width: '100%',
    },
    modalScrollViewContent: {
        paddingBottom: 10,
    },
    modalTitle: {
        fontSize: fontSizes.fontSizeTitre,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'purple',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: fontSizes.fontSize,
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: fontSizes.fontSize,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        minWidth: '45%',
        alignItems: 'center',
    },
    buttonCancel: {
        backgroundColor: '#f3f3f3',
    },
    buttonCancelText: {
        fontWeight: 'bold',
        fontSize: fontSizes.fontSize,
        color: '#333',
    },
    buttonSave: {
        backgroundColor: 'purple',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: fontSizes.fontSize,
        color: 'white',
    },
    dropdownButton: {
        backgroundColor: themeColors.background,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownButtonText: {
        fontSize: fontSizes.fontSize,
        color: themeColors.text,
    },
    dropdownIcon: {
        fontSize: fontSizes.fontSizePetit,
        color: 'purple',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    dropdownListContainer: {
        backgroundColor: themeColors.background,
        borderRadius: 8,
        width: '90%',
        borderWidth: 1,
        borderColor: themeColors.card.border,
        maxHeight: 300,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemSelected: {
        backgroundColor: '#F3E5F5',
    },
    dropdownItemText: {
        fontSize: fontSizes.fontSize,
        color: themeColors.text,
    },
    dropdownItemTextSelected: {
        color: 'purple',
        fontWeight: 'bold',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        backgroundColor: themeColors.background,
        borderRadius: 10,
        padding: 4,
        borderWidth: 1,
        borderColor: themeColors.card.border,
    },
    tabButton: {
        padding: 10,
        backgroundColor: 'transparent',
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 2,
    },
    activeTab: {
        backgroundColor: themeColors.primary.background,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tabButtonText: {
        color: themeColors.text,
        opacity: 0.8,
        fontWeight: '500',
    },
    activeTabButtonText: {
        color: themeColors.primary.text,
        fontWeight: 'bold',
    },
    title: {
        fontSize: fontSizes.fontSize,
        fontWeight: 'bold',
        marginBottom: 10,
        color: themeColors.text,
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    container2: {
        backgroundColor: themeColors.background,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    associationCard: {
        backgroundColor: themeColors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        marginBottom: 16,
        shadowColor: themeColors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 20,
        overflow: 'hidden',
    },
    associationContent: {
        padding: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: fontSizes.fontSizeTresPetit,
        color: themeColors.text,
        opacity: 0.8,
        marginBottom: 2,
    },
    statValue: {
        fontSize: fontSizes.fontSize,
        fontWeight: '600',
        color: themeColors.text,
        opacity: 0.8,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        padding: 8,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    associationActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    actionButton: {
        flex: 1,
        padding: 12,
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: '#4CAF50',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: '500',
    },
});
