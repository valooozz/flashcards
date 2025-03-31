import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DeckType } from '../../types/types';
import { Colors } from '../../style/Colors';
import { router, useFocusEffect } from 'expo-router';
import { Sizes } from '../../style/Sizes';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { getNbCardsInDeck } from '../../utils/database/deck.utils';

interface DeckCardProps {
  deck: DeckType;
}

export default function DeckCard({ deck }: DeckCardProps) {
  const database = useSQLiteContext();
  const [nbCards, setNbCards] = useState(0);
  const [word, setWord] = useState('');

  useFocusEffect(
    useCallback(() => {
      getNbCardsInDeck(database, deck.id.toString()).then((nb) => {
        setNbCards(nb);
        if (nbCards > 1) {
          setWord(' cartes');
        } else {
          setWord(' cartes');
        }
      });
    }, []),
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`(tabs)/deck?id=${deck.id}`)}
    >
      <Text style={styles.title}>{deck.name}</Text>
      <Text style={styles.nbCards}>{nbCards + word}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: Colors.library.dark.background,
    minWidth: 152,
    height: Sizes.component.huge,
    paddingHorizontal: 16,
    paddingVertical: 16,
    boxShadow:
      'rgba(136, 165, 191, 0.78) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px',
  },
  title: {
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    textDecorationLine: 'underline',
    color: Colors.library.dark.text,
    textAlign: 'left',
  },
  nbCards: {
    fontSize: Sizes.font.tiny,
    fontFamily: 'JosefinRegular',
    color: Colors.library.dark.text,
    textAlign: 'left',
  },
});
