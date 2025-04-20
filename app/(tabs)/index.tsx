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
import { getAllDecks } from '../../utils/database/deck/get/getAllDecks.utils';

export default function Tab() {
  const [decks, setDecks] = useState<DeckType[]>([]);
  const database = useSQLiteContext();

  const loadData = async () => {
    const decksResult = await getAllDecks(database);
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
          <View style={styles.columnDisplay}>
            {decks.map((deck, index) => {
              return index % 2 === 0 ? (
                <DeckCard deck={deck} key={index} />
              ) : null;
            })}
          </View>
          <View style={styles.columnDisplay}>
            {decks.map((deck, index) => {
              return index % 2 === 0 ? null : (
                <DeckCard deck={deck} key={index} />
              );
            })}
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    columnGap: 16,
    flexGrow: 1,
    marginRight: 24,
    paddingBottom: 104,
  },
  columnDisplay: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    rowGap: 16,
    minWidth: 152,
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
