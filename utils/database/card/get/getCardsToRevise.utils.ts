import { SQLiteDatabase } from 'expo-sqlite';
import { FlashCardType } from '../../../../types/FlashCardType';
import { getDate } from '../../../getDate.utils';

export const getCardsToRevise = async (
  database: SQLiteDatabase,
): Promise<FlashCardType[]> => {
  let cardsToRevise: FlashCardType[];
  const today = getDate(0);

  try {
    cardsToRevise = await database.getAllAsync<FlashCardType>(
      `SELECT
        C.id,
        CASE WHEN C.rectoFirst=1 THEN C.recto ELSE C.verso END AS recto,
        CASE WHEN C.rectoFirst=1 THEN C.verso ELSE C.recto END AS verso,
        C.rectoFirst,
        C.step,
        C.nextRevision,
        C.changeSide,
        D.name
      FROM Card C
      INNER JOIN Deck D ON C.deck=D.id
      WHERE nextRevision<=? AND toLearn=1`,
      [today],
    );
  } catch (error) {
    console.log('getCardsToRevise:', error);
  }

  return cardsToRevise;
};
