import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { AddButton } from '../../components/button/AddButton';
import { BackButton } from '../../components/button/BackButton';
import { SettingsButton } from '../../components/button/SettingsButton';
import { ListCard } from '../../components/card/ListCard';
import { Header } from '../../components/text/Header';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { globalStyles } from '../../style/Styles';
import { CardType } from '../../types/CardType';
import { getCardsFromDeck } from '../../utils/database/card/get/getCardsFromDeck.utils';
import { logAllCards } from '../../utils/database/card/table/logAllCards.utils';
import { getNameDeckById } from '../../utils/database/deck/getNameDeckById.utils';
import { getNbCardsInDeck } from '../../utils/database/deck/getNbCardsInDeck.utils';

export default function Screen() {
  const [deckName, setDeckName] = useState<string>(null);
  const [cards, setCards] = useState<CardType[]>([]);
  const [nbCards, setNbCards] = useState<number>(0);
  const database = useSQLiteContext();

  const { idDeck } = useLocalSearchParams<{ idDeck: string }>();

  useFocusEffect(
    useCallback(() => {
      logAllCards(database);
      getNameDeckById(database, idDeck).then((nameResult) => {
        setDeckName(nameResult);
      });
      getCardsFromDeck(database, idDeck).then((cardsResult) => {
        setCards(cardsResult);
      });
      getNbCardsInDeck(database, idDeck).then((nbResult) => {
        setNbCards(nbResult);
      });
    }, [idDeck]),
  );

  return (
    <View style={styles.container}>
      <BackButton color={Colors.library.dark.contrast} />
      <SettingsButton
        color={Colors.library.dark.contrast}
        route={`/modalDeck?idDeck=${idDeck}`}
      />
      <Header
        level={1}
        text={deckName}
        color={Colors.library.dark.contrast}
        underButton={true}
      />
      <Header
        level={2}
        text={`Cartes (${nbCards})`}
        color={Colors.library.dark.contrast}
      />
      {cards.length > 0 ? (
        <FlatList
          data={cards}
          renderItem={({ item }) => <ListCard card={item} />}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.cardsDisplay}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.text}>
          Ce deck ne contient aucune carte. Clique sur le bouton + pour en
          ajouter !
        </Text>
      )}
      <AddButton
        icon="pluscircle"
        size={70}
        color={Colors.library.light.main}
        onPress={() => router.push(`/modalCard?idDeck=${idDeck}`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.page,
    backgroundColor: Colors.library.dark.main,
    paddingRight: 0,
    paddingBottom: 0,
  },
  cardsDisplay: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    rowGap: 8,
    flexGrow: 1,
    marginRight: 24,
    paddingBottom: 104,
  },
  text: {
    color: Colors.learning.dark.contrast,
    textAlign: 'center',
    fontSize: Sizes.font.small,
    fontFamily: 'JosefinRegular',
    marginTop: 80,
    marginRight: 24,
  },
});
