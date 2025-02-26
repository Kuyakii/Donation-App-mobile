import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Header() {
    return (
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>Logo</Text>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
                <Feather name="settings" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: 20,
    },
    logoContainer: {
        width: 180,
        height: 48,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: '500',
    },
    settingsButton: {
        padding: 8,
    },
});
