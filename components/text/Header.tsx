import { StyleSheet, Text } from 'react-native';
import { Sizes } from '../../style/Sizes';

interface HeaderProps {
  level: number;
  text: string;
  color: string;
}

export function Header({ level, text, color }: HeaderProps) {
  return (
    <Text
      style={{
        ...styles[level],
        color: color,
      }}
    >
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  1: {
    textAlign: 'left',
    fontSize: Sizes.font.large,
    fontFamily: 'JosefinSemiBold',
    marginBottom: 24,
    marginRight: 24,
    flexWrap: 'wrap',
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
