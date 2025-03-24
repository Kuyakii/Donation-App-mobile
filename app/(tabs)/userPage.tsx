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

export default function UserProfileScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const navigation = useNavigation();
    const [user, setUser] = useState<IUtilisateur | null>(null);
    const [dons, setDons] = useState<IDon[]>([]);
    const [role, setRole] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);

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

                    // Redirection vers la page admin si l'utilisateur est un admin d'association
                    if (roles.toString().includes('ADMIN_ASSO')) {
                        // @ts-ignore
                        navigation.replace('(tabs)',{
                            screen : 'AdminAssoScreen'
                        });
                        return;
                    }
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
    scrollViewContent: {
        padding: 16
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
});
