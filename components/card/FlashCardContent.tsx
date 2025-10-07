import { Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface FlashCardContentProps {
  text: string;
  image?: string | null;
}

export function FlashCardContent({
  text,
  image,
}: FlashCardContentProps) {

  const hasText = Boolean(text && text.trim().length > 0);
  const hasImage = Boolean(image);

  return (
    <View style={styles.container}>
      {(hasImage && !hasText) ? (
        <Image
          style={styles.imageFull}
          resizeMode="contain"
          source={{ uri: image as string }}
        />
      ) : (
        <>
          {hasText ? (
            <Text variant='displaySmall' style={styles.text}>
              {text}
            </Text>
          ) : null}
          {hasImage ? (
            <Image
              style={styles.imagePartial}
              resizeMode="contain"
              source={{ uri: image as string }}
            />
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFull: {
    width: '100%',
    height: '95%',
  },
  imagePartial: {
    width: '100%',
    flex: 1,
    marginTop: 8,
  },
  text: {
    textAlign: 'center',
  }
});
