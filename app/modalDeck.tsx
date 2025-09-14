import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toolbar } from '../components/bar/Toolbar';
import { BackButton } from '../components/button/BackButton';
import { ButtonModal } from '../components/button/ButtonModal';
import { Header } from '../components/text/Header';
import { Input } from '../components/text/Input';
import { Colors } from '../style/Colors';
import { Sizes } from '../style/Sizes';
import { globalStyles } from '../style/Styles';
import { alertAction } from '../utils/alertAction.utils';
import { getProgressInDeck } from '../utils/database/card/get/getProgressInDeck.utils';
import { createDeck } from '../utils/database/deck/createDeck.utils';
import { deleteDeck } from '../utils/database/deck/deleteDeck.utils';
import { exportDeck } from '../utils/database/deck/exportDeck.utils';
import { getNameDeckById } from '../utils/database/deck/get/getNameDeckById.utils';
import { getNbCardsLearntInDeck } from '../utils/database/deck/get/getNbCardsLearntInDeck.utils';
import { getNbCardsToLearnInDeck } from '../utils/database/deck/get/getNbCardsToLearnInDeck.utils';
import { renameDeck } from '../utils/database/deck/update/renameDeck.utils';
import { resetDeck } from '../utils/database/deck/update/resetDeck.utils';
import { importDocument } from '../utils/import/importDocument.utils';
import { notify } from '../utils/notify.utils';

export default function Modal() {
  const [deckName, setDeckName] = useState('');
  const [newDeckName, setNewDeckName] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [nbCardsLearnt, setNbCardsLearnt] = useState(0);
  const [nbCardsToLearn, setNbCardsToLearn] = useState(0);
  const [progress, setProgress] = useState(0);

  const database = useSQLiteContext();

  const { idDeck } = useLocalSearchParams<{
    idDeck: string;
  }>();

  const handleValidate = async () => {
    if (newDeckName === '') {
      notify(false, 'Le nom du deck ne peut pas être vide.');
      return;
    }

    if (editMode) {
      const renameOk = await renameDeck(database, idDeck, newDeckName);
      if (renameOk) {
        router.back();
      }
      notify(renameOk, 'Un deck porte déjà ce nom.', 'Deck renommé');
    } else {
      const idCreated = await createDeck(database, newDeckName);
      if (idCreated >= 0) {
        router.back();
      }
      notify(
        idCreated >= 0,
        'Un deck porte déjà ce nom.',
        `Deck ${newDeckName} créé`,
      );
    }
  };

  const handleReset = async () => {
    const resetOk = await resetDeck(database, idDeck);
    if (resetOk) {
      router.back();
    }
    notify(
      resetOk,
      'Une erreur est survenue.',
      "Apprentissage réinitialisé sur l'ensemble du deck",
    );
  };

  const handleDelete = async () => {
    const deleteOk = await deleteDeck(database, idDeck);
    if (deleteOk) {
      router.back();
    }
    notify(deleteOk, 'Une erreur est survenue.', 'Deck supprimé');
  };

  const handleImport = async (importType: 'json' | 'csv') => {
    await importDocument(database, importType);
    router.back();
  };

  useFocusEffect(
    useCallback(() => {
      if (idDeck) {
        setEditMode(true);
        getNameDeckById(database, idDeck).then((name) => {
          setDeckName(name);
          setNewDeckName(name);
        });
        getNbCardsLearntInDeck(database, Number(idDeck)).then((nb) => {
          setNbCardsLearnt(nb);
        });
        getNbCardsToLearnInDeck(database, Number(idDeck)).then((nb) => {
          setNbCardsToLearn(nb);
        });
        getProgressInDeck(database, Number(idDeck)).then((nb) => {
          setProgress(nb ? Number(nb.toFixed(2)) : 0);
        });
      }
    }, [idDeck]),
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ title: 'Deck', headerShown: false }} />
      <Toolbar>
        <BackButton color={Colors.library.light.contrast} />
      </Toolbar>
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
        <View style={{ ...styles.buttonLineContainer, marginTop: 16 }}>
          <ButtonModal
            text={editMode ? 'Retour' : 'Annuler'}
            onPress={() => router.back()}
          />
          <ButtonModal
            text={editMode ? 'Renommer' : 'Ajouter'}
            onPress={handleValidate}
          />
        </View>
        {!editMode && (
          <View style={styles.buttonBottom}>
            <ButtonModal
              text="Importer JSON"
              onPress={() => handleImport('json')}
            />
            <ButtonModal
              text="Importer CSV"
              onPress={() => handleImport('csv')}
            />
          </View>
        )}
        {editMode && (
          <View style={{ ...styles.buttonLineContainer, marginTop: 16 }}>
            <ButtonModal
              text="Exporter les cartes"
              onPress={() => exportDeck(database, idDeck, deckName, false)}
            />
          </View>
        )}
        {editMode && (
          <View style={{ ...styles.buttonLineContainer, marginTop: 8 }}>
            <ButtonModal
              text="Exporter avec l'apprentissage"
              onPress={() => exportDeck(database, idDeck, deckName, true)}
            />
          </View>
        )}
        {editMode && (
          <View style={styles.statContainer}>
            <Text style={styles.textStat}>
              Cartes apprises : {nbCardsLearnt}
            </Text>
            <Text style={styles.textStat}>
              Cartes à apprendre : {nbCardsToLearn}
            </Text>
            <Text style={styles.textStat}>
              Progression totale : {progress} %
            </Text>
          </View>
        )}
        {editMode && (
          <View style={styles.buttonBottom}>
            <ButtonModal
              text="Réinitialiser l'apprentissage"
              onPress={() =>
                alertAction(
                  'Réinitialiser',
                  "l'apprentissage du deck",
                  handleReset,
                )
              }
            />
            <ButtonModal
              text="Supprimer"
              onPress={() => alertAction('Supprimer', 'le deck', handleDelete)}
            />
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
  statContainer: {
    marginTop: 8,
  },
  textStat: {
    color: Colors.library.light.contrast,
    fontSize: Sizes.font.small,
    textAlign: 'left',
    fontFamily: 'JosefinRegular',
  },
});
