import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { PressableAndroidRippleConfig, StyleSheet } from 'react-native';
import { Card, ProgressBar, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { DeckType } from '../../types/DeckType';
import { getNbCardsInDeck } from '../../utils/database/deck/get/getNbCardsInDeck.utils';
import { getNbCardsToLearnInDeck } from '../../utils/database/deck/get/getNbCardsToLearnInDeck.utils';
import { getNbCardsToReviseInDeck } from '../../utils/database/deck/get/getNbCardsToReviseInDeck.utils';
import { getProgressInDeck } from '../../utils/database/deck/get/getProgressInDeck.utils';

interface DeckCardProps {
  deck: DeckType;
  openDeck: (id: number, name: string) => void;
  searchCard?: boolean;
}

function DeckCardComponent({ deck, openDeck, searchCard = false }: DeckCardProps) {
  const database = useSQLiteContext();
  const [nbCards, setNbCards] = useState(0);
  const [nbCardsToRevise, setNbCardsToRevise] = useState(0);
  const [nbCardsToLearn, setNbCardsToLearn] = useState(0);
  const [word, setWord] = useState('');
  const [progressInDeck, setProgressInDeck] = useState(0);

  const { colors } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    let isActive = true;

    getNbCardsInDeck(database, deck.id).then((nb) => {
      if (!isActive) return;
      setNbCards(nb);
      if (nb > 1) {
        setWord(t('deck.cards'));
      } else {
        setWord(t('deck.card'));
      }
    });
    getNbCardsToReviseInDeck(database, deck.id).then((nb) => {
      if (!isActive) return;
      setNbCardsToRevise(nb);
    });
    getNbCardsToLearnInDeck(database, deck.id, true).then((nb) => {
      if (!isActive) return;
      setNbCardsToLearn(nb);
    });
    getProgressInDeck(database, deck.id).then((progress) => {
      if (!isActive) return;
      setProgressInDeck(progress);
    });

    return () => {
      isActive = false;
    };
  }, [database, deck.id, t]);

  const handlePress = useCallback(() => openDeck(deck.id, deck.name), [openDeck, deck.id, deck.name]);
  const handleLongPress = useCallback(() => router.push(`/modalDeck?idDeck=${deck.id}`), [deck.id]);

  return (
    <Card
      style={[styles.card, { backgroundColor: colors.onPrimary }]}
      elevation={searchCard ? 0 : 5}
    >
      <TouchableRipple
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={300}
        underlayColor={colors.backdrop}
        background={
          {
            color: colors.backdrop,
            foreground: true,
          } as PressableAndroidRippleConfig
        }
      >
        <>
          <Card.Title title={deck.name} />
          <Card.Content style={styles.content}>
            <Text variant="bodyMedium" style={{ color: colors.primary }}>{nbCards + word}</Text>
            {nbCardsToRevise && !searchCard ? <Text variant="bodyMedium" style={[styles.center, { color: Colors.daily.dark.main }]}>{nbCardsToRevise + t('deck.toReview')}</Text> : null}
            {nbCardsToLearn && !searchCard ? <Text variant="bodyMedium" style={[styles.right, { color: Colors.learning.dark.main }]}>{nbCardsToLearn + t('deck.toLearn')}</Text> : null}
          </Card.Content>
          {!searchCard && (
            <ProgressBar
              progress={progressInDeck || 0}
              color={Colors.library.intermediate.main}
              style={[styles.progressBar, { backgroundColor: colors.onPrimary }]}
            />
          )}
        </>
      </TouchableRipple>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  center: {
    position: 'absolute',
    left: '40%',
  },
  right: {
    marginLeft: 'auto',
  },
  progressBar: {
    height: 6,
  },
})

export const DeckCard = memo(DeckCardComponent);