import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../style/Colors';
import { Radius } from '../../style/Radius';
import { Shadows } from '../../style/Shadows';
import { Sizes } from '../../style/Sizes';
import { CardType } from '../../types/CardType';
import { alertAction } from '../../utils/alertAction.utils';
import { deleteCard } from '../../utils/database/card/deleteCard.utils';
import { getDelay } from '../../utils/getDelay.utils';
import { getProgressBarLength } from '../../utils/getProgressBarLength';
import { notify } from '../../utils/notify.utils';
import { ProgressBar } from '../bar/ProgressBar';

interface ListCardProps {
  card: CardType;
  triggerReload: () => void;
}

export function ListCard({ card, triggerReload }: ListCardProps) {
  const database = useSQLiteContext();

  const handleDelete = async () => {
    const deleteOk = await deleteCard(database, card.id.toString());
    notify(deleteOk, 'Une erreur est survenue.', 'Carte supprimée');
    triggerReload();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push(`/modalCard?idDeck=${card.deck}&idCard=${card.id}`)
      }
      onLongPress={() => alertAction('Supprimer', 'la carte', handleDelete)}
    >
      <View style={styles.textContainer}>
        <Text style={{ ...styles.text, opacity: card.toLearn ? 1 : 0.3 }}>
          {card.recto.length < 11 ? card.recto : card.recto.slice(0, 9) + '...'}
        </Text>
        <Text
          style={{
            ...styles.text,
            opacity: card.changeSide && card.toLearn ? 1 : 0.3,
          }}
        >
          {card.verso.length < 11 ? card.verso : card.verso.slice(0, 8) + '...'}
        </Text>
        <Text
          style={{
            ...styles.textDate,
            color:
              getDelay(card.nextRevision) >= 0
                ? Colors.daily.dark.main
                : Colors.library.dark.main,
          }}
        >
          {card.nextRevision && card.toLearn
            ? card.nextRevision.slice(8) + '/' + card.nextRevision.slice(5, 7)
            : null}
        </Text>
      </View>
      <ProgressBar
        width={`${getProgressBarLength(card.step)}%`}
        color={Colors.library.intermediate.main}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: Sizes.component.medium,
    backgroundColor: Colors.library.simple.main,
    boxShadow: Shadows.listCard,
    borderRadius: Radius.small,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  textContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    width: 120,
    fontSize: Sizes.font.small,
    color: Colors.library.simple.contrast,
    textAlign: 'left',
    fontFamily: 'JosefinRegular',
    overflow: 'hidden',
  },
  textDate: {
    marginLeft: 'auto',
    fontSize: Sizes.font.small,
    textAlign: 'right',
    fontFamily: 'JosefinRegular',
  },
});
