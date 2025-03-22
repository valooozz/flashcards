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
import {
  createCard,
  deleteCard,
  getCardById,
  updateCard,
} from '../utils/database/card.utils';
import { getNameById } from '../utils/database/deck.utils';

export default function Modal() {
  const [deckName, setDeckName] = useState('');
  const [recto, setRecto] = useState('');
  const [verso, setVerso] = useState('');
  const [editMode, setEditMode] = useState(false);

  const database = useSQLiteContext();

  const { iddeck, idcard } = useLocalSearchParams();
  const idDeck = iddeck.toString();
  const idCard = idcard ? idcard.toString() : undefined;

  const loadData = async () => {
    setDeckName(await getNameById(database, idDeck));

    if (idcard) {
      setEditMode(true);

      const card = await getCardById(database, idCard);
      setRecto(card.recto);
      setVerso(card.verso);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const handleValidate = async () => {
    if (editMode) {
      await updateCard(database, idCard, recto, verso);
    } else {
      await createCard(database, recto, verso, idDeck[0]);
    }
    router.back();
  };

  const handleDelete = async () => {
    await deleteCard(database, idCard);
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ title: 'Carte', headerShown: false }} />
      <Header1 text={`Carte de ${deckName}`} color={Colors.library.main} />
      <View style={styles.container}>
        <Text style={styles.text}>Recto</Text>
        <TextInput style={styles.input} value={recto} onChangeText={setRecto} />
        <Text style={styles.text}>Verso</Text>
        <TextInput style={styles.input} value={verso} onChangeText={setVerso} />
        <View style={styles.buttonContainer}>
          <ButtonModal text="Annuler" onPress={() => router.back()} />
          <ButtonModal
            text={editMode ? 'Modifier' : 'Ajouter'}
            onPress={handleValidate}
          />
        </View>
        {editMode && (
          <View style={styles.buttonDelete}>
            <ButtonModal text="Supprimer" onPress={handleDelete} />
          </View>
        )}
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
    alignItems: 'stretch',
    gap: 10,
    paddingVertical: 20,
  },
  text: {
    fontSize: 30,
    marginLeft: '10%',
    color: Colors.library.main,
  },
  input: {
    height: 40,
    marginHorizontal: '10%',
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
  buttonDelete: {
    marginTop: 'auto',
    marginHorizontal: '10%',
    height: 40,
  },
});
