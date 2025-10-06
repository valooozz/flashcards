import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, FAB, Menu, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModalButton } from '../components/button/ModalButton';
import { StatsDeckDialog } from '../components/dialog/StatsDeckDialog';
import { CheckboxWithText } from '../components/text/CheckboxWithText';
import { useTranslation } from '../hooks/useTranslation';
import { GlobalStyles } from '../style/GlobalStyles';
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
  const [changeSide, setChangeSide] = useState<boolean>(true);
  const [showName, setShowName] = useState<boolean>(true);
  const [initialShowName, setInitialShowName] = useState<boolean>(undefined);
  const [initialChangeSide, setInitialChangeSide] = useState<boolean>(undefined);

  const [editMode, setEditMode] = useState(false);

  const [nbCardsLearnt, setNbCardsLearnt] = useState(0);
  const [nbCardsToLearn, setNbCardsToLearn] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showStatsDialog, setShowStatsDialog] = useState(false);

  const [showExportMenu, setShowExportMenu] = useState(false);

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
      const updateOk = await updateDeckInfo(database, idDeck, newDeckName, changeSide, showName);
      if (updateOk) {
        router.back();
      }
      notify(updateOk, t('deck.existingNameError'), t('deck.updated'));
    } else {
      const idCreated = await createDeck(database, newDeckName, changeSide, showName);
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

  useFocusEffect(
    useCallback(() => {
      if (idDeck) {
        setEditMode(true);
        getDeckById(database, idDeck).then((deck) => {
          setDeckName(deck.name);
          setNewDeckName(deck.name);
          setChangeSide(Boolean(deck.changeSide));
          setShowName(Boolean(deck.showName));
          setInitialChangeSide(Boolean(deck.changeSide));
          setInitialShowName(Boolean(deck.showName));
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
    return newDeckName !== deckName || changeSide !== initialChangeSide || showName !== initialShowName;
  };

  return (
    <SafeAreaView>
      <Stack.Screen options={{ title: t('deck.title'), headerShown: false }} />
      <Appbar.Header>
        <Appbar.BackAction onPress={hasChanged() ? handleValidate : () => router.back()} />
        <Appbar.Content title={editMode ? deckName : t('deck.new')} />
        {editMode && (
          <>
            <Appbar.Action icon="poll" onPress={() => setShowStatsDialog(true)} />
            <Menu
              visible={showExportMenu}
              onDismiss={() => setShowExportMenu(false)}
              anchor={<Appbar.Action icon="export-variant" onPress={() => setShowExportMenu(true)} />}
            >
              <Menu.Item title={t('deck.exportCardsJson')} onPress={() => exportDeck(database, idDeck, deckName, 'json', false)} />
              <Menu.Item title={t('deck.exportCardsCsv')} onPress={() => exportDeck(database, idDeck, deckName, 'csv', false)} />
              <Menu.Item title={t('deck.exportLearning')} onPress={() => exportDeck(database, idDeck, deckName, 'json', true)} />
            </Menu>
            <Appbar.Action icon="restore" onPress={() =>
              alertAction(
                t('notifications.confirm'),
                t('common.reset'),
                t('deck.learning'),
                t('common.cancel'),
                handleReset,
              )} />
            <Appbar.Action icon="delete" onPress={() =>
              alertAction(
                t('notifications.confirm'),
                t('common.delete'),
                t('deck.theDeck'),
                t('common.cancel'),
                handleDelete,
              )} />
          </>
        )}
        {!editMode && (
          <Menu
            visible={showExportMenu}
            onDismiss={() => setShowExportMenu(false)}
            anchor={<Appbar.Action icon="import" onPress={() => setShowExportMenu(true)} />}
          >
            <Menu.Item title={t('deck.importJson')} onPress={() => handleImport('json')} />
            <Menu.Item title={t('deck.importCsv')} onPress={() => handleImport('csv')} />
          </Menu>
        )}
      </Appbar.Header>

      <View style={[GlobalStyles.container, GlobalStyles.modalContainer]}>
        <TextInput label={t('deck.name')} value={newDeckName} onChangeText={setNewDeckName} />
        <View style={styles.checkboxAction}>
          <CheckboxWithText
            isChecked={changeSide}
            setIsChecked={setChangeSide}
            textLabel={t('card.alternateSides')}
          />
          {editMode && (
            <FAB
              icon="sync"
              size="small"
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
          )}
        </View>
        <CheckboxWithText
          isChecked={showName}
          setIsChecked={setShowName}
          textLabel={t('deck.showName')}
        />
        <View style={GlobalStyles.buttonLineContainer}>
          <ModalButton variant='tertiary' text={editMode ? t('common.back') : t('common.cancel')} onPress={() => router.back()} />
          <ModalButton variant='primary' text={editMode ? t('common.edit') : t('common.add')} onPress={handleValidate} />
        </View>
      </View>

      <StatsDeckDialog visible={showStatsDialog} hideDialog={() => setShowStatsDialog(false)} nbCardsLearnt={nbCardsLearnt} nbCardsToLearn={nbCardsToLearn} progress={progress} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  checkboxAction: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 16,
  }
});
