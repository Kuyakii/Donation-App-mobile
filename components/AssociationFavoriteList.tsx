import React, { useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import FavoriteItem from '@/components/FavoriteItem';
import Section from '@/components/Section';
import { getUtilisateurConnecte } from '@/helpers';
import { useFavorites } from '@/context/FavoriteContext';  // Utilisation du hook du contexte

const AssociationFavoriteList: React.FC = () => {
    const { associationsFavorites, loading, fetchFavorites } = useFavorites();  // Accéder au contexte
    const user = getUtilisateurConnecte();
    const userId = user?.idUtilisateur;

    // Récupérer les favoris à chaque fois que le composant est monté ou que l'utilisateur change
    useFocusEffect(
        React.useCallback(() => {
            if (userId) {
                fetchFavorites(userId);
            }
        }, [userId, fetchFavorites])
    );

    return (
        <Section title="Mes associations favorites" icon="star" onSeeAllPress={undefined}>
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favoritesList}>
                    {associationsFavorites.length > 0 ? (
                        associationsFavorites.map((asso) => (
                            <FavoriteItem
                                key={asso.idAssociation}
                                name={asso.nom}
                                imageName={asso.nomImage}
                            />
                        ))
                    ) : (
                        <View style={styles.noFavorites}>
                            <Text>Aucune association favorite.</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </Section>
    );
};

const styles = StyleSheet.create({
    favoritesList: {
        marginLeft: 10,
    },
    noFavorites: {
        padding: 20,
        alignItems: 'center',
    },
});

export default AssociationFavoriteList;
