import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

// @ts-ignore
export default function Section({ title, icon, children }) {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <Feather name={icon} size={20} color="black" />
                    <Text style={styles.sectionTitle}>{title}</Text>
                </View>
                <Text style={styles.seeAllText}>Voir tout</Text>
            </View>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginLeft: 8,
    },
    seeAllText: {
        fontSize: 14,
        color: '#777',
    },
});
