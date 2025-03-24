import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Switch,
    TouchableOpacity
} from 'react-native';
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import {getUtilisateurConnecte} from "@/helpers";
import ChangePseudoModal from "@/components/ChangePseudoModal";

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [dataSharing, setDataSharing] = useState(true);
    const [location, setLocation] = useState(true);
    const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
    const [isChangePseudoModalVisible, setChangePseudoModalVisible] = useState(false);

    const navigation = useNavigation();
    const user = getUtilisateurConnecte();

    const handleGoBack = () => {
        router.back();
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            title: '',
        });
    }, [navigation]);

    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
                <Text style={{ fontSize: 18, marginBottom: 20 }}>Vous devez être connecté pour accéder aux réglages.</Text>
                <TouchableOpacity
                    onPress={() => router.push("/login")}
                    style={{
                        backgroundColor: "#4CAF50",
                        padding: 10,
                        borderRadius: 5,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "white", fontSize: 16 }}>Se connecter</Text>
                </TouchableOpacity>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.pageTitle}>Réglages</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Compte</Text>
                    <TouchableOpacity style={styles.settingItem} onPress={() => setChangePasswordModalVisible(true)}>
                        <Text style={styles.settingLabel}>Changer le mot de passe</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem} onPress={() => setChangePseudoModalVisible(true)}>
                        <Text style={styles.settingLabel}>Changer le pseudonyme</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            {/* Intégration du modal */}
            <ChangePasswordModal visible={isChangePasswordModalVisible} onClose={() => setChangePasswordModalVisible(false)} email={user.email} />
            {/* Intégration du modal */}
            <ChangePseudoModal visible={isChangePseudoModalVisible} onClose={() => setChangePseudoModalVisible(false)} email={user.email} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop: 20,
        marginBottom: 15,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        padding: 5,
    },
    backButtonText: {
        fontSize: 30,
        color: Colors.primary_dark.background,
    },
    pageTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 20,
        marginBottom: 15,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    section: {
        backgroundColor: Colors.container_light.backgroundColor,
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: 'black',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary_light.background,
    },
    settingLabel: {
        fontSize: 16,
        color: '#333',
    },
    settingArrow: {
        color: '#999',
        fontSize: 20,
    },
});

