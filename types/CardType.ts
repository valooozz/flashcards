export interface CardType {
  id: number;
  recto: string;
  verso: string;
  deck: number;
  rectoFirst: number;
  step: number;
  nextRevision: string;
  toLearn: number;
  changeSide: number;
}
