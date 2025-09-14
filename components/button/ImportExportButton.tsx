import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSQLiteContext } from 'expo-sqlite';
import { TouchableOpacity } from 'react-native';
import { exportAllDecks } from '../../utils/database/deck/exportAllDecks.utils';
import { importDocument } from '../../utils/import/importDocument.utils';

interface ImportExportButtonProps {
  color: string;
}

export function ImportExportButton({ color }: ImportExportButtonProps) {
  const database = useSQLiteContext();

  return (
    <TouchableOpacity
      onPress={() => exportAllDecks(database)}
      onLongPress={() => importDocument(database, 'json')}
      testID="import-export-button"
    >
      <MaterialIcons name="import-export" size={40} color={color} />
    </TouchableOpacity>
  );
}
