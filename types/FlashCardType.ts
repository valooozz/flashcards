export interface FlashCardType {
  id: number;
  recto: string;
  verso: string;
  name: string;
  rectoFirst: number;
  step: number;
  nextRevision: string;
  changeSide: number;
}
