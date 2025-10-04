import * as DocumentPicker from 'expo-document-picker';
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModalButton } from '../components/button/ModalButton';
import { CheckboxWithText } from '../components/text/CheckboxWithText';
import { useTranslation } from '../hooks/useTranslation';
import { globalStyles } from '../style/Styles';
import { CardChangeSide } from '../types/CardChangeSide';
import { alertAction } from '../utils/alertAction.utils';
import { createCard } from '../utils/database/card/createCard.utils';
import { deleteCard } from '../utils/database/card/deleteCard.utils';
import { getCardById } from '../utils/database/card/get/getCardById.utils';
import { resetCard } from '../utils/database/card/update/resetCard.utils';
import { updateCardInfo } from '../utils/database/card/update/updateCardInfo.utils';
import { getNameDeckById } from '../utils/database/deck/get/getNameDeckById.utils';
import { formatDate } from '../utils/formatDate.utils';
import { getDelay } from '../utils/getDelay.utils';
import { notify } from '../utils/notify.utils';

export default function Modal() {
  const [deckName, setDeckName] = useState('');
  const [recto, setRecto] = useState('');
  const [verso, setVerso] = useState('');
  const [rectoImage, setRectoImage] = useState<string | null>(null);
  const [versoImage, setVersoImage] = useState<string | null>(null);
  const [rectoFirst, setRectoFirst] = useState(true);
  const [step, setStep] = useState(0);
  const [nextRevision, setNextRevision] = useState('');
  const [delay, setDelay] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [selectedChangeSide, setSelectedChangeSide] = useState<CardChangeSide>('deck');
  const [checkedLearn, setCheckedLearn] = useState(true);
  const [initialRecto, setInitialRecto] = useState('');
  const [initialVerso, setInitialVerso] = useState('');
  const [initialRectoImage, setInitialRectoImage] = useState<string | null>(null);
  const [initialVersoImage, setInitialVersoImage] = useState<string | null>(null);
  const [initialSelectedChangeSide, setInitialSelectedChangeSide] = useState<CardChangeSide>('deck');
  const [initialCheckedLearn, setInitialCheckedLearn] = useState(true);

  const rectoInputRef = useRef(null);
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
          setDelay(getDelay(card.nextRevision));
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
  };

  const handleDelete = async () => {
    const deleteOk = await deleteCard(database, idCard);
    if (deleteOk) {
      router.back();
    }
    notify(deleteOk, t('notifications.errorOccurred'), t('card.deleted'));
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

  const getNextRevisionText = () => {
    return nextRevision
      ? delay < 0
        ? `${t('card.nextRevision')} : ${formatDate(nextRevision)} (${-getDelay(nextRevision)} ${t('common.dayAbbreviation')})`
        : delay > 0
          ? `${delay} ${delay > 1 ? t('common.dayPlural') : t('common.daySingular')} ${t('card.delayInRevisions')}`
          : t('card.reviseToday')
      : t('card.notLearnt')
  }

  const showStats = () => {
    Alert.alert(
      t('common.info'),
      `${t('card.learningStep')} : ${step}/8\n${getNextRevisionText()}`
    )
  }

  const pickImage = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['image/*'], multiple: false, copyToCacheDirectory: true });
    if (result.canceled) return;
    return result.assets?.[0].uri;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: t('card.title'), headerShown: false }} />
      <Appbar.Header>
        <Appbar.BackAction onPress={hasChanged() ? () => handleValidate(false) : () => router.back()} />
        <Appbar.Content title={deckName} />
        {editMode && (
          <>
            <Appbar.Action icon="poll" onPress={showStats} />
            <Appbar.Action icon="restore" onPress={() =>
              alertAction(
                t('notifications.confirm'),
                t('common.reset'),
                t('card.learningOfCard'),
                t('common.cancel'),
                handleReset,
              )} />
            <Appbar.Action icon="delete" onPress={() =>
              alertAction(
                t('notifications.confirm'),
                t('common.delete'),
                t('card.theCard'),
                t('common.cancel'),
                handleDelete,
              )} />
          </>
        )}
      </Appbar.Header>

      <ScrollView style={{}} contentContainerStyle={globalStyles.modalContainer}>
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
        <Text variant='titleMedium' style={globalStyles.titleCenter}>{t('card.alternateSides')}</Text>
        <SegmentedButtons
          value={selectedChangeSide}
          onValueChange={setSelectedChangeSide as ((value: string) => void)}
          buttons={[
            {
              value: 'no',
              label: t('common.no'),
            },
            {
              value: 'deck',
              label: t('card.followDeck'),
            },
            {
              value: 'yes',
              label: t('common.yes'),
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
        <View style={globalStyles.buttonLineContainer}>
          <ModalButton variant='tertiary' text={editMode ? t('common.back') : t('common.cancel')} onPress={() => router.back()} />
          <ModalButton variant='primary' text={editMode ? t('common.edit') : t('common.add')} onPress={() => handleValidate(false)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
});
