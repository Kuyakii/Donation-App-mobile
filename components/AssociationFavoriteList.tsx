import React, {useCallback, useEffect, useState} from 'react';
import { Text, View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import {useFocusEffect, useRouter} from "expo-router";
import FavoriteItem from "@/components/FavoriteItem";
import Section from "@/components/Section";
import { getUtilisateurConnectee } from "@/helpers";
import { BASE_URL } from "@/config";

export default function AssociationFavoriteList() {
    const [associationsFavorites, setAssociationsFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = getUtilisateurConnectee()
    const userId = user?.idUtilisateur

    useFocusEffect(
        useCallback(() => {
            fetchFavorites();
        }, [])
    );

    const fetchFavorites = async () => {
        try {

            if (!user) return;

            const response = await fetch(`${BASE_URL}/favorites/${userId}`);
            const data = await response.json();
            if (response.ok) {
                setAssociationsFavorites(data);
            } else {
                console.error("Erreur API :", data.message);
            }
        } catch (error) {
            console.error("Erreur récupération favoris :", error);
        } finally {
            setLoading(false);
        }
    };

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
                            <Text>Aucune association favorite. </Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </Section>
    );
}

const styles = StyleSheet.create({
    favoritesList: {
        width: '100%',
        justifyContent: 'space-around',
    },
    noFavorites: {
        padding: 20,
        alignItems: 'center',
    },
});
