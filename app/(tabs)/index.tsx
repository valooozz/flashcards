import { View, StyleSheet } from 'react-native';
import FloatingButton from '../../components/button/FloatingButton';
import { router, useFocusEffect } from 'expo-router';
import { Colors } from '../../style/Colors';
import Header1 from '../../components/text/Header1';
import { globalStyles } from '../../style/Styles';
import { useCallback, useState } from 'react';
import { DeckType } from '../../types/types';
import { useSQLiteContext } from 'expo-sqlite';
import DeckCard from '../../components/card/DeckCard';

export default function Tab() {
  const [decks, setDecks] = useState<DeckType[]>([]);
  const database = useSQLiteContext();

  const loadData = async () => {
    const decksResult = await database.getAllAsync<DeckType>(
      'SELECT * FROM Deck;',
    );
    console.log('Decks:', decksResult);
    setDecks(decksResult);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header1 text="Bibliothèque" color={Colors.library.main} />
      <View style={styles.decksDisplay}>
        {decks.map((deck, index) => {
          return <DeckCard deck={deck} key={index} />;
        })}
      </View>
      <FloatingButton
        icon="pluscircle"
        size={70}
        color={Colors.library.main}
        onPress={() => router.push('/modalDeck')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.library.light,
  },
  decksDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    rowGap: 20,
    flex: 1,
  },
});
