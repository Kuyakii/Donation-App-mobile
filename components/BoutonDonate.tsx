import React from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {router} from "expo-router";

const BoutonDonate= () => {
    const navigation = useNavigation();
    const redirect =  () => {
            router.replace('/(tabs)');
    };

    return (
        <View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText} onPress={undefined}>Faire un Don</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4CAF50', // Couleur verte
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
export default BoutonDonate;
