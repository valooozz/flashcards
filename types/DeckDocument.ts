export interface CardDocument {
  recto: string;
  verso: string;
  rectoImage?: string | null;
  versoImage?: string | null;
  rectoFirst?: boolean;
  step?: number;
  nextRevision?: string;
  toLearn?: boolean;
  changeSide?: boolean;
}

export interface DeckDocument {
  deckName: string;
  cards: CardDocument[];
  changeSide: boolean;
  showName: boolean;
}
