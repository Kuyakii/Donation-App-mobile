import React from 'react';
import {Text, View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import {useFocusEffect, useRouter} from 'expo-router';
import FavoriteItem from '@/components/FavoriteItem';
import Section from '@/components/Section';
import { getUtilisateurConnecte } from '@/helpers';
import { useFavorites } from '@/context/FavoriteContext';
import {useTranslation} from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";
import useFontStore from "@/store/fontStore";

const AssociationFavoriteList: React.FC = () => {
    const { associationsFavorites, loading, fetchFavorites } = useFavorites();  // Accéder au contexte
    const user = getUtilisateurConnecte();
    const userId = user?.idUtilisateur;
    const router = useRouter();
    const { t } = useTranslation();
    const { fontSizePetit } = useFontStore();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors, { fontSizePetit });

    const handleNavigate = (idAssos: number) => {
        router.push({
            pathname: "/detailsAssos",
            params: { id: idAssos},
        });
    };
    // Récupérer les favoris à chaque fois que le composant est monté ou que l'utilisateur change
    useFocusEffect(
        React.useCallback(() => {
            if (userId) {
                fetchFavorites(userId);
            }
        }, [userId, fetchFavorites])
    );

    return (
        <Section title={t('favorite_associations')} icon="star" onSeeAllPress={undefined}>
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favoritesList}>
                    {associationsFavorites.length > 0 ? (
                        associationsFavorites.map((asso) => (
                            <TouchableOpacity key={asso.idAssociation} onPress={() => handleNavigate(asso.idAssociation)}>
                                <FavoriteItem
                                    name={asso.nom}
                                    imageName={asso.nomImage}
                                />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.noFavorites}>
                            <Text style={styles.noFavoritesText}>{t('no_favorite_association')}</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </Section>
    );
};

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    favoritesList: {
        marginLeft: 10,
    },
    noFavorites: {
        padding: 20,
        alignItems: 'center',
    },
    noFavoritesText: {
        fontSize: fontSizes.fontSizePetit,
        color: themeColors.text,
        opacity: 0.8,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});

export default AssociationFavoriteList;
