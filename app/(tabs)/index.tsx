import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Header from '../../components/header';
import SearchBar from '../../components/SearchBar';
import Section from '../../components/Section';
import FavoriteItem from '../../components/FavoriteItem';
import AssociationItem from '../../components/AssociationItem';

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
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    favoritesList: {
        paddingRight: 16,
    }
});
