import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { images } from "@/config";

interface DetailAssosProps {
    nom: string;
    description: string;
    localisation: any;
    descriptionCourte: string;
    nomImage: string;
}

export default function DetailAssociation({ nom, description, localisation, descriptionCourte, nomImage }: DetailAssosProps) {
    // Vérification que localisation est bien un objet avec les propriétés `x` et `y`
    const getCoordinates = (loc: any) => {
        if (loc && typeof loc === 'object' && loc.x !== undefined && loc.y !== undefined) {
            return { latitude: loc.y, longitude: loc.x }; // Retourne les coordonnées
        }
        return null; // Retourne null si localisation invalide
    };

    const coordinates = getCoordinates(localisation);
    console.log(localisation, typeof localisation, coordinates);



    return (
        <View style={styles.container}>
            {/* Nom de l'association */}
            <Text style={styles.title}>{nom}</Text>

            {/* Image + Description courte */}
            <View style={styles.imageContainer}>
                {/* @ts-ignore */}
                <Image source={images[nomImage]} style={styles.image} />
                <Text style={styles.shortDescription}>{descriptionCourte}</Text>
            </View>

            {/* Description longue */}
            <Text style={styles.longDescription}>{description}</Text>

            {/* Carte avec la localisation*/}
            {localisation ? (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude,
                        }}
                        title={nom}
                    />
                </MapView>
            ) : (
                <Text style={styles.errorText}>Localisation non disponible</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
        resizeMode :'contain'
    },
    shortDescription: {
        fontSize: 16,
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#666',
    },
    longDescription: {
        fontSize: 18,
        lineHeight: 24,
        textAlign: 'justify',
        marginBottom: 20,
    },
    map: {
        width: Dimensions.get('window').width - 40,
        height: 300,
        borderRadius: 10,
        alignSelf: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});
