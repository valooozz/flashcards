import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../../style/Colors';
import Header1 from '../../components/text/Header1';
import { globalStyles } from '../../style/Styles';
import { emptyTableDeck } from '../../utils/database/deck.utils';
import { useSQLiteContext } from 'expo-sqlite';
import { emptyTableCard } from '../../utils/database/card.utils';

export default function Tab() {
  const database = useSQLiteContext();

  return (
    <View style={styles.container}>
      <Header1 text="Révisions du jour" color={Colors.daily.main} />
      <TouchableOpacity
        style={{ backgroundColor: 'red' }}
        onPress={() => emptyTableDeck(database)}
      >
        <Text style={{ fontSize: 30, textAlign: 'center' }}>
          Vider la table Deck
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ backgroundColor: 'blue' }}
        onPress={() => emptyTableCard(database)}
      >
        <Text style={{ fontSize: 30, textAlign: 'center' }}>
          Vider la table Card
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.daily.light,
  },
});
