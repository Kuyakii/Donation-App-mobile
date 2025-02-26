import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Header from '../../components/header';
import {AssociationRepository} from "@/backend/repositories/AssociationRepository";


export default function map() {
    let dataAssos;
    const fetchAssociations = async () => {
        try {
            const response = await fetch('http://192.168.1.90:3000/associations'); // Remplace par ton IP locale
            const data = await response.json();
            console.log('Données récupérées :', data);
        } catch (error) {
            console.error('Erreur lors de la récupération des associations', error);
        }
    };

    fetchAssociations();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />
            <Text>
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
