import { View, StyleSheet } from 'react-native';
import FloatingButton from '../../components/button/FloatingButton';
import { router } from 'expo-router';
import { Colors } from '../../style/Colors';
import Header1 from '../../components/text/Header1';
import { globalStyles } from '../../style/Styles';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Header1 text="Bibliothèque" color={Colors.library.main} />
      <FloatingButton
        icon="pluscircle"
        size={70}
        color={Colors.library.main}
        onPress={() => router.push('/modalCreateDeck')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.library.light,
  },
});
