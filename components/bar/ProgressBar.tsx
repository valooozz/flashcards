import { DimensionValue, View } from 'react-native';

interface ProgressBarProps {
  width: DimensionValue;
  color: string;
}

export function ProgressBar({ width, color }: ProgressBarProps) {
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
