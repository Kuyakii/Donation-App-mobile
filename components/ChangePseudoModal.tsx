import React, { useState } from "react";
import {Modal, View, TextInput, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert} from "react-native";
import {BASE_URL} from "@/config";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTranslation} from "react-i18next";
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

export default ChangePseudoModal;
