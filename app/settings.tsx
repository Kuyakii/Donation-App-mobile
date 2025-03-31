import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Switch,
    TouchableOpacity, Alert
} from 'react-native';
import AboutApp from "@/constants/AboutApp";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import {getUtilisateurConnecte} from "@/helpers";
import ChangePseudoModal from "@/components/ChangePseudoModal";
import {useTranslation} from "react-i18next";
import LanguageSelector from "@/components/LanguageSelector";
import * as Location from "expo-location";
import {Camera} from "expo-camera";
import TermsOfUseModal from "@/components/TermsOfUseModal";
import RGPDModal from "@/components/RGPDModal";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import useFontStore from "@/store/fontStore";

import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

export default function SettingsScreen() {
    const {
        fontSizeTresPetit,
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre,
        fontSizeGrosTitre
    } = useFontStore();

    const { theme, toggleTheme } = useTheme();
    const themeColors = ThemeColors[theme];
    const styles = getStyles(themeColors, {
        fontSizeTresPetit,
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre,
        fontSizeGrosTitre
    });

    const { t } = useTranslation();
    const [notifications, setNotifications] = useState(false);

    const [isChangePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
    const [isChangePseudoModalVisible, setChangePseudoModalVisible] = useState(false);
    const [isTermsOfUseModalVisible, setTermsOfUseModalVisible] = useState(false);
    const [isPrivacyPolicyModalVisible, setPrivacyPolicyModalVisible] = useState(false);
    const [isDeleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);

    const [cameraPermission, setCameraPermission] = useState(false);
    const [locationPermission, setLocationPermission] = useState(false);

    const navigation = useNavigation();
    const user = getUtilisateurConnecte();

    const handleGoBack = () => {
        router.back();
    };

    useEffect(() => {
        checkPermissions();

        navigation.setOptions({
            headerShown: false,
            title: '',
        });
    }, [navigation]);

    const checkPermissions = async () => {

    };

    const toggleCameraPermission = async () => {
        if (cameraPermission) {
            Alert.alert("Info", "Vous devez désactiver l'autorisation caméra depuis les paramètres de votre téléphone.");
        } else {
            let { status } = await Camera.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission refusée", "Autorisez la caméra pour pouvoir scanner des QR Code.");
                setCameraPermission(false);
                return;
            }
            setCameraPermission(true);
        }
    };

    const toggleLocationPermission = async () => {
        if (locationPermission) {
            Alert.alert("Info", "Vous devez désactiver l'autorisation localisation depuis les paramètres de votre téléphone.");
        } else {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission refusée", "Autorisez la localisation pour voir les associations proches.");
                setLocationPermission(false);
                return;
            }
            setLocationPermission(true);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.pageTitle}>
                    {t('settings')}</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Account Section */}
                {user ? (<View style={styles.section}>
                    <Text style={styles.sectionTitle} >{t('account')}</Text>
                    <TouchableOpacity style={styles.settingItem} onPress={() => setChangePasswordModalVisible(true)}>
                        <Text style={styles.settingLabel}>{t('changePassword')}</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem} onPress={() => setChangePseudoModalVisible(true)}>
                        <Text style={styles.settingLabel}>{t('changeUsername')}</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>
                </View>) : (<Text/>)}


                {/* Notifications Section */}
                <View style={styles.section }>
                    <Text style={styles.sectionTitle}>{t('notifications')}</Text>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>{t('enable_notifications')}</Text>
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
                    <Text style={styles.sectionTitle}>{t('preferences')}</Text>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>{t('dark_mode')}</Text>
                        <Switch
                            value={theme === 'dark'}
                            onValueChange={toggleTheme}
                            trackColor={{ false: "#d3d3d3", true: "#4CAF50" }}
                            thumbColor="#ffffff"
                        />
                    </View>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>{t('language')}</Text>
                        <LanguageSelector />
                    </View>
                </View>

                {/* Privacy Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('privacy')}</Text>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>{t('enable_camera')}</Text>
                        <Switch
                            value={cameraPermission}
                            onValueChange={toggleCameraPermission}
                            trackColor={{ false: "#d3d3d3", true: "#4CAF50" }}
                            thumbColor="#ffffff"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>{t('enable_location')}</Text>
                        <Switch
                            value={locationPermission}
                            onValueChange={toggleLocationPermission}
                            trackColor={{ false: "#d3d3d3", true: "#4CAF50" }}
                            thumbColor="#ffffff"
                        />
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('about_us')}</Text>
                    <TouchableOpacity style={styles.settingItem} onPress={() => setTermsOfUseModalVisible(true)}>
                        <Text style={styles.settingLabel}>{t('terms_of_use')}</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem} onPress={() => setPrivacyPolicyModalVisible(true)}>
                        <Text style={styles.settingLabel}>{t('privacy_policy')}</Text>
                        <Text style={styles.settingArrow}>→</Text>
                    </TouchableOpacity>
                    <View style={styles.settingItem}>
                        <Text style={styles.settingLabel}>{t('app_version')}</Text>
                        <Text style={styles.settingValue}>{AboutApp.app_version}</Text>
                    </View>
                </View>
                {user ? (
                <TouchableOpacity style={styles.deleteAccountbutton} onPress={() => setDeleteAccountModalVisible(true)}>
                    <Text style={styles.deleteAccountbuttonText}>{t('delete_account_button')}</Text>
                </TouchableOpacity>) : (<Text/>)}
            </ScrollView>

            {/* Intégration du modal */}
            <ChangePasswordModal visible={isChangePasswordModalVisible} onClose={() => setChangePasswordModalVisible(false)} email={user ? user.email : ""} />
            <ChangePseudoModal visible={isChangePseudoModalVisible} onClose={() => setChangePseudoModalVisible(false)} email={user ? user.email : ""} />
            <RGPDModal modalVisible={isPrivacyPolicyModalVisible} onClose={() => setPrivacyPolicyModalVisible(false)}/>
            <TermsOfUseModal modalVisible={isTermsOfUseModalVisible} onClose={() => setTermsOfUseModalVisible(false)}/>
            <DeleteAccountModal visible={isDeleteAccountModalVisible} onClose={() => setDeleteAccountModalVisible(false)} email={user ? user.email : ""} />
        </View>
    );
}

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: themeColors.background,
        justifyContent: 'center',
        paddingBottom: 20,
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
        fontSize: 35,
        color: themeColors.text,
    },
    pageTitle: {
        fontSize: fontSizes.fontSizeTitre,
        fontWeight: 'bold',
        color: themeColors.text,
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
        backgroundColor: themeColors.card.background,
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: themeColors.card.border,
    },
    sectionTitle: {
        fontSize: fontSizes.fontSizeSousTitre,
        fontWeight: 'bold',
        marginBottom: 15,
        color: themeColors.text,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: themeColors.primaryAlt?.background || '#ccc',
    },
    settingLabel: {
        fontSize: fontSizes.fontSize,
        color: themeColors.text,
    },
    settingArrow: {
        color: themeColors.text,
        fontSize: fontSizes.fontSize,
    },
    settingValue: {
        fontSize: fontSizes.fontSize,
        color: themeColors.text,
    },
    languageSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    languageOption: {
        fontSize: 16,
        color: themeColors.text,
    },
    deleteAccountbutton: {
        backgroundColor: themeColors.primary.background,
        padding: 12,
        borderRadius: 20,
        width: '60%',
        alignSelf: "center"
    },
    deleteAccountbuttonText: {
        fontSize: fontSizes.fontSize,
        color: themeColors.primary.text,
        textAlign: 'center',
        fontWeight: "bold"
    },
});
