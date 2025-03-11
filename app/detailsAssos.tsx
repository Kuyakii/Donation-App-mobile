import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import Header from '@/components/header';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import BoutonAccueil from "@/components/BoutonAccueil";
import DetailAssociation from "@/components/DetailAssociation";
import { getAssociation } from "@/helpers";
import { getUtilisateurConnecte } from "@/helpers";
import Colors from "@/constants/Colors";
import BoutonFavorite from "@/components/BoutonFavorite";

export default function DetailsAssos() {
    const user = getUtilisateurConnecte()
    const userId = user?.idUtilisateur

    const params = useLocalSearchParams();
    const { id } = params;

    const [association, setAssociation] = useState(null);

    useEffect(() => {
        // Récupérer l'association de manière asynchrone
        const fetchAssociation = async () => {
            const assoc = await getAssociation(id);
            setAssociation(assoc);
        };
        fetchAssociation();
    }, [id]);

    if (!association) return <Text>Loading...</Text>;

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
                    // @ts-ignore
                    nom={association.nom}
                    // @ts-ignore
                    description={association.description}
                    // @ts-ignore
                    localisation={association.localisation}
                    // @ts-ignore
                    descriptionCourte={association.descriptionCourte}
                    // @ts-ignore
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
    buttonsContainer: {
        flexDirection: 'row',
    }
});
