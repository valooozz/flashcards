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

  const newChangeSide = changeSide === null ? null : Number(changeSide);

  return database
    .runAsync('UPDATE Deck SET name=?, changeSide=? WHERE id=?', [name.trim(), newChangeSide, id])
    .then(() => true)
    .catch((err) => { console.log(err); return false; });
};
