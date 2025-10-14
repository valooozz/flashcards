import * as FileSystem from 'expo-file-system';
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
  const file = await pickDocument(importType);
  if (file === null) {
    return;
  }

  const uri = file.assets[0].uri;
  const name = file.assets[0].name || '';
  const lower = name.toLowerCase();

  // If it's a flipo bundle, read zip in-memory and extract deck.json + images
  if (lower.endsWith('.flipo') || lower.endsWith('.zip')) {
    const destDir = `${FileSystem.cacheDirectory}flipo_import_${Date.now()}/`;
    await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });

    // Read archive and extract with JSZip
    const archiveBase64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const zip = await JSZip.loadAsync(archiveBase64, { base64: true });

    // Extract all files, preserving folder structure
    const writePromises: Promise<void>[] = [];
    zip.forEach((relativePath, file) => {
      const outPath = `${destDir}${relativePath}`;
      if (file.dir) {
        writePromises.push(FileSystem.makeDirectoryAsync(outPath, { intermediates: true }));
      } else {
        const folder = outPath.substring(0, outPath.lastIndexOf('/') + 1);
        writePromises.push((async () => {
          if (folder) {
            await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
          }
          const contentBase64 = await file.async('base64');
          await FileSystem.writeAsStringAsync(outPath, contentBase64, { encoding: FileSystem.EncodingType.Base64 });
        })());
      }
    });
    await Promise.all(writePromises);

    const jsonPath = `${destDir}deck.json`;
    const exists = await FileSystem.getInfoAsync(jsonPath);
    if (!exists.exists) {
      return false;
    }
    const jsonContent = await FileSystem.readAsStringAsync(jsonPath);
    // For bundled imports, images are relative paths within destDir; rewrite to absolute paths
    const decks = JSON.parse(jsonContent);
    for (const deck of decks) {
      let idx = 0;
      for (const card of deck.cards) {
        if (card.rectoImage && !card.rectoImage.startsWith('data:')) {
          card.rectoImage = `${destDir}${card.rectoImage}`;
        }
        if (card.versoImage && !card.versoImage.startsWith('data:')) {
          card.versoImage = `${destDir}${card.versoImage}`;
        }
        idx += 1;
      }
    }
    return await importInDatabase(database, decks);
  }

  const fileContent = await FileSystem.readAsStringAsync(uri);
  if (fileContent === '') {
    return;
  }

  if (importType === 'json') {
    return await importJsonDocument(database, fileContent);
  } else if (importType === 'csv') {
    return await importCsvDocument(
      database,
      file.assets[0].name.slice(0, -4),
      fileContent,
    );
  }
};
