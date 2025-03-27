import { View, StyleSheet } from 'react-native';
import AddButton from '../../components/button/AddButton';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../style/Colors';
import Header from '../../components/text/Header';
import { globalStyles } from '../../style/Styles';
import { useCallback, useState } from 'react';
import { CardType } from '../../types/types';
import { useSQLiteContext } from 'expo-sqlite';
import ListCard from '../../components/card/ListCard';
import { getNameById, getNbCardsInDeck } from '../../utils/database/deck.utils';
import { getCardsFromDeck, logAllCards } from '../../utils/database/card.utils';
import BackButton from '../../components/button/BackButton';

export default function Tab() {
  const [deckName, setDeckName] = useState<string>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [nbCards, setNbCards] = useState<number>(0);
  const database = useSQLiteContext();

  const { id } = useLocalSearchParams();
  const idDeck = id[0];

  const loadData = async () => {
    setDeckName(await getNameById(database, idDeck));
    setCards(await getCardsFromDeck(database, idDeck));
    setNbCards(await getNbCardsInDeck(database, idDeck));
  };

  useFocusEffect(
    useCallback(() => {
      logAllCards(database);
      loadData();
    }, [id]),
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
        onPress={() => router.push(`/modalCard?iddeck=${idDeck}`)}
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
