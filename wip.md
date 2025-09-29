# Paramètre d'alternance recto/verso placé sur le deck

## Éléments à modifier

#### Types

+ Ajouter paramètre *changeSide* sur **DeckType**
+ Passer *changeSide* en optionnel sur **CardType**

#### Interface

- Dans les paramètres du deck, ajouter une checkbox pour le paramètre *changeSide*
- Dans les paramètres de la carte, mettre un système pour suivre le paramètre du deck ou override la valeur
- Dans les paramètres du deck, ajouter un bouton pour forcer toutes les cartes à suivre le paramètre du deck (avec pop-up de confirmation)

#### BDD

+ **getCardToRevise** doit récupérer le paramètre *changeSide* en fonction du deck si celui de la carte est null
+ **renameDeck** doit devenir **updateDeckInfo** pour pouvoir modifier aussi bien le titre du deck que le paramètre *changeSide*
+ **updateCardInfo** doit bien prendre en compte que *changeSide* peut être null
+ **setNullChangeSideOnAllCardsFromDeck**
+ **setRectoFirstOnDependantCardsFromDeck** pour mettre le *rectoFirst* des cartes du deck à 1 si elles ont un *changeSide* null et que le deck n'alterne plus les cartes

## Migration BDD

+ Ajouter colonne *changeSide* sur la table **deck**
+ Pouvoir mettre *changeSide* en null sur la table **card**
- Gérer la migration correctement, en plaçant à 1 la valeur de *changeSide* sur les decks existants

## Notes

L'attribut *changeSide* de **FlashCardType** ne doit pas devenir optionnel, car il sera toujours renseigné pour calculer lors de la prochaine révision quel côté affiché en premier (et donc modifier *rectoFirst*). C'est en fait les fonctions qui récupèrent les flashcards de la BDD qui s'occupent de remplir cet attribut, ce qui cache en quelque sorte le changement par rapport à avant.