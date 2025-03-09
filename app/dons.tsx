import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { BASE_URL } from "@/config";
import { useLocalSearchParams, router } from "expo-router";
import { getAssociation, getUtilisateurConectee } from "@/helpers";
import AssociationItem from "@/components/AssociationItem";
import { CardField, StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { IUtilisateur } from "@/backend/interfaces/IUtilisateur";
import Header from "@/components/header";
import BoutonAccueil from '@/components/BoutonAccueil';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useNavigation} from "@react-navigation/native";

const DonPage = () => {
    const { confirmPayment } = useStripe();
    const [montant, setMontant] = useState<string>('10');
    const [montantCustom, setMontantCustom] = useState<boolean>(false);
    const [cardDetails, setCardDetails] = useState<any>(null);
    const [isRecurrent, setIsRecurrent] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [frequency, setFrequency] = useState<string>('mois');
    const [showCardForm, setShowCardForm] = useState<boolean>(false);
    const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
    const [processingPayment, setProcessingPayment] = useState<boolean>(false);
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);

    const params = useLocalSearchParams();
    const { id } = params;
    const [association, setAssociation] = useState(null);
    const [loading, setLoading] = useState<boolean>(true);
    const user: IUtilisateur | null = getUtilisateurConectee();

    let idUser: number = user ? user.idUtilisateur : 0;

    useEffect(() => {
        const fetchAssociation = async () => {
            try {
                const assoc = await getAssociation(id);
                setAssociation(assoc);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'association:", error);
                Alert.alert("Erreur", "Impossible de charger les données de l'association");
                setLoading(false);
            }
        };
        fetchAssociation();
    }, [id]);

    // Lorsque le formulaire de carte apparaît, faire défiler jusqu'en bas
    useEffect(() => {
        if (showCardForm && scrollViewRef.current) {
            // Petit délai pour s'assurer que le composant est rendu
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 200);
        }
    }, [showCardForm]);

    const validateDate = (selectedDate: Date, isStartDate: boolean) => {
        const today = new Date();
        if (isStartDate) {
            if (selectedDate < today) {
                Alert.alert("Erreur", "La date de début doit être égale ou postérieure à aujourd'hui.");
                return false;
            }
        } else {
            if (selectedDate <= new Date(startDate)) {
                Alert.alert("Erreur", "La date de fin doit être postérieure à la date de début.");
                return false;
            }
        }
        return true;
    };

    const handleStartDateChange = (date: Date) => {
        if (validateDate(date, true)) {
            setStartDate(date.toISOString().split('T')[0]);
            setStartDatePickerVisible(false);
        }
    };

    const handleEndDateChange = (date: Date) => {
        if (validateDate(date, false)) {
            setEndDate(date.toISOString().split('T')[0]);
            setEndDatePickerVisible(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Chargement...</Text>
            </View>
        );
    }

    const resetFormState = () => {
        setMontant('10');
        setMontantCustom(false);
        setCardDetails(null);
        setIsRecurrent(false);
        setStartDate('');
        setEndDate('');
        setFrequency('mois');
        setShowCardForm(false);
        setProcessingPayment(false);
    };

    const handlePayment = async () => {
        if (processingPayment) {
            return; // Éviter les soumissions multiples
        }

        try {
            setProcessingPayment(true);

            if (!cardDetails) {
                Alert.alert('Erreur', 'Veuillez remplir les détails de la carte');
                setProcessingPayment(false);
                return;
            }

            if (isRecurrent && (!user || idUser === 0)) {
                Alert.alert('Erreur', 'Vous devez être connecté afin de réaliser un don récurrent !');
                setShowCardForm(false);
                setProcessingPayment(false);
                router.push('/login');
                return;
            }

            // Création de l'intent de paiement
            console.log("Début de la création de l'intent de paiement");

            try {
                const paymentIntentResponse = await fetch(`${BASE_URL}/create-payment-intent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: parseFloat(montant) * 100, currency: 'eur' }),
                });

                if (!paymentIntentResponse.ok) {
                    const errorText = await paymentIntentResponse.text();
                    console.error("Erreur de réponse du serveur (create-payment-intent):", errorText);
                    throw new Error(`Erreur lors de la création de l'intent: ${errorText}`);
                }

                const responseData = await paymentIntentResponse.json();
                const { clientSecret } = responseData;
                console.log("Intent créé avec succès");

                // Confirmation du paiement avec Stripe
                console.log("Début de la confirmation du paiement");
                const { error, paymentIntent } = await confirmPayment(clientSecret, {
                    paymentMethodData: cardDetails,
                    paymentMethodType: 'Card',
                });

                if (error) {
                    console.error("Erreur de confirmation de paiement:", error);
                    Alert.alert('Erreur de paiement', error.message);
                    setProcessingPayment(false);
                    return;
                }

                console.log("Paiement confirmé avec succès");

                // Enregistrement du don
                console.log("Début de l'enregistrement du don");
                try {
                    const donResponse = await fetch(`${BASE_URL}/dons`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id,
                            idUser,
                            montant,
                            typeDon: isRecurrent ? "recurrent" : "unique",
                            ...(isRecurrent && { startDate, endDate, frequency })
                        }),
                    });

                    const responseText = await donResponse.text();
                    console.log("Réponse brute du serveur (dons):", responseText);

                    let data;
                    try {
                        data = JSON.parse(responseText);
                    } catch (parseError) {
                        console.error("Erreur de parsing JSON:", parseError);
                        throw new Error("La réponse du serveur n'est pas un JSON valide");
                    }

                    if (!donResponse.ok) {
                        throw new Error(data.message || "Erreur lors de l'enregistrement du don.");
                    }

                    console.log("Don enregistré avec succès");

                    // Succès complet de l'opération
                    Alert.alert('Succès', 'Don réussi !', [
                        {
                            text: 'OK',
                            onPress: () => {
                                //resetFormState();
                                setTimeout(() => {
                                    try {
                                        // @ts-ignore
                                        navigation.navigate('(tabs)',{
                                            screen:'index'
                                        });
                                    } catch (navError) {
                                        console.error("Erreur de navigation:", navError);
                                    }
                                }, 500);
                            }
                        }
                    ]);
                } catch (donError) {
                    console.error("Erreur lors de l'enregistrement du don:", donError);
                    Alert.alert('Attention', "Le paiement a été effectué mais nous avons rencontré un problème lors de l'enregistrement du don. Veuillez contacter le support.");
                    resetFormState();
                }
            } catch (stripeError) {
                console.error("Erreur Stripe ou d'API:", stripeError);
                // @ts-ignore
                Alert.alert('Erreur', stripeError.message || "Une erreur est survenue lors du traitement du paiement.");
            }
        } catch (globalError) {
            console.error("Erreur globale non gérée:", globalError);
            Alert.alert('Erreur', 'Un problème inattendu est survenu. Veuillez réessayer.');
        } finally {
            setProcessingPayment(false);
        }
    };

    const validateAndProceed = () => {
        if (isRecurrent && (!startDate || !endDate || !frequency)) {
            Alert.alert("Erreur", "Veuillez remplir tous les champs pour le don récurrent.");
        } else if (isRecurrent && idUser === 0) {
            Alert.alert("Erreur", "Vous devez être connecté afin de faire un don récurrent !");
            router.push('/login');
        } else {
            setShowCardForm(true);
        }
    };

    return (
        <View style={styles.container}>
            <Header />
            <BoutonAccueil />
            <ScrollView ref={scrollViewRef}>
                <Text style={styles.title}>Faire un don à {association.nom}</Text>
                <AssociationItem name={association.nom} description={association.descriptionCourte} imageName={association.nomImage} />

                <Text style={styles.label}>Montant du don (en EUR)</Text>
                <View style={styles.buttonContainer}>
                    {[6, 10, 20, 50].map((value) => (
                        <TouchableOpacity key={value} style={styles.amountButton} onPress={() => { setMontant(value.toString()); setMontantCustom(false); }}>
                            <Text style={styles.buttonText}>{value} €</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.amountButton} onPress={() => setMontantCustom(true)}>
                        <Text style={styles.buttonText}>Autre</Text>
                    </TouchableOpacity>
                </View>

                {montantCustom && (
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={montant}
                        onChangeText={setMontant}
                        placeholder="Montant personnalisé"
                    />
                )}

                <View style={styles.checkboxContainer}>
                    <Text style={styles.label}>Don récurrent :</Text>
                    <Button title={isRecurrent ? "Oui" : "Non"} onPress={() => setIsRecurrent(!isRecurrent)} />
                </View>

                {isRecurrent && (
                    <>
                        <Text style={styles.label}>Date de début :</Text>
                        <TouchableOpacity
                            style={styles.datePickerButton}
                            onPress={() => setStartDatePickerVisible(true)}
                        >
                            <Text style={styles.datePickerText}>
                                {startDate || "Sélectionnez une date"}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Date de fin :</Text>
                        <TouchableOpacity
                            style={styles.datePickerButton}
                            onPress={() => setEndDatePickerVisible(true)}
                        >
                            <Text style={styles.datePickerText}>
                                {endDate || "Sélectionnez une date"}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Fréquence :</Text>
                        <View style={styles.buttonContainer}>
                            {["semaine", "mois", "trimestre"].map((freq) => (
                                <TouchableOpacity key={freq} style={styles.amountButton} onPress={() => setFrequency(freq)}>
                                    <Text style={styles.buttonText}>{freq}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {!showCardForm ? (
                    <Button title="Faire un don" onPress={validateAndProceed} />
                ) : (
                    <View style={styles.cardFormContainer}>
                        <Text style={styles.cardFormTitle}>Informations de paiement</Text>
                        <Text style={styles.cardFormSubtitle}>Vous allez faire un don de {montant} € {isRecurrent ? "récurrent" : "unique"}</Text>

                        <CardField
                            postalCodeEnabled={true}
                            style={styles.cardField}
                            onCardChange={setCardDetails}
                        />

                        <View style={styles.cardFormButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowCardForm(false)}
                                disabled={processingPayment}
                            >
                                <Text style={styles.cancelButtonText}>Annuler</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.confirmButton, processingPayment && styles.disabledButton]}
                                onPress={handlePayment}
                                disabled={processingPayment}
                            >
                                <Text style={styles.confirmButtonText}>
                                    {processingPayment ? "Traitement..." : "Confirmer le paiement"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {processingPayment && (
                            <ActivityIndicator size="large" color="#0000ff" style={{marginTop: 20}} />
                        )}
                    </View>
                )}

                {/* Espace en bas pour s'assurer que le formulaire est visible après le défilement */}
                {showCardForm && <View style={{height: 50}} />}
            </ScrollView>

            <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={handleStartDateChange}
                onCancel={() => setStartDatePickerVisible(false)}
            />
            <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="date"
                onConfirm={handleEndDateChange}
                onCancel={() => setEndDatePickerVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f4f4f4',
        color: '#000000',
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
        width: '100%',
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
        marginVertical: 20,
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
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    amountButton: {
        backgroundColor: '#2563EB',
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    datePickerButton: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        width: '100%'
    },
    datePickerText: {
        color: '#000',
        fontSize: 16
    },
    cardFormContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    cardFormTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    cardFormSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    cardFormButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    confirmButton: {
        backgroundColor: '#2563EB',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#f4f4f4',
        padding: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: '#93c5fd',
    },
});

export default () => (
    <StripeProvider publishableKey="pk_test_51R0Q18IsFroIM4A9TamwLy8vz7Y3tmdjRcjx9g5MI6rl0chsWpn8XIZ28BPVSTr2hYNuhW8STuIzkhiK8co6sWan00DtGCvH6n">
        <DonPage />
    </StripeProvider>
);
