import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ButtonModal } from '../components/button/ButtonModal';
import { Header } from '../components/text/Header';
import { Input } from '../components/text/Input';
import { Colors } from '../style/Colors';
import { Sizes } from '../style/Sizes';
import { globalStyles } from '../style/Styles';
import { createCard } from '../utils/database/card/createCard.utils';
import { deleteCard } from '../utils/database/card/deleteCard.utils';
import { getCardById } from '../utils/database/card/getCardById.utils';
import { updateCard } from '../utils/database/card/updateCard.utils';
import { getNameDeckById } from '../utils/database/deck/getNameDeckById.utils';

export default function Modal() {
  const [deckName, setDeckName] = useState('');
  const [recto, setRecto] = useState('');
  const [verso, setVerso] = useState('');
  const [editMode, setEditMode] = useState(false);

  const database = useSQLiteContext();

  const { idDeck, idCard } = useLocalSearchParams<{
    idDeck: string;
    idCard: string;
  }>();

  useFocusEffect(
    useCallback(() => {
      getNameDeckById(database, idDeck).then((name) => {
        setDeckName(name);
      });

      if (idCard) {
        setEditMode(true);

        getCardById(database, idCard).then((card) => {
          setRecto(card.recto);
          setVerso(card.verso);
        });
      }
    }, [idDeck, idCard]),
  );

  const handleValidate = async (continueCreating: boolean) => {
    if (editMode) {
      await updateCard(database, idCard, recto, verso);
    } else {
      await createCard(database, recto, verso, idDeck);
    }

    if (continueCreating) {
      setRecto('');
      setVerso('');
      return;
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
      <Header level={1} text={deckName} color={Colors.library.light.text} />
      <View style={styles.container}>
        <Header level={3} text="Recto" color={Colors.library.light.text} />
        <Input text={recto} setText={setRecto} />
        <Header level={3} text="Verso" color={Colors.library.light.text} />
        <Input text={verso} setText={setVerso} />
        <View style={{ ...styles.buttonContainer, marginTop: 16 }}>
          <ButtonModal text="Annuler" onPress={() => router.back()} />
          <ButtonModal
            text={editMode ? 'Modifier' : 'Ajouter'}
            onPress={() => handleValidate(false)}
          />
        </View>
        {!editMode && (
          <View style={{ ...styles.buttonContainer, marginTop: 8 }}>
            <ButtonModal
              text="Ajouter et continuer à créer"
              onPress={() => {
                handleValidate(true);
              }}
            />
          </View>
        )}
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
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  buttonDelete: {
    marginTop: 'auto',
    height: Sizes.component.small,
  },
});
