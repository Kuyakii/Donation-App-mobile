import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { IUtilisateur } from "@/backend/interfaces/IUtilisateur";
import { BASE_URL } from "@/config";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

interface UtilisateursListProps {
    utilisateurs: IUtilisateur[];
    onUpdateUsers: (updatedUsers: IUtilisateur[]) => void;
    user: IUtilisateur;
}

export const UtilisateursList: React.FC<UtilisateursListProps> = ({
                                                                      utilisateurs,
                                                                      onUpdateUsers,
                                                                      user
                                                                  }) => {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUtilisateur | null>(null);
    const [editedPseudonyme, setEditedPseudonyme] = useState('');
    const [editedEmail, setEditedEmail] = useState('');

    const handleEditUser = (userToEdit: IUtilisateur) => {
        setSelectedUser(userToEdit);
        setEditedPseudonyme(userToEdit.pseudonyme);
        setEditedEmail(userToEdit.email);
        setIsEditModalVisible(true);
    };

    const handleSaveUser = async () => {
        if (!selectedUser) return;

        // Validation basic
        if (!editedPseudonyme.trim() || !editedEmail.trim()) {
            Alert.alert('Erreur', 'Tous les champs sont requis');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/updateUtilisateur/${selectedUser.idUtilisateur}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idUtilisateur: selectedUser.idUtilisateur,
                    pseudonyme: editedPseudonyme,
                    email: editedEmail
                })
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de l\'utilisateur');
            }

            // Mettre à jour la liste des utilisateurs
            const updatedUsers = utilisateurs.map(u =>
                u.idUtilisateur === selectedUser.idUtilisateur
                    ? { ...u, pseudonyme: editedPseudonyme, email: editedEmail }
                    : u
            );

            onUpdateUsers(updatedUsers);
            setIsEditModalVisible(false);
            Alert.alert("Succès", "L'utilisateur a été mis à jour avec succès");
        } catch (error) {
            console.error('Erreur de mise à jour:', error);
            Alert.alert("Erreur", "Impossible de mettre à jour l'utilisateur");
        }
    };

    const handleDeleteUser = (userToDelete: IUtilisateur) => {
        Alert.alert(
            "Confirmation",
            `Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete.pseudonyme} ?`,
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await fetch(`${BASE_URL}/suppUser/${userToDelete.idUtilisateur}`, {
                                method: 'DELETE',
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                }
                            });

                            if (response.status !== 201 && response.status !== 200) {
                                throw new Error(`Erreur de suppression de l'utilisateur`);
                            }

                            // Mettre à jour la liste des utilisateurs
                            const updatedUsers = utilisateurs.filter(
                                u => u.idUtilisateur !== userToDelete.idUtilisateur
                            );

                            onUpdateUsers(updatedUsers);
                            Alert.alert("Succès", "L'utilisateur a été supprimé avec succès");
                        } catch (error) {
                            console.error('Erreur de suppression:', error);
                            Alert.alert("Erreur", "Impossible de supprimer l'utilisateur");
                        }
                    }
                }
            ]
        );
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
    const renderUserItem = (item: IUtilisateur) => (
        <View key={item.idUtilisateur} style={styles.userItem}>
            <View style={styles.userInfo}>
                <Text style={[styles.userName, {fontSize : fontSize}]}>
                    {item.pseudonyme}{item.idUtilisateur == user.idUtilisateur ? " (Moi)": ""}
                </Text>
                <Text style={[styles.userEmail, {fontSize : fontSizePetit}]}>{item.email}</Text>
            </View>
            <View style={styles.userActions}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditUser(item)}
                >
                    <Text style={styles.actionButtonText}>Modifier</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteUser(item)}
                >
                    <Text style={styles.actionButtonText}>Supprimer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView>
                {utilisateurs.length > 0 ? (
                    utilisateurs.map(renderUserItem)
                ) : (
                    <Text style={[styles.emptyListText, {fontSize : fontSize}]}>Aucun utilisateur trouvé</Text>
                )}
            </ScrollView>

            {/* Modal de modification d'utilisateur */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isEditModalVisible}
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <Text style={[styles.modalTitle, {fontSize : fontSizeSousTitre}]}>Modifier l'utilisateur</Text>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, {fontSize : fontSize}]}>Pseudonyme</Text>
                            <TextInput
                                style={[styles.input, {fontSize : fontSize}]}
                                value={editedPseudonyme}
                                onChangeText={setEditedPseudonyme}
                                placeholder="Entrez le pseudonyme"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, {fontSize : fontSize}]}>Email</Text>
                            <TextInput
                                style={[styles.input, {fontSize : fontSize}]}
                                value={editedEmail}
                                onChangeText={setEditedEmail}
                                placeholder="Entrez l'email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonCancel]}
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <Text style={[styles.buttonCancelText, {fontSize : fontSize}]}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonSave]}
                                onPress={handleSaveUser}
                            >
                                <Text style={[styles.buttonText, {fontSize : fontSize}]}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: themeColors.background,
            minWidth: 'auto',
            borderWidth: 1,
            borderColor: "#ddd"
        },
        userItem: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
        },
        userInfo: {
            flex: 1,
            marginRight: 10,
        },
        userName: {
            fontSize: fontSizes.fontSize,
            fontWeight: 'bold',
            color: themeColors.text,
        },
        userEmail: {
            fontSize: fontSizes.fontSizePetit,
            color: themeColors.text,
            opacity: 0.8,
        },
        userActions: {
            flexDirection: 'row',
        },
        actionButton: {
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            marginLeft: 5,
        },
        editButton: {
            backgroundColor: '#4CAF50',
        },
        deleteButton: {
            backgroundColor: '#f44336',
        },
        actionButtonText: {
            color: 'white',
            fontWeight: '500',
        },
        emptyListText: {
            textAlign: 'center',
            marginTop: 20,
            fontSize: fontSizes.fontSize,
            color: themeColors.text,
            opacity: 0.8,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalContent: {
            width: '90%',
            backgroundColor: themeColors.background,
            borderRadius: 10,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            borderWidth: 1,
            borderColor: "#ddd",
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
        },
        input: {
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            padding: 10,
            fontSize: fontSizes.fontSize,
            color: themeColors.text,
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
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: '#ddd',
        },
        buttonCancelText: {
            fontWeight: 'bold',
            fontSize: fontSizes.fontSize,
            color: themeColors.text,
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