import React from 'react';
import {View, Button, Text, TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {router} from "expo-router";
import Colors from "@/constants/Colors";

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
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    buttonText: {
        color: Colors.primary_dark.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default BoutonInscription;