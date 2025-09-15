import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashButton } from '../../components/button/FlashButton';
import { FlashCard } from '../../components/card/FlashCard';
import { Header } from '../../components/text/Header';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { globalStyles } from '../../style/Styles';
import { LearningAction } from '../../types/Actions';
import { FlashCardType } from '../../types/FlashCardType';
import { getCardsToLearn } from '../../utils/database/card/get/getCardsToLearn.utils';
import { putCardToReviseTommorow } from '../../utils/database/card/update/putCardToReviseTommorow.utils';
import { resetCard } from '../../utils/database/card/update/resetCard.utils';
import { stopLearningCard } from '../../utils/database/card/update/stopLearningCard.utils';
import { decrementStatOfToday } from '../../utils/database/stats/decrementStatOfToday.utils';
import { incrementStatOfToday } from '../../utils/database/stats/incrementStatOfToday.utils';
import { shuffle } from '../../utils/shuffle.utils';

export default function Tab() {
  const [cardsToLearn, setCardsToLearn] = useState<FlashCardType[]>([]);
  const [cardToShow, setCardToShow] = useState<FlashCardType>(undefined);
  const [previousCard, setPreviousCard] = useState<FlashCardType>(undefined);
  const [lastAction, setLastAction] = useState<LearningAction>(undefined);

  const { t } = useTranslation();

  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      setPreviousCard(undefined);
      getCardsToLearn(database).then((cardsResult) => {
        shuffle(cardsResult);
        updateCardsToLearn(cardsResult);
      });
    }, []),
  );

  const updateCardsToLearn = (newCardsToLearn: FlashCardType[]) => {
    if (cardsToLearn.length === 1) {
      setPreviousCard(undefined);
    }
    setCardsToLearn(newCardsToLearn);
    setCardToShow(newCardsToLearn[0]);
  };

  const handlePrevious = () => {
    setPreviousCard(undefined);
    if (lastAction === 'again') {
      updateCardsToLearn([previousCard, ...cardsToLearn.slice(0, -1)]);
      return;
    }
    resetCard(database, previousCard.id.toString());
    updateCardsToLearn([previousCard, ...cardsToLearn]);
    if (lastAction === 'learnt') {
      decrementStatOfToday(database, 'nbLearnt');
    }
  };

  const handleNext = (learningAction: LearningAction) => {
    setPreviousCard(cardToShow);
    if (learningAction === 'learnt') {
      putCardToReviseTommorow(database, cardToShow.id);
      incrementStatOfToday(database, 'nbLearnt');
      updateCardsToLearn(cardsToLearn.slice(1));
    } else if (learningAction === 'again') {
      updateCardsToLearn([...cardsToLearn.slice(1), cardToShow]);
    } else if (learningAction === 'ignore') {
      stopLearningCard(database, cardToShow.id);
      updateCardsToLearn(cardsToLearn.slice(1));
    }
    setLastAction(learningAction);
  };

  return (
    <View style={styles.container}>
      <Header
        level={1}
        text={`${t('learning.title')} ${cardsToLearn.length > 0 ? `(${cardsToLearn.length})` : ''}`}
        color={Colors.learning.dark.contrast}
      />
      {cardToShow ? (
        <>
          <FlashCard
            recto={cardToShow.recto}
            verso={cardToShow.verso}
            deckName={cardToShow.name}
            backgroundColor={Colors.learning.simple.main}
            textColor={Colors.learning.simple.contrast}
            textDeckColor={Colors.learning.dark.main}
            previousPossible={previousCard !== undefined}
            handlePrevious={handlePrevious}
          />
          <View style={styles.buttons}>
            <FlashButton
              text={t('learning.ignore')}
              backgroundColor={Colors.learning.light.main}
              textColor={Colors.learning.light.contrast}
              handleClick={() => handleNext('ignore')}
            />
            <FlashButton
              text={t('learning.again')}
              backgroundColor={Colors.learning.middle.main}
              textColor={Colors.learning.light.contrast}
              handleClick={() => handleNext('again')}
            />
            <FlashButton
              text={t('learning.learnt')}
              backgroundColor={Colors.learning.intermediate.main}
              textColor={Colors.learning.intermediate.contrast}
              handleClick={() => handleNext('learnt')}
            />
          </View>
        </>
      ) : (
        <Text style={styles.text}>{t('learning.over')}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.learning.dark.main,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    height: Sizes.component.large,
  },
  text: {
    color: Colors.learning.dark.contrast,
    textAlign: 'center',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    marginVertical: 'auto',
    marginHorizontal: '20%',
  },
});
