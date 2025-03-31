import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {images} from "@/config";
import {t} from "i18next";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

// @ts-ignore
export default function Partenariat() {
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre,fontSizeGrosTitre, increaseFontSize, decreaseFontSize } = useFontStore();
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
        <View style={styles.partnershipContainer}>
            <Image
                style={styles.partnershipLogo}
                source={images['france-asso.png']}
            />
            <Text style={[styles.partnershipText, {fontSize : fontSizeTresPetit}]}>
                {t('partenariat')}
            </Text>
        </View>
    );
}

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    partnershipContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 10,
        backgroundColor: themeColors.card.background,
        borderRadius: 10,
    },
    partnershipLogo: {
        width: 50,
        height: 50,
        marginRight: 10,
        resizeMode: 'contain',
    },
    partnershipText: {
        flex: 1,
        fontSize: fontSizes.fontSizeTresPetit,
        color: themeColors.text,
        textAlign: 'left',
    },
});