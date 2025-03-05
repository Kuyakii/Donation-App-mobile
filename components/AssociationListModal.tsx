import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AssociationItem from './AssociationItem';
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";

// @ts-ignore
export default function AssociationListModal({ visible, onClose, associations }) {
    const router = useRouter();

    const handleNavigate = (idAssos: number) => {
        onClose();
        router.replace({
            pathname: "/(tabs)/detailsAssos",
            params: { id: idAssos},
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Toutes les associations</Text>

                    {/* Liste des associations */}
                    <FlatList
                        data={associations}
                        keyExtractor={(item) => item.idAssociation.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleNavigate(item.idAssociation)}>
                                <AssociationItem
                                    name={item.nom}
                                    description={item.descriptionCourte}
                                    imageName={item.nomImage}
                                />
                            </TouchableOpacity>
                        )}
                    />

                    {/* Bouton pour fermer la modal */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end', // Assure que la modal soit en bas de l'écran ou centré
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '100%', // La modal prend toute la largeur de l'écran
        height: '90%', // Prend 90% de la hauteur de l'écran
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#f2f2f2',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#333',
        fontSize: 16,
    },
});
