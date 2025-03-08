import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image, Platform, StatusBar} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {images} from "@/config";

interface HeaderProps {
    title?: string
}

export default function Header({title}: HeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logoImage}
                    source={images["logo.png"]}
                />
            </View>
            <TouchableOpacity style={styles.settingsButton}>
                <Feather name="settings" size={36} color="black"/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#e3b5f8',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingBottom: 20,
    },
    logoContainer: {
        width: 200,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 200,
        height: 80,
        margin: 12,
        resizeMode: 'contain', // Ajuste l'image
    },
    settingsButton: {
        padding: 8,
        right: 0,
        position: 'absolute',
    },
    placeholder: {
        width: 40, // La même taille que le bouton de paramètres
        height: 40,
    },
});