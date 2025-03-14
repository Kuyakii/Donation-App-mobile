import React, {useEffect} from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity, SafeAreaView, Image, StatusBar } from 'react-native';
import Colors from "@/constants/Colors";
import {router, useRouter} from "expo-router";
import {useNavigation} from "@react-navigation/native";
import {black} from "react-native-paper/lib/typescript/styles/themes/v2/colors";


export default function SettingsScreen() {
    const [notifications, setNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false);
    const [dataSharing, setDataSharing] = React.useState(true);
    const [location, setLocation] = React.useState(true);

    const navigation1 = useRouter();
    const navigation = useNavigation();

    const handleGoBack = () => {
        router.back();
    };

    // Force la suppression du header pour cette page spécifiquement jsp pk il était tjr la
    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            title: '',
        });
    }, [navigation]);


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
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Changer le mot de passe</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </View>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Changer le pseudonyme</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </View>
                </View>

                {/* Notifications Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Activer les notifications</Text>
                        <Switch
                            value={notifications}
                            onValueChange={setNotifications}
                            trackColor={{ false: "#d3d3d3", true: "#4CAF50" }}
                            thumbColor="#ffffff"
                        />
                    </View>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Préférences</Text>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Mode sombre</Text>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: "#d3d3d3", true: "#4CAF50" }}
                            thumbColor="#ffffff"
                        />
                    </View>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Langue</Text>
                        <Text style={styles.settingValue}>Français</Text>
                    </View>
                </View>

                {/* Privacy Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Confidentialité</Text>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Partage de données</Text>
                        <Switch
                            value={dataSharing}
                            onValueChange={setDataSharing}
                            trackColor={{ false: "#d3d3d3", true: "#4CAF50" }}
                            thumbColor="#ffffff"
                        />
                    </View>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Localisation</Text>
                        <Switch
                            value={location}
                            onValueChange={setLocation}
                            trackColor={{ false: "#d3d3d3", true: "#4CAF50" }}
                            thumbColor="#ffffff"
                        />
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>À propos</Text>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Conditions d'utilisation</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </View>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Politique de confidentialité</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </View>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>Version de l'application</Text>
                        <Text style={styles.settingValue}>1.2.3</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Supprimer ce compte</Text>
                </TouchableOpacity>
            </ScrollView>

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
        padding : 20,
        marginTop: 20,
        marginBottom: 15,
        position: 'relative',

    },
    iconText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: Colors.primary_dark.background,
        fontSize: 20,
        fontWeight: 'bold',
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
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
    settingValue: {
        color: '#666',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#f44336',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 30,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

});