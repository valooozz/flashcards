export interface FlashCardType {
  id: number;
  recto: string;
  verso: string;
  rectoImage?: string | null;
  versoImage?: string | null;
  name: string;
  rectoFirst: number;
  step: number;
  nextRevision: string;
  changeSide: number;
}
