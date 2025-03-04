import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar, Alert } from 'react-native';
import MapView, {Callout, Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import Header from '../../components/header';
import { BASE_URL } from '@/config';

export default function MapScreen() {
    const [location, setLocation] = useState(null);
    const [associations, setAssociations] = useState([]);

    const getCoordinates = (loc: any) => {
        if (loc && typeof loc === 'object' && loc.x !== undefined && loc.y !== undefined) {
            return { latitude: loc.y, longitude: loc.x }; // Retourne les coordonnées
        }
        return null; // Retourne null si localisation invalide
    };

    useEffect(() => {
        (async () => {
            // Demande de permission pour la localisation
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission refusée", "Autorisez la localisation pour voir les associations proches.");
                return;
            }

            // Récupération de la position actuelle de l'utilisateur
            let userLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });

            // Récupération des associations depuis l'API
            fetchAssociations();
        })();
    }, []);

    const fetchAssociations = async () => {
        try {
            const response = await fetch(`${BASE_URL}/associations`);
            const data = await response.json();
            setAssociations(data); // Supposant que "data" est un tableau d'associations avec latitude & longitude
        } catch (error) {
            console.error("Erreur lors de la récupération des associations :", error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />
            {location ? (
                <MapView
                    style={styles.map}
                    initialRegion={location}
                    showsUserLocation={true}
                    followsUserLocation={true}
                >
                    {/* Marqueurs des associations */}
                    {associations.map((asso, index) => (
                        <Marker
                            key={index}
                            coordinate={{ latitude: asso.localisation.y, longitude: asso.localisation.x }}
                            title={asso.nom}
                            description={asso.descriptionCourte}
                        >
                            <Callout style={styles.callout}>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutTitle}>{asso.nom}</Text>
                                    <Text style={styles.calloutDescription}>{asso.descriptionCourte}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
            ) : (
                <Text style={styles.loadingText}>Chargement de la carte...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    map: {
        flex: 1,
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    callout: {
        width: 150,
    },
    calloutContainer: {
        padding: 10,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 5,
    },
    calloutDescription: {
        fontSize: 14,
        color: '#555',
    },
});
