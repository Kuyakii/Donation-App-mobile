import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity, ScrollView,
} from 'react-native';

import {useTranslation} from "react-i18next";
import useFontStore from '@/store/fontStore';
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

// @ts-ignore
export default function RGPDModal({modalVisible, onClose}) {
    const {fontSizeTresPetit ,fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre,fontSizeGrosTitre, increaseFontSize, decreaseFontSize } = useFontStore();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors, {
        fontSizeTresPetit,
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre,
    });
    const { t } = useTranslation();
    return (
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <ScrollView style={styles.modalContent}>
                    <Text style={styles.modalText}>
                        {t('privacy_policy_modal_text')}
                        <Text style={styles.linkText}>{t('privacy_policy')}</Text>.
                    </Text>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>{t('close_button')}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Modal>
    )
}
const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    modalContainer: {
        flex: 1,
        paddingVertical: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: themeColors.card.background,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
        borderColor: themeColors.card.border
    },
    modalText: {
        fontSize: fontSizes.fontSize,
        color: themeColors.text,
        lineHeight: 22,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: themeColors.primary.background,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30,
    },
    closeButtonText: {
        color: themeColors.primary.text,
        fontSize: fontSizes.fontSize,
    },
    linkText: {
        color: themeColors.primary.background,
        textDecorationLine: 'underline',
    },
});