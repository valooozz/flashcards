import { SQLiteDatabase } from 'expo-sqlite';

export const getNbCardsToLearnInDeck = async (
  database: SQLiteDatabase,
  idDeck: number,
  onlyCardsToLearn: boolean = false
): Promise<number> => {
  let nbCardsResult: object = undefined;
  try {
    nbCardsResult = await database.getFirstAsync(
      `SELECT COUNT(*) 
        FROM Card 
        WHERE deck=? AND nextRevision IS NULL 
        ${onlyCardsToLearn ? 'AND toLearn=1' : ''}`,
      [idDeck],
    );
  } catch (error) {
    console.error('getNbCardsToLearnInDeck:', error);
  }

  return nbCardsResult['COUNT(*)'];
};
