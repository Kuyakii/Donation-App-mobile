import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, StatusBar } from 'react-native';
import Header from '@/components/header';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import BoutonAccueil from "@/components/BoutonAccueil";
import DetailAssociation from "@/components/DetailAssociation";
import { getAssociation } from "@/helpers";
import * as Location from "expo-location";
import {IAssociation} from "@/backend/interfaces/IAssociation";
import Colors from "@/constants/Colors";

export default function DetailsAssos() {
    const user = getUtilisateurConnectee()
    const userId = user?.idUtilisateur

    const params = useLocalSearchParams();
    const { id } = params;

    const [association, setAssociation] = useState(null);  // Stocker l'association dans le state

    useEffect(() => {
        // Récupérer l'association de manière asynchrone
        const fetchAssociation = async () => {
            const assoc = await getAssociation(id);  // Si c'est une fonction asynchrone, attends le résultat
            setAssociation(assoc);  // Mettre à jour l'état avec l'association récupérée
        };

        fetchAssociation();  // Appeler la fonction pour récupérer l'association

    }, [id]);  // Reprendre le fetch chaque fois que l'id change

    if (!association) return <Text>Loading...</Text>;  // Afficher un message de chargement si l'association n'est pas encore disponible

    // Fonction pour gérer la navigation vers la page des dons
    const navigateToDons = () => {
        router.push({
            pathname: "/dons",
            params: { id: id },
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />
            <BoutonAccueil />
            <View style={styles.buttonsContainer}>
                {/* Bouton "Donner" */}
                <TouchableOpacity style={styles.donnerButton} onPress={navigateToDons}>
                    <Text style={styles.donnerButtonText}>Faire un Don</Text>
                </TouchableOpacity>
                <BoutonFavorite idAssociation={id} idUtilisateur={userId} />
            </View>

            <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <DetailAssociation
                    nom={association.nom}
                    description={association.description}
                    localisation={association.localisation}
                    descriptionCourte={association.descriptionCourte}
                    nomImage={association.nomImage}
                />
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingBottom: 50,
    },
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },

    donnerButton: {
        backgroundColor: Colors.primary_dark.background,
        paddingVertical: 15,
        margin : 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    donnerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
