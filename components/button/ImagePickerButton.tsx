import * as DocumentPicker from 'expo-document-picker';
import { TextInput } from 'react-native-paper';

interface ImagePickerButtonProps {
    imageUri: string | null;
    setImageUri: (uri: string | null) => void;
}

export function ImagePickerButton({
    imageUri,
    setImageUri
}: ImagePickerButtonProps) {
    const pickImage = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: ['image/*'], multiple: false, copyToCacheDirectory: true });
        if (result.canceled) return;
        const asset = result.assets?.[0];
        if (asset?.uri) {
            setImageUri(asset.uri);
        }
    };

    return (
        <TextInput.Icon icon={imageUri ? 'image-not-supported' : 'image'} onPress={imageUri ? () => setImageUri(null) : pickImage} />
    );
}
