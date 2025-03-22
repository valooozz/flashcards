import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CardType } from '../../types/types';
import { Colors } from '../../style/Colors';

interface ListCardProps {
  card: CardType;
}

export default function ListCard({ card }: ListCardProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.text}>{card.recto}</Text>
      <Text style={{ ...styles.text, ...styles.textRight }}>{card.verso}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '90%',
    height: '15%',
    borderWidth: 5,
    borderColor: Colors.library.main,
    borderRadius: 12,
    borderEndEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 20,
    color: Colors.library.main,
    textAlign: 'left',
  },
  textRight: {
    marginLeft: 'auto',
  },
});
