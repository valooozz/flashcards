import { DimensionValue, View } from 'react-native';

interface CardProgressBarProps {
  width: DimensionValue;
  color: string;
}

export function CardProgressBar({ width, color }: CardProgressBarProps) {
  return (
    <View
      style={{
        height: 8,
        width: width,
        backgroundColor: color,
        borderTopRightRadius: width === '100%' ? 0 : 10,
        borderBottomRightRadius: width === '100%' ? 0 : 10,
      }}
    ></View>
  );
}
