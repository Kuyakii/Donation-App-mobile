import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
import Header from '../../components/header';
import {router, useLocalSearchParams } from 'expo-router';
import {checkLogin, getAssociation} from '@/helpers';
import DonationForm from '../../components/DonationForm'
import {useNavigation} from "@react-navigation/native";

export default function Dons() {
    const params = useLocalSearchParams();
    const { id } = params;
    const [association, setAssociation] = useState(null);
    if(!id){
        Alert.alert("Choisir une association", "Vous devez choisir d'abord une association pour faire un don.");
        // @ts-ignore
        useNavigation().navigate('index');
    }
    useEffect(() => {
        const fetchAssociation = async () => {
            const assoc = await getAssociation(id);
            setAssociation(assoc);
        };
        fetchAssociation();
    }, [id]);

    if (!association) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />
            <ScrollView>
                <DonationForm association={association} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    donationContainer: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    amountContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    amountButton: {
        backgroundColor: '#ddd',
        padding: 10,
        margin: 5,
        borderRadius: 5,
    },
    amountText: {
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        marginTop: 10,
    },
    toggleButton: {
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    toggleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    donateButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    donateButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
