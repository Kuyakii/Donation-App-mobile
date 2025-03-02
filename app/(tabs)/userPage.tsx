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
import BoutonDeconnexion from "@/components/BoutonDeconnexion";
import {checkLogin, getUtilisateurConectee} from "@/helpers";  // Import de composants spécifiques au profil

export default function UserProfileScreen() {

    checkLogin();
    const user = getUtilisateurConectee();
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
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`}
                                                        description={`Description asso ${num}`} imageName={undefined} />)}
                </Section>

                {/* Section des Associations santé mentale */}
                <Section title="Associations santé mentale" icon="heart">
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`}
                                                        description={`Description asso ${num}`} imageName={undefined} />)}
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
