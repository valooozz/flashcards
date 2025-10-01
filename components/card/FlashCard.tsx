import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import FlipCard from 'react-native-flip-card';
import { Colors } from '../../style/Colors';
import { Shadows } from '../../style/Shadows';
import { Sizes } from '../../style/Sizes';
import { CancelButton } from '../button/CancelButton';
import { FlashCardContent } from './FlashCardContent';

interface FlashCardProps {
  recto: string;
  verso: string;
  rectoImage?: string | null;
  versoImage?: string | null;
  deckName: string;
  delay?: number;
  backgroundColor: string;
  textColor: string;
  textDeckColor: string;
  previousPossible: boolean;
  handlePrevious: () => void;
}

export function FlashCard({
  recto,
  verso,
  rectoImage,
  versoImage,
  deckName,
  delay = 0,
  backgroundColor,
  textColor,
  textDeckColor,
  previousPossible,
  handlePrevious,
}: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [flippedAtFirst, setFlippedAtFirst] = useState(false);

  useEffect(() => {
    if (flipped) {
      setFlippedAtFirst(true);
    } else {
      setFlippedAtFirst(false);
    }
  }, [recto, verso, rectoImage, versoImage]);

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
        {previousPossible && (
          <CancelButton
            backgroundColor={textDeckColor}
            color={backgroundColor}
            handleClick={handlePrevious}
          />
        )}
        <Text
          numberOfLines={1}
          style={{ ...styles.text, color: textDeckColor }}
        >
          {deckName}
        </Text>
        {delay ? (
          <Text
            style={{
              ...styles.text,
              color: Colors.daily.intermediate.main,
            }}
          >
            {delay > 0
              ? `${delay} jour${delay > 1 ? 's' : ''} de retard`
              : 'Oubliée'}
          </Text>
        ) : null}
        <FlashCardContent text={flippedAtFirst ? verso : recto} image={flippedAtFirst ? versoImage : rectoImage} textColor={textColor} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ ...styles.container, backgroundColor: backgroundColor }}
        onPress={() => setFlipped(!flipped)}
        activeOpacity={1}
      >
        {previousPossible && (
          <CancelButton
            backgroundColor={textDeckColor}
            color={backgroundColor}
            handleClick={handlePrevious}
          />
        )}
        <Text
          numberOfLines={1}
          style={{ ...styles.text, color: textDeckColor }}
        >
          {deckName}
        </Text>
        {delay ? (
          <Text
            style={{
              ...styles.text,
              color: Colors.daily.intermediate.main,
            }}
          >
            {delay > 0
              ? `${delay} jour${delay > 1 ? 's' : ''} de retard`
              : 'Oubliée'}
          </Text>
        ) : null}
        <FlashCardContent text={flippedAtFirst ? recto : verso} image={flippedAtFirst ? rectoImage : versoImage} textColor={textColor} />
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
    textAlign: 'right',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
  },
});
