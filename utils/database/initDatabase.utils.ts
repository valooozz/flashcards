import { SQLiteDatabase } from 'expo-sqlite';
import { createTableCard } from './card/table/createTableCard.utils';
import { createTableDeck } from './deck/table/createTableDeck.utils';
import { clearForToday } from './forgotten/clearForToday.util';
import { createTableForgotten } from './forgotten/createTableForgotten.utils';

export const initDatabase = async (database: SQLiteDatabase) => {
  await createTableDeck(database);
  await createTableCard(database);
  await createTableForgotten(database);
  await clearForToday(database);
};
