import React, { useState } from "react";
import {Modal, View, TextInput, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert} from "react-native";
import {BASE_URL} from "@/config";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";
interface ChangePseudoModal {
    visible: boolean;
    onClose: () => void;
    email: string;
}

const ChangePseudoModal = ({ visible, onClose, email }: ChangePseudoModal) => {
    const [password, setpassword] = useState<string>("");
    const [newPseudonyme, setNewPseudonyme] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const navigation = useNavigation();
    const { t } = useTranslation();
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
    const handleChangePseudonyme = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${BASE_URL}/changePseudonyme`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    newPseudonyme,
                    password,
                })
            });
            const user = await AsyncStorage.getItem("utilisateur");
            const updatedUser = { ...JSON.parse(String(user)), pseudonyme: newPseudonyme };
            await AsyncStorage.setItem('utilisateur', JSON.stringify(updatedUser));

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors du changement du pseudonyme.");
            }

            Alert.alert(t("success"), t("usernameChangedSuccess"));
            onClose();
        } catch (err) {
            // @ts-ignore
            setError(err.message);
        } finally {
            setLoading(false);
            // @ts-ignore
            navigation.navigate('settings');
        }
    };
    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{t("changeUsername")}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe actuel"
                        secureTextEntry
                        value={password}
                        onChangeText={setpassword}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Nouveau pseudonyme"
                        value={newPseudonyme}
                        onChangeText={setNewPseudonyme}
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {loading ? (
                        <ActivityIndicator size="large" color="#4CAF50" />
                    ) : (
                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                                <Text style={styles.cancelButtonText}>{t('cancel_button')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleChangePseudonyme} style={styles.confirmButton}>
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

export default ChangePseudoModal;
