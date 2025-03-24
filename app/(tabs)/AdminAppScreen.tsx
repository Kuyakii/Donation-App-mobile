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
import {useNavigation} from "@react-navigation/native";
import { EditAssociationModal } from '@/components/EditAssociationModal';
import {UtilisateursList} from "@/components/UtilisateursList";

export default function AdminAppScreen() {
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
                <Text>Chargement du profil administrateur...</Text>
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
            : donsAssos.filter(don => don.idAssociation === parseInt(selectedAssociation));

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
                <Text style={styles.sectionTitle}>Choisir une association</Text>

                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setDropdownVisible(true)}
                >
                    <Text style={styles.dropdownButtonText}>{getSelectedAssociationName()}</Text>
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
                                            styles.dropdownItemText,
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
                <Text style={styles.sectionTitle}>Statistiques des dons</Text>
                <Text>Total des dons de {selectedYear} : <Text style={styles.highlight}>{totalDons}€</Text></Text>
                <Text>Dons récurrents actifs : <Text style={styles.highlight}>{donsRecurentsAssos.length}</Text></Text>
            </View>

            {/* Favoris */}
            <View style={styles.adminSection}>
                <Text style={styles.sectionTitle}>Favoris</Text>
                <Text>Utilisateurs ayant mis en favoris l'association : <Text style={styles.highlight}>{nbAssosFav}</Text></Text>
            </View>
            {/* Graphique des dons - AMÉLIORÉ */}
            <View style={styles.chartContainer}>
                <Text style={styles.sectionTitle}>Évolution des dons</Text>
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
                        yAxisMax={yAxisMax}
                        yAxisMin={0}
                        fromZero
                        showValuesOnTopOfBars={true}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: () => "rgba(128, 0, 128, 0.8)",
                            labelColor: () => "rgba(0, 0, 0, 0.8)",
                            style: {
                                borderRadius: 16,
                            },
                            barPercentage: 0.7,
                            propsForLabels: {
                                fontSize: 12,
                                fontWeight: 'bold',
                            },
                            propsForBackgroundLines: {
                                strokeDasharray: '',
                                stroke: "rgba(0, 0, 0, 0.1)",
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
                <Text style={styles.sectionTitle}>Activités récentes (inf à 30j)</Text>
                <Text>Nouveaux dons : <Text style={styles.highlight}>{getRecentDonsCount(filteredDons)}</Text></Text>
                <Text>Nouveaux dons récurrents : <Text style={styles.highlight}>{getRecentDonsCountReccurent(filteredDons)}</Text></Text>
            </View>

            {/* Wall of Givers - Meilleurs donateurs */}
            <View style={styles.adminSection}>
                <Text style={styles.sectionTitle}>🏆 Wall of Givers 🏆</Text>
                <Text style={{marginBottom: 10}}>Meilleurs donateurs de l'application Soteria</Text>
                {meilleursDonateurs.length > 0 ? (
                    meilleursDonateurs.map((donateur, index) => (
                        <View key={donateur.idUtilisateur} style={styles.donateurItem}>
                            <Text style={styles.donateurRank}>{index + 1}.</Text>
                            <Text style={styles.donateurName}>{donateur.pseudonyme}</Text>
                            <Text style={styles.donateurAmount}>{donateur.totalMontant}€</Text>
                        </View>
                    ))
                ) : (
                    <Text>Aucun donateur pour l'instant.</Text>
                )}
            </View>
            <BoutonDeconnexion />
    </View>
    );
    // @ts-ignore
    const renderUsers = () => (
            <View style={styles.container}>
                <Text style={styles.title}>Gestion des Utilisateurs</Text>
                <UtilisateursList
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
                                prevAssociations.filter(asso => asso.idAssociation !== id)
                            );
                            Alert.alert("Succès", "L'association a été supprimée avec succès");
                        } catch (error) {
                            console.error('Erreur détaillée de suppression:', error);
                            Alert.alert(
                                "Erreur",
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
    const navigation = useNavigation();
    const renderAssociations = () => (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Gestion des Associations</Text>
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
                                <Text style={styles.statLabel}>Somme des dons:</Text>
                                <Text style={styles.statValue}>{getDonsParAssociation(asso.idAssociation)[0]} €</Text>
                            </View>

                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Moyenne:</Text>
                                <Text style={styles.statValue}>{getDonsParAssociation(asso.idAssociation)[1] || 0} €</Text>
                            </View>

                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Nombre:</Text>
                                <Text style={styles.statValue}>{getDonsParAssociation(asso.idAssociation)[2]}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.associationActions}>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => handleEditAssociation(asso)}
                    >
                        <Text style={styles.actionButtonText}>Modifier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeleteAssociation(asso.idAssociation)}
                    >
                        <Text style={styles.actionButtonText}>Supprimer</Text>
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
                <Text style={styles.welcomeTitle}>Bonjour, Admin {user.pseudonyme}</Text>
                <Text style={styles.welcomeTitle2}>Administrateur de l'application </Text>
                <View style={styles.tabs}>
                <TouchableOpacity onPress={() => setActiveTab('stats')} style={styles.tabButton}><Text>Stats</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('users')} style={styles.tabButton}><Text>Utilisateurs</Text></TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('associations')} style={styles.tabButton}><Text>Associations</Text></TouchableOpacity>
            </View>
            {activeTab === 'stats' && renderStats()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'associations' && renderAssociations()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10
    },
    welcomeTitle2: {
        fontSize: 18,
        marginBottom: 10
    },
    adminSection: {
        backgroundColor: "#f3f3f3",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15
    },
    chartContainer: {
        backgroundColor: "#f3f3f3",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 10,
        paddingRight: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15
    },
    highlight: {
        color: "purple",
        fontWeight: "bold"
    },
    yearSelector: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },
    yearButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "purple"
    },
    selectedYear: {
        backgroundColor: "purple"
    },
    selectedYearText: {
        color: "white"
    },
    yearText: {
        color: "black",
        fontWeight: "bold"
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
        fontSize: 16,
    },
    propsForLabels: {
        fontSize: 12, // Réduit de 14 à 12
        fontWeight: 'bold',
    },
    donateurItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    donateurRank: {
        fontSize: 16,
        fontWeight: "bold",
        color: "gold",
        width: 30,
    },
    donateurName: {
        fontSize: 16,
        fontWeight: "600",
        flex: 1,
        textAlign: "left",
    },
    donateurAmount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "purple",
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
        fontSize: 18,
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'purple',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
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
        fontSize: 16,
        color: '#333',
    },
    buttonSave: {
        backgroundColor: 'purple',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
    },
    dropdownButton: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownButtonText: {
        fontSize: 16,
        color: 'black',
    },
    dropdownIcon: {
        fontSize: 12,
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
        backgroundColor: 'white',
        borderRadius: 8,
        width: '90%',
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
        fontSize: 16,
        color: 'black',
    },
    dropdownItemTextSelected: {
        color: 'purple',
        fontWeight: 'bold',
    },
    tabs: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
    tabButton: { padding: 10, backgroundColor: '#ddd', borderRadius: 5 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    listItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'},
    container2: {backgroundColor: 'white'},

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
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
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
