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
import { CardType } from '../../types/CardType';
import { getCardsToLearn } from '../../utils/database/card/get/getCardsToLearn.utils';
import { putCardToReviseTommorow } from '../../utils/database/card/update/putCardToReviseTommorow.utils';
import { getNameDeckById } from '../../utils/database/deck/get/getNameDeckById.utils';
import { shuffle } from '../../utils/shuffle.utils';

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
      getCardsToLearn(database).then((cardsResult) => {
        shuffle(cardsResult);
        setCardsToLearn(cardsResult);
      });
    }, []),
  );

  const handleClick = (learnt: boolean) => {
    if (learnt) {
      putCardToReviseTommorow(database, cardToShow.id.toString());
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
        color={Colors.learning.dark.contrast}
      />
      {cardToShow ? (
        <>
          <FlashCard
            recto={cardToShow.recto}
            verso={cardToShow.verso}
            deckName={deckName}
            backgroundColor={Colors.learning.simple.main}
            textColor={Colors.learning.simple.contrast}
            textDeckColor={Colors.learning.dark.main}
          />
          <View style={styles.buttons}>
            <FlashButton
              text="A revoir"
              backgroundColor={Colors.learning.light.main}
              textColor={Colors.learning.light.contrast}
              handleClick={() => handleClick(false)}
            />
            <FlashButton
              text="Apprise"
              backgroundColor={Colors.learning.intermediate.main}
              textColor={Colors.learning.intermediate.contrast}
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
