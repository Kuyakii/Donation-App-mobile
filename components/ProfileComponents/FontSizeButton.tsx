import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import useFontStore from "@/store/fontStore";

export default function FontSizeButton() {
    const { increaseFontSize, decreaseFontSize } = useFontStore();

    return (
        <View style={styles.container}>
            {/* Bouton pour augmenter la taille */}
            <TouchableOpacity style={styles.button} onPress={increaseFontSize}>
                <Text style={styles.buttonText}>A+</Text>
            </TouchableOpacity>

            {/* Bouton pour diminuer la taille */}
            <TouchableOpacity style={styles.button} onPress={decreaseFontSize}>
                <Text style={styles.buttonText}>A-</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 20,
        bottom: 20,
        flexDirection: "column",
        gap: 10,
    },
    button: {
        backgroundColor: "#007AFF",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
});
