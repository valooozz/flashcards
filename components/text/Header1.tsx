import { StyleSheet, Text, View } from 'react-native';

interface Header1Props {
  text: string;
  color: string;
}

export default function Header1({ text, color }: Header1Props) {
  return (
    <View style={styles.container}>
      <Text style={{ ...styles.text, color: color }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text: {
    textAlign: 'left',
    fontSize: 40,
    fontWeight: 'bold',
  },
});
