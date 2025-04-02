import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../../types/types';

export const getCardsToLearn = async (database: SQLiteDatabase) => {
  let cardsToLearn: CardType[];
  try {
    cardsToLearn = await database.getAllAsync<CardType>(
      'SELECT * FROM Card WHERE nextRevision IS NULL AND toLearn=1',
    );
  } catch (error) {
    console.log(error);
  }

  return cardsToLearn;
};
