import { SQLiteDatabase } from 'expo-sqlite';

export const getNbCardsInDeck = async (
  database: SQLiteDatabase,
  idDeck: number,
) => {
  let nbCardsResult: object = undefined;
  try {
    nbCardsResult = await database.getFirstAsync(
      'SELECT COUNT(*) FROM Card WHERE deck=?',
      [idDeck],
    );
  } catch (error) {
    console.error(error);
  }

  return nbCardsResult['COUNT(*)'];
};
