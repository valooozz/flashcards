import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ImportExportType } from '../../types/ImportExportType';

export const exportDocument = async (document: object | string, fileName: string, extension: ImportExportType) => {
  const stringDocument = typeof(document) === 'object' ? JSON.stringify(document) : document;
  const exportPath = FileSystem.cacheDirectory + fileName + '.' + extension;

  await FileSystem.writeAsStringAsync(exportPath, stringDocument);

  await Sharing.shareAsync(exportPath);
};
