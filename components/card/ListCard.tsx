import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useTranslation } from '../../hooks/useTranslation';
import { Sizes } from '../../style/Sizes';
import { CardType } from '../../types/CardType';
import { putCardToReviseTommorow } from '../../utils/database/card/update/putCardToReviseTommorow.utils';
import { resetCard } from '../../utils/database/card/update/resetCard.utils';
import { getDelay } from '../../utils/getDelay.utils';
import { notify } from '../../utils/notify.utils';
import { ConfirmDialog } from '../dialog/ConfirmDialog';
import { ListCardElement } from '../text/ListCardElement';

interface ListCardProps {
  card: CardType;
  triggerReload: () => void;
}

export function ListCard({ card, triggerReload }: ListCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { t } = useTranslation();
  const { colors } = useTheme();

  const database = useSQLiteContext();

  const handleForget = async () => {
    const resetOk = await resetCard(database, card.id.toString());
    notify(resetOk, t('notifications.errorOccurred'), t('card.forgotten'));
    setShowConfirmDialog(false);
    triggerReload();
  };

  const handleLearn = async () => {
    await putCardToReviseTommorow(database, card.id);
    notify(true, '', t('card.learnt'));
    triggerReload();
  };

  const handleLongPress = () => {
    if (card.nextRevision !== null) {
      setShowConfirmDialog(true);
    } else {
      handleLearn();
    }
  };

  return (
    <>
      <Card
        onPress={() =>
          router.push(`/modalCard?idDeck=${card.deck}&idCard=${card.id}`)
        }
        onLongPress={handleLongPress}
      >
        <Card.Content style={styles.content}>
          <ListCardElement text={card.recto} image={card.rectoImage} light={!card.toLearn} />
          <ListCardElement text={card.verso} image={card.versoImage} light={!card.toLearn || !card.changeSide} />
          <Text
            numberOfLines={1}
            style={{
              ...styles.textDate,
              color:
                getDelay(card.nextRevision) >= 0
                  ? colors.secondary
                  : colors.primary,
            }}
          >
            {card.nextRevision && card.toLearn
              ? card.nextRevision.slice(8) + '/' + card.nextRevision.slice(5, 7)
              : null}
          </Text>
        </Card.Content>
      </Card>
      <ConfirmDialog
        visible={showConfirmDialog}
        hideDialog={() => setShowConfirmDialog(false)}
        actionVerb={t('common.forget')}
        element={t('card.theCard')}
        onValidate={handleForget}
      />
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 8,
  },
  textDate: {
    marginLeft: 'auto',
    fontSize: Sizes.font.small,
    textAlign: 'right',
    fontFamily: 'JosefinRegular',
  },
});
