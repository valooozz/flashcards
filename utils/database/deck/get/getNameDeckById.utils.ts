import { SQLiteDatabase } from 'expo-sqlite';

export const getNameDeckById = async (
  database: SQLiteDatabase,
  idDeck: string,
) => {
  let deckNameResult: object = undefined;
  try {
    deckNameResult = await database.getFirstAsync<object>(
      'SELECT name FROM Deck WHERE id=?;',
      idDeck,
    );
  } catch (error) {
    console.error(error);
  }

  return deckNameResult['name'];
};
