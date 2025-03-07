import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
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
                <Feather name="settings" size={24} color="black"/>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 12,
        marginHorizontal: 10,
    },
    logoContainer: {
        width: 200,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 95, //pour centrer

    },
    logoImage: {
        width: 200,
        height: 80,
        margin: 12,
        resizeMode: 'contain', // Ajuste l'image

    },
    settingsButton: {
        padding: 8,
    },
    placeholder: {
        width: 40, // La même taille que le bouton de paramètres
        height: 40,
    },
});