import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Modal,
    TextInput,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { IUtilisateur } from "@/backend/interfaces/IUtilisateur";
import { BASE_URL } from "@/config";

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

    const handleEditUser = (user: IUtilisateur) => {
        setSelectedUser(user);
        setEditedPseudonyme(user.pseudonyme);
        setEditedEmail(user.email);
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
            const updatedUsers = utilisateurs.map(user =>
                user.idUtilisateur === selectedUser.idUtilisateur
                    ? { ...user, pseudonyme: editedPseudonyme, email: editedEmail }
                    : user
            );

            onUpdateUsers(updatedUsers);
            setIsEditModalVisible(false);
            Alert.alert("Succès", "L'utilisateur a été mis à jour avec succès");
        } catch (error) {
            console.error('Erreur de mise à jour:', error);
            Alert.alert("Erreur", "Impossible de mettre à jour l'utilisateur");
        }
    };

    const handleDeleteUser = (user: IUtilisateur) => {
        Alert.alert(
            "Confirmation",
            `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.pseudonyme} ?`,
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
                            const response = await fetch(`${BASE_URL}/deleteUtilisateur/${user.idUtilisateur}`, {
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
                                u => u.idUtilisateur !== user.idUtilisateur
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

    const renderUserItem = ({ item }: { item: IUtilisateur }) => (
        <View style={styles.userItem}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.pseudonyme}{item.idUtilisateur == user.idUtilisateur ? " (Moi)": ""}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
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
            <FlatList
                data={utilisateurs}
                keyExtractor={(item) => item.idUtilisateur.toString()}
                renderItem={renderUserItem}
                ListEmptyComponent={
                    <Text style={styles.emptyListText}>Aucun utilisateur trouvé</Text>
                }
            />

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
                        <Text style={styles.modalTitle}>Modifier l'utilisateur</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Pseudonyme</Text>
                            <TextInput
                                style={styles.input}
                                value={editedPseudonyme}
                                onChangeText={setEditedPseudonyme}
                                placeholder="Entrez le pseudonyme"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
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
                                <Text style={styles.buttonCancelText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonSave]}
                                onPress={handleSaveUser}
                            >
                                <Text style={styles.buttonText}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        fontSize: 16,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
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
        fontSize: 16,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
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
    modalTitle: {
        fontSize: 18,
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
