import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import { StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from '../../style/Colors';

interface ImagePickerButtonProps {
    imageUri: string | null;
    setImageUri: (uri: string | null) => void;
    backgroundColor?: string;
    color?: string;
}

export function ImagePickerButton({
    imageUri,
    setImageUri,
    backgroundColor = Colors.library.dark.main,
    color = Colors.library.dark.contrast
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
        <TouchableOpacity style={{ ...styles.button, backgroundColor }} onPress={imageUri ? () => setImageUri(null) : pickImage}>
            <MaterialIcons name={imageUri ? 'hide-image' : 'image'} size={40} color={color} style={styles.icon} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'red',
        paddingHorizontal: 8,
    },
    icon: {
        marginVertical: 'auto',
    }
});