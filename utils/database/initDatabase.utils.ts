import { SQLiteDatabase } from 'expo-sqlite';
import { createTableCard } from './card/table/createTableCard.utils';
import { createTableDeck } from './deck/table/createTableDeck.utils';
import { clearForToday } from './forgotten/clearForToday.util';
import { createTableForgotten } from './forgotten/createTableForgotten.utils';
import { migrateDatabase } from './migrateDatabase.utils';
import { createStatsOfToday } from './stats/createStatsOfToday.utils';
import { createTableStats } from './stats/createTableStats.utils';
import { createAllTriggers } from './triggers/createAllTriggers.utils';

export const initDatabase = async (database: SQLiteDatabase) => {

  await createTableDeck(database);
  await createTableCard(database);

  await createTableStats(database);
  await createStatsOfToday(database);

  await createTableForgotten(database);
  await clearForToday(database);

  await createAllTriggers(database);

  await migrateDatabase(database);

};
