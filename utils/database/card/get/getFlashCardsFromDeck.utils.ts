import { SQLiteDatabase } from 'expo-sqlite';
import { FlashCardType } from '../../../../types/FlashCardType';

export const getFlashCardsFromDeck = async (
  database: SQLiteDatabase,
  idDeck: number,
): Promise<FlashCardType[]> => {
  let flashcards: FlashCardType[];

  try {
    flashcards = await database.getAllAsync<FlashCardType>(
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
      WHERE D.id=? AND toLearn=1`,
      [idDeck],
    );
  } catch (error) {
    console.log('getFlashCardsFromDeck:', error);
  }

  return flashcards;
};
