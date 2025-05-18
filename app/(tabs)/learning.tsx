import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FlashButton } from '../../components/button/FlashButton';
import { FlashCard } from '../../components/card/FlashCard';
import { Header } from '../../components/text/Header';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { globalStyles } from '../../style/Styles';
import { FlashCardType } from '../../types/FlashCardType';
import { getCardsToLearn } from '../../utils/database/card/get/getCardsToLearn.utils';
import { putCardToReviseTommorow } from '../../utils/database/card/update/putCardToReviseTommorow.utils';
import { incrementStatOfToday } from '../../utils/database/stats/incrementStatOfToday.utils';
import { shuffle } from '../../utils/shuffle.utils';

export default function Tab() {
  const [cardsToLearn, setCardsToLearn] = useState<FlashCardType[]>([]);
  const [cardToShow, setCardToShow] = useState<FlashCardType>(undefined);

  const database = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      getCardsToLearn(database).then((cardsResult) => {
        shuffle(cardsResult);
        updateCardsToLearn(cardsResult);
      });
    }, []),
  );

  const updateCardsToLearn = (newCardsToLearn: FlashCardType[]) => {
    setCardsToLearn(newCardsToLearn);
    setCardToShow(newCardsToLearn[0]);
  };

  const handleClick = (learnt: boolean) => {
    if (learnt) {
      putCardToReviseTommorow(database, cardToShow.id);
      incrementStatOfToday(database, 'nbLearnt');
      updateCardsToLearn(cardsToLearn.slice(1));
    } else {
      updateCardsToLearn([...cardsToLearn.slice(1), cardToShow]);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        level={1}
        text={`Apprentissage ${cardsToLearn.length > 0 ? `(${cardsToLearn.length})` : ''}`}
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
