import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import Header from '../../components/header';
import SearchBar from '../../components/SearchBar';
import Section from '../../components/Section';
import FavoriteItem from '../../components/FavoriteItem';
import AssociationItem from '../../components/AssociationItem';
import {IAssociation} from "@/backend/interfaces/IAssociation";
import {BASE_URL} from "@/config";
import {getAllAssociation} from "@/helpers";
import AssociationListModal from "@/components/AssociationListModal";


export default function Layout() {
    const associations = getAllAssociation();
    const slicedAssociations = associations.slice(0, 3);
    const [modalVisible, setModalVisible] = useState(false);


    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Header />
            <SearchBar />
            <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Section title="Mes associations favorites" icon="star" onSeeAllPress={undefined}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.favoritesList}>
                        {[1, 2, 3].map(num => <FavoriteItem key={num} name={`Asso ${num}`} />)}
                    </ScrollView>
                </Section>
                <Section title="Associations populaire" icon="trending-up" onSeeAllPress={undefined}>
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`}
                                                        description={`Description asso ${num}`} imageName={undefined} />)}
                </Section>
                <Section title="Associations santé mentale" icon="heart" onSeeAllPress={undefined}>
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`}
                                                        description={`Description asso ${num}`} imageName={undefined} />)}
                </Section>
                <Section title="Toutes les associations" icon="list" onSeeAllPress={() => setModalVisible(true)}>
                    {slicedAssociations.map((asso: IAssociation) => (
                        <AssociationItem key={asso.idAssociation} name={asso.nom} description={asso.descriptionCourte} imageName={asso.nomImage} />
                    ))}
                </Section>
            </ScrollView>
            <AssociationListModal visible={modalVisible} onClose={() => setModalVisible(false)} associations={associations} />
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
