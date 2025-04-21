export interface CardDocument {
  recto: string;
  verso: string;
  rectoFirst?: boolean;
  step?: number;
  nextRevision?: string;
  toLearn?: boolean;
  changeSide?: boolean;
}

export interface DeckDocument {
  deckName: string;
  cards: CardDocument[];
}
