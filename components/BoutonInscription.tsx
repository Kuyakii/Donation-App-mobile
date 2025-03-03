import React from 'react';
import {View, Button, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {router} from "expo-router";

const BoutonInscription= () => {
    const navigation = useNavigation();

    const redirect =  () => {
        // @ts-ignore
        router.replace('/register');
    };

    return (
        <View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={redirect}>Pas de compte ? S'inscrire !</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 40,
        backgroundColor: '#2563EB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        paddingHorizontal: 20,
        shadowOpacity: 0.6,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default BoutonInscription;
