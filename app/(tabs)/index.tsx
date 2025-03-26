import { View, StyleSheet } from 'react-native';
import AddButton from '../../components/button/AddButton';
import { router, useFocusEffect } from 'expo-router';
import { Colors } from '../../style/Colors';
import Header from '../../components/text/Header';
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
      <Header level={1} text="Bibliothèque" color={Colors.library.light.text} />
      <Header level={2} text="Decks" color={Colors.library.light.text} />
      <View style={styles.decksDisplay}>
        {decks.map((deck, index) => {
          return <DeckCard deck={deck} key={index} />;
        })}
      </View>
      <AddButton
        icon="pluscircle"
        size={70}
        color={Colors.library.dark.background}
        onPress={() => router.push('/modalDeck')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.library.light.background,
  },
  decksDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    rowGap: 16,
    columnGap: 16,
    flex: 1,
  },
});
