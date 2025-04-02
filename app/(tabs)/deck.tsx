import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AddButton from '../../components/button/AddButton';
import BackButton from '../../components/button/BackButton';
import ListCard from '../../components/card/ListCard';
import Header from '../../components/text/Header';
import { Colors } from '../../style/Colors';
import { globalStyles } from '../../style/Styles';
import { CardType } from '../../types/types';
import { getCardsFromDeck } from '../../utils/database/card/getCardsFromDeck.utils';
import { logAllCards } from '../../utils/database/card/logAllCards.utils';
import { getNbCardsInDeck } from '../../utils/database/deck/getNbCardsInDeck.utils';
import { getNameDeckById } from '../../utils/database/deck/getNameDeckById.utils';

export default function Screen() {
  const [deckName, setDeckName] = useState<string>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [nbCards, setNbCards] = useState<number>(0);
  const database = useSQLiteContext();

  const { idDeck } = useLocalSearchParams<{ idDeck: string }>();

  useFocusEffect(
    useCallback(() => {
      logAllCards(database);
      getNameDeckById(database, idDeck).then((nameResult) => {
        setDeckName(nameResult);
      });
      getCardsFromDeck(database, idDeck).then((cardsResult) => {
        setCards(cardsResult);
      });
      getNbCardsInDeck(database, idDeck).then((nbResult) => {
        setNbCards(nbResult);
      });
    }, [idDeck]),
  );

  return (
    <View style={styles.container}>
      <BackButton color={Colors.library.dark.text} />
      <Header
        level={1}
        text={deckName}
        color={Colors.library.dark.text}
        underButton={true}
      />
      <Header
        level={2}
        text={`Cartes (${nbCards})`}
        color={Colors.library.dark.text}
      />
      <View style={styles.cardsDisplay}>
        {cards.map((card, index) => {
          return <ListCard card={card} key={index} />;
        })}
      </View>
      <AddButton
        icon="pluscircle"
        size={70}
        color={Colors.library.light.background}
        onPress={() => router.push(`/modalCard?idDeck=${idDeck}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.library.dark.background,
  },
  cardsDisplay: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    rowGap: 8,
    flex: 1,
  },
});
