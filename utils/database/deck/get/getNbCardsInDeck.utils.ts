import { SQLiteDatabase } from 'expo-sqlite';

export const getNbCardsInDeck = async (
  database: SQLiteDatabase,
  idDeck: number,
): Promise<number> => {
  let nbCardsResult: object;
  try {
    nbCardsResult = await database.getFirstAsync(
      'SELECT COUNT(*) FROM Card WHERE deck=?',
      [idDeck],
    );
  } catch (error) {
    console.error('getNbCardsInDeck:', error, idDeck);
  }

  return nbCardsResult['COUNT(*)'];
};
