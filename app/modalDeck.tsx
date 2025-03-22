import { router, Stack } from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonModal from '../components/button/ButtonModal';
import { useState } from 'react';
import { Colors } from '../style/Colors';
import { useSQLiteContext } from 'expo-sqlite';
import Header1 from '../components/text/Header1';

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
      <Header1 text="Nouveau Deck" color={Colors.library.main} />
      <View style={styles.container}>
        <Text style={styles.text}>Nom du deck :</Text>
        <TextInput
          style={styles.input}
          value={deckName}
          onChangeText={setDeckName}
        />
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
    flex: 1,
    backgroundColor: Colors.library.light,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    marginTop: 100,
  },
  text: {
    fontSize: 30,
    color: Colors.library.main,
  },
  input: {
    height: 40,
    width: '80%',
    borderWidth: 1,
    borderColor: Colors.library.main,
    borderRadius: 10,
    backgroundColor: Colors.library.dark,
    color: Colors.library.light,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: '10%',
    gap: 10,
  },
});
