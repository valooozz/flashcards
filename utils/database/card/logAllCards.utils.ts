import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../../types/types';

export const logAllCards = async (database: SQLiteDatabase) => {
  try {
    const cardsResult =
      await database.getAllAsync<CardType>('SELECT * FROM Card');
    console.log('all cards:', cardsResult);
  } catch (error) {
    console.error(error);
  }
};
