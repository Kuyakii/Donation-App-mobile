import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Feather} from '@expo/vector-icons';

interface HeaderProps {
    title?: string
}

export default function Header({title}: HeaderProps) {
    return (
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>Logo</Text>
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
        width: 180,
        height: 48,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 95, //pour centrer

    },
    logoText: {
        fontSize: 18,
        fontWeight: '500',
    },
    settingsButton: {
        padding: 8,
    },
    placeholder: {
        width: 40, // La même taille que le bouton de paramètres
        height: 40,
    },
});