import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { images } from "@/config";

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
                <Text style={styles.associationDescription} numberOfLines={2}>
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
        marginBottom: 15, // Ajoutez de l'espace entre les éléments de la liste
    },
    associationImage: {
        width: 120,
        height: 90,
        marginRight: 12,
        resizeMode: 'contain', // Ajuste l'image pour qu'elle s'adapte à la taille donnée
    },
    associationInfo: {
        flex: 1, // Permet à la description de prendre toute la largeur restante
    },
    associationName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    associationDescription: {
        fontSize: 14,
        color: '#666',
        flexWrap: 'wrap', // Permet au texte de passer à la ligne suivante s'il est trop long
    },
});
