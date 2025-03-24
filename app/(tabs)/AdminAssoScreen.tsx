import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions, Image, Alert, Modal, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import Header from '../../components/header';
import BoutonDeconnexion from "@/components/BoutonDeconnexion";
import Colors from "@/constants/Colors";
import { IDon } from "@/backend/interfaces/IDon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BASE_URL, images} from "@/config";
import { BarChart } from "react-native-chart-kit";
import { IUtilisateur } from "@/backend/interfaces/IUtilisateur";
import {IAssociation} from "@/backend/interfaces/IAssociation";

export default function AdminAssoScreen() {
    const { height: screenHeight } = Dimensions.get('window');

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<IUtilisateur | null>(null);
    const [association, setAssociation] = useState<IAssociation | null>(null);
    const [donsAssos, setDonsAssos] = useState<IDon[]>([]);
    const [donsRecurentsAssos, setDonsRecurentsAssos] = useState<IDon[]>([]);
    const [meilleursDonateurs, setMeilleursDonateurs] = useState<{ idUtilisateur: number, pseudonyme: string, totalMontant: number }[]>([]);
    const [nbAssosFav, setnbAssosFav] = useState<number>();
    const [selectedYear, setSelectedYear] = useState(2025);
    const scrollViewRef = useRef<ScrollView>(null);

    // States pour la modal d'édition
    const [modalVisible, setModalVisible] = useState(false);
    const [editedNom, setEditedNom] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedDescriptionCourte, setEditedDescriptionCourte] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                const response = await fetch(`${BASE_URL}/associationsByMail/${user.email}`);
                const data = await response.json();
                setAssociation(data);

                if (data) {
                    setEditedNom(data.nom);
                    setEditedDescription(data.description);
                    setEditedDescriptionCourte(data.descriptionCourte);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des dons de l\'association', error);
            }
        };
        if (user) {
                getAssociation();
        }
    }, [user]);

    useEffect(() => {
        const fetchDonsAssos = async () => {
            if (!user) return;

            try {
                const response = await fetch(`${BASE_URL}/getDonsAdmin/${user.email}`);
                const data = await response.json();
                setDonsAssos(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des dons de l\'association', error);
            }
        };

        if (user) {
            fetchDonsAssos();
        }
    }, [user]);

    useEffect(() => {
        const fetchDonsAssosRecurents = async () => {
            if (!user) return;

            try {
                const response = await fetch(`${BASE_URL}/getDonsRecurrent/${user.email}`);
                const data = await response.json();
                setDonsRecurentsAssos(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des dons récurrents de l\'association', error);
            }
        };

        if (user) {
            fetchDonsAssosRecurents();
        }
    }, [user]);
    useEffect(() => {
        const fetchNbAssosFav = async () => {
            if (!user) return;

            try {
                const response = await fetch(`${BASE_URL}/getAssosFavorites/${user.email}`);
                const data = await response.json();
                setnbAssosFav(data);
            } catch (error) {
                console.error('Erreur lors de la récupération du nombre d\'associations fav', error);
            }
        };

        if (user) {
            fetchNbAssosFav();
        }
    }, [user]);

    useEffect(() => {
        const fetchMeilleursDonateurs = async () => {
            if (!user) return;

            try {
                const response = await fetch(`${BASE_URL}/getMeilleurDonateur/${user.email}`);
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

    // Fonction pour calculer les montants par mois
    const getMontantsParMois = (year: number) => {
        const montants: Record<number, number> = {};
        donsAssos.forEach((d) => {
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

        return dons.filter(don => new Date(don.dateDon) >= thirtyDaysAgo).length;
    };

    const handleUpdateAssociation = async () => {
        if (!association) return;

        setIsSubmitting(true);

        try {
            const updatedAssociation = {
                ...association,
                nom: editedNom,
                description: editedDescription,
                descriptionCourte: editedDescriptionCourte
            };

            const response = await fetch(`${BASE_URL}/updateAssociation/${association.idAssociation}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedAssociation),
            });

            if (response.ok) {
                // Mettre à jour l'état local avec les nouvelles valeurs
                setAssociation(updatedAssociation);
                setModalVisible(false);
                Alert.alert('Succès', 'Informations de l\'association mises à jour avec succès');
            } else {
                Alert.alert('Erreur', 'Impossible de mettre à jour les informations');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour des informations:', error);
            Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollViewContent}
            >
                <Text style={styles.welcomeTitle}>Bonjour, Admin, administrateur de l'association </Text>
                {/* Association Card*/}
                <View style={styles.assoCard}>
                    {association ? (
                        <>
                            <Image
                                style={styles.assoImage}
                                // @ts-ignore
                                source={images[association.nomImage]}
                            />
                            <Text style={styles.assoName}>{association.nom}</Text>
                        </>
                    ) : (
                        <Text>Chargement des informations de l'association...</Text>
                    )}
                </View>

                {/* Bouton de modification */}
                <TouchableOpacity
                    style={styles.adminButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.adminButtonText}>Modifier ma page association</Text>
                </TouchableOpacity>

                {/* Modal d'édition */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.keyboardAvoidingView}
                        >
                            <View style={[styles.modalView, { maxHeight: screenHeight * 0.8 }]}>
                                <Text style={styles.modalTitle}>Modifier les informations</Text>

                                <ScrollView style={styles.modalScrollView} contentContainerStyle={styles.modalScrollViewContent}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Nom</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={editedNom}
                                            onChangeText={setEditedNom}
                                            placeholder="Nom de l'association"
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Description</Text>
                                        <TextInput
                                            style={[styles.input, styles.textArea]}
                                            value={editedDescription}
                                            onChangeText={setEditedDescription}
                                            placeholder="Description détaillée"
                                            multiline={true}
                                            numberOfLines={4}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Description courte</Text>
                                        <TextInput
                                            style={[styles.input, styles.textArea]}
                                            value={editedDescriptionCourte}
                                            onChangeText={setEditedDescriptionCourte}
                                            placeholder="Description courte"
                                            multiline={true}
                                            numberOfLines={2}
                                        />
                                    </View>
                                </ScrollView>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonCancel]}
                                        onPress={() => setModalVisible(false)}
                                        disabled={isSubmitting}
                                    >
                                        <Text style={styles.buttonCancelText}>Annuler</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.button, styles.buttonSave]}
                                        onPress={handleUpdateAssociation}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <ActivityIndicator size="small" color="white" />
                                        ) : (
                                            <Text style={styles.buttonText}>Enregistrer</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

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

                {/* Statistiques des dons */}
                <View style={styles.adminSection}>
                    <Text style={styles.sectionTitle}>Statistiques des dons</Text>
                    <Text>Total des dons de {selectedYear} : <Text style={styles.highlight}>{totalDons}€</Text></Text>
                    <Text>Dons récurrents actifs : {donsRecurentsAssos.length}</Text>
                </View>

                {/* Favoris */}
                <View style={styles.adminSection}>
                    <Text style={styles.sectionTitle}>Favoris</Text>
                    <Text>Utilisateurs ayant mis en favoris l'association : {nbAssosFav}</Text>
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
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                },
                                propsForBackgroundLines: {
                                    strokeDasharray: '',
                                    stroke: "rgba(0, 0, 0, 0.1)",
                                    strokeWidth: 1,
                                },
                            }}
                            yLabelsOffset={20}  // Décale l'affichage des labels Y pour éviter la coupure
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
                    <Text>Nouveaux dons : {getRecentDonsCount(donsAssos)}</Text>
                    <Text>Nouveaux dons récurrents : {getRecentDonsCount(donsRecurentsAssos)}</Text>
                </View>

                {/* Wall of Givers - Meilleurs donateurs */}
                <View style={styles.adminSection}>
                    <Text style={styles.sectionTitle}>🏆 Wall of Givers 🏆</Text>
                    <Text style={{marginBottom: 10}}>Meilleurs donateurs de : {association?.nom}</Text>
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
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        fontSize: 24,
        fontWeight: 'bold',
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
});
