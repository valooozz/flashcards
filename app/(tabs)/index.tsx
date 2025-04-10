import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AddButton } from '../../components/button/AddButton';
import { DeckCard } from '../../components/card/DeckCard';
import { Header } from '../../components/text/Header';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
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
      <Header
        level={1}
        text="Bibliothèque"
        color={Colors.library.dark.contrast}
      />
      <Header level={2} text="Decks" color={Colors.library.dark.contrast} />
      {decks.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.decksDisplay}
          showsVerticalScrollIndicator={false}
        >
          {decks.map((deck, index) => {
            return <DeckCard deck={deck} key={index} />;
          })}
        </ScrollView>
      ) : (
        <Text style={styles.text}>
          Il n'y a aucun deck par ici. Cliquez sur le bouton + pour en ajouter !
        </Text>
      )}

      <AddButton
        icon="pluscircle"
        size={70}
        color={Colors.library.light.main}
        onPress={() => router.push('/modalDeck')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.library.dark.main,
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
  text: {
    color: Colors.learning.dark.contrast,
    textAlign: 'center',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    marginTop: 80,
    marginRight: 24,
  },
});
