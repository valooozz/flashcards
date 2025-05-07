import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const exportDocument = async (document: object, fileName: string) => {
  const stringDocument = JSON.stringify(document);
  const exportPath = FileSystem.cacheDirectory + fileName + '.json';

  await FileSystem.writeAsStringAsync(exportPath, stringDocument);

  await Sharing.shareAsync(exportPath);
};
