import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashButton } from '../../components/button/FlashButton';
import { FlashCard } from '../../components/card/FlashCard';
import { Header } from '../../components/text/Header';
import { useSettingsContext } from '../../context/SettingsContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { globalStyles } from '../../style/Styles';
import { RevisionAction } from '../../types/Actions';
import { FlashCardType } from '../../types/FlashCardType';
import { NbCardsToReviseType } from '../../types/NbCardsToReviseType';
import { getCardsToRevise } from '../../utils/database/card/get/getCardsToRevise.utils';
import { getNbCardsToReviseThisWeek } from '../../utils/database/card/get/getNbCardsToReviseThisWeek.utils';
import { cancelLastActionOnCard } from '../../utils/database/card/update/cancelLastActionOnCard.utils';
import { putCardToNextStep } from '../../utils/database/card/update/putCardToNextStep.utils';
import { putCardToPreviousStep } from '../../utils/database/card/update/putCardToPreviousStep.utils';
import { putCardToReviseTommorow } from '../../utils/database/card/update/putCardToReviseTommorow.utils';
import { putCardToSameStep } from '../../utils/database/card/update/putCardToSameStep.utils';
import { addForgottenCard } from '../../utils/database/forgotten/addForgottenCard.utils';
import { getForgottenCards } from '../../utils/database/forgotten/getForgottenCards.utils';
import { removeForgottenCard } from '../../utils/database/forgotten/removeForgottenCard.utils';
import { decrementStatOfToday } from '../../utils/database/stats/decrementStatOfToday.utils';
import { getStatsOfDay } from '../../utils/database/stats/getStatsOfDay.utils';
import { incrementStatOfToday } from '../../utils/database/stats/incrementStatOfToday.utils';
import { getDate } from '../../utils/getDate.utils';
import { getDelay } from '../../utils/getDelay.utils';
import { isLastItem } from '../../utils/isLastItem.utils';
import { shuffle } from '../../utils/shuffle.utils';

export default function Tab() {
  const [cardsToRevise, setCardsToRevise] = useState<FlashCardType[]>([]);
  const [forgottenCards, setForgottenCards] = useState<FlashCardType[]>([]);
  const [cardToShow, setCardToShow] = useState<FlashCardType>(undefined);
  const [delay, setDelay] = useState<number>(0);
  const [inSecondPhase, setInSecondPhase] = useState<boolean>(false);

  const [nbRevised, setNbRevised] = useState(0);
  const [nbKnown, setNbKown] = useState(0);
  const [nbForgotten, setNbForgotten] = useState(0);
  const [nbCardsToReviseThisWeek, setNbCardsToReviseThisWeek] = useState<
    NbCardsToReviseType[]
  >([]);

  const [previousCard, setPreviousCard] = useState<FlashCardType>(undefined);
  const [previousStatIncremented, setPreviousStatIncremented] =
    useState<string>(undefined);

  const { hardThrowback, stopLearning, advancedRevisionMode, intervals } = useSettingsContext();

  const { t } = useTranslation();

  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      setPreviousCard(undefined);
      getCardsToRevise(database).then((cardsResult) => {
        shuffle(cardsResult);
        updateCardsToRevise(cardsResult);
        setInSecondPhase(false);

        if (cardsResult.length === 0) {
          getNbCardsToReviseThisWeek(database).then((result) => {
            setNbCardsToReviseThisWeek(result);
          });
        }
      });
    }, []),
  );

  const udpateCardToShow = (newCard: FlashCardType) => {
    setCardToShow(newCard);
    if (newCard === undefined) {
      getStatsOfDay(database, getDate(0)).then((stats) => {
        setNbRevised(stats.nbRevised);
        setNbKown(stats.nbKnown);
        setNbForgotten(stats.nbForgotten);
      });
      getNbCardsToReviseThisWeek(database).then((result) => {
        setNbCardsToReviseThisWeek(result);
      });
      return;
    }

    setDelay(getDelay(newCard.nextRevision));
  };

  const updateCardsToRevise = (newCardsToRevise: FlashCardType[]) => {
    setCardsToRevise(newCardsToRevise);
    if (newCardsToRevise.length > 0) {
      udpateCardToShow(newCardsToRevise[0]);
    } else {
      setPreviousCard(undefined);
      getForgottenCards(database).then((cardsResult) => {
        shuffle(cardsResult);
        updateForgottenCards(cardsResult);
        setInSecondPhase(true);
      });
    }
  };

  const updateForgottenCards = (newForgottenCards: FlashCardType[]) => {
    if (forgottenCards.length === 1) {
      setPreviousCard(undefined);
    }
    setForgottenCards(newForgottenCards);
    udpateCardToShow(newForgottenCards[0]);
  };

  const handlePrevious = () => {
    if (inSecondPhase) {
      if (isLastItem(previousCard, forgottenCards)) {
        updateForgottenCards([previousCard, ...forgottenCards.slice(0, -1)]);
      } else {
        updateForgottenCards([previousCard, ...forgottenCards]);
        addForgottenCard(database, previousCard.id);
      }
    } else {
      updateCardsToRevise([previousCard, ...cardsToRevise]);
      removeForgottenCard(database, previousCard.id);
      decrementStatOfToday(database, previousStatIncremented);
      cancelLastActionOnCard(
        database,
        previousCard.id,
        previousCard.step,
        previousCard.nextRevision,
        previousCard.rectoFirst,
      );
    }
    setPreviousCard(undefined);
    setPreviousStatIncremented(undefined);
  };

  const handleNext = (revisionAction: RevisionAction) => {
    setPreviousCard(cardToShow);

    if (inSecondPhase) {
      if (revisionAction === 'known') {
        removeForgottenCard(database, cardToShow.id);
        updateForgottenCards(forgottenCards.slice(1));
      } else if (revisionAction === 'forgotten') {
        updateForgottenCards([...forgottenCards.slice(1), cardToShow]);
      }
      return;
    }

    if (revisionAction === 'known') {
      incrementStatOfToday(database, 'nbKnown');
      setPreviousStatIncremented('nbKnown');
      putCardToNextStep(
        database,
        intervals,
        cardToShow.id,
        cardToShow.step,
        cardToShow.rectoFirst,
        cardToShow.changeSide,
        stopLearning,
      );
    } else if (revisionAction === 'difficult') {
      incrementStatOfToday(database, 'nbKnown');
      setPreviousStatIncremented('nbKnown');
      putCardToSameStep(database, intervals, cardToShow.id, cardToShow.step, cardToShow.rectoFirst, cardToShow.changeSide);
    } else if (revisionAction === 'almost') {
      incrementStatOfToday(database, 'nbForgotten');
      setPreviousStatIncremented('nbForgotten');
      addForgottenCard(database, cardToShow.id);
      putCardToPreviousStep(database, intervals, cardToShow.id, cardToShow.step);
    } else if (revisionAction === 'forgotten') {
      incrementStatOfToday(database, 'nbForgotten');
      setPreviousStatIncremented('nbForgotten');
      addForgottenCard(database, cardToShow.id);
      if (hardThrowback || advancedRevisionMode) {
        putCardToReviseTommorow(database, cardToShow.id);
      } else {
        putCardToPreviousStep(
          database,
          intervals,
          cardToShow.id,
          cardToShow.step,
        );
      }
    }
    updateCardsToRevise(cardsToRevise.slice(1));
  };

  return (
    <View style={styles.container}>
      <Header
        level={1}
        text={`${t('daily.title')} ${cardsToRevise.length + forgottenCards.length > 0 ? `(${cardsToRevise.length + forgottenCards.length})` : ''}`}
        color={Colors.daily.dark.contrast}
      />
      {cardToShow ? (
        <>
          <FlashCard
            recto={cardToShow.recto}
            verso={cardToShow.verso}
            deckName={cardToShow.name}
            delay={delay}
            backgroundColor={Colors.daily.simple.main}
            textColor={Colors.daily.simple.contrast}
            textDeckColor={Colors.daily.dark.main}
            previousPossible={previousCard !== undefined}
            handlePrevious={handlePrevious}
          />
          <View style={styles.buttons}>
            <FlashButton
              text={t('daily.forgotten')}
              backgroundColor={Colors.daily.light.main}
              textColor={Colors.daily.light.contrast}
              handleClick={() => handleNext('forgotten')}
            />
            {(advancedRevisionMode && !inSecondPhase) && (
              <>
                <FlashButton
                  text={t('daily.almost')}
                  backgroundColor={Colors.daily.middleLight.main}
                  textColor={Colors.daily.middleLight.contrast}
                  handleClick={() => handleNext('almost')}
                /><FlashButton
                  text={t('daily.difficult')}
                  backgroundColor={Colors.daily.middleDark.main}
                  textColor={Colors.daily.middleDark.contrast}
                  handleClick={() => handleNext('difficult')}
                />
              </>)}
            <FlashButton
              text={t('daily.known')}
              backgroundColor={Colors.daily.intermediate.main}
              textColor={Colors.daily.intermediate.contrast}
              handleClick={() => handleNext('known')}
            />
          </View>
        </>
      ) : (
        <>
          <Text
            style={{
              ...styles.text,
              textAlign: 'center',
              marginVertical: '10%',
              marginHorizontal: '20%',
            }}
          >
            {t('daily.over')}
          </Text>
          <View>
            <Header
              level={3}
              text={t('days.today')}
              color={Colors.daily.dark.contrast}
            />
            <Text style={styles.text}>{t('daily.cardsReviewed')} : {nbRevised}</Text>
            <Text style={styles.text}>{t('daily.cardsKnown')} : {nbKnown}</Text>
            <Text style={styles.text}>{t('daily.cardsForgotten')} : {nbForgotten}</Text>
          </View>
          <View style={{ marginTop: 16 }}>
            <Header
              level={3}
              text={t('daily.weekRevisions')}
              color={Colors.daily.dark.contrast}
            />
            {nbCardsToReviseThisWeek.map((nbCardsToRevise) => {
              const revisionDate = new Date();
              revisionDate.setDate(revisionDate.getDate() + nbCardsToRevise.daysFromToday);

              let dayLabel: string;
              if (nbCardsToRevise.daysFromToday === 1) {
                dayLabel = t('days.tomorrow');
              } else {
                const weekdayIndex = revisionDate.getDay();
                dayLabel = t(`days.${weekdayIndex}`);
              }

              return (
                <Text style={styles.text} key={nbCardsToRevise.daysFromToday}>
                  {dayLabel} : {nbCardsToRevise.nbCards}
                </Text>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.daily.dark.main,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    height: Sizes.component.large,
  },
  text: {
    color: Colors.daily.dark.contrast,
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
  },
  weekRevisionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    // marginVertical: 'auto',
  },
});
