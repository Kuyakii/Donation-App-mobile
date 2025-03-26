import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, Modal, Alert, StyleSheet, ActivityIndicator
} from "react-native";
import {BASE_URL} from "@/config";
import {useTranslation} from "react-i18next";
// @ts-ignore
const ChangePasswordModal = ({ visible, onClose, email }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { t } = useTranslation();

    const handleChangePassword = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${BASE_URL}/changePassword`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    currentPassword,
                    newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors du changement de mot de passe.");
            }

            Alert.alert(t("success"), t("passwordChangedSuccess"));
            onClose();
        } catch (err) {
            // @ts-ignore
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{t("changePassword")}</Text>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe actuel"
                        secureTextEntry
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nouveau mot de passe"
                        secureTextEntry
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />

                    {loading ? <ActivityIndicator size="large" color="#4CAF50" /> : (
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>{t('cancel_button')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleChangePassword} style={styles.confirmButton}>
                                <Text style={styles.confirmButtonText}>{t('confirm_button')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 5,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 5,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorText: {
        color: "red",
        marginBottom: 10
    },
});

export default ChangePasswordModal;
