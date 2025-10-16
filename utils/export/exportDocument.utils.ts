import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ImportExportType } from '../../types/ImportExportType';

export const exportDocument = async (
  document: object | string,
  fileName: string,
  extension: ImportExportType
) => {
  const stringDocument =
    typeof document === 'object' ? JSON.stringify(document) : document;

  // Crée le fichier dans le répertoire cache
  const exportFile = new File(Paths.cache, `${fileName}.${extension}`);

  // Écrit le contenu (UTF-8 par défaut)
  await exportFile.write(stringDocument);

  // Partage le fichier via le module système
  await Sharing.shareAsync(exportFile.uri);
};
