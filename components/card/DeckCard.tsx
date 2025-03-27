import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DeckType } from '../../types/types';
import { Colors } from '../../style/Colors';
import { router } from 'expo-router';
import { Sizes } from '../../style/Sizes';

interface DeckCardProps {
  deck: DeckType;
}

export default function DeckCard({ deck }: DeckCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`(tabs)/deck?id=${deck.id}`)}
    >
      <Text style={styles.text}>{deck.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.library.dark.background,
    minWidth: 152,
    height: Sizes.component.huge,
    paddingHorizontal: 16,
    paddingVertical: 16,
    boxShadow:
      'rgba(136, 165, 191, 0.78) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px',
  },
  text: {
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    textDecorationLine: 'underline',
    color: Colors.library.dark.text,
    textAlign: 'left',
  },
});
