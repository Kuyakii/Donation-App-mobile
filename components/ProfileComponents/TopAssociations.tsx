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
    return (
        <View style={styles.topAssociationsCard}>
            <Text style={styles.topAssociationsTitle}>Top 3 associations</Text>
            <Text style={styles.topAssociationsSubtitle}>
                Les trois associations pour lesquelles vous avez donné le plus donné.
            </Text>

            <View style={styles.associationItem}>
                <Text style={styles.rankingNumber}>1.</Text>

                <Image
                    style={styles.favoriteImage}
                    source={
                        listeAssos && listeAssos[0] && listeAssos[0].nomImage && images[listeAssos[0].nomImage]
                            ? images[listeAssos[0].nomImage] // Utiliser l'image de l'association
                            : images['tmp.png'] // Image par défaut
                    }>
                </Image>
                <Text style={styles.associationName}>{(listeAssos && listeAssos[0]) ? listeAssos[0].nom : "Aucune"}</Text>
                <Text>Montant donné : {(listeAssos && listeAssos[0]) ? topAssos[0][1] : "Aucun"}</Text>
            </View>

            <View style={styles.associationItem}>
                <Text style={styles.rankingNumber}>2.</Text>
                <Image
                    style={styles.favoriteImage}
                    source={
                        listeAssos && listeAssos[1] && listeAssos[1].nomImage && images[listeAssos[1].nomImage]
                            ? images[listeAssos[1].nomImage] // Utiliser l'image de l'association
                            : images['tmp.png'] // Image par défaut
                    }
                >
                </Image>
                <Text style={styles.associationName}>{(listeAssos && listeAssos[1]) ? listeAssos[1].nom : "Aucune"}</Text>
                <Text>Montant donné : {(listeAssos && listeAssos[1]) ? topAssos[1][1] : "Aucun"}</Text>
            </View>

            <View style={styles.associationItem}>
                <Text style={styles.rankingNumber}>3.</Text>
                <Image
                    style={styles.favoriteImage}
                    source={
                        listeAssos && listeAssos[2] && listeAssos[2].nomImage && images[listeAssos[2].nomImage]
                            ? images[listeAssos[2].nomImage] // Utiliser l'image de l'association
                            : images['tmp.png'] // Image par défaut
                    }
                >
                </Image>
                <Text style={styles.associationName}>{(listeAssos && listeAssos[2]) ? listeAssos[2].nom : "Aucune"}</Text>
                <Text>Montant donné : {(listeAssos && listeAssos[2]) ? topAssos[2][1] : "Aucun"}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    topAssociationsCard: {
        borderWidth: 1,
        borderColor: 'black',
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
    associationItem: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 12,
    },
    rankingNumber: {
        fontSize: 16,
        fontWeight: 'bold',

    },
    associationName: {
        fontSize: 16,
    },
    favoriteImage: {
        width: 60,
        height: 60,
        marginBottom: 4,
        borderRadius: 4,
        resizeMode: 'contain', // Ajuste l'image
    },
});
