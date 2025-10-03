import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { Card, Text, useTheme } from 'react-native-paper';
import { DeckType } from '../../types/DeckType';
import { getNbCardsInDeck } from '../../utils/database/deck/get/getNbCardsInDeck.utils';

interface DeckCardProps {
  deck: DeckType;
  openDeck: (id: number, name: string) => void;
}

export function DeckCard({ deck, openDeck }: DeckCardProps) {
  const database = useSQLiteContext();
  const [nbCards, setNbCards] = useState(0);
  const [word, setWord] = useState('');
  const { colors } = useTheme();

  useFocusEffect(
    useCallback(() => {
      getNbCardsInDeck(database, deck.id).then((nb) => {
        setNbCards(nb);
        if (nb > 1) {
          setWord(' cartes');
        } else {
          setWord(' carte');
        }
      });
    }, []),
  );

  return (
    <Card onPress={() => openDeck(deck.id, deck.name)} onLongPress={() => router.push(`/modalDeck?idDeck=${deck.id}`)}>
      <Card.Title title={deck.name} />
      <Card.Content>
        <Text adjustsFontSizeToFit variant="bodyMedium" style={{ color: colors.secondary }}>{nbCards + word}</Text>
      </Card.Content>
    </Card>
  )
}
