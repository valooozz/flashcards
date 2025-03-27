import { StyleSheet, Text, View } from 'react-native';
import { Sizes } from '../../style/Sizes';

interface HeaderProps {
  level: number;
  text: string;
  color: string;
  underButton?: boolean;
}

export default function Header({
  level,
  text,
  color,
  underButton = false,
}: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text
        style={{
          ...styles[level],
          color: color,
          marginTop: underButton ? 24 : 0,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  1: {
    textAlign: 'left',
    fontSize: Sizes.font.large,
    fontFamily: 'JosefinSemiBold',
    marginBottom: 24,
  },
  2: {
    textAlign: 'left',
    fontSize: Sizes.font.medium,
    fontFamily: 'JosefinRegular',
    marginBottom: 16,
  },
  3: {
    textAlign: 'left',
    fontSize: Sizes.font.medium,
    fontFamily: 'JosefinSemiBold',
    marginBottom: 8,
  },
});
