import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/header';
import DonationCard from '../../components/ProfileComponents/DonationCard';
import TopAssociations from '../../components/ProfileComponents/TopAssociations';
import BoutonDeconnexion from "@/components/BoutonDeconnexion";
import AssociationFavoriteList from "@/components/AssociationFavoriteList";
import { FavoriteProvider } from "@/context/FavoriteContext";
import Colors from "@/constants/Colors";
import { IDon } from "@/backend/interfaces/IDon";
import { useNavigation } from "@react-navigation/native";
import { IUtilisateur } from "@/backend/interfaces/IUtilisateur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config";
import AssociationListModal from "@/components/DonationListModal";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function UserProfileScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const [user, setUser] = useState<IUtilisateur | null>(null);
    const [dons, setDons] = useState<IDon[]>([]);
    const [role, setRole] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedYear, setSelectedYear] = useState(2025);


    useEffect(() => {
        const checkLogin = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                console.log('Token récupéré:', storedToken);

                if (!storedToken) {
                    // @ts-ignore
                    navigation.navigate('login');
                    return;
                }

                const utilisateurString = await AsyncStorage.getItem('utilisateur');
                if (utilisateurString) {
                    const utilisateur: IUtilisateur = JSON.parse(utilisateurString);
                    console.log("Utilisateur récupéré :", utilisateur);
                    setUser(utilisateur);
                } else {
                    // @ts-ignore
                    navigation.navigate('login');
                }

                const roles = await AsyncStorage.getItem('role');
                console.log('Role récupéré:', roles);

                if (roles) {
                    setRole(roles);
                }
            } catch (error) {
                console.error("Erreur lors de la vérification de la connexion:", error);
                // @ts-ignore
                navigation.navigate('login');
            } finally {
                setIsLoading(false);
            }
        };

        checkLogin();
    }, [navigation]);
    const [donsAssos, setDonsAssos] = useState<IDon[]>([]);

    useEffect(() => {
        const fetchDons = async () => {
            try {
                const response = await fetch(`${BASE_URL}/getDons`);
                const data = await response.json();
                setDons(data);
                if (role.toString().includes('ADMIN_ASSO')){
                    const response2 = await fetch(`${BASE_URL}/getDonsAdmin/${email}`);
                    const data2 = await response2.json();
                    setDonsAssos(data2);
                }

            } catch (error) {
                console.error('Erreur lors de la récupération des dons', error);
            }
        };
        fetchDons();
    }, []);

    if (isLoading || !user) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Chargement du profil...</Text>
            </View>
        );
    }

    const { pseudonyme: Pseudo, email } = user;
    console.log("Pseudo " + Pseudo + " Email " + email);

    const donsUser: IDon[] = [];
    let montantDonne: number = 0;
    const donsParAssos: Record<number, number> = {};

    dons.forEach((d: IDon) => {
        if (d.idUtilisateur === user.idUtilisateur) {
            donsUser.push(d);
            montantDonne += d.montant;
            if (!donsParAssos[d.idAssociation]) {
                donsParAssos[d.idAssociation] = 0;
            }
            donsParAssos[d.idAssociation] += d.montant;
        }
    });

    const donsParAssosTries = Object.entries(donsParAssos)
        .sort(([, montantA], [, montantB]) => montantB - montantA)
        .slice(0, 3);

    // Afficher une interface différente pour les administrateurs d'application
    if (role.toString().includes('ADMIN_ASSO')) {
        const screenWidth = Dimensions.get("window").width;

        // Fonction pour calculer les montants par mois
        const getMontantsParMois = (year: number) => {
            const montants: Record<number, number> = {};
            donsAssos.forEach((d) => {
                const donYear = new Date(d.dateDon).getFullYear();

                const month = new Date(d.dateDon).getMonth(); // 0 = Janvier
                if (donYear === year) {
                    montants[month] = (montants[month] || 0) + d.montant;
                    console.log(d.montant.toString());
                }
            });
            return montants;
        };

        const montantsParMois = getMontantsParMois(selectedYear);
        const labels = ["JAN", "FEV", "MAR", "AVR", "MAI", "JUI", "JUIL", "AOU", "SEP", "OCT", "NOV", "DEC"];
        const data3 = labels.map((_, index) => montantsParMois[index] || 0);
        const totalDons = data3.reduce((a, b) => a + b, 0);

        return (
            <View style={styles.container}>
                <Header />
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <Text style={styles.welcomeTitle}>Bonjour, Admin</Text>

                    {/* Sélecteur d'année */}
                    <View style={styles.yearSelector}>
                        {[2023, 2024, 2025].map((year) => (
                            <TouchableOpacity
                                key={year}
                                style={[styles.yearButton, selectedYear === year && styles.selectedYear]}
                                onPress={() => setSelectedYear(year)}
                            >
                                <Text style={styles.yearText}>{year}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Statistiques des dons */}
                    <View style={styles.adminSection}>
                        <Text style={styles.sectionTitle}>Statistiques des dons</Text>
                        <Text>Total des dons de {selectedYear} : <Text style={styles.highlight}>{totalDons}€</Text></Text>
                        <Text>Dons récurrents actifs : 7</Text>
                    </View>

                    {/* Favoris */}
                    <View style={styles.adminSection}>
                        <Text style={styles.sectionTitle}>Favoris</Text>
                        <Text>Utilisateurs ayant mis en favoris l’association : 37</Text>
                    </View>

                    {/* Graphique des dons */}
                    <View style={styles.adminSection}>
                        <Text style={styles.sectionTitle}>Évolution des dons</Text>
                        <BarChart
                            data={{
                                labels: labels,
                                datasets: [{ data: data3 }]
                            }}
                            width={screenWidth * 0.9}
                            height={300}
                            chartConfig={{
                                backgroundColor: "#f3f3f3",
                                backgroundGradientFrom: "#ffffff",
                                backgroundGradientTo: "#ffffff",
                                decimalPlaces: 0,
                                color: () => `rgba(128, 0, 128, 1)`, // Violet
                                labelColor: () => `black`,
                            }}
                            style={{ marginVertical: 8, borderRadius: 10 }}
                        />
                    </View>

                    {/* Activités récentes */}
                    <View style={styles.adminSection}>
                        <Text style={styles.sectionTitle}>Activités récentes (inf à 30j)</Text>
                        <Text>Nouveaux dons : 5</Text>
                        <Text>Nouveaux dons récurrents : 1</Text>
                        <Text>Nouveaux favoris : 0</Text>
                    </View>

                    {/* Bouton de modification */}
                    <TouchableOpacity style={styles.adminButton}>
                        <Text style={styles.adminButtonText}>Modifier ma page association</Text>
                    </TouchableOpacity>

                    <BoutonDeconnexion />
                </ScrollView>
            </View>
        );
    }

    // Page standard pour les utilisateurs
    return (
        <View style={styles.container}>
            <Header />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.welcomeTitle}>Bonjour, {Pseudo}</Text>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconContainer}>
                            <Feather name="user" size={icon_size} color="black" />
                            <Text style={styles.actionText}>Profil</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(true)}>
                        <View style={styles.iconContainer}>
                            <Feather name="gift" size={icon_size} color="black" />
                            <Text style={styles.actionText}>Dons</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconContainer}>
                            <Feather name="star" size={icon_size} color="#FFD700" />
                            <Text style={styles.actionText}>Favoris</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <DonationCard montantDon={montantDonne} />

                <TopAssociations topAssos={donsParAssosTries} />

                <FavoriteProvider>
                    <AssociationFavoriteList />
                </FavoriteProvider>

                <BoutonDeconnexion />
            </ScrollView>
            <AssociationListModal visible={modalVisible} onClose={() => setModalVisible(false)} dons={donsUser} total={montantDonne} />
        </View>
    );
}

const icon_size = 30;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    actionButton: {
        alignItems: 'center',
        width: '30%',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: Colors.container_light.backgroundColor,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    actionText: {
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollViewContent: { padding: 16 },
    welcomeTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    adminSection: { backgroundColor: "#f3f3f3", padding: 15, borderRadius: 10, marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
    highlight: { color: "purple", fontWeight: "bold" },
    yearSelector: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
    yearButton: { padding: 10, borderRadius: 5, borderWidth: 1, borderColor: "purple" },
    selectedYear: { backgroundColor: "purple" },
    yearText: { color: "black", fontWeight: "bold" },
    adminButton: { backgroundColor: "purple", padding: 10, borderRadius: 5, alignItems: "center" },
    adminButtonText: { color: "white", fontWeight: "bold" },
});
