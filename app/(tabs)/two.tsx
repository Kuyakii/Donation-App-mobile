import { useState } from 'react';
import { StyleSheet, Button } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  const [message, setMessage] = useState('This is tab two');

  const handlePress = () => {
    setMessage('Le texte a changé ! 🎉');
  };

  return (
      <View style={styles.container}>
        <Text style={styles.title}>{message}</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Button title="Clique ici" onPress={handlePress} />
        <EditScreenInfo path="app/(tabs)/two.tsx" />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4760ff', // Couleur personnalisée
    marginBottom: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
