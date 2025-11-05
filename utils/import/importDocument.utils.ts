import { Directory, File, Paths } from 'expo-file-system';
import { SQLiteDatabase } from 'expo-sqlite';
import JSZip from 'jszip';
import { ImportExportType } from '../../types/ImportExportType';
import { importCsvDocument } from './importCsvDocument.utils';
import { importInDatabase } from './importInDatabase.utils';
import { importJsonDocument } from './importJsonDocument.utils';
import { pickDocument } from './pickDocument.utils';

export const importDocument = async (
  database: SQLiteDatabase,
  importType: ImportExportType,
): Promise<boolean> => {
  const picked = await pickDocument(importType);
  if (!picked) return false;

  let uri = picked.assets[0].uri;
  const name = picked.assets[0].name || '';
  const lower = name.toLowerCase();

  const file = new File(uri);
  const copiedFile = new File(Paths.cache, name);
  copiedFile.delete();
  file.copy(copiedFile);

  // Gestion des bundles .flipo ou .zip
  if (lower.endsWith('.flipo') || lower.endsWith('.zip')) {
    const destDir = new Directory(Paths.cache, `flipo_import_${Date.now()}`);
    destDir.create({ intermediates: true });

    const archiveBase64 = copiedFile.base64(); // Lecture en base64
    const zip = await JSZip.loadAsync(archiveBase64, { base64: true });

    const writePromises: Promise<void>[] = [];

    zip.forEach((relativePath, zipEntry) => {
      const outPath = `${destDir.uri}${relativePath}`;
      if (zipEntry.dir) {
        writePromises.push((async () => {
          new Directory(outPath).create({ intermediates: true });
        })());
      } else {
        writePromises.push((async () => {
          const folder = outPath.substring(0, outPath.lastIndexOf('/') + 1);
          if (folder) {
            new Directory(folder).create({ intermediates: true });
          }
          const contentBase64 = await zipEntry.async('base64');
          const outFile = new File(outPath);
          outFile.write(contentBase64, { encoding: 'base64' });
        })());
      }
    });

    await Promise.all(writePromises);

    const jsonFile = new File(`${destDir.uri}deck.json`);
    if (!(jsonFile.exists)) return false;

    const jsonContent = await jsonFile.text();
    const decks = JSON.parse(jsonContent);

    for (const deck of decks) {
      for (const card of deck.cards) {
        if (card.rectoImage && !card.rectoImage.startsWith('data:')) {
          card.rectoImage = `${destDir.uri}${card.rectoImage}`;
        }
        if (card.versoImage && !card.versoImage.startsWith('data:')) {
          card.versoImage = `${destDir.uri}${card.versoImage}`;
        }
      }
    }

    return await importInDatabase(database, decks);
  }

  // Import JSON ou CSV
  const fileContent = await copiedFile.text();
  if (!fileContent) return false;

  if (importType === 'json') {
    return await importJsonDocument(database, fileContent);
  } else if (importType === 'csv') {
    return await importCsvDocument(database, name.slice(0, -4), fileContent);
  }

  return false;
};
