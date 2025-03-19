import { View, StyleSheet } from 'react-native';
import FloatingButton from '../../components/FloatingButton';
import { router } from 'expo-router';
import { Colors } from '../../style/Colors';

export default function Tab() {
  return (
    <View style={styles.container}>
      <FloatingButton
        icon="pluscircleo"
        size={70}
        color={Colors.primary.main}
        onPress={() => router.push('/modalCreateDeck')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary.light,
  },
});
