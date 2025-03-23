import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import Header from '../../components/header';
import BoutonDeconnexion from "@/components/BoutonDeconnexion";
import Colors from "@/constants/Colors";
import { IDon } from "@/backend/interfaces/IDon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config";
import { BarChart } from "react-native-chart-kit";
import { IUtilisateur } from "@/backend/interfaces/IUtilisateur";

export default function AdminAssoScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<IUtilisateur | null>(null);
    const [donsAssos, setDonsAssos] = useState<IDon[]>([]);
    const [selectedYear, setSelectedYear] = useState(2025);

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
                    <Text>Dons récurrents actifs : 7</Text>
                </View>

                {/* Favoris */}
                <View style={styles.adminSection}>
                    <Text style={styles.sectionTitle}>Favoris</Text>
                    <Text>Utilisateurs ayant mis en favoris l'association : 37</Text>
                </View>

                {/* Graphique des dons */}
                <View style={styles.adminSection}>
                    <Text style={styles.sectionTitle}>Évolution des dons</Text>
                    <BarChart
                        data={{
                            labels: labels,
                            datasets: [{ data: data }]
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5
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
        padding: 10,
        borderRadius: 5,
        alignItems: "center"
    },
    adminButtonText: {
        color: "white",
        fontWeight: "bold"
    },
});
