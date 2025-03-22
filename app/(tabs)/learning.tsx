import { View, StyleSheet } from 'react-native';
import { Colors } from '../../style/Colors';
import { globalStyles } from '../../style/Styles';
import Header1 from '../../components/text/Header1';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Header1 text="Apprentissage" color={Colors.learning.main} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.learning.light,
  },
});
