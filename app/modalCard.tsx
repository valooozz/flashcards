import * as DocumentPicker from 'expo-document-picker';
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Card, SegmentedButtons, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModalButton } from '../components/button/ModalButton';
import { ConfirmDialog } from '../components/dialog/ConfirmDialog';
import { QuitDialog } from '../components/dialog/QuitDialog';
import { StatsCardDialog } from '../components/dialog/StatsCardDialog';
import { CheckboxWithText } from '../components/text/CheckboxWithText';
import { useNotify } from '../hooks/useNotify';
import { useTranslation } from '../hooks/useTranslation';
import { GlobalStyles } from '../style/GlobalStyles';
import { CardChangeSide } from '../types/CardChangeSide';
import { createCard } from '../utils/database/card/createCard.utils';
import { deleteCard } from '../utils/database/card/deleteCard.utils';
import { getCardById } from '../utils/database/card/get/getCardById.utils';
import { resetCard } from '../utils/database/card/update/resetCard.utils';
import { updateCardInfo } from '../utils/database/card/update/updateCardInfo.utils';
import { getNameDeckById } from '../utils/database/deck/get/getNameDeckById.utils';

export default function Modal() {
  const notify = useNotify();
  const [deckName, setDeckName] = useState('');
  const [recto, setRecto] = useState('');
  const [verso, setVerso] = useState('');
  const [rectoImage, setRectoImage] = useState<string | null>(null);
  const [versoImage, setVersoImage] = useState<string | null>(null);
  const [rectoFirst, setRectoFirst] = useState(true);
  const [step, setStep] = useState(0);
  const [nextRevision, setNextRevision] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedChangeSide, setSelectedChangeSide] = useState<CardChangeSide>('deck');
  const [checkedLearn, setCheckedLearn] = useState(true);
  const [initialRecto, setInitialRecto] = useState('');
  const [initialVerso, setInitialVerso] = useState('');
  const [initialRectoImage, setInitialRectoImage] = useState<string | null>(null);
  const [initialVersoImage, setInitialVersoImage] = useState<string | null>(null);
  const [initialSelectedChangeSide, setInitialSelectedChangeSide] = useState<CardChangeSide>('deck');
  const [initialCheckedLearn, setInitialCheckedLearn] = useState(true);

  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [showConfirmResetDialog, setShowConfirmResetDialog] = useState(false);
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);

  const rectoInputRef = useRef(null);
  const { colors } = useTheme();
  const { t } = useTranslation();

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
          setRectoImage(card.rectoImage ?? null);
          setVersoImage(card.versoImage ?? null);
          setRectoFirst(Boolean(card.rectoFirst));
          setStep(card.step);
          setNextRevision(card.nextRevision);
          setSelectedChangeSide(numberToCardChangeSide(card.changeSide));
          setCheckedLearn(Boolean(card.toLearn));
          setInitialRecto(card.recto);
          setInitialVerso(card.verso);
          setInitialRectoImage(card.rectoImage ?? null);
          setInitialVersoImage(card.versoImage ?? null);
          setInitialSelectedChangeSide(numberToCardChangeSide(card.changeSide));
          setInitialCheckedLearn(Boolean(card.toLearn));
        });
      }
    }, [idDeck, idCard]),
  );

  const numberToCardChangeSide = (changeSide: number | null): CardChangeSide => {
    if (changeSide === 0) return 'no';
    if (changeSide === 1) return 'yes';
    return 'deck';
  }

  const cardChangeSideToBool = (changeSide: CardChangeSide): boolean | null => {
    if (changeSide === 'no') return false;
    if (changeSide === 'yes') return true;
    if (changeSide === 'deck') return null;
  }

  const handleValidate = async (continueCreating: boolean) => {
    if (recto === '' && !rectoImage) {
      notify(false, t('card.emptyFrontError'));
      return;
    }

    if (verso === '' && !versoImage) {
      notify(false, t('card.emptyBackError'));
      return;
    }

    if (editMode) {
      const updateOk = await updateCardInfo(
        database,
        idCard,
        recto,
        verso,
        rectoImage,
        versoImage,
        cardChangeSideToBool(selectedChangeSide),
        checkedLearn,
      );
      notify(updateOk, t('notifications.errorOccurred'), t('card.updated'));
    } else {
      await createCard(database, recto, verso, rectoImage, versoImage, idDeck, cardChangeSideToBool(selectedChangeSide), checkedLearn);
    }

    if (continueCreating) {
      setRecto('');
      setVerso('');
      setRectoImage(null);
      setVersoImage(null);
      return;
    }

    if (!editMode) {
      notify(true, '', t('card.added'));
    }

    router.back();
  };

  const handleReset = async () => {
    const resetOk = await resetCard(database, idCard);
    notify(resetOk, t('notifications.errorOccurred'), t('card.resetted'));
    setShowConfirmResetDialog(false);
    getCardById(database, idCard).then((card) => {
      setStep(card.step);
      setNextRevision(card.nextRevision);
    });
  };

  const handleDelete = async () => {
    const deleteOk = await deleteCard(database, idCard);
    if (deleteOk) {
      router.back();
    }
    notify(deleteOk, t('notifications.errorOccurred'), t('card.deleted'));
    setShowConfirmDeleteDialog(false);
  };

  const hasChanged = (): boolean => {
    return (
      recto !== initialRecto ||
      verso !== initialVerso ||
      rectoImage !== initialRectoImage ||
      versoImage !== initialVersoImage ||
      selectedChangeSide !== initialSelectedChangeSide ||
      checkedLearn !== initialCheckedLearn
    );
  }

  const pickImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['image/*'], multiple: false, copyToCacheDirectory: true });
    if (result.canceled) return;
    return result.assets?.[0].uri;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.inversePrimary }}>
      <Stack.Screen options={{ title: t('card.title'), headerShown: false }} />
      <Appbar.Header style={{ backgroundColor: colors.elevation.level1 }}>
        <Appbar.BackAction onPress={hasChanged() ? () => setShowQuitDialog(true) : () => router.back()} />
        <Appbar.Content title={deckName} />
        {editMode && (
          <>
            <Appbar.Action icon="poll" onPress={() => setShowStatsDialog(true)} />
            <Appbar.Action icon="restore" onPress={() => setShowConfirmResetDialog(true)} />
            <Appbar.Action icon="delete" onPress={() => setShowConfirmDeleteDialog(true)} />
          </>
        )}
      </Appbar.Header>

      <ScrollView style={{}} contentContainerStyle={GlobalStyles.modalContainer}>
        <TextInput
          label={t('card.front')}
          value={recto}
          onChangeText={setRecto}
          style={{ textDecorationLine: editMode && rectoFirst ? 'underline' : 'none' }}
          right={<TextInput.Icon
            icon={rectoImage ? 'image-remove' : 'image'}
            onPress={rectoImage ? () => setRectoImage(null) : async () => setRectoImage(await pickImage())}
          />}
        />
        {rectoImage &&
          <Card>
            <Card.Cover source={{ uri: rectoImage }} />
          </Card>
        }
        <TextInput
          label={t('card.back')}
          value={verso}
          onChangeText={setVerso}
          style={{ textDecorationLine: editMode && !rectoFirst ? 'underline' : 'none' }}
          right={<TextInput.Icon
            icon={versoImage ? 'image-remove' : 'image'}
            onPress={versoImage ? () => setVersoImage(null) : async () => setVersoImage(await pickImage())}
          />}
        />
        {versoImage &&
          <Card>
            <Card.Cover source={{ uri: versoImage }} />
          </Card>
        }
        <Text variant='titleMedium' style={GlobalStyles.titleCenter}>{t('card.alternateSides')}</Text>
        <SegmentedButtons
          value={selectedChangeSide}
          onValueChange={setSelectedChangeSide as ((value: string) => void)}
          theme={{ colors: { secondaryContainer: colors.primary, onSecondaryContainer: colors.onPrimary, outline: colors.primary } }}
          buttons={[
            {
              value: 'no',
              label: t('common.no'),
              checkedColor: colors.onPrimary,
            },
            {
              value: 'deck',
              label: t('card.followDeck'),
              checkedColor: colors.onPrimary,
            },
            {
              value: 'yes',
              label: t('common.yes'),
              checkedColor: colors.onPrimary,
            },
          ]}
        />
        <CheckboxWithText
          isChecked={checkedLearn}
          setIsChecked={setCheckedLearn}
          textLabel={t('card.toLearn')}
        />
        {!editMode && (
          <ModalButton variant='primary' text={t('card.addAndContinue')} onPress={() => {
            handleValidate(true);
            rectoInputRef.current.focus();
          }} />
        )}
        <View style={GlobalStyles.buttonLineContainer}>
          <ModalButton variant='tertiary' text={editMode ? t('common.back') : t('common.cancel')} onPressIn={() => router.back()} />
          <ModalButton variant='primary' text={editMode ? t('common.edit') : t('common.add')} onPress={() => handleValidate(false)} />
        </View>
      </ScrollView>

      <StatsCardDialog
        visible={showStatsDialog}
        hideDialog={() => setShowStatsDialog(false)}
        learningStep={step}
        nextRevision={nextRevision}
      />

      <QuitDialog
        visible={showQuitDialog}
        hideDialog={() => setShowQuitDialog(false)}
        saveAction={() => handleValidate(false)}
      />

      <ConfirmDialog
        visible={showConfirmResetDialog}
        hideDialog={() => setShowConfirmResetDialog(false)}
        actionVerb={t('common.reset')}
        element={t('card.learningOfCard')}
        onValidate={handleReset}
      />

      <ConfirmDialog
        visible={showConfirmDeleteDialog}
        hideDialog={() => setShowConfirmDeleteDialog(false)}
        actionVerb={t('common.delete')}
        element={t('card.theCard')}
        onValidate={handleDelete}
      />
    </SafeAreaView>
  )
}
