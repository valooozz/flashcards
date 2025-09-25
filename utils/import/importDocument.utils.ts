import * as FileSystem from 'expo-file-system';
import { SQLiteDatabase } from 'expo-sqlite';
import { importCsvDocument } from './importCsvDocument.utils';
import { importJsonDocument } from './importJsonDocument.utils';
import { pickDocument } from './pickDocument.utils';
import { ImportExportType } from '../../types/ImportExportType';

export const importDocument = async (
  database: SQLiteDatabase,
  importType: ImportExportType,
) => {
  const file = await pickDocument(importType);
  if (file === null) {
    return;
  }

  const fileContent = await FileSystem.readAsStringAsync(file.assets[0].uri);
  if (fileContent === '') {
    return;
  }

  if (importType === 'json') {
    await importJsonDocument(database, fileContent);
  } else if (importType === 'csv') {
    await importCsvDocument(
      database,
      file.assets[0].name.slice(0, -4),
      fileContent,
    );
  }
};
