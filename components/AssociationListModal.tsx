import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AssociationItem from './AssociationItem';
import {useRouter} from "expo-router";
import Colors from "@/constants/Colors";
import {useTranslation} from "react-i18next";

// @ts-ignore
export default function AssociationListModal({ visible, onClose, associations }) {
    const router = useRouter();
    const { t } = useTranslation();

    const handleNavigate = (idAssos: number) => {
        onClose();
        router.replace({
            pathname: "/detailsAssos",
            params: { id: idAssos},
        });
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{t('all_associations')}</Text>

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

                    {/* Bouton pour fermer le modal */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>{t('close_button')}</Text>
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
        color : Colors.primary_dark.text,
        fontSize: 16,
    },
});
