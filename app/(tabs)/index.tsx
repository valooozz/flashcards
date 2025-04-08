import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AddButton } from '../../components/button/AddButton';
import { DeckCard } from '../../components/card/DeckCard';
import { Header } from '../../components/text/Header';
import { Colors } from '../../style/Colors';
import { globalStyles } from '../../style/Styles';
import { DeckType } from '../../types/DeckType';

export default function Tab() {
  const [decks, setDecks] = useState<DeckType[]>([]);
  const database = useSQLiteContext();

  const loadData = async () => {
    const decksResult = await database.getAllAsync<DeckType>(
      'SELECT * FROM Deck;',
    );
    setDecks(decksResult);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Header level={1} text="Bibliothèque" color={Colors.library.dark.text} />
      <Header level={2} text="Decks" color={Colors.library.dark.text} />
      <ScrollView
        contentContainerStyle={styles.decksDisplay}
        showsVerticalScrollIndicator={false}
      >
        {decks.map((deck, index) => {
          return <DeckCard deck={deck} key={index} />;
        })}
      </ScrollView>
      <AddButton
        icon="pluscircle"
        size={70}
        color={Colors.library.light.background}
        onPress={() => router.push('/modalDeck')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.library.dark.background,
    paddingRight: 0,
    paddingBottom: 0,
  },
  decksDisplay: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    rowGap: 16,
    columnGap: 16,
    flexGrow: 1,
    marginRight: 24,
    paddingBottom: 104,
  },
});
