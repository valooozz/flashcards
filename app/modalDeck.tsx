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
import { useTranslation } from '../hooks/useTranslation';
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
import { ImportExportType } from '../types/ImportExportType';

export default function Modal() {
  const [deckName, setDeckName] = useState('');
  const [newDeckName, setNewDeckName] = useState('');
  const [editMode, setEditMode] = useState(false);

  const [nbCardsLearnt, setNbCardsLearnt] = useState(0);
  const [nbCardsToLearn, setNbCardsToLearn] = useState(0);
  const [progress, setProgress] = useState(0);

  const { t } = useTranslation();

  const database = useSQLiteContext();

  const { idDeck } = useLocalSearchParams<{
    idDeck: string;
  }>();

  const handleValidate = async () => {
    if (newDeckName === '') {
      notify(false, t('deck.emptyNameError'));
      return;
    }

    if (editMode) {
      const renameOk = await renameDeck(database, idDeck, newDeckName);
      if (renameOk) {
        router.back();
      }
      notify(renameOk, t('deck.existingNameError'), t('deck.renamed'));
    } else {
      const idCreated = await createDeck(database, newDeckName);
      if (idCreated >= 0) {
        router.back();
      }
      notify(
        idCreated >= 0,
        t('deck.existingNameError'),
        `${t('deck.title')} ${newDeckName} ${t('common.created')}`,
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
      t('notifications.errorOccured'),
      t('deck.learningResetted'),
    );
  };

  const handleDelete = async () => {
    const deleteOk = await deleteDeck(database, idDeck);
    if (deleteOk) {
      router.back();
    }
    notify(deleteOk, t('notifications.errorOccured'), t('deck.deleted'));
  };

  const handleImport = async (importType: ImportExportType) => {
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
      <Stack.Screen options={{ title: t('deck.title'), headerShown: false }} />
      <Toolbar>
        <BackButton color={Colors.library.light.contrast} />
      </Toolbar>
      <Header
        level={1}
        text={editMode ? deckName : t('deck.new')}
        color={Colors.library.light.contrast}
      />
      <View style={styles.container}>
        <Header
          level={3}
          text={t('deck.name')}
          color={Colors.library.light.contrast}
        />
        <Input text={newDeckName} setText={setNewDeckName} />
        <View style={{ ...styles.buttonLineContainer, marginTop: 16 }}>
          <ButtonModal
            text={editMode ? t('common.back') : t('common.cancel')}
            onPress={() => router.back()}
          />
          <ButtonModal
            text={editMode ? t('common.rename') : t('common.add')}
            onPress={handleValidate}
          />
        </View>
        {!editMode && (
          <View style={styles.buttonBottom}>
            <ButtonModal
              text={t('deck.importJson')}
              onPress={() => handleImport('json')}
            />
            <ButtonModal
              text={t('deck.importCsv')}
              onPress={() => handleImport('csv')}
            />
          </View>
        )}
        {editMode && (
          <View style={{ ...styles.buttonLineContainer, marginTop: 16 }}>
            <ButtonModal
              text={t('deck.exportCardsJson')}
              onPress={() => exportDeck(database, idDeck, deckName, 'json', false)}
            />
            <ButtonModal
              text={t('deck.exportCardsCsv')}
              onPress={() => exportDeck(database, idDeck, deckName, 'csv', false)}
            />
          </View>
        )}
        {editMode && (
          <View style={{ ...styles.buttonLineContainer, marginTop: 8 }}>
            <ButtonModal
              text={t('deck.exportLearning')}
              onPress={() => exportDeck(database, idDeck, deckName, 'json', true)}
            />
          </View>
        )}
        {editMode && (
          <View style={styles.statContainer}>
            <Text style={styles.textStat}>
              {t('deck.cardsLearnt')} : {nbCardsLearnt}
            </Text>
            <Text style={styles.textStat}>
              {t('deck.cardsToLearn')} : {nbCardsToLearn}
            </Text>
            <Text style={styles.textStat}>
              {t('deck.progress')} : {progress} %
            </Text>
          </View>
        )}
        {editMode && (
          <View style={styles.buttonBottom}>
            <ButtonModal
              text={t('deck.reset')}
              onPress={() =>
                alertAction(
                  t('notifications.confirm'),
                  t('common.reset'),
                  t('deck.learning'),
                  t('common.cancel'),
                  handleReset,
                )
              }
            />
            <ButtonModal
              text={t('common.delete')}
              onPress={() => alertAction(t('notifications.confirm'), t('common.delete'), t('deck.theDeck'), t('common.cancel'), handleDelete)}
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
