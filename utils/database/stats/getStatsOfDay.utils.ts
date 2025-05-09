import { SQLiteDatabase } from 'expo-sqlite';

export const getStatsOfDay = async (database: SQLiteDatabase, date: string) => {
  let statsResult: { nbForgotten: number; nbKnown: number; nbLearnt: number };
  try {
    statsResult = await database.getFirstAsync(
      'SELECT nbKnown, nbForgotten, nbLearnt FROM Stats WHERE date=?;',
      [date],
    );
  } catch (error) {
    console.error(error);
  }

  return {
    nbRevised: statsResult.nbKnown + statsResult.nbForgotten,
    nbKnown: statsResult.nbKnown,
    nbForgotten: statsResult.nbForgotten,
    nbLearnt: statsResult.nbLearnt,
  };
};
