import { router, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonModal from '../components/button/ButtonModal';
import { useState } from 'react';
import { Colors } from '../style/Colors';
import { useSQLiteContext } from 'expo-sqlite';
import Header from '../components/text/Header';
import { globalStyles } from '../style/Styles';
import Input from '../components/text/Input';

export default function Modal() {
  const [deckName, setDeckName] = useState('');

  const database = useSQLiteContext();

  const handleValidate = async () => {
    try {
      database.runAsync('INSERT INTO Deck (name) VALUES (?);', [deckName]);
      console.log('Nouveau deck', deckName, 'ajouté');
      router.back();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ title: 'Nouveau deck', headerShown: false }} />
      <Header level={1} text="Nouveau Deck" color={Colors.library.light.text} />
      <View style={styles.container}>
        <Header
          level={3}
          text="Nom du deck"
          color={Colors.library.light.text}
        />
        <Input text={deckName} setText={setDeckName} />
        <View style={styles.buttonContainer}>
          <ButtonModal text="Annuler" onPress={() => router.back()} />
          <ButtonModal text="Valider" onPress={handleValidate} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...globalStyles.page,
    backgroundColor: Colors.library.light.background,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});
