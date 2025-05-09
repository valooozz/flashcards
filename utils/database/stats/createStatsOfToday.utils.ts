import { SQLiteDatabase } from 'expo-sqlite';
import { getDate } from '../../getDate.utils';

export const createStatsOfToday = async (database: SQLiteDatabase) => {
  const today = getDate(0);
  await database
    .runAsync(
      'INSERT INTO Stats (date, nbKnown, nbForgotten, nbLearnt) VALUES (?, 0, 0, 0);',
      [today],
    )
    .catch(() => {});
};
