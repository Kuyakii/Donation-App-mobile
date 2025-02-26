import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import UserProfileScreen from './userPage';
import Header from '../../components/header';
import SearchBar from '../../components/SearchBar';
import Section from '../../components/Section';
import FavoriteItem from '../../components/FavoriteItem';
import AssociationItem from '../../components/AssociationItem';
/*import NavigationBar from '../../components/NavigationBar';*/

export default function Layout() {

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />
            <SearchBar />
            <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Section title="Mes associations favorites" icon="star">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favoritesList}>
                        {[1, 2, 3].map(num => <FavoriteItem key={num} name={`Asso ${num}`} />)}
                    </ScrollView>
                </Section>
                <Section title="Associations populaire" icon="trending-up">
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`} description={`Description asso ${num}`} />)}
                </Section>
                <Section title="Associations santé mentale" icon="heart">
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`} description={`Description asso ${num}`} />)}
                </Section>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    logoContainer: {
        width: 180,
        height: 48,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: '500',
    },
    settingsButton: {
        padding: 8,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
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
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginLeft: 8,
    },
    seeAllText: {
        fontSize: 14,
        color: '#777',
    },
    favoritesList: {
        paddingRight: 16,
    },
    favoriteItem: {
        marginRight: 16,
        alignItems: 'center',
        width: 64,
    },
    favoriteImage: {
        width: 64,
        height: 64,
        backgroundColor: '#f2f2f2',
        marginBottom: 4,
    },
    favoriteText: {
        fontSize: 12,
        textAlign: 'center',
    },
    verticalList: {
        gap: 16,
    },
    associationItem: {
        flexDirection: 'row',
    },
    associationImage: {
        width: 120,
        height: 90,
        backgroundColor: '#f2f2f2',
        marginRight: 12,
    },
    associationInfo: {
        justifyContent: 'center',
    },
    associationName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    associationDescription: {
        fontSize: 14,
        color: '#666',
    },
    heartIconContainer: {
        position: 'relative',
    },
    navigationContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 8,
    },
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f2f2f2',
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    navItem: {
        padding: 8,
    },
});
