import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Header from '@/components/header';
import {useRoute} from "@react-navigation/core";
import {useNavigation} from "@react-navigation/native";
import {IUtilisateur} from "@/backend/interfaces/IUtilisateur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getAssociation} from "@/helpers";
import AssociationItem from "@/components/AssociationItem";
import { useLocalSearchParams } from 'expo-router';
import BoutonAccueil from "@/components/BoutonAccueil";
import DetailAssociation from "@/components/DetailAssociation";


export default function detailsAssos() {
    const params = useLocalSearchParams();
    const { id } = params;
    console.log(id);
    const association = getAssociation(id);
    // @ts-ignore
    console.log(association);
    const nom = association.nom;
    const description = association.description;
    const localisation = association.localisation;
    const descriptionCourte = association.descriptionCourte;
    const nomImage = association.nomImage;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />
            <BoutonAccueil></BoutonAccueil>
            <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <DetailAssociation nom={nom} description={description} localisation={localisation} descriptionCourte={descriptionCourte} nomImage={nomImage}></DetailAssociation>
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
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
});
