import { SQLiteDatabase } from 'expo-sqlite';
import { FlashCardType } from '../../../../types/FlashCardType';

export const getCardsToLearn = async (database: SQLiteDatabase) => {
  let cardsToLearn: FlashCardType[];
  try {
    cardsToLearn = await database.getAllAsync<FlashCardType>(
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
        CASE WHEN D.showName = 1 THEN D.name ELSE '' END as name
      FROM Card C
      INNER JOIN Deck D ON C.deck=D.id
      WHERE nextRevision IS NULL AND toLearn=1`,
    );
  } catch (error) {
    console.error(error);
  }

  return cardsToLearn;
};
