import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// @ts-ignore
export default function FavoriteItem({ name }) {
    return (
        <View style={styles.favoriteItem}>
            <View style={styles.favoriteImage}></View>
            <Text style={styles.favoriteText}>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    favoriteItem: {
        marginRight: 16,
        alignItems: 'center',
        width: 64,
    },
    favoriteImage: {
        width: 64,
        height: 64,
        backgroundColor: '#f2f2f2',
        marginBottom: 4,
    },
    favoriteText: {
        fontSize: 12,
        textAlign: 'center',
    },
});
