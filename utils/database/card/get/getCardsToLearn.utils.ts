import { SQLiteDatabase } from 'expo-sqlite';
import { FlashCardType } from '../../../../types/FlashCardType';

export const getCardsToLearn = async (database: SQLiteDatabase) => {
  let cardsToLearn: FlashCardType[];
  try {
    cardsToLearn = await database.getAllAsync<FlashCardType>(
      `SELECT C.id, C.recto, C.verso, C.rectoFirst, C.step, C.nextRevision, C.changeSide, D.name 
      FROM Card C INNER JOIN Deck D ON C.deck=D.id
      WHERE nextRevision IS NULL AND toLearn=1`,
    );
  } catch (error) {
    console.log(error);
  }

  return cardsToLearn;
};
