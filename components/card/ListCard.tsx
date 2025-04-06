import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { CardType } from '../../types/CardType';

interface ListCardProps {
  card: CardType;
}

export function ListCard({ card }: ListCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push(`/modalCard?idDeck=${card.deck}&idCard=${card.id}`)
      }
    >
      <Text style={styles.text}>
        {card.recto.length < 11 ? card.recto : card.recto.slice(0, 9) + '...'}
      </Text>
      <Text style={styles.text}>
        {card.verso.length < 11 ? card.verso : card.verso.slice(0, 8) + '...'}
      </Text>
      <Text style={styles.textDate}>
        {card.nextRevision && card.nextRevision.slice(5).replace('-', '/')}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: Sizes.component.medium,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.library.simple.background,
    boxShadow: 'rgba(149, 157, 165, 0.4) 0px 8px 24px',
  },
  text: {
    width: 120,
    fontSize: Sizes.font.small,
    color: Colors.library.simple.text,
    textAlign: 'left',
    fontFamily: 'JosefinRegular',
    overflow: 'hidden',
  },
  textDate: {
    marginLeft: 'auto',
    fontSize: Sizes.font.small,
    color: Colors.library.simple.text,
    textAlign: 'right',
    fontFamily: 'JosefinRegular',
  },
});
