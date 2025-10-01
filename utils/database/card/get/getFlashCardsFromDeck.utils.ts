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
        C.recto,
        C.verso,
        C.rectoImage,
        C.versoImage,
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
