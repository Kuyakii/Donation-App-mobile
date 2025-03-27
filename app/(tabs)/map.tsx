import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Alert, Modal, Image, TouchableOpacity, Dimensions} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { images} from '@/config';
import {useRouter} from "expo-router";
import {getAllAssociation} from "@/helpers";
import {IAssociation} from "@/backend/interfaces/IAssociation";
import Colors from "@/constants/Colors";
import {useTranslation} from "react-i18next";
export default function MapScreen() {
    const [location, setLocation] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAssociation, setSelectedAssociation] = useState<IAssociation | null>(null);
    const router = useRouter();
    const { t } = useTranslation();

    const handleMarkerPress = (asso : IAssociation) => {
        setSelectedAssociation(asso);
        setModalVisible(true);
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission refusée", "Autorisez la localisation pour voir les associations proches.");
                return;
            }

            let userLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                // @ts-ignore
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        })();
    }, []);

    const associations = getAllAssociation();

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
                        onPress={() => handleMarkerPress(asso)}
                    />
                ))}
            </MapView>

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

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    router.push({
                                        pathname: "/detailsAssos",
                                        params: { id: selectedAssociation.idAssociation},
                                    });
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.buttonText}>{t('voir_association')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>{t('close_button')}</Text>
                            </TouchableOpacity>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
        padding: 15,
        flex: 1,
        fontSize: 20,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    modalDescription: {
        marginBottom: 30,
        fontSize: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 75,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    button: {
        backgroundColor: Colors.primary_dark.background,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: 250,
        height: 45,
        marginBottom: 10,
    },
    buttonText: {
        color: Colors.primary_dark.text,
        fontSize: 15,
        fontWeight: '500',
    }
});