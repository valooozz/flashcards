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
        CASE WHEN C.rectoFirst=1 THEN C.rectoImage ELSE C.versoImage END AS rectoImage,
        CASE WHEN C.rectoFirst=1 THEN C.versoImage ELSE C.rectoImage END AS versoImage,
        C.rectoFirst,
        C.step,
        C.nextRevision,
        CASE WHEN C.changeSide IS NOT NULL THEN C.changeSide ELSE D.changeSide END as changeSide,
        CASE WHEN D.showName = 1 THEN D.name ELSE '' END as name
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
