import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { DeckDocument } from '../../types/DeckDocument';
import { exportAllDecks } from '../../utils/database/deck/exportAllDecks.utils';
import { importDecks } from '../../utils/database/deck/importDecks.utils';
import { notify } from '../../utils/notify.utils';

interface BackButtonProps {
  color: string;
}

export function ImportExportButton({ color }: BackButtonProps) {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');

  const database = useSQLiteContext();

  useEffect(() => {
    if (fileContent === '') {
      return;
    }

    const decksDocument: DeckDocument[] = JSON.parse(fileContent);
    importDecks(database, decksDocument).then((allDecksAdded) => {
      notify(
        allDecksAdded,
        "Certains decks existaient déjà et n'ont pas pu être ajoutés",
        'Decks ajoutés',
      );
    });
  }, [fileContent]);

  useEffect(() => {
    if (file === null) {
      return;
    }

    FileSystem.readAsStringAsync(file.assets[0].uri)
      .then((fileRead) => setFileContent(fileRead))
      .catch((error) => console.log(error));
  }, [file]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        multiple: false,
      });

      if (result.canceled) {
      } else {
        setFile(result);
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => exportAllDecks(database)}
      onLongPress={pickDocument}
    >
      <MaterialIcons name="import-export" size={40} color={color} />
    </TouchableOpacity>
  );
}
