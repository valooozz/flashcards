export interface DeckType {
  id: number;
  name: string;
}

export interface CardType {
  id: number;
  recto: string;
  verso: string;
  deck: number;
  nextRevision: string;
}
