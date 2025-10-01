import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toolbar } from '../components/bar/Toolbar';
import { BackButton } from '../components/button/BackButton';
import { ButtonModal } from '../components/button/ButtonModal';
import { StatsButton } from '../components/button/StatsButton';
import { CheckboxWithText } from '../components/text/CheckboxWithText';
import { Header } from '../components/text/Header';
import { Input } from '../components/text/Input';
import { useTranslation } from '../hooks/useTranslation';
import { Colors } from '../style/Colors';
import { Sizes } from '../style/Sizes';
import { globalStyles } from '../style/Styles';
import { ImportExportType } from '../types/ImportExportType';
import { alertAction } from '../utils/alertAction.utils';
import { getProgressInDeck } from '../utils/database/card/get/getProgressInDeck.utils';
import { setNullChangeSideOnAllCardsFromDeck } from '../utils/database/card/update/setNullChangeSideOnAllCardsFromDeck.utils';
import { createDeck } from '../utils/database/deck/createDeck.utils';
import { deleteDeck } from '../utils/database/deck/deleteDeck.utils';
import { exportDeck } from '../utils/database/deck/exportDeck.utils';
import { getDeckById } from '../utils/database/deck/get/getDeckById.utils';
import { getNbCardsLearntInDeck } from '../utils/database/deck/get/getNbCardsLearntInDeck.utils';
import { getNbCardsToLearnInDeck } from '../utils/database/deck/get/getNbCardsToLearnInDeck.utils';
import { resetDeck } from '../utils/database/deck/update/resetDeck.utils';
import { updateDeckInfo } from '../utils/database/deck/update/updateDeckInfo.utils';
import { importDocument } from '../utils/import/importDocument.utils';
import { notify } from '../utils/notify.utils';

export default function Modal() {
  const [deckName, setDeckName] = useState('');
  const [newDeckName, setNewDeckName] = useState('');
  const [changeSide, setChangeSide] = useState<boolean>(false);
  const [initialChangeSide, setInitialChangeSide] = useState<boolean>(undefined);

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
      const renameOk = await updateDeckInfo(database, idDeck, newDeckName, changeSide);
      if (renameOk) {
        router.back();
      }
      notify(renameOk, t('deck.existingNameError'), t('deck.updated'));
    } else {
      const idCreated = await createDeck(database, newDeckName, changeSide);
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
      t('notifications.errorOccurred'),
      t('deck.learningResetted'),
    );
  };

  const handleForceAlternate = async () => {
    const forceOk = await setNullChangeSideOnAllCardsFromDeck(database, idDeck);
    notify(
      forceOk,
      t('notifications.errorOccurred'),
      t('common.settingUpdated')
    )
  }

  const handleDelete = async () => {
    const deleteOk = await deleteDeck(database, idDeck);
    if (deleteOk) {
      router.back();
    }
    notify(deleteOk, t('notifications.errorOccurred'), t('deck.deleted'));
  };

  const handleImport = async (importType: ImportExportType) => {
    await importDocument(database, importType);
    router.back();
  };

  const showStats = () => {
    Alert.alert(
      t('common.stats'),
      `${t('deck.cardsLearnt')} : ${nbCardsLearnt}\n${t('deck.cardsToLearn')} : ${nbCardsToLearn}\n${t('deck.progress')} : ${progress} %`
    )
  }

  useFocusEffect(
    useCallback(() => {
      if (idDeck) {
        setEditMode(true);
        getDeckById(database, idDeck).then((deck) => {
          setDeckName(deck.name);
          setNewDeckName(deck.name);
          setChangeSide(Boolean(deck.changeSide));
          setInitialChangeSide(Boolean(deck.changeSide));
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

  const hasChanged = (): boolean => {
    return newDeckName !== deckName || changeSide !== initialChangeSide;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ title: t('deck.title'), headerShown: false }} />
      <Toolbar>
        <BackButton color={Colors.library.light.contrast} saveAction={hasChanged() ? handleValidate : undefined} />
        {editMode && <StatsButton color={Colors.library.light.contrast} onPress={showStats} />}
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
        <CheckboxWithText
          isChecked={changeSide}
          setIsChecked={setChangeSide}
          textLabel={t('card.alternateSides')}
          spaceTop
        />
        <View style={{ ...styles.buttonLineContainer, marginTop: 16 }}>
          <ButtonModal
            text={editMode ? t('common.back') : t('common.cancel')}
            onPress={() => router.back()}
          />
          <ButtonModal
            text={editMode ? t('common.edit') : t('common.add')}
            onPress={handleValidate}
          />
        </View>
        {!editMode && (
          <View style={{ ...styles.buttonBottom, height: Sizes.component.small * 2 + 16, }}>
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
        {/*editMode && (
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
        )*/}
        {editMode && (
          <View style={{ ...styles.buttonBottom, height: Sizes.component.small * 3 + 16, }}>
            <ButtonModal
              text={t('deck.forceAlternate')}
              onPress={() =>
                alertAction(
                  t('notifications.confirm'),
                  t('deck.detailedForceAlternate'),
                  t('deck.followDeckOnAlternate'),
                  t('common.cancel'),
                  handleForceAlternate
                )
              }
            />
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
    justifyContent: 'flex-start',
    rowGap: 8
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
