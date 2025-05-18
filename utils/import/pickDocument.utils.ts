import * as DocumentPicker from 'expo-document-picker';

export const pickDocument = async (
  importType: 'json' | 'csv',
): Promise<DocumentPicker.DocumentPickerResult> => {
  // const documentType = importType === 'json' ? 'application/json' : 'text/csv';
  const result = await DocumentPicker.getDocumentAsync({
    // type: documentType,
    multiple: false,
  });

  if (!result.canceled) {
    return result;
  }
};
