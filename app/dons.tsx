import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView} from 'react-native';
import {BASE_URL} from "@/config";
import {useLocalSearchParams} from "expo-router";
import {getAssociation, getUtilisateurConectee} from "@/helpers";
import AssociationItem from "@/components/AssociationItem";
import {CardField, StripeProvider, useStripe} from "@stripe/stripe-react-native";
import {IUtilisateur} from "@/backend/interfaces/IUtilisateur";
import {useNavigation} from "@react-navigation/native";
import Header from "@/components/header";
import BoutonAccueil from '@/components/BoutonAccueil';
import {Picker} from '@react-native-picker/picker';

const DonPage = () => {
    const { confirmPayment } = useStripe();
    const [montant, setMontant] = useState<string>('10');
    const [cardDetails, setCardDetails] = useState<any>(null);
    const [isRecurrent, setIsRecurrent] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [frequency, setFrequency] = useState<string>('mois'); // Par défaut : mois

    const params = useLocalSearchParams();
    const { id } = params;
    const [association, setAssociation] = useState(null);
    const [loading, setLoading] = useState<boolean>(true);
    const user : IUtilisateur | null = getUtilisateurConectee();
    const navigation = useNavigation();

    let idUser: number = user ? user.idUtilisateur : 0;

    useEffect(() => {
        const fetchAssociation = async () => {
            const assoc = await getAssociation(id);
            setAssociation(assoc);
            setLoading(false);
        };
        fetchAssociation();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Chargement...</Text>
            </View>
        );
    }

    const handlePayment = async () => {
        if (!cardDetails) {
            Alert.alert('Erreur', 'Veuillez remplir les détails de la carte');
            return;
        }

        try {
            const paymentIntentResponse = await fetch(`${BASE_URL}/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseFloat(montant) * 100,
                    currency: 'eur',
                }),
            });

            const { clientSecret } = await paymentIntentResponse.json();

            const { error, paymentIntent } = await confirmPayment(clientSecret, {
                paymentMethodData: cardDetails , paymentMethodType: 'Card',
            });

            if (error) {
                Alert.alert('Erreur de paiement', error.message);
            } else {
                try {
                    const response = await fetch(`${BASE_URL}/dons`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id,
                            idUser,
                            montant,
                            typeDon: isRecurrent ? "recurrent" : "unique",
                            ...(isRecurrent && {
                                startDate,
                                endDate,
                                frequency,
                            })
                        }),
                    });

                    const data = await response.json();
                    if (!response.ok) throw new Error(data.message || "Erreur lors du don.");

                    Alert.alert('Succès', 'Don réussi !');
                    try {
                        // @ts-ignore
                        navigation.navigate('(tabs)', { screen: 'index' });
                    } catch (error) {
                        console.error("Erreur de navigation:", error);
                        // @ts-ignore
                        Alert.alert('Erreur', error.message || "Problème lors de la navigation");
                    }

                } catch (error) {
                    // @ts-ignore
                    Alert.alert('Erreur', error.message);
                }
            }
        } catch (error) {
            console.error('Erreur lors du traitement du paiement', error);
            Alert.alert('Erreur', 'Un problème est survenu. Veuillez réessayer.');
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <BoutonAccueil />
            <ScrollView>
                <Text style={styles.title}>Faire un don à {association.nom}</Text>
                <AssociationItem name={association.nom} description={association.descriptionCourte} imageName={association.nomImage} />
                <Text style={styles.label}>Montant du don (en EUR)</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={montant}
                    onChangeText={setMontant}
                    placeholder="10"
                />

                {/* Checkbox pour choisir entre don unique et récurrent */}
                <View style={styles.checkboxContainer}>
                    <Text style={styles.label}>Don récurrent :</Text>
                    <Button title={isRecurrent ? "Oui" : "Non"} onPress={() => setIsRecurrent(!isRecurrent)} />
                </View>

                {/* Afficher les champs supplémentaires si le don est récurrent */}
                {isRecurrent && (
                    <>
                        <Text style={styles.label}>Date de début :</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={startDate}
                            onChangeText={setStartDate}
                        />

                        <Text style={styles.label}>Date de fin :</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={endDate}
                            onChangeText={setEndDate}
                        />

                        <Text style={styles.label}>Fréquence :</Text>
                        <Picker
                            selectedValue={frequency}
                            onValueChange={(itemValue) => setFrequency(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Toutes les semaines" value="semaine" />
                            <Picker.Item label="Tous les mois" value="mois" />
                            <Picker.Item label="Tous les trimestres" value="trimestre" />
                        </Picker>
                    </>
                )}

                <CardField
                    postalCodeEnabled={true}
                    style={styles.cardField}
                    onCardChange={(cardDetails) => {
                        console.log("Nouvelle carte détectée", cardDetails);
                        setCardDetails(cardDetails);
                    }}
                />
            </ScrollView>
            <Button title="Faire un don" onPress={handlePayment} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        marginTop: 20,
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    cardField: {
        width: '100%',
        height: 50,
        marginBottom: 20,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    picker: {
        height: 50,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 5,
    }
});

export default () => (
    <StripeProvider publishableKey="pk_test_51R0Q18IsFroIM4A9TamwLy8vz7Y3tmdjRcjx9g5MI6rl0chsWpn8XIZ28BPVSTr2hYNuhW8STuIzkhiK8co6sWan00DtGCvH6n">
        <DonPage />
    </StripeProvider>
);
