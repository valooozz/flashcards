import { SQLiteDatabase } from 'expo-sqlite';
import { setRectoFirstOnDependantCardsFromDeck } from '../../card/update/setRectoFirstOnDependantCardsFromDeck.utils';

export const updateDeckInfo = async (
  database: SQLiteDatabase,
  id: string,
  name: string,
  changeSide: boolean,
): Promise<boolean> => {
  if (!changeSide) {
    setRectoFirstOnDependantCardsFromDeck(database, id);
  }

  return database
    .runAsync('UPDATE Deck SET name=?, changeSide=? WHERE id=?', [name.trim(), Number(changeSide), id])
    .then(() => true)
    .catch(() => false);
};
