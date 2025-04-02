import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../../types/types';

export const getCardById = async (database: SQLiteDatabase, id: string) => {
  let card: CardType;
  try {
    card = await database.getFirstAsync<CardType>(
      'SELECT * FROM Card WHERE id=?',
      id,
    );
  } catch (error) {
    console.error(error);
  }

  return card;
};
