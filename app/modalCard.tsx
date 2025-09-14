import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toolbar } from '../components/bar/Toolbar';
import { BackButton } from '../components/button/BackButton';
import { ButtonModal } from '../components/button/ButtonModal';
import { CheckboxWithText } from '../components/text/CheckboxWithText';
import { Header } from '../components/text/Header';
import { Input } from '../components/text/Input';
import { useTranslation } from '../hooks/useTranslation';
import { Colors } from '../style/Colors';
import { Sizes } from '../style/Sizes';
import { globalStyles } from '../style/Styles';
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
  const [rectoFirst, setRectoFirst] = useState(true);
  const [step, setStep] = useState(0);
  const [nextRevision, setNextRevision] = useState('');
  const [delay, setDelay] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [checkedAlternate, setCheckedAlternate] = useState(true);
  const [checkedLearn, setCheckedLearn] = useState(true);

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
          setRectoFirst(Boolean(card.rectoFirst));
          setStep(card.step);
          setNextRevision(card.nextRevision);
          setDelay(getDelay(card.nextRevision));
          setCheckedAlternate(Boolean(card.changeSide));
          setCheckedLearn(Boolean(card.toLearn));
        });
      }
    }, [idDeck, idCard]),
  );

  const handleValidate = async (continueCreating: boolean) => {
    if (recto === '') {
      notify(false, t('card.emptyFrontError'));
      return;
    }

    if (verso === '') {
      notify(false, t('card.emptyBackError'));
      return;
    }

    if (editMode) {
      const updateOk = await updateCardInfo(
        database,
        idCard,
        recto,
        verso,
        checkedAlternate,
        checkedLearn,
      );
      notify(updateOk, t('notifications.errorOccurred'), t('card.cardUpdated'));
    } else {
      await createCard(database, recto, verso, idDeck, checkedAlternate);
    }

    if (continueCreating) {
      setRecto('');
      setVerso('');
      return;
    }

    if (!editMode) {
      notify(true, '', t('card.cardAdded'));
    }

    router.back();
  };

  const handleReset = async () => {
    const resetOk = await resetCard(database, idCard);
    notify(resetOk, t('notifications.errorOccurred'), t('learning.learningComplete'));
  };

  const handleDelete = async () => {
    const deleteOk = await deleteCard(database, idCard);
    if (deleteOk) {
      router.back();
    }
    notify(deleteOk, t('notifications.errorOccurred'), t('card.cardDeleted'));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ title: t('card.title'), headerShown: false }} />
      <Toolbar>
        <BackButton color={Colors.library.light.contrast} />
      </Toolbar>
      <Header level={1} text={deckName} color={Colors.library.light.contrast} />
      <View style={styles.container}>
        <Header level={3} text={t('card.front')} color={Colors.library.light.contrast} />
        <Input
          text={recto}
          setText={setRecto}
          underline={editMode && rectoFirst}
          autofocus={!editMode}
          innerRef={rectoInputRef}
        />
        <Header level={3} text={t('card.back')} color={Colors.library.light.contrast} />
        <Input
          text={verso}
          setText={setVerso}
          underline={editMode && !rectoFirst}
        />
        <CheckboxWithText
          isChecked={checkedAlternate}
          setIsChecked={setCheckedAlternate}
          textLabel={t('card.alternateSides')}
          spaceTop
        />
        <CheckboxWithText
          isChecked={checkedLearn}
          setIsChecked={setCheckedLearn}
          textLabel={t('card.learningCard')}
          spaceTop
        />
        {!editMode && (
          <View style={{ ...styles.buttonLineContainer, marginTop: 16 }}>
            <ButtonModal
              text={t('card.addAndContinue')}
              onPress={() => {
                handleValidate(true);
                rectoInputRef.current.focus();
              }}
            />
          </View>
        )}
        <View style={{ ...styles.buttonLineContainer, marginTop: 8 }}>
          <ButtonModal
            text={editMode ? t('common.back') : t('common.cancel')}
            onPress={() => router.back()}
          />
          <ButtonModal
            text={editMode ? t('common.edit') : t('common.add')}
            onPress={() => handleValidate(false)}
          />
        </View>
        {editMode && (
          <>
            <View style={styles.infoContainer}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={styles.text}
              >{`Étape d'apprentissage : ${step}/8`}</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit style={styles.text}>
                {nextRevision
                  ? delay < 0
                    ? `Prochaine révision : ${formatDate(nextRevision)} (${-getDelay(nextRevision)} j.)`
                    : delay > 0
                      ? `${delay} jour${delay > 1 ? 's' : ''} de retard dans les révisions.`
                      : "À réviser aujourd'hui."
                  : 'Pas encore apprise'}
              </Text>
            </View>
            <View style={{ ...styles.buttonLineContainer, marginTop: 'auto' }}>
              <ButtonModal
                text="Réinitialiser"
                onPress={() =>
                  alertAction(
                    'Réinitialiser',
                    "l'apprentissage de la carte",
                    handleReset,
                  )
                }
              />
              <ButtonModal
                text="Supprimer"
                onPress={() =>
                  alertAction('Supprimer', 'la carte', handleDelete)
                }
              />
            </View>
          </>
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
  text: {
    textAlign: 'left',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
  },
  buttonLineContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 8,
  },
});
