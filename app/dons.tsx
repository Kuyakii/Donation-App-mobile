import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import Header from '../components/header';
import { router, useLocalSearchParams } from 'expo-router';
import { getAssociation } from '@/helpers';
import DonationForm from '../components/DonationForm';
import { useNavigation } from "@react-navigation/native";
import BoutonAccueil from "@/components/BoutonAccueil";

export default function Dons() {
    const params = useLocalSearchParams();
    const { id } = params;
    const [association, setAssociation] = useState(null);

    useEffect(() => {
        console.log("Current ID:", id);
        if (!id) {
            Alert.alert(
                "Choisir une association",
                "Vous devez choisir d'abord une association pour faire un don.",
                [{ text: "OK", onPress: () => router.push("/(tabs)") }]
            );
        }
    }, [id]);


    useEffect(() => {
        const fetchAssociation = async () => {
            if (id) {
                const assoc = await getAssociation(id);
                setAssociation(assoc);
            }
        };
        fetchAssociation();
    }, [id]);

    if (!association) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header />
            <BoutonAccueil></BoutonAccueil>
            <ScrollView>
                <DonationForm association={association} />
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
    // Autres styles...
});
