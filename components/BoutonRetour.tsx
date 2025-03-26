import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { router } from "expo-router";
import Colors from "@/constants/Colors";

const BoutonRetour = () => {
    const handleGoBack = () => {
        router.back();
    };

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={handleGoBack}>
                <Text style={styles.buttonText}>‹</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 60,
        width: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: Colors.primary_dark.background,
        fontSize: 45,
        fontWeight: 'bold',
        textAlign: 'center', // Assure le centrage du texte
    },
});

export default BoutonRetour;