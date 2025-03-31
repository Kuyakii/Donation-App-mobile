import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, Modal, Alert, StyleSheet, ActivityIndicator
} from "react-native";
import {BASE_URL} from "@/config";
import {useTranslation} from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

// @ts-ignore
const DeleteAccountModal = ({ visible, onClose, email }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { t } = useTranslation();
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('utilisateur');
            // @ts-ignore
            router.replace('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };
    const handleChangePassword = async () => {
        setLoading(true);
        setError('');


        try {
            const response = await fetch(`${BASE_URL}/deleteAccount`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    password,
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors de la suppression du compte");
            }

            Alert.alert(t("success"), t("accountDeletedSuccess"));
            logout();
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
                        value={password}
                        onChangeText={setPassword}
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
        backgroundColor: themeColors.container.backgroundColor,
        padding: 20,
        borderWidth: 1,
        borderColor: themeColors.card.border,
        borderRadius: 10,
        width: '80%',
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
        padding: 10,
        borderWidth: 1,
        borderColor: themeColors.primaryAlt?.background || '#ddd',
        borderRadius: 5,
        marginBottom: 15,
        color: themeColors.text,
        fontSize: fontSizes.fontSize,
        backgroundColor: themeColors.input.backgroundColor,
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
        fontSize: fontSizes.fontSizePetit,
    },
    confirmButton: {
        flex: 1,
        backgroundColor: themeColors.primary.background,
        padding: 10,
        borderRadius: 5,
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

export default DeleteAccountModal;
