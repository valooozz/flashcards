import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../style/Colors';
import { Radius } from '../../style/Radius';
import { Sizes } from '../../style/Sizes';

interface DeckProgressBarProps {
  progress: number;
  color: string;
}

export function DeckProgressBar({ progress, color }: DeckProgressBarProps) {
  return progress ? (
    <View style={styles.container} testID="deck-progress-bar">
      <View
        style={{
          ...styles.bar,
          width: '100%',
          backgroundColor: Colors.daily.simple.main,
          justifyContent: 'flex-start',
        }}
        testID="deck-progress-bar-background"
      >
        {progress < 30 && (
          <Text
            style={{
              ...styles.text,
              color: Colors.library.simple.contrast,
              marginLeft: `${progress + 2}%`,
            }}
          >
            {`${progress} %`}
          </Text>
        )}
      </View>
      <View
        style={{
          ...styles.bar,
          width: `${progress}%`,
          backgroundColor: color,
          position: 'absolute',
          justifyContent: 'center',
        }}
        testID="deck-progress-bar-foreground"
      >
        {progress >= 30 && (
          <Text
            style={{
              ...styles.text,
              color: Colors.library.intermediate.contrast,
            }}
          >
            {`${progress} %`}
          </Text>
        )}
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    marginRight: 24,
  },
  bar: {
    height: 40,
    borderRadius: Radius.small,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
  },
});
