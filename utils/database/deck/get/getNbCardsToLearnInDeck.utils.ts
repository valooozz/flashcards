import { SQLiteDatabase } from 'expo-sqlite';

export const getNbCardsToLearnInDeck = async (
  database: SQLiteDatabase,
  idDeck: number,
): Promise<number> => {
  let nbCardsResult: object = undefined;
  try {
    nbCardsResult = await database.getFirstAsync(
      'SELECT COUNT(*) FROM Card WHERE deck=? AND nextRevision IS NULL',
      [idDeck],
    );
  } catch (error) {
    console.error(error);
  }

  return nbCardsResult['COUNT(*)'];
};
