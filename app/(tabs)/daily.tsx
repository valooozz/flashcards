import { useSQLiteContext } from 'expo-sqlite';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../components/text/Header';
import { Colors } from '../../style/Colors';
import { globalStyles } from '../../style/Styles';
import { dropTableCard } from '../../utils/database/card/dropTableCard.utils';
import { emptyTableCard } from '../../utils/database/card/emptyTableCard.utils';
import { emptyTableDeck } from '../../utils/database/deck/emptyTableDeck.utils';

export default function Tab() {
  const database = useSQLiteContext();

  return (
    <View style={styles.container}>
      <Header level={1} text="Révisions" color={Colors.daily.dark.text} />
      <TouchableOpacity
        style={{ backgroundColor: 'green' }}
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
      <TouchableOpacity
        style={{ backgroundColor: 'green' }}
        onPress={() => dropTableCard(database)}
      >
        <Text style={{ fontSize: 30, textAlign: 'center' }}>
          Supprimer la table Card
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.daily.dark.background,
  },
});
