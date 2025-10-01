# Insertion d'une image sur une carte

## Éléments à modifier

#### Types

Ajout des attributs *rectoImage* et *versoImage* dans les types suivants :
+ CardType
+ FlashCardType
+ CardDocument

#### Interface

+ Insertion d'une image dans **modalCard**
+ Affichage correct de la **ListCard** avec un texte de remplacement s'il y a simplement une image, ou alors mettre l'image en tout petit

#### BDD

Ajout des colonnes *rectoImage* et *versoImage* dans la table **Card** :
+ Création
- Migration

+ **getCardsFromDeck**
+ **getFlashCardsFromDeck**
+ **createCard**
+ **updateCardInfo**


#### Autre

- Gérer l'import et l'export
+ Pouvoir stocker convenablement les images

## Notes