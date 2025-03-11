import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BASE_URL } from '@/config';
import { checkFavorite } from "@/helpers";

// @ts-ignore
const BoutonFavorite = ({ idAssociation, idUtilisateur }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            if (!idUtilisateur) return;
            const favorite = await checkFavorite(idUtilisateur, idAssociation);
            setIsFavorite(favorite);
        };

        fetchFavoriteStatus();
    }, [idUtilisateur, idAssociation]);

    const toggleFavorite = async () => {
        try {
            if (!idUtilisateur) {
                Alert.alert("Erreur", "Utilisateur non connecté.");
                return;
            }

            const method = isFavorite ? 'DELETE' : 'POST';
            const response = await fetch(`${BASE_URL}/favorites`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idUtilisateur, idAssociation }),
            });

            if (!response.ok) throw new Error('Erreur lors de la mise à jour des favoris.');

            setIsFavorite(!isFavorite);

        } catch (error) {
            // @ts-ignore
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
