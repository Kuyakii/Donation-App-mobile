import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Header from '../../components/header';
import {useRoute} from "@react-navigation/core";
import {useNavigation} from "@react-navigation/native";
import {IUtilisateur} from "@/backend/interfaces/IUtilisateur";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function dons() {
    const navigation = useNavigation();
    const [assos, setAssos] = useState<string | null>(null);

    useEffect(() => {
        const getAssos = async () => {
            try {
                const association = await AsyncStorage.getItem('association');
                if (association) {
                    setAssos(association);
                    await AsyncStorage.removeItem('association');
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'association:", error);
                // @ts-ignore
                navigation.navigate('index');
            }
        };

        getAssos();
    }, [navigation]);

    if(assos)
        console.log(assos);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />
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
