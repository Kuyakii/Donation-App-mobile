import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Animated,
    PanResponder,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';
import { useRouter } from "expo-router";

import Header from "@/components/header";
import Colors from "@/constants/Colors";
import { getAllAssociation } from "@/helpers";
import { IAssociation } from "@/backend/interfaces/IAssociation";
import { images } from "@/config";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

// Types d'associations et leurs scores initiaux
const associationTypes = {
    "Familles et aides aux personnes en difficulté": 0,
    "Handicap": 0,
    "Maladies chroniques et rares": 0,
    "Droits des patients et prévention santé": 0,
    "Autres thématiques": 0,
    "Addictions": 0,
    "Maladies infectieuses et immunitaires": 0,
    "Santé mentale": 0,
    "Cancer": 0
};

const typeOptions = [
    { label: "Santé mentale", value: "3" },
    { label: "Handicap", value: "2" },
    { label: "Addictions", value: "1" },
    { label: "Maladies chroniques et rares", value: "4" },
    { label: "Maladies infectieuses et immunitaires", value: "5" },
    { label: "Cancer", value: "6" },
    { label: "Droits des patients et prévention santé", value: "7" },
    { label: "Familles et aides aux personnes en difficulté", value: "8" },
    { label: "Autres thématiques", value: "9" }
];

export default function QuestionnaireScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const associations = getAllAssociation();
    const [completed, setCompleted] = useState(false);
    const [scores, setScores] = useState({...associationTypes});
    const [recommendedAssociations, setRecommendedAssociations] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const position = useRef(new Animated.ValueXY()).current;
    const rotation = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp'
    });

    // Questions à poser avec les points à attribuer
    const questions = [
        {
            text: "Préférez-vous aider directement des personnes en difficulté dans leur quotidien ?",
            points: {
                yes: {
                    "Familles et aides aux personnes en difficulté": 1,
                    "Handicap": 1,
                    "Maladies chroniques et rares": 1
                },
                no: {
                    "Droits des patients et prévention santé": 1,
                    "Autres thématiques": 1
                }
            }
        },
        {
            text: "Vous sentez-vous plus concerné(e) par la prévention et la sensibilisation que par l'aide directe ?",
            points: {
                yes: {
                    "Droits des patients et prévention santé": 1,
                    "Addictions": 1,
                    "Maladies infectieuses et immunitaires": 1
                },
                no: {
                    "Familles et aides aux personnes en difficulté": 1,
                    "Santé mentale": 1,
                    "Handicap": 1
                }
            }
        },
        {
            text: "Souhaitez-vous vous engager dans une cause liée à la santé mentale et au bien-être psychologique ?",
            points: {
                yes: {
                    "Santé mentale": 2,
                    "Addictions": 1,
                    "Familles et aides aux personnes en difficulté": 1
                },
                no: {
                    "Cancer": 1,
                    "Maladies infectieuses et immunitaires": 1
                }
            }
        },
        {
            text: "Pensez-vous que les maladies graves et chroniques méritent plus de soutien ?",
            points: {
                yes: {
                    "Cancer": 1,
                    "Maladies chroniques et rares": 1,
                    "Maladies infectieuses et immunitaires": 1
                },
                no: {
                    "Handicap": 1,
                    "Droits des patients et prévention santé": 1
                }
            }
        },
        {
            text: "Aimeriez-vous contribuer à la lutte contre certaines dépendances (alcool, tabac, drogues, écrans) ?",
            points: {
                yes: {
                    "Addictions": 2,
                    "Santé mentale": 1,
                    "Droits des patients et prévention santé": 1
                },
                no: {
                    "Handicap": 1,
                    "Maladies chroniques et rares": 1
                }
            }
        },
        {
            text: "Vous sentez-vous plus concerné(e) par des maladies qui touchent un grand nombre de personnes ?",
            points: {
                yes: {
                    "Cancer": 1,
                    "Maladies infectieuses et immunitaires": 1,
                    "Addictions": 1
                },
                no: {
                    "Maladies chroniques et rares": 1,
                    "Handicap": 1,
                    "Familles et aides aux personnes en difficulté": 1
                }
            }
        },
        {
            text: "L'entraide et le soutien aux familles touchées par des problèmes de santé vous semblent-ils prioritaires ?",
            points: {
                yes: {
                    "Familles et aides aux personnes en difficulté": 1,
                    "Handicap": 1,
                    "Maladies chroniques et rares": 1
                },
                no: {
                    "Autres thématiques": 1,
                    "Droits des patients et prévention santé": 1
                }
            }
        },
        {
            text: "Selon vous, la recherche et l'innovation en santé doivent-elles être une priorité ?",
            points: {
                yes: {
                    "Cancer": 1,
                    "Maladies chroniques et rares": 1,
                    "Maladies infectieuses et immunitaires": 1
                },
                no: {
                    "Familles et aides aux personnes en difficulté": 1,
                    "Santé mentale": 1
                }
            }
        },
        {
            text: "Pensez-vous que la société doit faire plus d'efforts pour inclure et soutenir les personnes en situation de handicap ?",
            points: {
                yes: {
                    "Handicap": 2,
                    "Familles et aides aux personnes en difficulté": 1,
                    "Maladies chroniques et rares": 1
                },
                no: {
                    "Autres thématiques": 1,
                    "Droits des patients et prévention santé": 1
                }
            }
        },
        {
            text: "Souhaitez-vous vous impliquer dans une cause qui ne concerne pas directement une maladie spécifique ?",
            points: {
                yes: {
                    "Autres thématiques": 2,
                    "Droits des patients et prévention santé": 1,
                    "Addictions": 1
                },
                no: {
                    "Cancer": 1,
                    "Maladies chroniques et rares": 1
                }
            }
        }
    ];

    // Mettre à jour les scores en fonction des réponses
    const updateScores = (answer: boolean) => {
        const question = questions[currentIndex];
        const pointsToAdd = answer ? question.points.yes : question.points.no;

        const updatedScores = { ...scores };

        // Ajouter les points aux catégories correspondantes
        Object.entries(pointsToAdd).forEach(([category, points]) => {
            // @ts-ignore
            updatedScores[category] = (updatedScores[category] || 0) + points;
        });

        setScores(updatedScores);
    };

    // Fonction pour recommencer le questionnaire
    const restartQuiz = () => {
        setCurrentIndex(0);
        setAnswers([]);
        setCompleted(false);
        setScores({...associationTypes});
        setRecommendedAssociations([]);
        position.setValue({ x: 0, y: 0 });
    };

    // Générer des recommandations basées sur les scores
    const generateRecommendations = () => {
        setLoadingRecommendations(true);

        // Trier les types d'associations par score
        const sortedTypes = Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2); // Prendre les 2 types avec les scores les plus élevés

        try {
            const recommendations: IAssociation[] = [];

            // Pour chaque type parmi les 2 meilleurs
            for (const [type, score] of sortedTypes) {
                if (score > 0) { // Ne considérer que les types ayant des points
                    // Récupérer la valeur du type
                    const typeOption = typeOptions.find(option => option.label === type);

                    // Convertir la valeur en nombre
                    const typeValue = typeOption ? Number(typeOption.value) : null;

                    // Filtre les associations par idType
                    const availableAssociations = associations.filter((asso: IAssociation) => {
                        return asso.idType === typeValue;
                    });

                    if (availableAssociations.length > 0) {
                        // Choisir une association aléatoire de ce type
                        const randomIndex = Math.floor(Math.random() * availableAssociations.length);
                        const selectedAssociation = availableAssociations[randomIndex];

                        recommendations.push(selectedAssociation);
                    }
                }
            }

            // @ts-ignore
            setRecommendedAssociations(recommendations);
            setLoadingRecommendations(false);
            return recommendations;

        } catch (error) {
            console.error("Erreur lors de la génération des recommandations:", error);
            setLoadingRecommendations(false);
        }
    };

    // Générer des recommandations quand le questionnaire est terminé
    useEffect(() => {
        if (completed) {
            generateRecommendations();
        }
    }, [completed]);

    // Panresponder et autres méthodes de swipe (restent inchangées)
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
            position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (event, gesture) => {
            if (gesture.dx > SWIPE_THRESHOLD) {
                forceSwipe('right');
            } else if (gesture.dx < -SWIPE_THRESHOLD) {
                forceSwipe('left');
            } else {
                resetPosition();
            }
        }
    });

    const forceSwipe = (direction: string) => {
        const x = direction === 'right' ? SCREEN_WIDTH + 100 : -SCREEN_WIDTH - 100;
        Animated.timing(position, {
            toValue: { x, y: 0 },
            duration: SWIPE_OUT_DURATION,
            useNativeDriver: false
        }).start(() => onSwipeComplete(direction));
    };

    const onSwipeComplete = (direction: string) => {
        const answer = direction === 'right';
        const currentQuestion = questions[currentIndex];

        // Mettre à jour les scores
        updateScores(answer);

        // Ajouter la réponse
        // @ts-ignore
        setAnswers([...answers, {question: currentQuestion.text, answer}]);

        // Réinitialiser la position APRÈS le setState
        setTimeout(() => {
            position.setValue({ x: 0, y: 0 });

            if (currentIndex >= questions.length - 1) {
                setCompleted(true);
            } else {
                setCurrentIndex(currentIndex + 1);
            }
        }, 10);
    };

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false
        }).start();
    };

    const handleNavigate = (idAssos: number) => {
        router.replace({
            pathname: "/detailsAssos",
            params: { id: idAssos },
        });
    };

    const navigateToDons = (idAssos: number) => {
        router.push({
            pathname: "/dons",
            params: { id: idAssos },
        });
    };

    // Calculer le contour pour l'aura
    const rightGlowOpacity = position.x.interpolate({
        inputRange: [0, SCREEN_WIDTH / 2],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    const leftGlowOpacity = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });

    if (completed) {
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Recommandations pour vous</Text>

                {loadingRecommendations ? (
                    <Text style={styles.loadingText}>Recherche des associations qui vous correspondent...</Text>
                ) : recommendedAssociations.length > 0 ? (
                    <ScrollView>
                        <Text style={styles.subtitle}>
                            Basé sur vos réponses, ces associations pourraient vous intéresser :
                        </Text>

                        {recommendedAssociations.map((asso, index) => (
                            <View key={index} style={styles.associationRecommendation}>
                                <TouchableOpacity
                                    style={styles.associationContent}
                                    onPress={() => handleNavigate(asso.idAssociation)}
                                >
                                    <Image
                                        style={styles.associationImage}
                                        //@ts-ignore
                                        source={images[asso.nomImage]}
                                    />
                                    <View style={styles.associationInfo}>
                                        <Text style={styles.associationName}>
                                            {asso.nom || "Nom non disponible"}
                                        </Text>
                                        <Text style={styles.associationDescription} numberOfLines={2}>
                                            {asso.descriptionCourte || "Description non disponible"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.donateButton}
                                    onPress={() => navigateToDons(asso.idAssociation)}
                                >
                                    <Text style={styles.donateButtonText}>Faire un don</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <Text style={styles.noResultsText}>
                        Nous n'avons pas pu trouver d'associations correspondant à vos critères.
                        Essayez de refaire le questionnaire ou explorez toutes nos associations.
                    </Text>
                )}

                {/* Reste du code pour le résumé des résultats */}
                <Text style={styles.resultsSummary}>Résumé de vos réponses :</Text>
                <ScrollView style={styles.resultsContainer}>
                    {answers.map((item, index) => (
                        <View key={index} style={styles.resultItem}>
                            <Text style={styles.questionTextResume} numberOfLines={2}>
                                {item.question}
                            </Text>
                            <View
                                style={
                                    item.answer
                                        ? styles.resultAnswerContainer
                                        : styles.resultNegativeAnswerContainer
                                }
                            >
                                <Text
                                    style={
                                        item.answer
                                            ? styles.yesText
                                            : styles.noText
                                    }
                                >
                                    {item.answer ? 'Oui' : 'Non'}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={styles.restartButton}
                    onPress={restartQuiz}
                >
                    <Text style={styles.restartButtonText}>Recommencer</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }

    return (
        <>
            <Header/>
            <View style={styles.container}>
                <Text style={styles.title}>Questionnaire</Text>
                <Text style={styles.subtitle}>Ce questionnaire vous aidera à trouver quelle association est faite pour vous.</Text>
                <Text style={styles.explication}>Swipe à droite pour Oui, à gauche pour Non</Text>
                <Text style={styles.counter}>{currentIndex + 1}/{questions.length}</Text>

                <View style={styles.cardContainer}>
                    {/* Aura verte (Oui) */}
                    <Animated.View
                        style={[
                            styles.aura,
                            styles.greenAura,
                            {opacity: rightGlowOpacity}
                        ]}/>

                    {/* Aura rouge (Non) */}
                    <Animated.View
                        style={[
                            styles.aura,
                            styles.redAura,
                            {opacity: leftGlowOpacity}
                        ]}/>

                    <Animated.View
                        style={[
                            styles.cardStyle,
                            {
                                transform: [
                                    {translateX: position.x},
                                    {translateY: position.y},
                                    {rotate: rotation}
                                ]
                            }
                        ]}
                        {...panResponder.panHandlers}
                    >
                        <Text style={styles.questionText}>{questions[currentIndex].text}</Text>
                    </Animated.View>
                </View>

            </View>
        </>
    );
}
// Styles (restent inchangés)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: 'black',
    },
    explication: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        color: 'gray',
        fontStyle: 'italic',
    },
    counter: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
        color: '#777',
    },
    cardContainer: {
        flex: 1,
        margin: 20,
        position: 'relative',
        alignItems: 'center',
    },
    cardStyle: {
        width: SCREEN_WIDTH * 0.8,
        height: 300,
        borderRadius: 20,
        backgroundColor: Colors.container_light.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 3,
    },
    aura: {
        position: 'absolute',
        width: SCREEN_WIDTH * 0.82,
        height: 310,
        borderRadius: 25,
        zIndex: 1,
    },
    greenAura: {
        backgroundColor: 'rgba(76, 175, 80, 0.3)',
    },
    redAura: {
        backgroundColor: 'rgba(244, 67, 54, 0.3)',
    },
    questionText: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '500',
    },
    questionTextResume: {
        fontSize: 15,
        flex: 1,
        marginRight: 10,
        color: '#333',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
        marginBottom: 40,
    },
    actionIndicator: {
        padding: 10,
    },
    yesText: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    noText: {
        color: '#F44336',
        fontWeight: 'bold',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginVertical: 20,
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#555',
        marginVertical: 20,
        fontStyle: 'italic',
    },
    resultsContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    resultsSummary: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    resultItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },

    resultAnswerContainer: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    resultNegativeAnswerContainer: {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    associationRecommendation: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    associationContent: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    donateButton: {
        backgroundColor: Colors.primary_dark.background,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    donateButtonText: {
        color: Colors.primary_dark.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
    restartButton: {
        backgroundColor: Colors.primary_dark.background,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        marginBottom :90,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    restartButtonText: {
        color: Colors.primary_dark.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    textcachesinonff: {
        color:'white',
        padding:0
    },
    associationImage: {
        width: 120,
        height: 90,
        marginRight: 12,
        resizeMode: 'contain',
    },
    associationInfo: {
        flex: 1,
    },
    associationName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    associationDescription: {
        fontSize: 14,
        color: '#666',
        flexWrap: 'wrap',
    },
});