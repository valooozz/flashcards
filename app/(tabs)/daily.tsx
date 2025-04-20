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
import { getCardsToRevise } from '../../utils/database/card/get/getCardsToRevise.utils';
import { logAllCards } from '../../utils/database/card/table/logAllCards.utils';
import { putCardToNextStep } from '../../utils/database/card/update/putCardToNextStep.utils';
import { putCardToReviseTommorow } from '../../utils/database/card/update/putCardToReviseTommorow.utils';
import { getNameDeckById } from '../../utils/database/deck/get/getNameDeckById.utils';
import { getDelay } from '../../utils/getDelay.utils';

export default function Tab() {
  const [cardsToRevise, setCardsToRevise] = useState<CardType[]>([]);
  const [forgottenCards, setForgottenCards] = useState<CardType[]>([]);
  const [cardToShow, setCardToShow] = useState<CardType>(undefined);
  const [deckName, setDeckName] = useState<string>('');
  const [delay, setDelay] = useState<number>(0);
  const [inSecondPhase, setInSecondPhase] = useState<boolean>(false);

  const { intervals } = useSettingsContext();
  const database = useSQLiteContext();

  useEffect(() => {
    if (cardToShow === undefined) {
      return;
    }

    setDelay(getDelay(cardToShow.nextRevision));
    getNameDeckById(database, cardToShow.deck.toString()).then((nameResult) => {
      setDeckName(nameResult);
    });
  }, [cardToShow]);

  useEffect(() => {
    if (!inSecondPhase) {
      return;
    }
    if (forgottenCards) {
      setCardToShow(forgottenCards[0]);
    }
  }, [forgottenCards]);

  useEffect(() => {
    if (cardsToRevise.length > 0) {
      setCardToShow(cardsToRevise[0]);
    } else if (forgottenCards) {
      setCardToShow(forgottenCards[0]);
      if (!inSecondPhase) {
        setInSecondPhase(true);
      }
    }
  }, [cardsToRevise]);

  useFocusEffect(
    useCallback(() => {
      logAllCards(database);
      getCardsToRevise(database).then((cardsResult) => {
        setCardsToRevise(cardsResult);
        setInSecondPhase(false);
      });
    }, []),
  );

  const handleClick = (known: boolean) => {
    if (known) {
      if (inSecondPhase) {
        putCardToReviseTommorow(database, cardToShow.id.toString());
        setForgottenCards(forgottenCards.slice(1));
      } else {
        putCardToNextStep(
          database,
          intervals,
          cardToShow.id,
          cardToShow.step,
          cardToShow.rectoFirst,
          cardToShow.changeSide,
        );
      }
    } else {
      if (inSecondPhase) {
        setForgottenCards([...forgottenCards.slice(1), cardToShow]);
      } else {
        setForgottenCards([...forgottenCards, cardToShow]);
      }
    }
    if (!inSecondPhase) {
      setCardsToRevise(cardsToRevise.slice(1));
    }
  };

  return (
    <View style={styles.container}>
      <Header level={1} text="Révisions" color={Colors.daily.dark.contrast} />
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
        <Text style={styles.text}>Toutes les cartes ont été révisées !</Text>
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
    textAlign: 'center',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    marginVertical: 'auto',
    marginHorizontal: '20%',
  },
});
