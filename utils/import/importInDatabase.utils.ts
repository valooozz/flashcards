import { SQLiteDatabase } from 'expo-sqlite';
import { DeckDocument } from '../../types/DeckDocument';
import { importDecks } from '../database/deck/importDecks.utils';
import { notify } from '../notify.utils';

export const importInDatabase = async (
  database: SQLiteDatabase,
  decksDocument: DeckDocument[],
) => {
  const allDecksAdded = await importDecks(database, decksDocument);
  notify(
    allDecksAdded,
    "Certains decks existaient déjà et n'ont pas pu être ajoutés",
    'Decks ajoutés',
  );
};
