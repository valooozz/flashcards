import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface ListCardElementProps {
    text: string;
    image?: string | null;
    light: boolean;
}

export function ListCardElement({ text, image, light }: ListCardElementProps) {

    return (
        text?.trim().length ? (
            <Text
                numberOfLines={1}
                // @ts-ignore
                variant='listCardText'
                style={{ ...styles.text, opacity: light ? 0.3 : 1 }}
            >
                {text}
            </Text>
        ) : image ? (
            <View style={styles.imageCell}>
                <Image
                    style={{ ...styles.avatar, opacity: light ? 0.3 : 1 }}
                    resizeMode="cover"
                    source={{ uri: image }}
                />
            </View>
        ) : (
            <View style={styles.imageCell} />
        )
    );
}

const styles = StyleSheet.create({
    text: {
        width: 120,
        textAlign: 'left',
        fontFamily: 'JosefinRegular',
    },
    imageCell: {
        width: 120,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    avatar: {
        width: 29,
        height: 29,
        borderRadius: 20,
        overflow: 'hidden',
    },
});
