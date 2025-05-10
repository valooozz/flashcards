import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../../../types/CardType';
import { getDate } from '../../../getDate.utils';

export const getCardsToRevise = async (database: SQLiteDatabase) => {
  let cardsToLearn: CardType[];
  const today = getDate(0);

  try {
    cardsToLearn = await database.getAllAsync<CardType>(
      'SELECT * FROM Card WHERE nextRevision<=? AND toLearn=1 ORDER BY nextRevision ASC',
      [today],
    );
  } catch (error) {
    console.log(error);
  }

  return cardsToLearn;
};
