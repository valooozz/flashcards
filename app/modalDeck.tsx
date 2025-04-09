import { router, Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';
import { ButtonModal } from '../components/button/ButtonModal';
import { Header } from '../components/text/Header';
import { Input } from '../components/text/Input';
import { Colors } from '../style/Colors';
import { globalStyles } from '../style/Styles';
import { createDeck } from '../utils/database/deck/createDeck.utils';

export default function Modal() {
  const [deckName, setDeckName] = useState('');

  const database = useSQLiteContext();

  const handleValidate = async () => {
    const creationOk = await createDeck(database, deckName);
    if (creationOk) {
      router.back();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Un deck porte déjà ce nom.',
        visibilityTime: 2000,
      });
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ title: 'Nouveau deck', headerShown: false }} />
      <Header
        level={1}
        text="Nouveau Deck"
        color={Colors.library.light.contrast}
      />
      <View style={styles.container}>
        <Header
          level={3}
          text="Nom du deck"
          color={Colors.library.light.contrast}
        />
        <Input text={deckName} setText={setDeckName} />
        <View style={styles.buttonContainer}>
          <ButtonModal text="Annuler" onPress={() => router.back()} />
          <ButtonModal text="Valider" onPress={handleValidate} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...globalStyles.page,
    backgroundColor: Colors.library.light.main,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});
