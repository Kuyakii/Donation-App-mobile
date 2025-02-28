import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Button} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/header';  // Import du Header
import SearchBar from '../../components/SearchBar';  // Import du SearchBar
import Section from '../../components/Section';  // Import de la Section
import FavoriteItem from '../../components/FavoriteItem';  // Import de FavoriteItem
import AssociationItem from '../../components/AssociationItem';  // Import de AssociationItem
import DonationCard from '../../components/ProfileComponents/DonationCard';  // Import de composants spécifiques au profil
import TopAssociations from '../../components/ProfileComponents/TopAssociations';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Navigation} from "lucide-react";
import {useNavigation} from "@react-navigation/native";
import BoutonDeconnexion from "@/components/BoutonDeconnexion";  // Import de composants spécifiques au profil

export default function UserProfileScreen() {
    const navigation = useNavigation();
    const [token, setToken] = useState<string | null>(null); // Gérer l'état du token

    useEffect(() => {
        const checkToken = async () => {
            try {
                // Attendre la résolution de la promesse AsyncStorage
                const storedToken = await AsyncStorage.getItem('token');
                console.log('Token récupéré:', storedToken); // Afficher le token récupéré

                if (!storedToken) {
                    // Si pas de token, rediriger vers la page de connexion
                    // @ts-ignore
                    navigation.navigate('login');
                } else {
                    setToken(storedToken); // Mettre à jour l'état avec le token
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du token:', error);
                // @ts-ignore
                navigation.navigate('login');
            }
        };

        checkToken(); // Exécuter la fonction lors du montage du composant
    }, [navigation]);

    const utilisateur = AsyncStorage.getItem('utilisateur');
    console.log(utilisateur);

    return (
        <SafeAreaView style={styles.container}>
            <Header />

            <SearchBar />
            <BoutonDeconnexion></BoutonDeconnexion>
            <ScrollView style={styles.scrollView}>
                <Text style={styles.welcomeTitle}>Bonjour, efqef</Text>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconContainer}>
                            <Feather name="user" size={24} color="black" />
                        </View>
                        <Text style={styles.actionText}>Profil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconContainer}>
                            <Feather name="gift" size={24} color="black" />
                        </View>
                        <Text style={styles.actionText}>Dons</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconContainer}>
                            <Feather name="star" size={24} color="#FFD700" />
                        </View>
                        <Text style={styles.actionText}>Favoris</Text>
                    </TouchableOpacity>
                </View>

                {/* Section de progression des dons */}
                <DonationCard />

                {/* Section des Top Associations */}
                <TopAssociations />

                {/* Section des Associations favorites */}
                <Section title="Mes associations favorites" icon="star">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favoritesList}>
                        {[1, 2, 3].map(num => <FavoriteItem key={num} name={`Asso ${num}`} />)}
                    </ScrollView>
                </Section>

                {/* Section des Associations populaires */}
                <Section title="Associations populaire" icon="trending-up">
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`} description={`Description asso ${num}`} />)}
                </Section>

                {/* Section des Associations santé mentale */}
                <Section title="Associations santé mentale" icon="heart">
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`} description={`Description asso ${num}`} />)}
                </Section>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        alignItems: 'center',
        width: '30%',
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    actionText: {
        fontSize: 14,
    },
    favoritesList: {
        paddingRight: 16,
    },
});
