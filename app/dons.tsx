import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import {BASE_URL} from "@/config";
import {useLocalSearchParams} from "expo-router";
import {getAssociation} from "@/helpers";
import AssociationItem from "@/components/AssociationItem";
import {CardField, StripeProvider, useStripe} from "@stripe/stripe-react-native";


// Composant principal
const DonPage = () => {
    const { confirmPayment } = useStripe();
    const [montant, setMontant] = useState<string>('10');
    const [cardDetails, setCardDetails] = useState<any>(null);
    const params = useLocalSearchParams();
    const { id } = params;
    const [association, setAssociation] = useState(null);
    const [loading, setLoading] = useState<boolean>(true);
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
    console.log(association);
    const handlePayment = async () => {
        if (!cardDetails) {
            Alert.alert('Erreur', 'Veuillez remplir les détails de la carte');
            return;
        }

        try {
            // Appeler le backend pour créer un PaymentIntent
            const paymentIntentResponse = await fetch(`${BASE_URL}/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: parseFloat(montant) * 100, // Stripe attend le montant en centimes
                    currency: 'eur',
                }),
            });

            const { clientSecret } = await paymentIntentResponse.json();

            // Confirmer le paiement avec Stripe
            const { error, paymentIntent } = await confirmPayment(clientSecret, {
                paymentMethodData: cardDetails , paymentMethodType: 'Card',
            });

            if (error) {
                Alert.alert('Erreur de paiement', error.message);
            } else {
                Alert.alert('Succès', 'Paiement réussi!');
                console.log(paymentIntent);
            }
        } catch (error) {
            console.error('Erreur lors du traitement du paiement', error);
            Alert.alert('Erreur', 'Un problème est survenu. Veuillez réessayer.');
        }
    };

    return (

        <View style={styles.container}>
            <Text style={styles.title}>Faire un don à {association.nom}</Text>
            <AssociationItem name={association.nom} description={association.descriptionCourte} imageName={association.nomImage}></AssociationItem>
            <Text style={styles.label}>Montant du don (en EUR)</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={montant}
                onChangeText={setMontant}
                placeholder="10"
            />

            {/* Ici tu peux intégrer un composant de formulaire de carte Stripe */}
            <CardField
                postalCodeEnabled={true}
                placeholders={{
                    number: '4242 4242 4242 4242',
                }}
                onCardChange={(cardDetails: any) => setCardDetails(cardDetails)}
                style={styles.cardField}
            />

            <Button title="Faire un don" onPress={handlePayment} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f4f4f4', // Fond clair
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
});

// Composant avec StripeProvider
const App = () => {
    return (
        <StripeProvider publishableKey="pk_test_51R0Q18IsFroIM4A9TamwLy8vz7Y3tmdjRcjx9g5MI6rl0chsWpn8XIZ28BPVSTr2hYNuhW8STuIzkhiK8co6sWan00DtGCvH6n">
            <DonPage />
        </StripeProvider>
    );
};

export default App;
