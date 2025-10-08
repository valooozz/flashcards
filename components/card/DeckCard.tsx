import { router, useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { DeckType } from '../../types/DeckType';
import { getNbCardsInDeck } from '../../utils/database/deck/get/getNbCardsInDeck.utils';
import { getNbCardsToLearnInDeck } from '../../utils/database/deck/get/getNbCardsToLearnInDeck.utils';
import { getNbCardsToReviseInDeck } from '../../utils/database/deck/get/getNbCardsToReviseInDeck.utils';

interface DeckCardProps {
  deck: DeckType;
  openDeck: (id: number, name: string) => void;
}

export function DeckCard({ deck, openDeck }: DeckCardProps) {
  const database = useSQLiteContext();
  const [nbCards, setNbCards] = useState(0);
  const [nbCardsToRevise, setNbCardsToRevise] = useState(0);
  const [nbCardsToLearn, setNbCardsToLearn] = useState(0);
  const [word, setWord] = useState('');

  const { colors } = useTheme();
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      getNbCardsInDeck(database, deck.id).then((nb) => {
        setNbCards(nb);
        if (nb > 1) {
          setWord(t('deck.cards'));
        } else {
          setWord(t('deck.card'));
        }
      });
      getNbCardsToReviseInDeck(database, deck.id).then((nb) => {
        setNbCardsToRevise(nb);
      });
      getNbCardsToLearnInDeck(database, deck.id).then((nb) => {
        setNbCardsToLearn(nb);
      });
    }, []),
  );

  return (
    <Card
      onPress={() => openDeck(deck.id, deck.name)}
      onLongPress={() => router.push(`/modalDeck?idDeck=${deck.id}`)}
      style={{ backgroundColor: colors.onPrimary }}
    >
      <Card.Title title={deck.name} />
      <Card.Content style={styles.content}>
        <Text variant="bodyMedium" style={{ color: colors.primary }}>{nbCards + word}</Text>
        {nbCardsToRevise ? <Text variant="bodyMedium" style={[styles.center, { color: Colors.daily.dark.main }]}>{nbCardsToRevise + t('deck.toReview')}</Text> : null}
        {nbCardsToLearn ? <Text variant="bodyMedium" style={[styles.right, { color: Colors.learning.dark.main }]}>{nbCardsToLearn + t('deck.toLearn')}</Text> : null}
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  center: {
    position: 'absolute',
    left: 152,
  },
  right: {
    marginLeft: 'auto',
  }
})