import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../style/Colors';
import { Radius } from '../../style/Radius';
import { Shadows } from '../../style/Shadows';
import { Sizes } from '../../style/Sizes';
import { CardType } from '../../types/CardType';
import { alertAction } from '../../utils/alertAction.utils';
import { putCardToReviseTommorow } from '../../utils/database/card/update/putCardToReviseTommorow.utils';
import { resetCard } from '../../utils/database/card/update/resetCard.utils';
import { getDelay } from '../../utils/getDelay.utils';
import { getProgressBarLength } from '../../utils/getProgressBarLength';
import { notify } from '../../utils/notify.utils';
import { CardProgressBar } from '../bar/CardProgressBar';

interface ListCardProps {
  card: CardType;
  triggerReload: () => void;
}

export function ListCard({ card, triggerReload }: ListCardProps) {
  const database = useSQLiteContext();

  const handleForget = async () => {
    const resetOk = await resetCard(database, card.id.toString());
    notify(resetOk, 'Une erreur est survenue.', 'Carte oubliée');
    triggerReload();
  };

  const handleLearn = async () => {
    await putCardToReviseTommorow(database, card.id);
    notify(true, '', 'Carte apprise');
    triggerReload();
  };

  const handleLongPress = () => {
    if (card.nextRevision !== null) {
      alertAction('Oublier', 'la carte', handleForget);
    } else {
      handleLearn();
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        router.push(`/modalCard?idDeck=${card.deck}&idCard=${card.id}`)
      }
      onLongPress={handleLongPress}
    >
      <View style={styles.textContainer}>
        <Text
          numberOfLines={1}
          style={{ ...styles.text, opacity: card.toLearn ? 1 : 0.3 }}
        >
          {card.recto}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            ...styles.text,
            opacity: card.changeSide && card.toLearn ? 1 : 0.3,
          }}
        >
          {card.verso}
        </Text>
        <Text
          numberOfLines={1}
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
      <CardProgressBar
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
    columnGap: 8,
  },
  text: {
    width: 120,
    fontSize: Sizes.font.small,
    color: Colors.library.simple.contrast,
    textAlign: 'left',
    fontFamily: 'JosefinRegular',
  },
  textDate: {
    marginLeft: 'auto',
    fontSize: Sizes.font.small,
    textAlign: 'right',
    fontFamily: 'JosefinRegular',
  },
});
