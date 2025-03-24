import React, { useState } from "react";
import {Modal, View, TextInput, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert} from "react-native";
import {BASE_URL} from "@/config";
import {useNavigation} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
            const updatedUser = { ...JSON.parse(user), pseudonyme: newPseudonyme };
            await AsyncStorage.setItem('utilisateur', JSON.stringify(updatedUser));

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erreur lors du changement du pseudonyme.");
            }

            Alert.alert("Succès", "Votre Pseudonyme a été changé avec succès !");
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
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Changer de pseudonyme</Text>

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
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleChangePseudonyme} style={styles.confirmButton}>
                                <Text style={styles.confirmButtonText}>Confirmer</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 45,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
        borderRadius: 5,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    cancelButton: {
        backgroundColor: "#f44336",
        padding: 10,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: "white",
        fontSize: 16,
    },
    confirmButton: {
        backgroundColor: "#4CAF50",
        padding: 10,
        borderRadius: 5,
    },
    confirmButtonText: {
        color: "white",
        fontSize: 16,
    },
});

export default ChangePseudoModal;
