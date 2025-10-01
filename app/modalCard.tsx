import { ButtonGroup } from '@rneui/themed';
import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { useCallback, useRef, useState } from 'react';
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
import { biToTri } from '../utils/biToTri.utils';
import { createCard } from '../utils/database/card/createCard.utils';
import { deleteCard } from '../utils/database/card/deleteCard.utils';
import { getCardById } from '../utils/database/card/get/getCardById.utils';
import { resetCard } from '../utils/database/card/update/resetCard.utils';
import { updateCardInfo } from '../utils/database/card/update/updateCardInfo.utils';
import { getNameDeckById } from '../utils/database/deck/get/getNameDeckById.utils';
import { formatDate } from '../utils/formatDate.utils';
import { getDelay } from '../utils/getDelay.utils';
import { notify } from '../utils/notify.utils';
import { triToBi } from '../utils/triToBi.utils';

export default function Modal() {
  const [deckName, setDeckName] = useState('');
  const [recto, setRecto] = useState('');
  const [verso, setVerso] = useState('');
  const [rectoFirst, setRectoFirst] = useState(true);
  const [step, setStep] = useState(0);
  const [nextRevision, setNextRevision] = useState('');
  const [delay, setDelay] = useState(0);
  const [editMode, setEditMode] = useState(false);
  // const [checkedAlternate, setCheckedAlternate] = useState(true);
  const [selectedChangeSide, setSelectedChangeSide] = useState(1);
  const [checkedLearn, setCheckedLearn] = useState(true);
  const [initialRecto, setInitialRecto] = useState('');
  const [initialVerso, setInitialVerso] = useState('');
  const [initialSelectedChangeSide, setInitialSelectedChangeSide] = useState(1);
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
          setRectoFirst(Boolean(card.rectoFirst));
          setStep(card.step);
          setNextRevision(card.nextRevision);
          setDelay(getDelay(card.nextRevision));
          setSelectedChangeSide(biToTri(card.changeSide));
          setCheckedLearn(Boolean(card.toLearn));
          setInitialRecto(card.recto);
          setInitialVerso(card.verso);
          setInitialSelectedChangeSide(biToTri(card.changeSide));
          setInitialCheckedLearn(Boolean(card.toLearn));
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
        triToBi(selectedChangeSide),
        checkedLearn,
      );
      notify(updateOk, t('notifications.errorOccurred'), t('card.updated'));
    } else {
      await createCard(database, recto, verso, idDeck, triToBi(selectedChangeSide), checkedLearn);
    }

    if (continueCreating) {
      setRecto('');
      setVerso('');
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
      selectedChangeSide !== initialSelectedChangeSide ||
      checkedLearn !== initialCheckedLearn
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ title: t('card.title'), headerShown: false }} />
      <Toolbar>
        <BackButton color={Colors.library.light.contrast} saveAction={hasChanged() ? () => handleValidate(false) : undefined} />
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
        <Header level={4} text={t('card.alternateSides')} color={Colors.library.light.contrast} />
        <ButtonGroup
          containerStyle={styles.selector}
          selectedButtonStyle={{ backgroundColor: Colors.library.dark.main }}
          buttonStyle={{ backgroundColor: Colors.library.simple.main }}
          textStyle={{ color: Colors.library.dark.main }}
          selectedTextStyle={{ color: Colors.library.dark.contrast }}
          buttons={[
            <Text style={styles.selectorText}>{t('common.no')}</Text>,
            <Text style={styles.selectorText}>{t('card.followDeck')}</Text>,
            <Text style={styles.selectorText}>{t('common.yes')}</Text>,
          ]}
          selectedIndex={selectedChangeSide}
          onPress={setSelectedChangeSide}
        />
        <CheckboxWithText
          isChecked={checkedLearn}
          setIsChecked={setCheckedLearn}
          textLabel={t('card.toLearn')}
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
              >{`${t('card.learningStep')} : ${step}/8`}</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit style={styles.text}>
                {nextRevision
                  ? delay < 0
                    ? `${t('card.nextRevision')} : ${formatDate(nextRevision)} (${-getDelay(nextRevision)} ${t('common.dayAbbreviation')})`
                    : delay > 0
                      ? `${delay} ${delay > 1 ? t('common.dayPlural') : t('common.daySingular')} ${t('card.delayInRevisions')}`
                      : t('card.reviseToday')
                  : t('card.notLearnt')}
              </Text>
            </View>
            <View style={{ ...styles.buttonLineContainer, marginTop: 'auto' }}>
              <ButtonModal
                text={t('common.reset')}
                onPress={() =>
                  alertAction(
                    t('notifications.confirm'),
                    t('common.reset'),
                    t('card.learningOfCard'),
                    t('common.cancel'),
                    handleReset,
                  )
                }
              />
              <ButtonModal
                text={t('common.delete')}
                onPress={() =>
                  alertAction(t('notifications.confirm'), t('common.delete'), t('card.theCard'), t('common.cancel'), handleDelete)
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
  selector: {
    width: '100%',
    height: Sizes.component.small,
    marginHorizontal: 'auto',
    borderWidth: 0,
    borderRadius: 0,
  },
  selectorText: {
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
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
