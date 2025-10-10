import { SQLiteDatabase } from 'expo-sqlite';
import { readString } from 'react-native-csv';
import { DeckDocument } from '../../types/DeckDocument';
import { importInDatabase } from './importInDatabase.utils';

export const importCsvDocument = async (
  database: SQLiteDatabase,
  fileName: string,
  fileContent: string,
): Promise<boolean> => {
  const pairs = readString(fileContent);
  const deckDocument: DeckDocument = {
    deckName: fileName,
    changeSide: true,
    showName: true,
    cards: [],
  };

  pairs.data.forEach((pair) => {
    deckDocument.cards.push({
      recto: pair[0],
      verso: pair[1],
      rectoImage: pair[2] ?? null,
      versoImage: pair[3] ?? null,
    });
  });

  return await importInDatabase(database, [deckDocument]);
};
