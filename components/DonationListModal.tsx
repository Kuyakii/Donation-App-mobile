import React, { useState } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { IDon } from '@/backend/interfaces/IDon';
import Colors from '@/constants/Colors';
import {useTranslation} from "react-i18next";
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
        { label: "Tous les dons", value: "TOUS" },
        { label: "Dons uniques", value: "UNIQUE" },
        { label: "Dons récurrents", value: "RECURRENT" }
    ];

    const sortOptions = [
        { label: "Décroissant", value: "desc" },
        { label: "Croissant", value: "asc" }
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
                            <Text style={styles.dropdownLabel}>{t("filter_type_label")}</Text>
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    modalSubTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
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
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        fontWeight: '500',
    },
    relativeContainer: {
        position: 'relative',
        zIndex: 1,
    },
    dropdownButton: {
        backgroundColor: '#f5f5f5',
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
        color: '#333',
        fontSize: 14,
    },
    dropdownArrow: {
        fontSize: 10,
        color: '#333',
    },
    dropdownMenu: {
        position: 'absolute',
        top: 42,
        left: 0,
        right: 0,
        backgroundColor: 'white',
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
        color: '#333',
        fontSize: 14,
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
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    donType: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    donMontant: {
        fontSize: 15,
        color: '#333',
        marginBottom: 2,
    },
    donDate: {
        fontSize: 14,
        color: '#333',
        marginBottom: 2,
    },
    donFrequence: {
        fontSize: 14,
        color: '#333',
        fontStyle: 'italic',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: Colors.primary_dark.background,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
