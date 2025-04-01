import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from "@/constants/Colors";
import {getBadgeColor, getSeuils} from "@/helpers";
import {useTranslation} from "react-i18next";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

// @ts-ignore
export default function  DonationCard ({montantDon}){
    const { t } = useTranslation();
    const seuils = getSeuils();
    let max = seuils[0];
    let indice = 0;
    for (let i = 0; i < seuils.length; i++) {
        if (seuils[i] >= Number(montantDon)) {
            max = seuils[i];
            indice = i;
            break;
        }
    }
    const pourcentage = (montantDon/max)*100;
    const progressWidth = `${Math.min(pourcentage, 100)}%`; // Évite que ça dépasse 100%
    const badges = seuils.slice(0, indice).map((seuil, i) => ({
        id: i,
        label: `Atteint ${seuil}€`,
        color : getBadgeColor(seuil),
    }));

    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre, increaseFontSize, decreaseFontSize } = useFontStore();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];
    const styles = getStyles(themeColors, {
        fontSizeTresPetit,
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre
    });

    return (
        <View style={styles.donationCard}>
            <Text style={styles.donationTitle}>{t('alreadyDonatedAmount', { montantDon })}</Text>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: progressWidth as any}]} />
                </View>
                <Text style={[styles.progressText, {fontSize: fontSizePetit}]}>{max}€</Text>
            </View>

            <Text style={styles.badgesTitle}>{t('yourBadges')}</Text>
            <View style={styles.badgesContainer}>
                {badges.map((badge) => (
                    <Text key={badge.id} style={[styles.badge, { backgroundColor: badge.color }]}>
                        🏆 {badge.label}
                    </Text>
                ))}
            </View>
        </View>
    );
};

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    donationCard: {
        borderWidth: 1,
        borderColor: themeColors.card.border,
        backgroundColor: themeColors.card.background,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    donationTitle: {
        fontSize: fontSizes.fontSize,
        fontWeight: 'bold',
        color: themeColors.text,
        marginBottom: 16,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    progressBar: {
        flex: 1,
        height: 20,
        backgroundColor: themeColors.input.backgroundColor,
        borderRadius: 10,
        borderWidth: 1,
        overflow: 'hidden',
        borderColor: themeColors.primaryAlt?.background || '#ccc',
    },
    progressFill: {
        height: '100%',
        backgroundColor: themeColors.primary.background,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: themeColors.primaryAlt?.background || '#ccc',
    },
    progressText: {
        marginLeft: 8,
        fontSize: fontSizes.fontSizePetit,
        fontWeight: 'bold',
        color: themeColors.text,
    },
    badgesTitle: {
        fontSize: fontSizes.fontSize,
        fontWeight: 'bold',
        color: themeColors.text,
        marginBottom: 12,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    badge: {
        fontSize: fontSizes.fontSizePetit,
        fontWeight: 'bold',
        backgroundColor: '#FFD700', // couleur custom par seuil, reste inchangée
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        marginRight: 8,
        color: themeColors.text,
    },
});
