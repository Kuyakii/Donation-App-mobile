import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Button,
    Platform,
    StatusBar, ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/header';
import SearchBar from '../../components/SearchBar';
import Section from '../../components/Section';
import AssociationItem from '../../components/AssociationItem';
import DonationCard from '../../components/ProfileComponents/DonationCard';
import TopAssociations from '../../components/ProfileComponents/TopAssociations';
import BoutonDeconnexion from "@/components/BoutonDeconnexion";
import {checkLogin, estConnecte, getAllDons, getUtilisateurConnecte} from "@/helpers";
import AssociationFavoriteList from "@/components/AssociationFavoriteList";
import {FavoriteProvider} from "@/context/FavoriteContext";
import Colors from "@/constants/Colors";
import {IDon} from "@/backend/interfaces/IDon";
import {useNavigation} from "@react-navigation/native";
import {IUtilisateur} from "@/backend/interfaces/IUtilisateur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {BASE_URL} from "@/config";

export default function UserProfileScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const [user, setUser] = useState<IUtilisateur | null>(null);
    const [dons, setDons] = useState<IDon[]>([]);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                // Vérifier si l'utilisateur est connecté en récupérant le token
                const storedToken = await AsyncStorage.getItem('token');
                console.log('Token récupéré:', storedToken); // Afficher le token récupéré

                if (!storedToken) {
                    // Si pas de token, rediriger vers la page de connexion
                    // @ts-ignore
                    navigation.navigate('login');
                    return; // Arrêter l'exécution ici
                }

                // Si le token existe, récupérer les informations de l'utilisateur
                const utilisateurString = await AsyncStorage.getItem('utilisateur');
                if (utilisateurString) {
                    const utilisateur: IUtilisateur = JSON.parse(utilisateurString);
                    console.log("Utilisateur récupéré :", utilisateur);
                    setUser(utilisateur);
                } else {
                    // Si l'utilisateur n'existe pas, rediriger vers la page de connexion
                    // @ts-ignore
                    navigation.navigate('login');
                }
            } catch (error) {
                console.error("Erreur lors de la vérification de la connexion:", error);
                // @ts-ignore
                navigation.navigate('login');
            } finally {
                setIsLoading(false); // Arrêter le chargement une fois la vérification terminée
            }
        };

        checkLogin(); // Exécuter la fonction lors du montage du composant
    }, [navigation]);

    useEffect(() => {
        const fetchDons = async () => {
            try {
                const response = await fetch(`${BASE_URL}/getDons`);
                const data = await response.json();
                setDons(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des dons', error);
            }
        };
        fetchDons();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Chargement du profil...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Utilisateur non trouvé</Text>
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

                    <TouchableOpacity style={styles.actionButton}>
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
    scrollViewContent: {
        paddingBottom: 100, // Espace en bas pour bien voir le bouton deconnexion
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFFFF',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },

});
