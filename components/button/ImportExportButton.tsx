import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';

interface BackButtonProps {
  color: string;
}

export function ImportExportButton({ color }: BackButtonProps) {
  return (
    <TouchableOpacity onPress={() => console.log('import')}>
      <MaterialIcons name="import-export" size={40} color={color} />
    </TouchableOpacity>
  );
}
