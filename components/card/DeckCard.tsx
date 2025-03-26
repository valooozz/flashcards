import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DeckType } from '../../types/types';
import { Colors } from '../../style/Colors';
import { router } from 'expo-router';

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
    backgroundColor: Colors.library.dark.background,
    width: 152,
    height: 120,
    paddingHorizontal: 16,
    paddingVertical: 16,
    boxShadow:
      'rgba(136, 165, 191, 0.78) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px',
  },
  text: {
    fontSize: 20,
    fontFamily: 'JosefinRegular',
    textDecorationLine: 'underline',
    color: Colors.library.dark.text,
    textAlign: 'left',
  },
});
