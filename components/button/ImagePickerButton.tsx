import * as DocumentPicker from 'expo-document-picker';
import { Image, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useTranslation } from "../../hooks/useTranslation";
import { Header } from "../text/Header";
import { ButtonModal } from "./ButtonModal";

interface ImagePickerButtonProps {
    label?: string;
    imageUri: string | null;
    setImageUri: (uri: string | null) => void;
}

export function ImagePickerButton({ label, imageUri, setImageUri }: ImagePickerButtonProps) {
    const { t } = useTranslation();

    const pickImage = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: ['image/*'], multiple: false, copyToCacheDirectory: true });
        if (result.canceled) return;
        const asset = result.assets?.[0];
        if (asset?.uri) {
            setImageUri(asset.uri);
        }
    };

    return (
        <View style={{ marginTop: 8, rowGap: 8 }}>
            {label && <Header level={4} text={label} color={Colors.library.light.contrast} />}
            <View style={{ display: 'flex', flexDirection: 'row', columnGap: 8, alignItems: 'center' }}>
                <ButtonModal text={imageUri ? t('card.changeImage') : t('card.addImage')} onPress={pickImage} />
                {imageUri ? <ButtonModal text={t('card.removeImage')} onPress={() => setImageUri(null)} /> : null}
            </View>
            {imageUri ? (
                <View style={{ height: 160 }}>
                    <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
            ) : null}
        </View>
    );
}