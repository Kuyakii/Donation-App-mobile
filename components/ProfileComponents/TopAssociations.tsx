import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from "@/constants/Colors";
import {IAssociation} from "@/backend/interfaces/IAssociation";
import {getAssociation} from "@/helpers";
import {images} from "@/config";

// @ts-ignore
export default function TopAssociations({topAssos}) {
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

    return (
        <View style={styles.topAssociationsCard}>
            <Text style={styles.topAssociationsTitle}>Top associations</Text>

            {hasAssociations ? (
                <Text style={styles.topAssociationsSubtitle}>
                    Les associations pour lesquelles vous avez le plus donné.
                </Text>
            ) : (
                <Text style={styles.topAssociationsSubtitle}>
                    Vous n'avez pas encore fait de dons. Chaque don peut faire une différence!
                </Text>
            )}

            {/* Afficher les associations si disponibles */}
            {hasAssociations && listeAssos && (
                <View style={styles.associationsContainer}>
                    {topAssos.map((asso, index) => (
                        listeAssos[index] && (
                            <View key={index} style={styles.associationItem}>
                                <Text style={styles.rankingNumber}>{index + 1}.</Text>
                                <View style={styles.associationContent}>
                                    <Image
                                        style={styles.favoriteImage}
                                        source={
                                            listeAssos[index].nomImage && images[listeAssos[index].nomImage]
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
                        Faites votre premier don et soutenez une cause qui vous tient à cœur!
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    topAssociationsCard: {
        borderWidth: 0.5,
        borderColor: 'grey',
        borderRadius: 12,
        padding: 16,
        backgroundColor: Colors.container_light.backgroundColor,
        marginBottom: 20,
    },
    topAssociationsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    topAssociationsSubtitle: {
        fontSize: 14,
        color: '#666',
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
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    associationDetails: {
        marginLeft: 12,
        flex: 1,
    },
    associationName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    donationAmount: {
        fontSize: 14,
        color: '#555',
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
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});