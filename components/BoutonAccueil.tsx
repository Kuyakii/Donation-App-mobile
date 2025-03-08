import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";

const BoutonAccueil = () => {
    const navigation = useNavigation();
    const redirect = () => {
        router.replace('/(tabs)');
    };

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={redirect}>
                <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 40,
        width: 100,
        backgroundColor: '#2563EB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center', // Assure le centrage du texte
    },
});

export default BoutonAccueil;
