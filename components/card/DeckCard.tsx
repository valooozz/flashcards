import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { DeckType } from '../../types/DeckType';
import { Colors } from '../../style/Colors';

interface DeckCardProps {
  deck: DeckType;
}

export default function DeckCard({ deck }: DeckCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.text}>{deck.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.library.main,
    width: '40%',
    height: '20%',
    borderWidth: 8,
    borderColor: Colors.library.dark,
    borderRadius: 12,
    borderEndEndRadius: 30,
    borderTopStartRadius: 20,
    padding: 20,
  },
  text: {
    fontSize: 20,
    color: Colors.library.light,
    textAlign: 'left',
  },
});
