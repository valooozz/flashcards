import { SQLiteDatabase } from 'expo-sqlite';
import { NbCardsToReviseType } from '../../../../types/NbCardsToReviseType';

export const getNbCardsToReviseThisWeek = async (database: SQLiteDatabase) => {
  let nbCardsToRevise: NbCardsToReviseType[];

  try {
    nbCardsToRevise = await database.getAllAsync<NbCardsToReviseType>(
      `SELECT
            CAST(julianday(nextRevision) - julianday(date('now')) AS INTEGER) AS daysFromToday,
            COUNT(*) AS nbCards
        FROM
            Card
        WHERE
            nextRevision BETWEEN date('now', '+1 day') AND date('now', '+7 days')
        GROUP BY
            daysFromToday
        ORDER BY
            daysFromToday;`,
    );
  } catch (error) {
    console.log(error);
  }

  console.log(nbCardsToRevise);

  return nbCardsToRevise;
};
