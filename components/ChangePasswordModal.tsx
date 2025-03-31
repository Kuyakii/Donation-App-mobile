import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, Modal, Alert, StyleSheet, ActivityIndicator
} from "react-native";
import {BASE_URL} from "@/config";
import {useTranslation} from "react-i18next";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

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

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: themeColors.background,
        padding: 20,
        borderWidth: 1,
        borderColor: themeColors.card.border,
        borderRadius: 10,
        width: '85%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: fontSizes.fontSizeSousTitre,
        fontWeight: 'bold',
        marginBottom: 15,
        color: themeColors.text,
    },
    input: {
        width: '100%',
        padding: 12,
        borderWidth: 1,
        borderColor: themeColors.primaryAlt?.background || '#ddd',
        borderRadius: 8,
        marginBottom: 15,
        fontSize: fontSizes.fontSize,
        backgroundColor: themeColors.input.backgroundColor,
        color: themeColors.text,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 5,
    },
    cancelButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: fontSizes.fontSizePetit,
    },
    confirmButton: {
        flex: 1,
        backgroundColor: themeColors.primary.background,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 5,
    },
    confirmButtonText: {
        color: themeColors.primary.text,
        fontWeight: 'bold',
        fontSize: fontSizes.fontSizePetit,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        fontSize: fontSizes.fontSizeTresPetit,
        textAlign: 'center',
    },
});
export default ChangePasswordModal;

