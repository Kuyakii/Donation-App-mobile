import React, { useState } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { IDon } from '@/backend/interfaces/IDon';
import {useTranslation} from "react-i18next";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

// @ts-ignore
export default function AssociationListModal({ visible, onClose, dons, total }) {
    const { t } = useTranslation();

    const [filterType, setFilterType] = useState<'TOUS' | 'UNIQUE' | 'RECURRENT'>('TOUS');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // États pour gérer l'ouverture des listes déroulantes
    const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

    // Options pour les listes déroulantes
    const typeOptions = [
        { label: t('all_donations'), value: "TOUS" },
        { label: t('unique_donation'), value: "UNIQUE" },
        { label: t('recurring_donation'), value: "RECURRENT" }
    ];

    const sortOptions = [
        { label: t('descending'), value: "desc" },
        { label: t('ascending'), value: "asc" }
    ];

    // Filtrer les dons par type
    const filteredDons = dons.filter((don: IDon) => {
        if (filterType === 'TOUS') return true;
        return don.typeDon === filterType;
    });

    // Trier les dons par montant
    const sortedDons = filteredDons.sort((a: IDon, b: IDon) => {
        if (sortOrder === 'asc') {
            return a.montant - b.montant;
        } else {
            return b.montant - a.montant;
        }
    });

    // Obtenir le label actuel pour les dropdowns
    const getCurrentTypeLabel = () => typeOptions.find(option => option.value === filterType)?.label;
    const getCurrentSortLabel = () => sortOptions.find(option => option.value === sortOrder)?.label;
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre,fontSizeGrosTitre, increaseFontSize, decreaseFontSize } = useFontStore();
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
                    <Text style={styles.modalTitle}>{t("your_donations", { total })}</Text>
                    <Text style={styles.modalSubTitle}>{t("donations_subtitle", { donCount: dons.length, total })}</Text>

                    {/* Filtres et tris */}
                    <View style={styles.filterContainer}>
                        {/* Filtre par type de don */}
                        <View style={styles.dropdownContainer}>
                            <Text style={styles.dropdownLabel}>{t("donation_type")}</Text>
                            <View style={styles.relativeContainer}>
                                <TouchableOpacity
                                    style={styles.dropdownButton}
                                    onPress={() => {
                                        setTypeDropdownOpen(!typeDropdownOpen);
                                        setSortDropdownOpen(false);
                                    }}
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
                                                        setFilterType(option.value as 'TOUS' | 'UNIQUE' | 'RECURRENT');
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

                        {/* Tri par montant */}
                        <View style={styles.dropdownContainer}>
                            <Text style={styles.dropdownLabel}>{t("filter_sort_label")}</Text>
                            <View style={styles.relativeContainer}>
                                <TouchableOpacity
                                    style={styles.dropdownButton}
                                    onPress={() => {
                                        setSortDropdownOpen(!sortDropdownOpen);
                                        setTypeDropdownOpen(false);
                                    }}
                                >
                                    <Text style={styles.dropdownButtonText}>{getCurrentSortLabel()}</Text>
                                    <Text style={styles.dropdownArrow}>▼</Text>
                                </TouchableOpacity>

                                {sortDropdownOpen && (
                                    <View style={styles.dropdownMenu}>
                                        <ScrollView nestedScrollEnabled={true}>
                                            {sortOptions.map((option) => (
                                                <TouchableOpacity
                                                    key={option.value}
                                                    style={styles.dropdownItem}
                                                    onPress={() => {
                                                        setSortOrder(option.value as 'asc' | 'desc');
                                                        setSortDropdownOpen(false);
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

                    {/* Liste des dons */}
                    <FlatList
                        data={sortedDons}
                        keyExtractor={(item: IDon) => item.idDon.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.donItem}>
                                <Text style={styles.donType}>{item.typeDon}</Text>
                                <Text style={styles.donMontant}>{t("donation_amount")}: {item.montant}€</Text>
                                <Text style={styles.donDate}>{t("start_date")}: {new Date(item.dateDon).toLocaleDateString()}</Text>
                                {item.frequence && (
                                    <Text style={styles.donFrequence}>{t('frequency')} {item.frequence}</Text>
                                )}
                            </View>
                        )}
                    />

                    {/* Bouton de fermeture */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>{t('close_button')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Overlay pour fermer les dropdowns en cliquant ailleurs */}
                {(typeDropdownOpen || sortDropdownOpen) && (
                    <TouchableOpacity
                        style={styles.overlay}
                        onPress={() => {
                            setTypeDropdownOpen(false);
                            setSortDropdownOpen(false);
                        }}
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
        marginBottom: 20,
        textAlign: 'center',
        color: themeColors.text,
    },
    modalSubTitle: {
        fontSize: fontSizes.fontSize,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: themeColors.text,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dropdownContainer: {
        flex: 1,
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
        borderColor: '#ddd',
        padding: 10,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownButtonText: {
        color: themeColors.text,
        fontSize: fontSizes.fontSizePetit,
    },
    dropdownArrow: {
        color: themeColors.text,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 42,
        left: 0,
        right: 0,
        backgroundColor: themeColors.background,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        maxHeight: 120,
        shadowColor: '#000',
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
        color: themeColors.text,
        fontSize: fontSizes.fontSizePetit,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
    },
    donItem: {
        backgroundColor: themeColors.card.background,
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: themeColors.card.border,
    },
    donType: {
        fontSize: fontSizes.fontSize,
        fontWeight: 'bold',
        color: themeColors.text,
        marginBottom: 4,
    },
    donMontant: {
        fontSize: fontSizes.fontSize,
        color: themeColors.text,
        marginBottom: 2,
    },
    donDate: {
        fontSize: fontSizes.fontSizePetit,
        color: themeColors.text,
        marginBottom: 2,
    },
    donFrequence: {
        fontSize: fontSizes.fontSizePetit,
        color: themeColors.text,
        fontStyle: 'italic',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: themeColors.primary.background,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: fontSizes.fontSize,
        color: themeColors.primary.text,
        fontWeight: 'bold',
    },
});