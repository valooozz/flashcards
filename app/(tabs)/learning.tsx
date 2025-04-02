import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashCard } from '../../components/card/FlashCard';
import { Header } from '../../components/text/Header';
import { Colors } from '../../style/Colors';
import { globalStyles } from '../../style/Styles';
import { CardType } from '../../types/types';
import { getCardsToLearn } from '../../utils/database/card/getCardsToLearn.utils';
import { logAllCards } from '../../utils/database/card/logAllCards.utils';
import { getNameDeckById } from '../../utils/database/deck/getNameDeckById.utils';

export default function Tab() {
  const [cardsToLearn, setCardsToLearn] = useState<CardType[]>([]);
  const [cardToShow, setCardToShow] = useState<CardType>(undefined);
  const [deckName, setDeckName] = useState<string>('');
  const database = useSQLiteContext();

  useEffect(() => {
    if (cardToShow === undefined) {
      return;
    }

    getNameDeckById(database, cardToShow.deck.toString()).then((nameResult) => {
      setDeckName(nameResult);
    });
  }, [cardToShow]);

  useFocusEffect(
    useCallback(() => {
      logAllCards(database);
      getCardsToLearn(database).then((cardsResult) => {
        setCardsToLearn(cardsResult);
        console.log('cardsToLearn:', cardsToLearn);
        if (cardsToLearn) {
          setCardToShow(cardsToLearn[0]);
          console.log('cardToShow:', cardToShow);
        }
      });
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header
        level={1}
        text="Apprentissage"
        color={Colors.learning.dark.text}
      />
      {cardToShow && (
        <FlashCard
          recto={cardToShow.recto}
          verso={cardToShow.verso}
          deckName={deckName}
          backgroundColor={Colors.learning.simple.background}
          textColor={Colors.learning.simple.text}
          textDeckColor={Colors.learning.dark.background}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.learning.dark.background,
  },
});
