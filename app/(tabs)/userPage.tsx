import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/header';
import SearchBar from '../../components/SearchBar';
import Section from '../../components/Section';
import FavoriteItem from '../../components/FavoriteItem';
import AssociationItem from '../../components/AssociationItem';
import DonationCard from '../../components/ProfileComponents/DonationCard';
import TopAssociations from '../../components/ProfileComponents/TopAssociations';

// @ts-ignore
const ActionButton = ({ iconName, label, color = "black" }) => (
    <TouchableOpacity style={styles.actionButton}>
        <View style={styles.iconContainer}>
            <Feather name={iconName} size={24} color={color} />
        </View>
        <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
);

export default function UserProfileScreen() {
    return (
        // Remplacé SafeAreaView par View pour enlever la grosse marge qui sort de jsp où
        <View style={styles.container}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />

            {/* Conteneur de Header sans marges */}
            <View style={styles.headerWrapper}>
                <Header />
            </View>

            <SearchBar />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.welcomeTitle}>Bonjour, unNom</Text>

                <View style={styles.actionsContainer}>
                    <ActionButton iconName="user" label="Profil" />
                    <ActionButton iconName="gift" label="Dons" />
                    <ActionButton iconName="star" label="Favoris" color="#FFD700" />
                </View>

                {/* Section de progression des dons */}
                <DonationCard />

                {/* Section des Top Associations */}
                <TopAssociations />

                {/* Section des Associations favorites */}
                <Section title="Mes associations favorites" icon="star">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.favoritesList}
                    >
                        {[1, 2, 3].map(num => (
                            <FavoriteItem key={`fav-${num}`} name={`Asso ${num}`} />
                        ))}
                    </ScrollView>
                </Section>

                {/* Section des Associations populaires */}
                <Section title="Associations populaire" icon="trending-up">
                    {[1, 2].map(num => (
                        <AssociationItem
                            key={`pop-${num}`}
                            name={`Asso ${num}`}
                            description={`Description asso ${num}`}
                        />
                    ))}
                </Section>

                {/* Section des Associations santé mentale */}
                <Section title="Associations santé mentale" icon="heart">
                    {[1, 2].map(num => (
                        <AssociationItem
                            key={`sm-${num}`}
                            name={`Asso ${num}`}
                            description={`Description asso ${num}`}
                        />
                    ))}
                </Section>

                {/* Espace en bas pour éviter que le contenu soit coupé */}
                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        // Supprimé paddingTop pour éviter la marge supplémentaire car jsp elle sort d'où
    },
    headerWrapper: {
        // Style spécifique pour contrôler  la position du header
        marginTop: 0,
        paddingTop: 0,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 16,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    actionButton: {
        alignItems: 'center',
        width: '30%',
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        backgroundColor: '#fafafa',
    },
    actionText: {
        fontSize: 14,
        marginTop: 2,
    },
    favoritesList: {
        paddingRight: 16,
    },
    bottomPadding: {
        height: 20,
    }
});