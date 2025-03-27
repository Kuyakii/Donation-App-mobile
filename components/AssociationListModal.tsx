import React, { useState } from 'react';
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AssociationItem from './AssociationItem';
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import {IAssociation} from "@/backend/interfaces/IAssociation";

interface Association {
    idAssociation: number;
    nom: string;
    descriptionCourte: string;
    typeAssociation: string | number;
    nomImage: string;
}
import {useTranslation} from "react-i18next";
import useFontStore from '@/store/fontStore';

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

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={[styles.modalTitle, {fontSize : fontSizeTitre}]}>{t('all_associations')}</Text>
                    <Text style={[styles.modalSubTitle, {fontSize : fontSize}]}>
                        {filteredAssociations.length} association {filteredAssociations.length > 1 ? 's' : ''} disponible{filteredAssociations.length > 1 ? 's' : ''}
                    </Text>

                    {/* Filtre par type d'association */}
                    <View style={styles.filterContainer}>
                        <View style={styles.dropdownContainer}>
                            <Text style={[styles.dropdownLabel, {fontSize : fontSizePetit}]}>Type d'association :</Text>
                            <View style={styles.relativeContainer}>
                                <TouchableOpacity
                                    style={styles.dropdownButton}
                                    onPress={() => setTypeDropdownOpen(!typeDropdownOpen)}
                                >
                                    <Text style={[styles.dropdownButtonText, {fontSize : fontSizePetit}]}>{getCurrentTypeLabel()}</Text>
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
                                                    <Text style={[styles.dropdownItemText, {fontSize : fontSizePetit}]}>{option.label}</Text>
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
                        <Text style={[styles.closeButtonText, {fontSize : fontSize}]}>{t('close_button')}</Text>
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
      //  fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
        color: '#333',
    },
    modalSubTitle: {
       // fontSize: 15,
        marginBottom: 20,
        textAlign: 'center',
        color: '#555',
    },
    filterContainer: {
        marginBottom: 20,
    },
    dropdownContainer: {
        marginHorizontal: 5,
    },
    dropdownLabel: {
      //  fontSize: 14,
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
    //    fontSize: 14,
    },
    dropdownArrow: {
     //   fontSize: 10,
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
        maxHeight: 150,
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
    //    fontSize: 14,
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
        backgroundColor: Colors.primary_dark.background,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        color: Colors.primary_dark.text,
    //    fontSize: 16,
        fontWeight: 'bold',
    },
});
