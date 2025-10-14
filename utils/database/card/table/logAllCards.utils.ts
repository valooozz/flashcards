import { SQLiteDatabase } from 'expo-sqlite';
import { CardType } from '../../../../types/CardType';

export const logAllCards = async (database: SQLiteDatabase) => {
  try {
    const cardsResult =
      await database.getAllAsync<CardType>('SELECT * FROM Card');
    console.info('=== all cards:');
    cardsResult.forEach((card) => {
      console.info('-', card);
    });
  } catch (error) {
    console.error('logAllCards:', error);
  }
};
