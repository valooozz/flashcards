import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashButton } from '../../components/button/FlashButton';
import { FlashCard } from '../../components/card/FlashCard';
import { Header } from '../../components/text/Header';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { globalStyles } from '../../style/Styles';
import { CardType } from '../../types/types';
import { getCardsToLearn } from '../../utils/database/card/getCardsToLearn.utils';
import { logAllCards } from '../../utils/database/card/logAllCards.utils';
import { markCardAsLearnt } from '../../utils/database/card/markCardAsLearn.utils';
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

  useEffect(() => {
    if (cardsToLearn) {
      setCardToShow(cardsToLearn[0]);
    }
  }, [cardsToLearn]);

  useFocusEffect(
    useCallback(() => {
      logAllCards(database);
      getCardsToLearn(database).then((cardsResult) => {
        setCardsToLearn(cardsResult);
      });
    }, []),
  );

  const handleClick = (learnt: boolean) => {
    if (learnt) {
      markCardAsLearnt(database, cardToShow.id.toString());
      setCardsToLearn(cardsToLearn.slice(1));
    } else {
      setCardsToLearn([...cardsToLearn.slice(1), cardToShow]);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        level={1}
        text="Apprentissage"
        color={Colors.learning.dark.text}
      />
      {cardToShow ? (
        <>
          <FlashCard
            recto={cardToShow.recto}
            verso={cardToShow.verso}
            deckName={deckName}
            backgroundColor={Colors.learning.simple.background}
            textColor={Colors.learning.simple.text}
            textDeckColor={Colors.learning.dark.background}
          />
          <View style={styles.buttons}>
            <FlashButton
              text="A revoir"
              backgroundColor={Colors.learning.light.background}
              textColor={Colors.learning.light.text}
              handleClick={() => handleClick(false)}
            />
            <FlashButton
              text="Apprise"
              backgroundColor={Colors.learning.intermediate.background}
              textColor={Colors.learning.intermediate.text}
              handleClick={() => handleClick(true)}
            />
          </View>
        </>
      ) : (
        <Text style={styles.text}>Toutes les cartes ont été apprises !</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.learning.dark.background,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    height: Sizes.component.large,
  },
  text: {
    color: Colors.learning.dark.text,
    textAlign: 'center',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    marginVertical: 'auto',
    marginHorizontal: '20%',
  },
});
