import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { images } from "@/config";
import useFontStore from "@/store/fontStore";

// @ts-ignore
export default function AssociationItem({ name, description, imageName }) {
    const { fontSize, increaseFontSize, decreaseFontSize } = useFontStore();

    return (
        <View style={styles.associationItem}>
            <Image
                style={styles.associationImage}
                // @ts-ignore
                source={images[imageName]} // Charge l'image dynamique
            />
            <View style={styles.associationInfo}>
                <Text style={styles.associationName}>{name}</Text>
                <Text style={[styles.associationDescription, {fontSize}]} numberOfLines={2}>
                    {description}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    associationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 15,
    },
    associationImage: {
        width: 120,
        height: 90,
        marginRight: 12,
        resizeMode: 'contain',
    },
    associationInfo: {
        flex: 1,
    },
    associationName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    associationDescription: {
       // fontSize: 14,
        color: '#666',
        flexWrap: 'wrap',
    },
});
