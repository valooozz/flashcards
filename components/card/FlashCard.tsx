import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Sizes } from '../../style/Sizes';

interface FlashCardProps {
  recto: string;
  verso: string;
  deckName: string;
  backgroundColor: string;
  textColor: string;
  textDeckColor: string;
}

export function FlashCard({
  recto,
  verso,
  deckName,
  backgroundColor,
  textColor,
  textDeckColor,
}: FlashCardProps) {
  const [showRecto, setShowRecto] = useState(true);
  const [textToShow, setTextToShow] = useState(recto);

  useEffect(() => {
    console.log('useEffect');
    if (showRecto) {
      setTextToShow(recto);
    } else {
      setTextToShow(verso);
    }
    console.log('textToShow:', textToShow);
  }, [showRecto]);

  const flipCard = () => {
    console.log('flip');
    if (showRecto) {
      setShowRecto(false);
    } else {
      setShowRecto(true);
    }
    console.log('showRecto:', showRecto);
  };

  return (
    <TouchableOpacity
      style={{ ...styles.container, backgroundColor: backgroundColor }}
      onPress={flipCard}
    >
      <Text style={{ ...styles.textDeck, color: textDeckColor }}>
        {deckName}
      </Text>
      <Text style={{ ...styles.text, color: textColor }}>{textToShow}</Text>
    </TouchableOpacity>
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
