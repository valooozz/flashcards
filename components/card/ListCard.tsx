import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import React, { memo, useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Card, ProgressBar, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { useNotify } from '../../hooks/useNotify';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { CardType } from '../../types/CardType';
import { putCardToReviseTommorow } from '../../utils/database/card/update/putCardToReviseTommorow.utils';
import { resetCard } from '../../utils/database/card/update/resetCard.utils';
import { getDelay } from '../../utils/getDelay.utils';
import { getProgressBarLength } from '../../utils/getProgressBarLength';
import { ConfirmDialog } from '../dialog/ConfirmDialog';
import { ListCardElement } from '../text/ListCardElement';

interface ListCardProps {
  card: CardType;
  triggerReload: () => void;
}

function ListCardComponent({ card, triggerReload }: ListCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const notify = useNotify();

  const { t } = useTranslation();
  const { colors } = useTheme();

  const database = useSQLiteContext();

  const handleForget = useCallback(async () => {
    const resetOk = await resetCard(database, card.id.toString());
    notify(resetOk, t('notifications.errorOccurred'), t('card.forgotten'));
    setShowConfirmDialog(false);
    triggerReload();
  }, [database, card.id, notify, t, triggerReload]);

  const handleLearn = useCallback(async () => {
    await putCardToReviseTommorow(database, card.id);
    notify(true, '', t('card.learnt'));
    triggerReload();
  }, [database, card.id, notify, t, triggerReload]);

  const handleLongPress = useCallback(() => {
    if (card.nextRevision !== null) {
      setShowConfirmDialog(true);
    } else {
      handleLearn();
    }
  }, [card.nextRevision, handleLearn]);

  const handlePress = useCallback(() => {
    router.push(`/modalCard?idDeck=${card.deck}&idCard=${card.id}`)
  }, [card.deck, card.id]);

  return (
    <>
      <Card
        style={[styles.card, { backgroundColor: colors.onPrimary }]}
        elevation={5}
      >
        <TouchableRipple
          onPress={handlePress}
          onLongPress={handleLongPress}
          delayLongPress={300}
          rippleColor={colors.backdrop}
          style={{ flexGrow: 1 }}
        >
          <>
            <Card.Content style={styles.content}>
              <ListCardElement text={card.recto} image={card.rectoImage} light={!card.toLearn} />
              <ListCardElement text={card.verso} image={card.versoImage} light={!card.toLearn || !card.changeSide} />
              <Text
                // @ts-ignore
                variant='listCardDate'
                numberOfLines={1}
                style={{
                  ...styles.textDate,
                  color:
                    getDelay(card.nextRevision) >= 0
                      ? Colors.daily.dark.main
                      : colors.primary,
                }}
              >
                {card.nextRevision && card.toLearn
                  ? card.nextRevision.slice(8) + '/' + card.nextRevision.slice(5, 7)
                  : null}
              </Text>
            </Card.Content>

            <ProgressBar
              progress={getProgressBarLength(card.step)}
              color={Colors.library.intermediate.main}
              style={[styles.progressBar, { backgroundColor: colors.onPrimary }]}
            />
          </>
        </TouchableRipple>
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
  card: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 8,
    height: 56,
  },
  textDate: {
    marginLeft: 'auto',
    textAlign: 'right',
  },
  progressBar: {
    height: 6,
  },
});

export const ListCard = memo(ListCardComponent);
