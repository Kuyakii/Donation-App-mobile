import React, { useState } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AssociationItem from './AssociationItem';
import { useRouter } from "expo-router";
import {IAssociation} from "@/backend/interfaces/IAssociation";
import {useTranslation} from "react-i18next";
import useFontStore from '@/store/fontStore';
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

interface Association {
    idAssociation: number;
    nom: string;
    descriptionCourte: string;
    typeAssociation: string | number;
    nomImage: string;
}

// @ts-ignore
export default function AssociationListModal({ visible, onClose, associations }) {
    const router = useRouter();
    const [filterType, setFilterType] = useState<'TOUS' | '1' | '2'| '3'| '4'| '5'| '6'| '7'| '8'| '9' >('TOUS');
    const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);


    // Options pour la liste déroulante
    const typeOptions = [
        { label: "Toutes les associations", value: "TOUS" },
        { label: "Associations de santé mentale", value: "3" },
        { label: "Associations d'handicap", value: "2" },
        { label: "Associations d'addictions", value: "1" },
        { label: "Associations de maladies chroniques et rares", value: "4" },
        { label: "Associations de maladies infectieuses et immunitaires", value: "5" },
        { label: "Associations cancers", value: "6" },
        { label: "Associations de droits des patients et prévention santé", value: "7" },
        { label: "Associations pour familles et aide aux personnes en difficulté", value: "8" },
        { label: "Associations d'autres thématiques", value: "9" }
    ];


    // Filtrer les associations par type
    const filteredAssociations = filterType === "TOUS"
        ? associations
        : associations.filter( (asso :IAssociation) => asso.idType === parseInt(filterType));

    // Obtenir le label actuel pour le dropdown
    const getCurrentTypeLabel = () => typeOptions.find(option => option.value === filterType)?.label || "Toutes les associations";
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
        fontSizeTitre,
    });

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{t('all_associations')}</Text>
                    <Text style={styles.modalSubTitle}>
                        {filteredAssociations.length} association{filteredAssociations.length > 1 ? 's' : ''} disponible{filteredAssociations.length > 1 ? 's' : ''}
                    </Text>

                    {/* Filtre par type d'association */}
                    <View style={styles.filterContainer}>
                        <View style={styles.dropdownContainer}>
                            <Text style={styles.dropdownLabel}>Type d'association :</Text>
                            <View style={styles.relativeContainer}>
                                <TouchableOpacity
                                    style={styles.dropdownButton}
                                    onPress={() => setTypeDropdownOpen(!typeDropdownOpen)}
                                >
                                    <Text style={styles.dropdownButtonText}>{getCurrentTypeLabel()}</Text>
                                    <Text style={styles.dropdownArrow}>▼</Text>
                                </TouchableOpacity>

                                {typeDropdownOpen && (
                                    <View style={styles.dropdownMenu}>
                                        <ScrollView nestedScrollEnabled={true}>
                                            {typeOptions.map((option) => (
                                                <TouchableOpacity
                                                    key={option.value}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setFilterType(option.value as any);
                                                        setTypeDropdownOpen(false);
                                                    }}
                                                >
                                                    <Text style={styles.dropdownItemText}>{option.label}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Liste des associations */}
                    <FlatList
                        data={filteredAssociations}
                        keyExtractor={(item: Association) => item.idAssociation.toString()}
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

                {/* Overlay pour fermer le dropdown en cliquant ailleurs */}
                {typeDropdownOpen && (
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={() => setTypeDropdownOpen(false)}
                    />
                )}
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
        fontSize: fontSizes.fontSizeTitre,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        color: themeColors.text,
    },
    modalSubTitle: {
        fontSize: fontSizes.fontSize,
        marginBottom: 20,
        textAlign: 'center',
        color: themeColors.text,
        opacity: 0.6,
    },
    filterContainer: {
        marginBottom: 20,
    },
    dropdownContainer: {
        marginHorizontal: 5,
    },
    dropdownLabel: {
        fontSize: fontSizes.fontSizePetit,
        color: themeColors.text,
        marginBottom: 5,
        fontWeight: '500',
    },
    relativeContainer: {
        position: 'relative',
        zIndex: 1,
    },
    dropdownButton: {
        backgroundColor: themeColors.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: themeColors.primaryAlt?.background || '#ddd',
        padding: 10,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownButtonText: {
        fontSize: fontSizes.fontSizePetit,
        color: themeColors.text,
    },
    dropdownArrow: {
        fontSize: fontSizes.fontSizeTresPetit,
        color: themeColors.text,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 42,
        left: 0,
        right: 0,
        backgroundColor: themeColors.background,
        borderWidth: 1,
        borderColor: themeColors.text,
        borderRadius: 8,
        maxHeight: 160,
        shadowColor: themeColors.shadowColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        zIndex: 2,
    },
    dropdownItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dropdownItemText: {
        fontSize: fontSizes.fontSizePetit,
        color: themeColors.text,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: themeColors.primary.background,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: themeColors.primary.text,
        fontSize: fontSizes.fontSize,
        fontWeight: 'bold',
    },
});
