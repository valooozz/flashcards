import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonModal from '../components/button/ButtonModal';
import { useCallback, useState } from 'react';
import { Colors } from '../style/Colors';
import { useSQLiteContext } from 'expo-sqlite';
import Header1 from '../components/text/Header1';
import { createCard } from '../utils/database/card.utils';

export default function Modal() {
  const [deckName, setDeckName] = useState('');
  const [recto, setRecto] = useState('');
  const [verso, setVerso] = useState('');

  const { id } = useLocalSearchParams();
  const idDeck = id[0];

  const database = useSQLiteContext();

  const loadData = async () => {
    console.log('id:', idDeck, typeof idDeck);
    const deckNameResult = await database.getFirstAsync<object>(
      'SELECT name FROM Deck WHERE id=?;',
      idDeck,
    );
    setDeckName(deckNameResult['name']);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const handleValidate = async () => {
    createCard(database, recto, verso, idDeck);
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ title: 'Nouveau deck', headerShown: false }} />
      <Header1
        text={`Nouvelle carte dans ${deckName}`}
        color={Colors.library.main}
      />
      <View style={styles.container}>
        <Text style={styles.text}>Recto</Text>
        <TextInput style={styles.input} value={recto} onChangeText={setRecto} />
        <Text style={styles.text}>Verso</Text>
        <TextInput style={styles.input} value={verso} onChangeText={setVerso} />
        <View style={styles.buttonContainer}>
          <ButtonModal text="Annuler" onPress={() => router.back()} />
          <ButtonModal text="Ajouter" onPress={handleValidate} />
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
    marginTop: 65,
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
