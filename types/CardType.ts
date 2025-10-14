export interface CardType {
  id: number;
  recto: string;
  verso: string;
  rectoImage?: string | null;
  versoImage?: string | null;
  deck: number;
  rectoFirst: number;
  step: number;
  nextRevision: string;
  toLearn: number;
  changeSide?: number;
  name?: string;
}
