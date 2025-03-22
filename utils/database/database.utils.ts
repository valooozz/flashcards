import { SQLiteDatabase } from 'expo-sqlite';
import { createTableDeck } from './deck.utils';
import { createTableCard } from './card.utils';

export const initDatabase = async (database: SQLiteDatabase) => {
  await createTableDeck(database);
  await createTableCard(database);
};
