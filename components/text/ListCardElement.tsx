import { Image, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';

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
        fontSize: Sizes.font.small,
        color: Colors.library.simple.contrast,
        textAlign: 'left',
        fontFamily: 'JosefinRegular',
    },
    imageCell: {
        width: 120,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
});
