import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { images } from "@/config";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

// @ts-ignore
export default function AssociationItem({ name, description, imageName }) {
    const {fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre, increaseFontSize, decreaseFontSize } = useFontStore();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors, {
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre,
    });

    return (
        <View style={styles.associationItem}>
            <Image
                style={styles.associationImage}
                // @ts-ignore
                source={images[imageName]} // Charge l'image dynamique
            />
            <View style={styles.associationInfo}>
                <Text style={[styles.associationName,{fontSize : fontSize}]}>{name}</Text>
                <Text style={[styles.associationDescription, {fontSize : fontSizePetit}]} numberOfLines={2}>
                    {description}
                </Text>
            </View>
        </View>
    );
}

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
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
        fontSize: fontSizes.fontSize,
        fontWeight: '500',
        marginBottom: 4,
        color: themeColors.text,
    },
    associationDescription: {
        fontSize: fontSizes.fontSizePetit,
        color: themeColors.text,
        opacity: 0.7,
        flexWrap: 'wrap',
    },
});
