import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {images} from "@/config";
import useFontStore from "@/store/fontStore";

// @ts-ignore
export default function FavoriteItem({ name, imageName }) {
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre, increaseFontSize, decreaseFontSize } = useFontStore();

    return (
        <View style={styles.favoriteItem}>
            <Image
                style={styles.favoriteImage}
                // @ts-ignore
                source={images[imageName]}
            />
            <Text style={[styles.favoriteText , {fontSize: fontSizeTresPetit}]}>{name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    favoriteItem: {
        alignItems: 'center',
        width: 64,
        marginRight: 25,
    },
    favoriteImage: {
        width: 70,
        height: 70,
        backgroundColor: '#f2f2f2',
        resizeMode: 'contain',
        marginBottom: 4,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: 'grey',
    },
    favoriteText: {
      //  fontSize: 12,
        textAlign: 'center',
    },
});
