import React, {useState} from 'react';
import {View, TextInput, StyleSheet, Text, TouchableOpacity, FlatList} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {router} from "expo-router";

// Ajout du type pour les associations
type Association = {
    idAssociation: number;
    nom: string;
    // Ajoutez d'autres propriétés si nécessaire
};

// @ts-ignore
interface SearchBarProps {
    associations?: any[]
}

// @ts-ignore
export default function SearchBar({associations}) {
    const navigation = useNavigation();
    const [value, setValue] = useState("");
    const [filteredAssociations, setFilteredAssociations] = useState<Association[]>([]);

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
        router.replace({
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
                <Text>{item.nom}</Text>
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
                    placeholder="Rechercher une association"
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

const styles = StyleSheet.create({
    searchContainer: {
        paddingHorizontal: 16,
        margin: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
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
        fontSize: 14,
    },
    suggestionsList: {
        backgroundColor: 'white',
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
});