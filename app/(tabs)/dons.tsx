import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Header from '../../components/header';
import {useRoute} from "@react-navigation/core";
import {useNavigation} from "@react-navigation/native";
import {IUtilisateur} from "@/backend/interfaces/IUtilisateur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getAssociation} from "@/helpers";
import AssociationItem from "@/components/AssociationItem";


export default function dons() {


    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />
            <AssociationItem name={undefined} description={undefined} imageName={undefined}></AssociationItem>
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
