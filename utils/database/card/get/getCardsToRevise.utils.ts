import { SQLiteDatabase } from 'expo-sqlite';
import { FlashCardType } from '../../../../types/FlashCardType';
import { getDate } from '../../../getDate.utils';

export const getCardsToRevise = async (
  database: SQLiteDatabase,
): Promise<FlashCardType[]> => {
  let cardsToLearn: FlashCardType[];
  const today = getDate(0);

  try {
    cardsToLearn = await database.getAllAsync<FlashCardType>(
      `SELECT C.id, C.recto, C.verso, C.rectoFirst, C.step, C.nextRevision, C.changeSide, D.name
      FROM Card C INNER JOIN Deck D ON C.deck=D.id 
      WHERE nextRevision<=? AND toLearn=1 
      ORDER BY nextRevision ASC`,
      [today],
    );
  } catch (error) {
    console.log('getCardsToRevise:', error);
  }

  return cardsToLearn;
};
