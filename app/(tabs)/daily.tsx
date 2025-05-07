import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashButton } from '../../components/button/FlashButton';
import { FlashCard } from '../../components/card/FlashCard';
import { Header } from '../../components/text/Header';
import { useSettingsContext } from '../../context/SettingsContext';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { globalStyles } from '../../style/Styles';
import { CardType } from '../../types/CardType';
import { NbCardsToReviseType } from '../../types/NbCardsToReviseType';
import { getCardsToRevise } from '../../utils/database/card/get/getCardsToRevise.utils';
import { getNbCardsToReviseThisWeek } from '../../utils/database/card/get/getNbCardsToReviseThisWeek.utils';
import { putCardToNextStep } from '../../utils/database/card/update/putCardToNextStep.utils';
import { putCardToPreviousStep } from '../../utils/database/card/update/putCardToPreviousStep.utils';
import { putCardToReviseTommorow } from '../../utils/database/card/update/putCardToReviseTommorow.utils';
import { getNameDeckById } from '../../utils/database/deck/get/getNameDeckById.utils';
import { addForgottenCard } from '../../utils/database/forgotten/addForgottenCard.utils';
import { getForgottenCards } from '../../utils/database/forgotten/getForgottenCards.utils';
import { removeForgottenCard } from '../../utils/database/forgotten/removeForgottenCard.utils';
import { getDelay } from '../../utils/getDelay.utils';
import { shuffle } from '../../utils/shuffle.utils';

export default function Tab() {
  const [cardsToRevise, setCardsToRevise] = useState<CardType[]>([]);
  const [forgottenCards, setForgottenCards] = useState<CardType[]>([]);
  const [cardToShow, setCardToShow] = useState<CardType>(undefined);
  const [deckName, setDeckName] = useState<string>('');
  const [delay, setDelay] = useState<number>(0);
  const [inSecondPhase, setInSecondPhase] = useState<boolean>(false);

  const [nbCardsToReviseThisWeek, setNbCardsToReviseThisWeek] = useState<
    NbCardsToReviseType[]
  >([]);

  const { hardThrowback, stopLearning, intervals } = useSettingsContext();
  const database = useSQLiteContext();

  useEffect(() => {
    if (cardToShow === undefined) {
      getNbCardsToReviseThisWeek(database).then((result) => {
        setNbCardsToReviseThisWeek(result);
      });
      return;
    }

    setDelay(getDelay(cardToShow.nextRevision));
    getNameDeckById(database, cardToShow.deck.toString()).then((nameResult) => {
      setDeckName(nameResult);
    });
  }, [cardToShow]);

  useEffect(() => {
    if (forgottenCards) {
      setCardToShow(forgottenCards[0]);
    }
  }, [forgottenCards]);

  useEffect(() => {
    if (cardsToRevise.length > 0) {
      setCardToShow(cardsToRevise[0]);
    } else {
      getForgottenCards(database).then((cardsResult) => {
        shuffle(cardsResult);
        setForgottenCards(cardsResult);
        setInSecondPhase(true);
      });
    }
  }, [cardsToRevise]);

  useFocusEffect(
    useCallback(() => {
      getCardsToRevise(database).then((cardsResult) => {
        shuffle(cardsResult);
        setCardsToRevise(cardsResult);
        setInSecondPhase(false);
      });
    }, []),
  );

  const handleClick = (known: boolean) => {
    if (known) {
      if (inSecondPhase) {
        removeForgottenCard(database, cardToShow.id);
        setForgottenCards(forgottenCards.slice(1));
      } else {
        putCardToNextStep(
          database,
          intervals,
          cardToShow.id,
          cardToShow.step,
          cardToShow.rectoFirst,
          cardToShow.changeSide,
          stopLearning,
        );
      }
    } else {
      if (inSecondPhase) {
        setForgottenCards([...forgottenCards.slice(1), cardToShow]);
      } else {
        addForgottenCard(database, cardToShow.id);
        if (hardThrowback) {
          putCardToReviseTommorow(database, cardToShow.id.toString());
        } else {
          putCardToPreviousStep(
            database,
            intervals,
            cardToShow.id,
            cardToShow.step,
          );
        }
      }
    }
    if (!inSecondPhase) {
      setCardsToRevise(cardsToRevise.slice(1));
    }
  };

  return (
    <View style={styles.container}>
      <Header
        level={1}
        text={`Révisions ${cardsToRevise.length + forgottenCards.length > 0 ? `(${cardsToRevise.length + forgottenCards.length})` : ''}`}
        color={Colors.daily.dark.contrast}
      />
      {cardToShow ? (
        <>
          <FlashCard
            recto={cardToShow.rectoFirst ? cardToShow.recto : cardToShow.verso}
            verso={cardToShow.rectoFirst ? cardToShow.verso : cardToShow.recto}
            deckName={deckName}
            delay={delay}
            backgroundColor={Colors.daily.simple.main}
            textColor={Colors.daily.simple.contrast}
            textDeckColor={Colors.daily.dark.main}
          />
          <View style={styles.buttons}>
            <FlashButton
              text="Oubliée"
              backgroundColor={Colors.daily.light.main}
              textColor={Colors.daily.light.contrast}
              handleClick={() => handleClick(false)}
            />
            <FlashButton
              text="Connue"
              backgroundColor={Colors.daily.intermediate.main}
              textColor={Colors.daily.intermediate.contrast}
              handleClick={() => handleClick(true)}
            />
          </View>
        </>
      ) : (
        <>
          <Text
            style={{
              ...styles.text,
              textAlign: 'center',
              marginVertical: '30%',
              marginHorizontal: '20%',
            }}
          >
            Toutes les cartes ont été révisées !
          </Text>
          <View>
            <Header
              level={3}
              text="Révisions de la semaine"
              color={Colors.daily.dark.contrast}
            />
            {nbCardsToReviseThisWeek.map((nbCardsToRevise) => (
              <Text style={styles.text} key={nbCardsToRevise.day}>
                {nbCardsToRevise.day} : {nbCardsToRevise.nbCards} carte
                {nbCardsToRevise.nbCards > 1 ? 's' : ''}
              </Text>
            ))}
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
