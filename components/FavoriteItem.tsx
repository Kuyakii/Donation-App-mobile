import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {images} from "@/config";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

// @ts-ignore
export default function FavoriteItem({ name, imageName }) {
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre, increaseFontSize, decreaseFontSize } = useFontStore();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors, {
        fontSizeTresPetit,
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre,
    });

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

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    favoriteItem: {
        alignItems: 'center',
        width: 64,
        marginRight: 25,
    },
    favoriteImage: {
        width: 70,
        height: 70,
        backgroundColor: themeColors.input.backgroundColor,
        resizeMode: 'contain',
        marginBottom: 4,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: themeColors.card.border,
    },
    favoriteText: {
        fontSize: fontSizes.fontSizeTresPetit,
        textAlign: 'center',
        color: themeColors.text,
    },
});
