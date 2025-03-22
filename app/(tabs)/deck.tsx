import { View, StyleSheet } from 'react-native';
import FloatingButton from '../../components/button/FloatingButton';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../style/Colors';
import Header1 from '../../components/text/Header1';
import { globalStyles } from '../../style/Styles';
import { useCallback, useState } from 'react';
import { CardType } from '../../types/types';
import { useSQLiteContext } from 'expo-sqlite';
import ListCard from '../../components/card/ListCard';
import { getNameById } from '../../utils/database/deck.utils';
import { getCardsFromDeck } from '../../utils/database/card.utils';

export default function Tab() {
  const [deckName, setDeckName] = useState<string>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const database = useSQLiteContext();

  const { id } = useLocalSearchParams();
  const idDeck = id[0];

  const loadData = async () => {
    setDeckName(await getNameById(database, idDeck));
    setCards(await getCardsFromDeck(database, idDeck));
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header1 text={deckName} color={Colors.library.light} />
      <View style={styles.cardsDisplay}>
        {cards.map((card, index) => {
          return <ListCard card={card} key={index} />;
        })}
      </View>
      <FloatingButton
        icon="pluscircle"
        size={70}
        color={Colors.library.light}
        onPress={() => router.push(`/modalCreateCard?id=${idDeck}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.library.dark,
  },
  cardsDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    rowGap: 20,
    flex: 1,
  },
});
