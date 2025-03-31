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
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

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
                        <Text style={[styles.modalTitle, {fontSize : fontSizeSousTitre}]}>Modifier l'Association</Text>

                        {/* Nom de l'association */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, {fontSize : fontSize}]}>Nom de l'association</Text>
                            <TextInput
                                style={[styles.input, {fontSize : fontSize}]}
                                value={nom}
                                onChangeText={setNom}
                                placeholder="Entrez le nom de l'association"
                            />
                        </View>

                        {/* Description courte */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, {fontSize : fontSize}]}>Description courte</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, {fontSize : fontSize}]}
                                value={descriptionCourte}
                                onChangeText={setDescriptionCourte}
                                placeholder="Entrez une description courte"
                                multiline
                            />
                        </View>

                        {/* Description longue */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, {fontSize : fontSize}]}>Description longue</Text>
                            <TextInput
                                style={[styles.input, styles.textArea, {fontSize : fontSize}]}
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
                                <Text style={[styles.buttonCancelText, {fontSize : fontSize}]}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonSave]}
                                onPress={handleSave}
                            >
                                <Text style={ [styles.buttonText, {fontSize : fontSize}]}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        backgroundColor: themeColors.background,
        borderRadius: 20,
        padding: 20,
        shadowColor: themeColors.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    modalScrollViewContent: {
        paddingBottom: 20,
    },
    modalTitle: {
        fontSize: fontSizes.fontSizeSousTitre,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: themeColors.primary.background,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: fontSizes.fontSize,
        marginBottom: 5,
        fontWeight: '600',
        color: themeColors.text,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        color: themeColors.text,
        fontSize: fontSizes.fontSize,
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
        backgroundColor: themeColors.background,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    buttonCancelText: {
        fontWeight: 'bold',
        fontSize: fontSizes.fontSize,
        color: themeColors.text,
        opacity: 0.8,
    },
    buttonSave: {
        backgroundColor: themeColors.primary.background,
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: fontSizes.fontSize,
        color: 'white',
    },
});