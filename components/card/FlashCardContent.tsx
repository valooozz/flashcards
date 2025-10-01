import { Image, StyleSheet, Text, View } from 'react-native';
import { Sizes } from '../../style/Sizes';

interface FlashCardContentProps {
  text: string;
  image?: string | null;
  textColor: string;
}

export function FlashCardContent({
  text,
  image,
  textColor,
}: FlashCardContentProps) {

  return (
    <View style={styles.container}>
      {(() => {
        const hasText = Boolean(text && text.trim().length > 0);
        const hasImage = Boolean(image);
        if (hasImage && !hasText) {
          return (
            <Image
              style={styles.imageFull}
              resizeMode="contain"
              source={{ uri: image as string }}
            />
          );
        }
        return (
          <>
            {hasText ? (
              <Text adjustsFontSizeToFit style={{ ...styles.text, color: textColor }}>
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
        );
      })()}
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
    fontSize: Sizes.font.large,
    fontFamily: 'JosefinSemiBold',
    marginVertical: 'auto',
  },
});
