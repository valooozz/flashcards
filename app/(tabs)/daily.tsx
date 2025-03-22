import { View, StyleSheet } from 'react-native';
import { Colors } from '../../style/Colors';
import Header1 from '../../components/text/Header1';
import { globalStyles } from '../../style/Styles';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Header1 text="Révisions du jour" color={Colors.daily.main} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.daily.light,
  },
});
