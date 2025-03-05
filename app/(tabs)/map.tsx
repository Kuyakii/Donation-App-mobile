import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Platform, StatusBar, Alert, Modal, Button, Image} from 'react-native';
import MapView, {Callout, Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import Header from '../../components/header';
import {BASE_URL, images} from '@/config';
import {useRouter} from "expo-router";
import {getAllAssociation} from "@/helpers";
import {IAssociation} from "@/backend/interfaces/IAssociation";

export default function MapScreen() {
    const [location, setLocation] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAssociation, setSelectedAssociation] = useState<IAssociation | null>(null);
    const router = useRouter();

    const handleMarkerPress = (asso : IAssociation) => {
        setSelectedAssociation(asso);
        setModalVisible(true);
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
                // @ts-ignore
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });

            // Récupération des associations depuis l'API
        })();
    }, []);


    const associations = getAllAssociation();
    // @ts-ignore
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                // @ts-ignore
                initialRegion={location}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                {associations.map((asso : IAssociation, index) => (
                    <Marker
                        key={index}
                        /* @ts-ignore */
                        coordinate={{ latitude: asso.localisation.y, longitude: asso.localisation.x }}
                        onPress={() => handleMarkerPress(asso)}  // Ouverture de la modale sur le clic
                    />
                ))}
            </MapView>

            {/* Modale avec les informations */}
            {selectedAssociation && (
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedAssociation.nom}</Text>
                                {/* @ts-ignore */}
                                <Image source={images[selectedAssociation.nomImage]} style={styles.image} />
                            </View>

                            <Text style={styles.modalDescription}>{selectedAssociation.descriptionCourte}</Text>
                            <Button title="Aller voir l'association" onPress={() => {
                                router.push({
                                    pathname: "/detailsAssos",
                                    params: { id: selectedAssociation.idAssociation},
                                });}}/>
                            <View style={{marginBottom: 7,}}></View>
                            <Button title="Fermer" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    map: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Pour rendre le fond sombre
    },
    modalHeader: {
      flexDirection: "row",
        alignItems: "center",
    },
    modalContent: {
        padding: 20,
        height: '50%',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    modalTitle: {
        padding: 17,
        flex: 1,
        fontSize: 26,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    modalDescription: {
        marginVertical: 10,
        fontSize: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 75,
        marginBottom: 10,
    },
});
