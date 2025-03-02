import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {images} from "@/config";

// @ts-ignore
export default function AssociationItem({ name, description, imageName }) {
    return (
        <View style={styles.associationItem}>
            <Image
                style={styles.associationImage}
                // @ts-ignore
                source={images[imageName]} // Charge l'image dynamique
            />
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
        alignItems: 'center',
        padding: 10,
    },
    associationImage: {
        width: 120,
        height: 90,
        marginRight: 12,
        resizeMode: 'cover', // Ajuste l'image
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
