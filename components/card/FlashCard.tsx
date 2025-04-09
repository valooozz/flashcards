import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
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
  const [showRecto, setShowRecto] = useState(true);
  const [textToShow, setTextToShow] = useState('');
  const [reloadText, setReloadText] = useState(false);

  useEffect(() => {
    setShowRecto(true);
    setReloadText(!reloadText);
  }, [recto, verso]);

  useEffect(() => {
    if (showRecto) {
      setTextToShow(recto);
    } else {
      setTextToShow(verso);
    }
  }, [reloadText]);

  const flipCard = () => {
    if (showRecto) {
      setShowRecto(false);
    } else {
      setShowRecto(true);
    }
    setReloadText(!reloadText);
  };

  return (
    <TouchableOpacity
      style={{ ...styles.container, backgroundColor: backgroundColor }}
      onPress={flipCard}
    >
      <Text style={{ ...styles.textDeck, color: textDeckColor }}>
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
