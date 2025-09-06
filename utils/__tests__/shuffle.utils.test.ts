import { shuffle } from '../shuffle.utils';
import { FlashCardType } from '../../types/FlashCardType';

const makeCard = (id: number): FlashCardType => ({
    id,
    recto: `r${id}`,
    verso: `v${id}`,
    name: `card${id}`,
    rectoFirst: 1,
    step: 0,
    nextRevision: '2023-01-01',
    changeSide: 0,
});

describe('shuffle', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('shuffles array in place using Fisher-Yates algorithm (deterministic mock)', () => {
        const cards = [makeCard(1), makeCard(2), makeCard(3), makeCard(4)];

        // For i = 3,2,1 choose j sequence via Math.random
        // i=3: floor(r*4) => 0; i=2: floor(r*3) => 2; i=1: floor(r*2) => 0
        jest
            .spyOn(Math, 'random')
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0.9)
            .mockReturnValueOnce(0.4);

        const result = shuffle(cards);

        expect(result).toBeUndefined();
        // Expected order after swaps: [2,4,3,1]
        expect(cards.map(c => c.id)).toEqual([2, 4, 3, 1]);
    });

    it('preserves the same elements (permutation)', () => {
        const original = [makeCard(1), makeCard(2), makeCard(3)];
        const copy = [...original];

        // Force a non-trivial shuffle
        jest
            .spyOn(Math, 'random')
            .mockReturnValueOnce(0.99) // i=2 -> j=2
            .mockReturnValueOnce(0.6); // i=1 -> j=1

        shuffle(copy);

        const sortedIds = (arr: FlashCardType[]) => arr.map(c => c.id).sort((a, b) => a - b);
        expect(sortedIds(copy)).toEqual(sortedIds(original));
    });
});
