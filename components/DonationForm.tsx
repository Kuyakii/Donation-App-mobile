
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {checkLogin} from "@/helpers";

export default function DonationForm ({ association })  {
    const [amount, setAmount] = useState(null);
    const [isRecurring, setIsRecurring] = useState(false);
    const [user, setUser] = useState(null);

    const handleDonate = () => {
        if (!amount || amount <= 0) {
            Alert.alert("Erreur", "Veuillez choisir un montant valide.");
            return;
        }

        if (isRecurring && !user) {
            Alert.alert("Connexion requise", "Vous devez être connecté pour faire un don récurrent.");
            checkLogin();
            return;
        }

        Alert.alert("Merci!", `Vous avez donné ${amount}€ à ${association.nom}${isRecurring ? " en tant que don récurrent" : " en don unique"}.`);
    };

    return (
        <View style={styles.donationContainer}>
            <Text style={styles.title}>Faire un don à {association.nom}</Text>
            <Text>Montant : {amount??0}</Text>
            <View style={styles.amountContainer}>
                {[5, 10, 20, 50].map(value => (
                    <TouchableOpacity key={value} style={styles.amountButton} onPress={() => setAmount(value)}>
                        <Text style={styles.amountText}>{value}€</Text>
                    </TouchableOpacity>
                ))}
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder="Montant personnalisé"
                    onChangeText={(text) => setAmount(Number(text))}
                />
            </View>
            <TouchableOpacity style={styles.toggleButton} onPress={() => setIsRecurring(!isRecurring)}>
                <Text style={styles.toggleText}>{isRecurring ? "Don récurrent" : "Don unique (anonyme)"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.donateButton} onPress={handleDonate}>
                <Text style={styles.donateButtonText}>Faire un don</Text>
            </TouchableOpacity>
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

