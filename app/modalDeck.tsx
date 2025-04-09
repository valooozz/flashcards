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
import { Toast } from 'toastify-react-native';
import { ButtonModal } from '../components/button/ButtonModal';
import { Header } from '../components/text/Header';
import { Input } from '../components/text/Input';
import { Colors } from '../style/Colors';
import { Sizes } from '../style/Sizes';
import { globalStyles } from '../style/Styles';
import { createDeck } from '../utils/database/deck/createDeck.utils';
import { deleteDeck } from '../utils/database/deck/deleteDeck.utils';
import { getNameDeckById } from '../utils/database/deck/getNameDeckById.utils';
import { renameDeck } from '../utils/database/deck/renameDeck.utils';
import { resetDeck } from '../utils/database/deck/resetDeck.utils';

export default function Modal() {
  const [deckName, setDeckName] = useState('');
  const [newDeckName, setNewDeckName] = useState('');
  const [editMode, setEditMode] = useState(false);

  const database = useSQLiteContext();

  const { idDeck } = useLocalSearchParams<{
    idDeck: string;
  }>();

  const handleValidate = async () => {
    if (newDeckName === '') {
      Toast.show({
        type: 'error',
        text1: 'Le nom du deck ne peut pas être vide.',
        visibilityTime: 2000,
      });
      return;
    }

    if (editMode) {
      const renameOk = await renameDeck(database, idDeck, newDeckName);
      if (renameOk) {
        router.back();
        Toast.show({
          type: 'success',
          text1: 'Deck renommé',
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Un deck porte déjà ce nom.',
          visibilityTime: 2000,
        });
      }
    } else {
      const creationOk = await createDeck(database, newDeckName);
      if (creationOk) {
        router.back();
        Toast.show({
          type: 'success',
          text1: `Deck ${newDeckName} créé.`,
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Un deck porte déjà ce nom.',
          visibilityTime: 2000,
        });
      }
    }
  };

  const handleReset = async () => {
    const resetOk = await resetDeck(database, idDeck);
    if (resetOk) {
      router.back();
      Toast.show({
        type: 'success',
        text1: "Apprentissage réinitialisé sur l'ensemble du deck",
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Une erreur est survenue.',
        visibilityTime: 2000,
      });
    }
  };

  const handleDelete = async () => {
    const deleteOk = await deleteDeck(database, idDeck);
    if (deleteOk) {
      router.push('/');
      Toast.show({
        type: 'success',
        text1: 'Deck supprimé',
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Une erreur est survenue.',
        visibilityTime: 2000,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (idDeck) {
        setEditMode(true);
        getNameDeckById(database, idDeck).then((name) => {
          setDeckName(name);
          setNewDeckName(name);
        });
      }
    }, [idDeck]),
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ title: 'Deck', headerShown: false }} />
      <Header
        level={1}
        text={editMode ? deckName : 'Nouveau Deck'}
        color={Colors.library.light.contrast}
      />
      <View style={styles.container}>
        <Header
          level={3}
          text="Nom du deck"
          color={Colors.library.light.contrast}
        />
        <Input text={newDeckName} setText={setNewDeckName} />
        <View style={styles.buttonLineContainer}>
          <ButtonModal
            text={editMode ? 'Retour' : 'Annuler'}
            onPress={() => router.back()}
          />
          <ButtonModal
            text={editMode ? 'Renommer' : 'Ajouter'}
            onPress={handleValidate}
          />
        </View>
        {editMode && (
          <View style={styles.buttonBottom}>
            <ButtonModal
              text="Réinitialiser l'apprentissage"
              onPress={handleReset}
            />
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
    backgroundColor: Colors.library.light.main,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  buttonLineContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonBottom: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    gap: 8,
    height: Sizes.component.small * 2 + 8,
  },
});
