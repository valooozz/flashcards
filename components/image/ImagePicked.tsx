import { Image, StyleSheet, View } from "react-native";

interface ImagePickedProps {
    imageUri: string | null;
}

export function ImagePicked({
    imageUri,
}: ImagePickedProps) {

    return imageUri ? (
        <View style={styles.container}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
        </View>
    ) : null
}

const styles = StyleSheet.create({
    container: {
        height: 160,
        marginTop: 8
    },
    image: {
        width: '100%',
        height: '100%'
    }
});