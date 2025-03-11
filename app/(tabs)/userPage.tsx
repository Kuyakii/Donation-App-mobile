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
    StatusBar
} from 'react-native';
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
import BoutonDeconnexion from "@/components/BoutonDeconnexion";
import {checkLogin, getUtilisateurConnectee} from "@/helpers";  // Import de composants spécifiques au profil

export default function UserProfileScreen() {

    checkLogin();
    const user = getUtilisateurConnectee();
    let Pseudo;
    let email
    if(user){
        Pseudo = user.pseudonyme;
        email = user.email;
        console.log("Pseudo " + Pseudo + " Email " + email);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header />

            <SearchBar />
            <BoutonDeconnexion></BoutonDeconnexion>
            <ScrollView style={styles.scrollView}>
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

                {/* Section de progression des dons */}
                <DonationCard />

                {/* Section des Top Associations */}
                <TopAssociations />

                {/* Section des Associations favorites */}
                <Section title="Mes associations favorites" icon="star" onSeeAllPress={undefined}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favoritesList}>
                        {[1, 2, 3, 4].map(num => <FavoriteItem key={num} name={`Asso ${num}`} />)}
                    </ScrollView>
                </Section>

                {/* Section des Associations populaires */}
                <Section title="Associations populaire" icon="trending-up" onSeeAllPress={undefined}>
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`}
                                                        description={`Description asso ${num}`} imageName={undefined} />)}
                </Section>

                {/* Section des Associations santé mentale */}
                <Section title="Associations santé mentale" icon="heart" onSeeAllPress={undefined}>
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`}
                                                        description={`Description asso ${num}`} imageName={undefined} />)}
                </Section>
            </ScrollView>
        </SafeAreaView>
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
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: 'black',
        backgroundColor: '#EADEF4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionText: {
        fontSize: 14,
    },
    favoritesList: {
        width: '100%',
        justifyContent: 'space-between',
    },
});
