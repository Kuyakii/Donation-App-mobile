import React from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AssociationItem from './AssociationItem';
import { useRouter } from "expo-router";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";
import {useTranslation} from "react-i18next";

// @ts-ignore
export default function AssociationTypeModal({ visible, onClose, associations, typeTitle }) {
    const router = useRouter();
    const { t } = useTranslation();
    const handleNavigate = (idAssos: number) => {
        onClose();
        router.push({
            pathname: "/detailsAssos",
            params: { id: idAssos },
        });
    };
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre, increaseFontSize, decreaseFontSize } = useFontStore();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors, {
        fontSizeTresPetit,
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre
    });

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
                        <Text style={styles.closeButtonText}>{t('close_button')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: themeColors.background,
        width: '100%',
        height: '90%',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: fontSizes.fontSizeSousTitre,
        fontWeight: 'bold',
        marginBottom: 10,
        color: themeColors.text,
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: themeColors.primary.background,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: fontSizes.fontSize,
        color: themeColors.primary.text,
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: fontSizes.fontSize,
        color: themeColors.text,
        fontStyle: 'italic',
        opacity: 0.6,
    },
});
