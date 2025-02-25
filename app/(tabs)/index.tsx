import React, {useState} from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import UserProfileScreen from './userPage';

export default function Layout() {
    const [currentScreen, setCurrentScreen] = useState('home');

    // Render the appropriate screen based on currentScreen state
    if (currentScreen === 'user') {
        return <UserProfileScreen onNavigate={setCurrentScreen} />;
    }


    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header with logo and settings */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Logo</Text>
                </View>
                <TouchableOpacity style={styles.settingsButton}>
                    <Feather name="settings" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Feather name="search" size={18} color="gray" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher"
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            {/* Scroll content */}
            <ScrollView
                style={styles.contentContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Favorite associations */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <Feather name="star" size={20} color="#FFD700" />
                            <Text style={styles.sectionTitle}>Mes associations favorites</Text>
                        </View>
                        <Text style={styles.seeAllText}>Voir tout</Text>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.favoritesList}
                    >
                        {[1, 2, 3].map((num) => (
                            <View key={num} style={styles.favoriteItem}>
                                <View style={styles.favoriteImage}></View>
                                <Text style={styles.favoriteText}>Asso {num}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* Popular associations */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <Feather name="trending-up" size={20} color="black" />
                            <Text style={styles.sectionTitle}>Associations populaire</Text>
                        </View>
                        <Text style={styles.seeAllText}>Voir tout</Text>
                    </View>

                    <View style={styles.verticalList}>
                        {[1, 2].map((num) => (
                            <View key={num} style={styles.associationItem}>
                                <View style={styles.associationImage}></View>
                                <View style={styles.associationInfo}>
                                    <Text style={styles.associationName}>Asso {num}</Text>
                                    <Text style={styles.associationDescription}>Description asso {num}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Mental health associations */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.heartIconContainer}>
                                <Feather name="heart" size={20} color="black" />
                            </View>
                            <Text style={styles.sectionTitle}>Associations santé mentale</Text>
                        </View>
                        <Text style={styles.seeAllText}>Voir tout</Text>
                    </View>

                    <View style={styles.verticalList}>
                        {[1, 2].map((num) => (
                            <View key={num} style={styles.associationItem}>
                                <View style={styles.associationImage}></View>
                                <View style={styles.associationInfo}>
                                    <Text style={styles.associationName}>Asso {num}</Text>
                                    <Text style={styles.associationDescription}>Description asso {num}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Navigation bar */}
            <View style={styles.navigationContainer}>
                <View style={styles.navigationBar}>
                    <TouchableOpacity style={styles.navItem}>
                        <Feather name="map" size={22} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem}>
                        <Feather name="credit-card" size={22} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => setCurrentScreen('home')}>
                        <Feather name="home" size={22} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.navItem}>
                        <Feather name="maximize" size={22} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={() => setCurrentScreen('user')}>
                        <Feather name="user" size={22} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
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
        marginTop: Platform.OS === 'ios' ? 44 : 0, // Pour iOS, ajoutez de l'espace pour la statusbar
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