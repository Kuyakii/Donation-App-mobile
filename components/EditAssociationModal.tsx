import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { IAssociation } from "@/backend/interfaces/IAssociation";
import { IUtilisateur } from "@/backend/interfaces/IUtilisateur";
import { Picker } from '@react-native-picker/picker';

interface EditAssociationModalProps {
    isVisible: boolean;
    association: IAssociation | null;
    utilisateurs: IUtilisateur[] | null;
    onClose: () => void;
    onSave: (updatedAssociation: Partial<IAssociation>) => void;
}

export const EditAssociationModal: React.FC<EditAssociationModalProps> = ({
                                                                              isVisible,
                                                                              association,
                                                                              utilisateurs,
                                                                              onClose,
                                                                              onSave
                                                                          }) => {
    const [nom, setNom] = useState(association?.nom || '');
    const [descriptionCourte, setDescriptionCourte] = useState(association?.descriptionCourte || '');
    const [descriptionLongue, setDescriptionLongue] = useState(association?.description || '');
    //const [selectedAdminId, setSelectedAdminId] = useState(association?.?.toString() || '');
    useEffect(() => {
        if (association && isVisible) {
            setNom(association.nom || '');
            setDescriptionCourte(association.descriptionCourte || '');
            setDescriptionLongue(association.description || '');
        }
    }, [association, isVisible]);

    const handleSave = () => {
        // Validation
        if (!nom.trim()) {
            Alert.alert('Erreur', 'Le nom de l\'association est requis');
            return;
        }

        const updatedAssociation = {
            ...association,
            nom: nom,
            description: descriptionLongue,
            descriptionCourte: descriptionCourte
        };

        onSave(updatedAssociation);
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.centeredView}
            >
                <View style={styles.modalView}>
                    <ScrollView
                        contentContainerStyle={styles.modalScrollViewContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={styles.modalTitle}>Modifier l'Association</Text>

                        {/* Nom de l'association */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Nom de l'association</Text>
                            <TextInput
                                style={styles.input}
                                value={nom}
                                onChangeText={setNom}
                                placeholder="Entrez le nom de l'association"
                            />
                        </View>

                        {/* Description courte */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description courte</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={descriptionCourte}
                                onChangeText={setDescriptionCourte}
                                placeholder="Entrez une description courte"
                                multiline
                            />
                        </View>

                        {/* Description longue */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Description longue</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={descriptionLongue}
                                onChangeText={setDescriptionLongue}
                                placeholder="Entrez une description détaillée"
                                multiline
                            />
                        </View>

                        {/* Sélection de l'administrateur
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Administrateur de l'association</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedAdminId}
                                    onValueChange={(itemValue) => setSelectedAdminId(itemValue)}
                                >
                                    <Picker.Item label="Sélectionner un administrateur" value="" />
                                    {utilisateurs?.map((user) => (
                                        <Picker.Item
                                            key={user.idUtilisateur}
                                            label={user.pseudonyme}
                                            value={user.idUtilisateur.toString()}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>*/}

                        {/* Boutons d'action */}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonCancel]}
                                onPress={onClose}
                            >
                                <Text style={styles.buttonCancelText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonSave]}
                                onPress={handleSave}
                            >
                                <Text style={styles.buttonText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// Styles are taken from the existing styles in the original file
const styles = StyleSheet.create({
    // ... (copy the relevant styles from the original StyleSheet)
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalScrollViewContent: {
        paddingBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: 'purple',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        minWidth: '45%',
        alignItems: 'center',
    },
    buttonCancel: {
        backgroundColor: '#f3f3f3',
    },
    buttonCancelText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
    },
    buttonSave: {
        backgroundColor: 'purple',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
    },
});
