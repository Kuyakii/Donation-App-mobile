import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AssociationItem from './AssociationItem';
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";

// @ts-ignore
export default function AssociationTypeModal({ visible, onClose, associations, typeTitle }) {
    const router = useRouter();

    const handleNavigate = (idAssos: number) => {
        onClose();
        router.push({
            pathname: "/detailsAssos",
            params: { id: idAssos },
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{typeTitle || "Associations"}</Text>

                    {/* Liste des associations */}
                    {associations.length > 0 ? (
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
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Aucune association disponible</Text>
                        </View>
                    )}

                    {/* Bouton pour fermer le modal */}
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
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: '100%',
        height: '90%',
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
        backgroundColor: Colors.primary_dark.background,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: Colors.primary_dark.text,
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
});