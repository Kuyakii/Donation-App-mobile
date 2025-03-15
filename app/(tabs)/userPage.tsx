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
import Header from '../../components/header';
import SearchBar from '../../components/SearchBar';
import Section from '../../components/Section';
import AssociationItem from '../../components/AssociationItem';
import DonationCard from '../../components/ProfileComponents/DonationCard';
import TopAssociations from '../../components/ProfileComponents/TopAssociations';
import BoutonDeconnexion from "@/components/BoutonDeconnexion";
import {checkLogin, getAllDons, getUtilisateurConnecte} from "@/helpers";
import AssociationFavoriteList from "@/components/AssociationFavoriteList";
import {FavoriteProvider} from "@/context/FavoriteContext";
import Colors from "@/constants/Colors";
import {IDon} from "@/backend/interfaces/IDon";

export default function UserProfileScreen() {

    checkLogin();
    const user = getUtilisateurConnecte();
    let Pseudo;
    let email
    if(user){
        Pseudo = user.pseudonyme;
        email = user.email;
        console.log("Pseudo " + Pseudo + " Email " + email);
    }
    const dons = getAllDons();
    const donsUser: IDon[] = [];
    let montantDonne:number = 0;
    const donsParAssos: Record<number, number> = {};
    dons.forEach((d : IDon) => {
        // @ts-ignore
        if(d.idUtilisateur === user.idUtilisateur) {
            donsUser.push(d);
            montantDonne+= d.montant;
            if(!donsParAssos[d.idAssociation]){
                donsParAssos[d.idAssociation] = 0;
            }
            donsParAssos[d.idAssociation]+= d.montant;
        }
    });

    const donsParAssosTries = Object.entries(donsParAssos)
        .sort(([, montantA], [, montantB]) => montantB - montantA).slice(0,3) // Tri décroissant
        ;

    //console.log(donsParAssosTries);

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

                {/* Section de progression des dons */}
                <DonationCard montantDon={montantDonne}/>

                {/* Section des Top Associations */}
                <TopAssociations topAssos={donsParAssosTries} />

                {/* Section des Associations favorites */}
                <FavoriteProvider>
                    <AssociationFavoriteList />
                </FavoriteProvider>

                <BoutonDeconnexion></BoutonDeconnexion>

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

});
