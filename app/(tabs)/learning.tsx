import { View, StyleSheet } from 'react-native';
import { Colors } from '../../style/Colors';
import { globalStyles } from '../../style/Styles';
import Header from '../../components/text/Header';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Header
        level={1}
        text="Apprentissage"
        color={Colors.learning.dark.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.learning.dark.background,
  },
});
