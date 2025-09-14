import { SQLiteDatabase } from 'expo-sqlite';
import { FlashCardType } from '../../../types/FlashCardType';
import { getDate } from '../../getDate.utils';

export const getForgottenCards = async (
  database: SQLiteDatabase,
): Promise<FlashCardType[]> => {
  let forgottenCards: FlashCardType[] = [];
  const today = getDate(0);

  try {
    forgottenCards = await database.getAllAsync<FlashCardType>(
      `SELECT
        C.id,
        CASE WHEN C.rectoFirst=1 THEN C.recto ELSE C.verso END AS recto,
        CASE WHEN C.rectoFirst=1 THEN C.verso ELSE C.recto END AS verso,
        C.rectoFirst,
        C.step,
        C.nextRevision,
        C.changeSide,
        D.name
      FROM Forgotten F
      INNER JOIN Card C ON F.idCard=C.id
      INNER JOIN Deck D ON C.deck=D.id
      WHERE date=?`,
      today,
    );
  } catch (error) {
    console.error('getForgottenCards:', error);
  }

  return forgottenCards;
};
