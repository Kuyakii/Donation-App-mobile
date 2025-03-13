import React from 'react';
import {View, Button, StyleSheet, Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {router} from "expo-router";
import Colors from "@/constants/Colors";

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
            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText} >Se déconnecter</Text>
            </TouchableOpacity>
        </View>
    );
};

export default BoutonDeconnexion;


const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary_dark.background,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: 200,
        height: 45,
    },
    buttonText: {
        color: Colors.primary_dark.text,
        fontSize: 16,
        fontWeight: '500',
    }
})