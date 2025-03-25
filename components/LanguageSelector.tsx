import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
    const { t, i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        setSelectedLanguage(lang);
    };

    return (
      <RNPickerSelect
                onValueChange={(lang) => changeLanguage(lang)}
                items={[
                    { label: t('fr'), value: 'fr' },
                    { label: t('en'), value: 'en' },
                    { label: t('es'), value: 'es' },
                    { label: t('ja'), value: 'ja' },
                    { label: t('zh'), value: 'zh' },
                    { label: t('pt'), value: 'pt' },
                    { label: t('ko'), value: 'ko' },
                    { label: t('it'), value: 'it' },
                ]}
                value={selectedLanguage}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
            />
    );
}

const styles = StyleSheet.create({
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
    },
    settingLabel: {
        fontSize: 16,
        color: "#333",
    },
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        color: "black",
    },
    inputAndroid: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        color: "black",
    },
};
