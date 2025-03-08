import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BASE_URL } from '@/config'; // Assure-toi d'avoir l'URL de ton API
import AsyncStorage from '@react-native-async-storage/async-storage';

const BoutonFavorite = ({ idAssociation }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const toggleFavorite = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                Alert.alert("Erreur", "Utilisateur non connecté.");
                return;
            }

            const method = isFavorite ? 'DELETE' : 'POST';
            const response = await fetch(`${BASE_URL}/favorites`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idUtilisateur: userId, idAssociation }),
            });

            if (!response.ok) throw new Error("Erreur lors de l'ajout aux favoris.");

            setIsFavorite(!isFavorite);
        } catch (error) {
            Alert.alert("Erreur", error.message);
        }
    };

    return (
        <View>
            <TouchableOpacity style={styles.button} onPress={toggleFavorite}>
                <Feather name={'star'} size={20} color={isFavorite ? "yellow" : "gray"} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default BoutonFavorite;
