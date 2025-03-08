import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function SearchBar() {
    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
                <Feather name="search" size={18} color="gray" style={styles.searchIcon} />
                <TextInput style={styles.searchInput} placeholder="Rechercher" placeholderTextColor="#999" />
            </View>
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
});
