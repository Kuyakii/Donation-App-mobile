import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// @ts-ignore
export default function AssociationItem({ name, description }) {
    return (
        <View style={styles.associationItem}>
            <View style={styles.associationImage}></View>
            <View style={styles.associationInfo}>
                <Text style={styles.associationName}>{name}</Text>
                <Text style={styles.associationDescription}>{description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    associationItem: {
        flexDirection: 'row',
    },
    associationImage: {
        width: 120,
        height: 90,
        backgroundColor: '#f2f2f2',
        marginRight: 12,
    },
    associationInfo: {
        justifyContent: 'center',
    },
    associationName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    associationDescription: {
        fontSize: 14,
        color: '#666',
    },
});
