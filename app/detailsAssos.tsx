import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, StatusBar, Alert} from 'react-native';
import Header from '@/components/header';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import BoutonRetour from "@/components/BoutonRetour";
import DetailAssociation from "@/components/DetailAssociation";
import { getAssociation } from "@/helpers";
import { getUtilisateurConnecte } from "@/helpers";
import Colors from "@/constants/Colors";
import BoutonFavorite from "@/components/BoutonFavorite";
import {IAssociation} from "@/backend/interfaces/IAssociation";
import {useTranslation} from "react-i18next";

export default function DetailsAssos() {
    const user = getUtilisateurConnecte()
    const userId = user?.idUtilisateur
    const { t } = useTranslation();

    const params = useLocalSearchParams();
    const { id } = params;

    const [association, setAssociation] = useState<IAssociation | null>(null);  // Stocker l'association dans le state

    useEffect(() => {
        // Récupérer l'association de manière asynchrone
        const fetchAssociation = async () => {
            const assoc = await getAssociation(id);
            setAssociation(assoc);
        };
        fetchAssociation();
    }, [id]);

    if (!association) return <Text>t('loading')</Text>;

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
            <BoutonRetour />

            <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <DetailAssociation
                    nom={association.nom}
                    description={association.description}
                    localisation={association.localisation}
                    descriptionCourte={association.descriptionCourte}
                    nomImage={association.nomImage}
                />
            </ScrollView>
            {/* Bouton "Donner" */}
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.donnerButton} onPress={navigateToDons}>
                    <Text style={styles.donnerButtonText}>{t('don_title')}</Text>
                </TouchableOpacity>
                <BoutonFavorite idAssociation={id} idUtilisateur={userId} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 5,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
        paddingHorizontal: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 45,
    },
    donnerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 15,
    }

});