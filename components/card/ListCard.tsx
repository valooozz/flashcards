import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CardType } from '../../types/types';
import { Colors } from '../../style/Colors';
import { router } from 'expo-router';

interface ListCardProps {
  card: CardType;
}

export default function ListCard({ card }: ListCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push(`/modalCard?iddeck=${card.deck}&idcard=${card.id}`)
      }
    >
      <Text style={styles.text}>
        {card.recto.length < 11 ? card.recto : card.recto.slice(0, 9) + '...'}
      </Text>
      <Text style={styles.text}>
        {card.verso.length < 11 ? card.verso : card.verso.slice(0, 8) + '...'}
      </Text>
      <Text style={styles.textDate}>{card.nextRevision}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.library.simple.background,
    boxShadow: 'rgba(149, 157, 165, 0.4) 0px 8px 24px',
  },
  text: {
    width: 120,
    fontSize: 20,
    color: Colors.library.simple.text,
    textAlign: 'left',
    fontFamily: 'JosefinRegular',
    overflow: 'hidden',
  },
  textDate: {
    marginLeft: 'auto',
    fontSize: 20,
    color: Colors.library.simple.text,
    textAlign: 'right',
    fontFamily: 'JosefinRegular',
  },
});
