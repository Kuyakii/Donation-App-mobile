import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import {BASE_URL, images} from "@/config";
import { useLocalSearchParams, router } from "expo-router";
import { getAssociation, getUtilisateurConnecte } from "@/helpers";
import { CardField, StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { IUtilisateur } from "@/backend/interfaces/IUtilisateur";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import Header from "@/components/header";
import BoutonAccueil from "@/components/BoutonAccueil";

const DonPage = () => {
    const { confirmPayment } = useStripe();
    const [montant, setMontant] = useState<string>('20');
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
    const user: IUtilisateur | null = getUtilisateurConnecte();

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

    useEffect(() => {
        if (showCardForm && scrollViewRef.current) {
            setTimeout(() => {
                // @ts-ignore
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#9C27B0" />
                <Text>Chargement...</Text>
            </View>
        );
    }

    const resetFormState = () => {
        setMontant('20');
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
            return;
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

                    Alert.alert('Succès', 'Don réussi !', [
                        {
                            text: 'OK',
                            onPress: () => {
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
        <SafeAreaView style={styles.safeArea}>

            <Header/>
            <BoutonAccueil></BoutonAccueil>
            <ScrollView ref={scrollViewRef} style={styles.scrollView}>
                <Text style={styles.title}>Faire un don</Text>

                {/* Association Card */}
                <View style={styles.assoCard}>
                    <Image
                        style={styles.associationImage}
                        // @ts-ignore
                        source={images[association.nomImage]} // Charge l'image dynamique
                    />
                    <Text style={styles.assoName}>{association.nom}</Text>
                </View>

                {/* Donation Type */}
                <Text style={styles.sectionTitle}>Type de don :</Text>
                <View style={styles.typeDonContainer}>
                    <TouchableOpacity
                        style={[styles.typeDonButton, !isRecurrent && styles.typeDonSelected]}
                        onPress={() => setIsRecurrent(false)}
                    >
                        <Text style={styles.typeDonText}>Don unique</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeDonButton, isRecurrent && styles.typeDonSelected]}
                        onPress={() => setIsRecurrent(true)}
                    >
                        <Text style={styles.typeDonText}>Don récurrent</Text>
                    </TouchableOpacity>
                </View>

                {/* Amount Selection */}
                <Text style={styles.sectionTitle}>Montant du don :</Text>
                <View style={styles.amountContainer}>
                    <TouchableOpacity
                        style={[styles.amountButton, montant === '5' && styles.amountButtonSelected]}
                        onPress={() => { setMontant('5'); setMontantCustom(false); }}
                    >
                        <Text style={styles.amountText}>5€</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.amountButton, montant === '10' && styles.amountButtonSelected]}
                        onPress={() => { setMontant('10'); setMontantCustom(false); }}
                    >
                        <Text style={styles.amountText}>10€</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.amountButton, montant === '20' && styles.amountButtonSelected]}
                        onPress={() => { setMontant('20'); setMontantCustom(false); }}
                    >
                        <Text style={styles.amountText}>20€</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.amountButton}
                        onPress={() => setMontantCustom(true)}
                    >
                        <Text style={styles.amountText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                {montantCustom && (
                    <TextInput
                        style={styles.customAmountInput}
                        keyboardType="numeric"
                        value={montant}
                        onChangeText={setMontant}
                        placeholder="Montant personnalisé"
                    />
                )}

                {isRecurrent && (
                    <>
                        <Text style={styles.sectionTitle}>Date de début :</Text>
                        <TouchableOpacity
                            style={styles.datePickerButton}
                            onPress={() => setStartDatePickerVisible(true)}
                        >
                            <Text style={styles.datePickerText}>
                                {startDate || "Sélectionnez une date"}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>Date de fin :</Text>
                        <TouchableOpacity
                            style={styles.datePickerButton}
                            onPress={() => setEndDatePickerVisible(true)}
                        >
                            <Text style={styles.datePickerText}>
                                {endDate || "Sélectionnez une date"}
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>Fréquence :</Text>
                        <View style={styles.frequencyContainer}>
                            {["semaine", "mois", "trimestre"].map((freq) => (
                                <TouchableOpacity
                                    key={freq}
                                    style={[
                                        styles.frequencyButton,
                                        frequency === freq && styles.frequencyButtonSelected
                                    ]}
                                    onPress={() => setFrequency(freq)}
                                >
                                    <Text style={styles.frequencyText}>{freq}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {/* Payment Details */}

                {!showCardForm ? (
                    <TouchableOpacity style={styles.donateButton} onPress={validateAndProceed}>
                        <Text style={styles.donateButtonText}>Donner {montant}€</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.cardFormContainer}>
                        <CardField
                            postalCodeEnabled={true}
                            style={styles.stripeCardField}
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
                                    {processingPayment ? "Traitement..." : "Confirmer"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {processingPayment && (
                            <ActivityIndicator size="large" color="#9C27B0" style={{marginTop: 20}} />
                        )}
                    </View>
                )}

                <View style={{height: 60}} />
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 5,
    },
    headerTime: {
        fontWeight: 'bold',
    },
    headerStatusBar: {
        flexDirection: 'row',
        width: 80,
        justifyContent: 'space-between',
    },
    appHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#E6C8F2',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    logoText: {
        color: '#9C27B0',
        fontSize: 20,
        fontWeight: 'bold',
    },
    settingsButton: {
        padding: 5,
    },
    settingsIcon: {
        fontSize: 24,
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    assoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3D9FF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    assoImage: {
        width: 80,
        height: 80,
        backgroundColor: '#DDD',
        marginRight: 15,
    },
    assoName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 15,
    },
    dropdownSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#DDD',
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
    },
    dropdownText: {
        color: '#333',
    },
    dropdownIcon: {
        fontSize: 18,
    },
    typeDonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    typeDonButton: {
        flex: 1,
        padding: 15,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#9C27B0',
        marginHorizontal: 5,
        alignItems: 'center',
    },
    typeDonSelected: {
        backgroundColor: '#E6C8F2',
    },
    typeDonText: {
        color: '#333',
        fontWeight: '500',
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    amountButton: {
        width: '22%',
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    amountButtonSelected: {
        backgroundColor: '#E6C8F2',
    },
    amountText: {
        fontWeight: '500',
    },
    customAmountInput: {
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
    },
    frequencyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    frequencyButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        marginHorizontal: 2,
    },
    frequencyButtonSelected: {
        backgroundColor: '#E6C8F2',
    },
    frequencyText: {
        fontWeight: '500',
    },
    datePickerButton: {
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
    },
    datePickerText: {
        color: '#333',
    },
    cardInput: {
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
    },
    cardSecondaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    cardSecondaryInput: {
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 5,
        width: '48%',
    },
    donateButton: {
        backgroundColor: '#9C27B0',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
    },
    donateButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    stripeCardField: {
        height: 50,
        marginVertical: 20,
    },
    cardFormContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
    },
    cardFormButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    confirmButton: {
        backgroundColor: '#9C27B0',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#DDD',
    },
    cancelButtonText: {
        color: '#333',
    },
    disabledButton: {
        backgroundColor: '#D8A0E6',
    },
    bottomNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#DDD',
        paddingVertical: 10,
        backgroundColor: '#FFF',
    },
    navItem: {
        alignItems: 'center',
        padding: 10,
    },
    navIcon: {
        fontSize: 24,
        width: 24,
        height: 24,
        textAlign: 'center',
    },
    associationImage: {
    width: 120,
        height: 90,
        marginRight: 12,
        resizeMode: 'contain', // Ajuste l'image
},
});

export default () => (
    <StripeProvider publishableKey="pk_test_51R0Q18IsFroIM4A9TamwLy8vz7Y3tmdjRcjx9g5MI6rl0chsWpn8XIZ28BPVSTr2hYNuhW8STuIzkhiK8co6sWan00DtGCvH6n">
        <DonPage />
    </StripeProvider>
);
