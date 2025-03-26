import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, PanResponder, TouchableOpacity } from 'react-native';
import Header from "@/components/header";
import Colors from "@/constants/Colors";
import {useTranslation} from "react-i18next";
const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;


export default function App() {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [completed, setCompleted] = useState(false);
    const position = useRef(new Animated.ValueXY()).current;
    const rotation = position.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp'
    });

    // Questions à poser
    const questions = [
        t('questionnaire_questions.handicap'),
        t('questionnaire_questions.local_association'),
        t('questionnaire_questions.mental_health'),
        t('questionnaire_questions.addiction'),
        t('questionnaire_questions.caregivers'),
    ];

    // Fonction pour recommencer le questionnaire
    const restartQuiz = () => {
        setCurrentIndex(0);
        setAnswers([]);
        setCompleted(false);
        position.setValue({ x: 0, y: 0 });
    };

    // Créer un nouveau panResponder pour chaque rendu
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
        const answer = direction === 'right' ? true : false;
        // @ts-ignore
        setAnswers([...answers, { question: questions[currentIndex], answer }]);

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
            <View style={styles.container}>
                <Text style={styles.title}>Résultats</Text>
                {answers.map((item, index) => (
                    <View key={index} style={styles.resultItem}>
                        <Text style={styles.questionText}>{item.question}</Text>
                        <Text style={item.answer ? styles.yesText : styles.noText}>
                            {item.answer ? 'Oui' : 'Non'}
                        </Text>
                    </View>
                ))}

                <TouchableOpacity
                    style={styles.restartButton}
                    onPress={restartQuiz}
                >
                    <Text style={styles.restartButtonText}>Recommencer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <Header/>
            <View style={styles.container}>
            <Text style={styles.title}>{t('questionnaire')}</Text>
            <Text style={styles.subtitle}>{t('questionnaire_explanation')}</Text>
            <Text style={styles.explication}>{t('swipe_right_for_yes')}, {t('swipe_left_for_no')}</Text>
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
                    <Text style={styles.questionText}>{questions[currentIndex]}</Text>
                </Animated.View>
            </View>

            <View style={styles.actionsContainer}>
                <View style={styles.actionIndicator}>
                    <Text style={styles.noText}>{t('yes')}</Text>
                </View>
                <View style={styles.actionIndicator}>
                    <Text style={styles.yesText}>{t('no')}</Text>
                </View>
            </View>
        </View></>
    );
}

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
        margin : 20,
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
    resultItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    restartButton: {
        backgroundColor: Colors.primary_dark.background,
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
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
});