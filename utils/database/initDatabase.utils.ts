import { SQLiteDatabase } from 'expo-sqlite';
import { createTableCard } from './card/createTableCard.utils';
import { createTableDeck } from './deck/createTableDeck.utils';

export const initDatabase = async (database: SQLiteDatabase) => {
  await createTableDeck(database);
  await createTableCard(database);
};
