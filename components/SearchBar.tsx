import { Feather } from '@expo/vector-icons';
import {useTranslation} from "react-i18next";
import React, {useState} from 'react';
import {View, TextInput, StyleSheet, Text, TouchableOpacity, FlatList} from 'react-native';
import {router} from "expo-router";
import useFontStore from "@/store/fontStore";
import { useTheme } from "@/context/ThemeContext";
import { ThemeColors } from "@/constants/ThemeColor";

type Association = {
    idAssociation: number;
    nom: string;
};

// @ts-ignore
interface SearchBarProps {
    associations?: any[]
}

// @ts-ignore
export default function SearchBar({associations}) {
    const { t } = useTranslation();
    const [value, setValue] = useState("");
    const [filteredAssociations, setFilteredAssociations] = useState<Association[]>([]);
    const {fontSizePetit, fontSize, fontSizeSousTitre,fontSizeTitre, increaseFontSize, decreaseFontSize } = useFontStore();
    const { theme } = useTheme();
    const themeColors = ThemeColors[theme];

    const styles = getStyles(themeColors, {
        fontSizePetit,
        fontSize,
        fontSizeSousTitre,
        fontSizeTitre,
    });
    const handleChange = (text: string) => {
        setValue(text);
        if (text && associations) {
            const filtered = associations.filter((association: Association) =>
                association.nom.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredAssociations(filtered);
        } else {
            setFilteredAssociations([]);
        }
    };

    const handleSelectAssociation = (association: Association) => {
        router.push({
            pathname: "/detailsAssos",
            params: {id: association.idAssociation},
        });
    };

    const renderAssociationItem = ({item}: { item: Association }) => {
        return (
            <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSelectAssociation(item)}
            >
                <Text style={styles.suggestionName}>{item.nom}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
                <Feather name="search" size={18} color="gray" style={styles.searchIcon}/>
                <TextInput
                    style={styles.searchInput}
                    value={value}
                    onChangeText={handleChange}
                    placeholder={t('searchBar_placeholder')}
                    placeholderTextColor="#999"
                />
            </View>

            {filteredAssociations.length > 0 && (
                <FlatList
                    data={filteredAssociations}
                    renderItem={renderAssociationItem}
                    keyExtractor={(item) => item.idAssociation.toString()}
                    style={styles.suggestionsList}
                />
            )}
        </View>
    );
}

const getStyles = (themeColors: any, fontSizes: any) => StyleSheet.create({
    searchContainer: {
        paddingHorizontal: 16,
        margin: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: themeColors.background,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        paddingHorizontal: 12,
        height: 40,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: fontSizes.fontSizePetit,
    },
    suggestionsList: {
        backgroundColor: themeColors.background,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        maxHeight: 200,
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    suggestionName: {
        color: themeColors.text,
    }
});
