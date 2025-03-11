
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkLogin, estConnecte, getUtilisateurConectee} from "@/helpers";
import {BASE_URL} from "@/config";

// @ts-ignore
export default function DonationForm ({ association })  {
    const [amount, setAmount] = useState(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDonate = async () => {
        if (!amount || amount <= 0) {
            Alert.alert("Erreur", "Veuillez choisir un montant valide.");
            return;
        }

        if (isRecurring && !user) {
            Alert.alert("Connexion requise", "Vous devez être connecté pour faire un don récurrent.");
            checkLogin();
            return;
        }
        setIsLoading(true);
        const idAssos = association.idAssociation;
        let idUSer: number = 0;

        console.log(idAssos, idUSer);
        try {
            const response = await fetch(`${BASE_URL}/dons`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({idAssos, idUSer, amount, isRecurring}),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || "Erreur lors du don.");

            Alert.alert('Succès', 'Don réussi !');
            // @ts-ignore
            navigation.navigate('(tabs)'
            );
        } catch (error) {
            // @ts-ignore
            Alert.alert('Erreur', error.message);
        } finally {
            setIsLoading(false);
        }

        Alert.alert("Merci!", `Vous avez donné ${amount}€ à ${association.nom}${isRecurring ? " en tant que don récurrent" : " en don unique"}.`);
    };

    // @ts-ignore
    return (
        <View style={styles.donationContainer}>
            <Text style={styles.title}>Faire un don à {association.nom}</Text>
            <Text>Montant : {amount??0}</Text>
            <View style={styles.amountContainer}>
                {[5, 10, 20, 50].map(value => (
                    /* @ts-ignore */
                    <TouchableOpacity key={value} style={styles.amountButton} onPress={() => setAmount(value)}>
                        <Text style={styles.amountText}>{value}€</Text>
                    </TouchableOpacity>
                ))}
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Montant personnalisé"
                    /* @ts-ignore */
                    onChangeText={(text) => setAmount(Number(text))}
                />
            </View>
            <TouchableOpacity style={styles.toggleButton} onPress={() => setIsRecurring(!isRecurring)}>
                <Text style={styles.toggleText}>{isRecurring ? "Don récurrent" : "Don unique (anonyme)"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.donateButton} onPress={handleDonate}>
                <Text style={styles.donateButtonText}>Faire un don</Text>
            </TouchableOpacity>
            {isLoading ? (
                <Text style={styles.buttonText}>Don en cours...</Text>
            ) : (
                <Text style={styles.buttonText}>Donner</Text>
            )}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    donationContainer: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    amountContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    amountButton: {
        backgroundColor: '#ddd',
        padding: 10,
        margin: 5,
        borderRadius: 5,
    },
    amountText: {
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        marginTop: 10,
    },
    toggleButton: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    toggleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    donateButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    donateButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

