import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { Colors } from '../../style/Colors';
import { Shadows } from '../../style/Shadows';
import { Sizes } from '../../style/Sizes';

interface FlashCardProps {
  recto: string;
  verso: string;
  deckName: string;
  delay?: number;
  backgroundColor: string;
  textColor: string;
  textDeckColor: string;
}

export function FlashCard({
  recto,
  verso,
  deckName,
  delay = 0,
  backgroundColor,
  textColor,
  textDeckColor,
}: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [flippedAtFirst, setFlippedAtFirst] = useState(false);

  useEffect(() => {
    if (flipped) {
      setFlippedAtFirst(true);
    } else {
      setFlippedAtFirst(false);
    }
  }, [recto, verso]);

  useFocusEffect(
    useCallback(() => {
      setFlipped(false);
      setFlippedAtFirst(false);
    }, []),
  );

  return (
    <FlipCard
      friction={100}
      perspective={1000}
      flipHorizontal={true}
      flipVertical={false}
      flip={flipped}
    >
      <TouchableOpacity
        style={{ ...styles.container, backgroundColor: backgroundColor }}
        onPress={() => setFlipped(!flipped)}
        activeOpacity={1}
      >
        <Text
          numberOfLines={1}
          style={{ ...styles.textDeck, color: textDeckColor }}
        >
          {deckName}
        </Text>
        {delay ? (
          <Text
            style={{
              ...styles.textDeck,
              color: Colors.daily.intermediate.main,
            }}
          >
            {`${delay} jour${delay > 1 ? 's' : ''} de retard`}
          </Text>
        ) : null}
        <Text adjustsFontSizeToFit style={{ ...styles.text, color: textColor }}>
          {flippedAtFirst ? verso : recto}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ ...styles.container, backgroundColor: backgroundColor }}
        onPress={() => setFlipped(!flipped)}
        activeOpacity={1}
      >
        <Text
          numberOfLines={1}
          style={{ ...styles.textDeck, color: textDeckColor }}
        >
          {deckName}
        </Text>
        {delay ? (
          <Text
            style={{
              ...styles.textDeck,
              color: Colors.daily.intermediate.main,
            }}
          >
            {`${delay} jour${delay > 1 ? 's' : ''} de retard`}
          </Text>
        ) : null}
        <Text adjustsFontSizeToFit style={{ ...styles.text, color: textColor }}>
          {flippedAtFirst ? recto : verso}
        </Text>
      </TouchableOpacity>
    </FlipCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 36,
    boxShadow: Shadows.flashCard,
  },
  text: {
    textAlign: 'center',
    fontSize: Sizes.font.large,
    fontFamily: 'JosefinSemiBold',
    marginVertical: 'auto',
  },
  textDeck: {
    textAlign: 'right',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
  },
});
