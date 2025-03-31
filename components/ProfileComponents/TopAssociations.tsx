import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from "@/constants/Colors";
import {IAssociation} from "@/backend/interfaces/IAssociation";
import {getAssociation} from "@/helpers";
import {images} from "@/config";
import {useTranslation} from "react-i18next";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

// @ts-ignore
export default function TopAssociations({topAssos}) {
    const { t } = useTranslation();
    const [listeAssos, setListeAssos] = useState<IAssociation[] | null>(null);

    useEffect(() => {
        async function fetchAssociations() {
            // Si aucune association n'est fournie, ne rien faire
            if (!topAssos || topAssos.length === 0) {
                setListeAssos([]);
                return;
            }

            const associations: IAssociation[] = [];
            for (const a of topAssos) {
                console.log("ID remplir liste" + a[0]);
                const association = await getAssociation(a[0]);
                associations.push(association);
            }
            setListeAssos(associations); // Met à jour l'état une fois terminé
        }

        fetchAssociations();
    }, [topAssos]);

    // Vérifier s'il y a des associations à afficher
    const hasAssociations = topAssos && topAssos.length > 0;
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
        <View style={styles.topAssociationsCard}>
            <Text style={styles.topAssociationsTitle}>{t('top3Associations')}</Text>

            {hasAssociations ? (
                <Text style={styles.topAssociationsSubtitle}>
                    {t('top3AssociationsSubtitle')}
                </Text>
            ) : (
                <Text style={styles.topAssociationsSubtitle}>
                    {t('no_donations_yet')}
                </Text>
            )}

            {/* Afficher les associations si disponibles */}
            {hasAssociations && listeAssos && (
                <View style={styles.associationsContainer}>
                    {topAssos.map((asso:IAssociation, index:number) => (
                        listeAssos[index] && (
                            <View key={index} style={styles.associationItem}>
                                <Text style={styles.rankingNumber}>{index + 1}.</Text>
                                <View style={styles.associationContent}>
                                    <Image
                                        style={styles.favoriteImage}
                                        source={
                                        // @ts-ignore
                                            listeAssos[index].nomImage && images[listeAssos[index].nomImage]
                                                // @ts-ignore
                                                ? images[listeAssos[index].nomImage]
                                                : images['tmp.png']
                                        }
                                    />
                                    <View style={styles.associationDetails}>
                                        <Text style={styles.associationName}>{listeAssos[index].nom}</Text>
                                        <Text style={styles.donationAmount}>{asso[1]}€</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    ))}
                </View>
            )}

            {/* Message d'encouragement si aucune association */}
            {(!hasAssociations || (listeAssos && listeAssos.length === 0)) && (
                <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateText}>
                        {t('make_first_donation')}
                    </Text>
                </View>
            )}
        </View>
    );
};

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    topAssociationsCard: {
        borderWidth: 0.5,
        borderColor: themeColors.card.border,
        borderRadius: 12,
        padding: 16,
        backgroundColor: themeColors.card.background,
        marginBottom: 20,
    },
    topAssociationsTitle: {
        fontSize: fontSizes.fontSizeSousTitre,
        fontWeight: 'bold',
        marginBottom: 8,
        color: themeColors.text,
    },
    topAssociationsSubtitle: {
        fontSize: fontSizes.fontSizePetit,
        color: themeColors.text,
        opacity: 0.7,
        marginBottom: 16,
        fontWeight: '500',
    },
    associationsContainer: {
        gap: 12,
    },
    associationItem: {
        marginBottom: 16,
    },
    associationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    rankingNumber: {
        fontSize: fontSizes.fontSize,
        fontWeight: 'bold',
        marginBottom: 4,
        color: themeColors.text,
    },
    associationDetails: {
        marginLeft: 12,
        flex: 1,
    },
    associationName: {
        fontSize: fontSizes.fontSize,
        fontWeight: '600',
        marginBottom: 2,
        color: themeColors.text,
    },
    donationAmount: {
        fontSize: fontSizes.fontSizePetit,
        color: themeColors.text,
        opacity: 0.7,
    },
    favoriteImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
        resizeMode: 'contain',
    },
    emptyStateContainer: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    emptyStateText: {
        fontSize: fontSizes.fontSizePetit,
        color: themeColors.text,
        opacity: 0.6,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
