import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {images} from "@/config";

// @ts-ignore
export default function FavoriteItem({ name, imageName }) {
    return (
        <View style={styles.favoriteItem}>
            <Image
                style={styles.favoriteImage}
                // @ts-ignore
                source={images[imageName]}
            />
            <Text style={styles.favoriteText}>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    favoriteItem: {
        alignItems: 'center',
        width: 64,
    },
    favoriteImage: {
        width: 70,
        height: 70,
        backgroundColor: '#f2f2f2',
        marginBottom: 4,
        borderRadius: 4,
        borderWidth: 1,
    },
    favoriteText: {
        fontSize: 12,
        textAlign: 'center',
    },
});
