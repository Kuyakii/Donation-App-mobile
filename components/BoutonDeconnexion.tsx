import React from 'react';
import { View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {router} from "expo-router";

const BoutonDeconnexion = () => {
    const navigation = useNavigation();

    const logout = async () => {
        try {
            // Supprimer le token de AsyncStorage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('utilisateur');
            // Rediriger vers la page de connexion après déconnexion
            // @ts-ignore
            router.replace('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    return (
        <View>
            <Button title="Se déconnecter" onPress={logout} />
        </View>
    );
};

export default BoutonDeconnexion;
