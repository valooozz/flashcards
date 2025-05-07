import { SQLiteDatabase } from 'expo-sqlite';
import { NbCardsToReviseType } from '../../../../types/NbCardsToReviseType';

export const getNbCardsToReviseThisWeek = async (database: SQLiteDatabase) => {
  let nbCardsToRevise: NbCardsToReviseType[];

  try {
    nbCardsToRevise = await database.getAllAsync<NbCardsToReviseType>(
      `SELECT
            CASE
                WHEN nextRevision = date('now', '+1 day') THEN 'Demain'
                WHEN nextRevision = date('now', '+2 days') THEN 'Après-demain'
                WHEN nextRevision = date('now', '+3 days') THEN 'Dans trois jours'
                WHEN nextRevision = date('now', '+4 days') THEN 'Dans quatre jours'
                WHEN nextRevision = date('now', '+5 days') THEN 'Dans cinq jours'
                WHEN nextRevision = date('now', '+6 days') THEN 'Dans six jours'
                WHEN nextRevision = date('now', '+7 days') THEN 'Dans sept jours'
            END AS day,
            COUNT(*) AS nbCards
        FROM
            Card
        WHERE
            nextRevision BETWEEN date('now', '+1 day') AND date('now', '+7 days')
        GROUP BY
            day
        ORDER BY
            CASE
                WHEN day = 'Demain' THEN 1
                WHEN day = 'Après-demain' THEN 2
                WHEN day = 'Dans trois jours' THEN 3
                WHEN day = 'Dans quatre jours' THEN 4
                WHEN day = 'Dans cinq jours' THEN 5
                WHEN day = 'Dans six jours' THEN 6
                WHEN day = 'Dans sept jours' THEN 7
            END;`,
    );
  } catch (error) {
    console.log(error);
  }

  return nbCardsToRevise;
};
