import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../../components/header';
import SearchBar from '../../components/SearchBar';
import Section from '../../components/Section';
import AssociationItem from '../../components/AssociationItem';
import DonationCard from '../../components/ProfileComponents/DonationCard';
import TopAssociations from '../../components/ProfileComponents/TopAssociations';
import BoutonDeconnexion from "@/components/BoutonDeconnexion";
import {checkLogin, getUtilisateurConnecte} from "@/helpers";
import AssociationFavoriteList from "@/components/AssociationFavoriteList";
import {FavoriteProvider} from "@/context/FavoriteContext";

export default function UserProfileScreen() {

    checkLogin();
    const user = getUtilisateurConnecte();
    let Pseudo;
    let email
    if(user){
        Pseudo = user.pseudonyme;
        email = user.email;
        console.log("Pseudo " + Pseudo + " Email " + email);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <SearchBar />
            <BoutonDeconnexion></BoutonDeconnexion>

            <ScrollView style={styles.scrollView}>
                <Text style={styles.welcomeTitle}>Bonjour, {Pseudo}</Text>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconContainer}>
                            <Feather name="user" size={icon_size} color="black" />
                            <Text style={styles.actionText}>Profil</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconContainer}>
                            <Feather name="gift" size={icon_size} color="black" />
                            <Text style={styles.actionText}>Dons</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={styles.iconContainer}>
                            <Feather name="star" size={icon_size} color="#FFD700" />
                            <Text style={styles.actionText}>Favoris</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Section de progression des dons */}
                <DonationCard />

                {/* Section des Top Associations */}
                <TopAssociations />

                {/* Section des Associations favorites */}
                <FavoriteProvider>
                    <AssociationFavoriteList />
                </FavoriteProvider>

                {/* Section des Associations populaires */}
                <Section title="Associations populaire" icon="trending-up" onSeeAllPress={undefined}>
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`}
                                                        description={`Description asso ${num}`} imageName={undefined} />)}
                </Section>

                {/* Section des Associations santé mentale */}
                <Section title="Associations santé mentale" icon="heart" onSeeAllPress={undefined}>
                    {[1, 2].map(num => <AssociationItem key={num} name={`Asso ${num}`}
                                                        description={`Description asso ${num}`} imageName={undefined} />)}
                </Section>
            </ScrollView>
        </SafeAreaView>
    );
}

const icon_size = 30;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
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
    },
    actionText: {
        fontSize: 14,
    },

});
