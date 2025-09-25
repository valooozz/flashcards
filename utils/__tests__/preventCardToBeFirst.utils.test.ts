import { preventCardToBeFirst } from '../preventCardToBeFirst.utils';
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

describe('preventCardToBeFirst', () => {
    it('returns same array when length is 0', () => {
        const list: FlashCardType[] = [];
        const card = makeCard(1);
        const result = preventCardToBeFirst(card, list);
        expect(result).toBe(list);
        expect(result).toEqual([]);
    });

    it('returns same array when length is 1', () => {
        const list = [makeCard(1)];
        const card = list[0];
        const result = preventCardToBeFirst(card, list);
        expect(result).toBe(list);
        expect(result.map(c => c.id)).toEqual([1]);
    });

    it('returns same array when first item does not matche the given card', () => {
        const list = [makeCard(2), makeCard(3), makeCard(4)];
        const card = list[1];
        const result = preventCardToBeFirst(card, list);
        expect(result).toBe(list);
        expect(result.map(c => c.id)).toEqual([2, 3, 4]);
    });

    it('moves the first item to the end when it matches the given card', () => {
        const list = [makeCard(10), makeCard(11), makeCard(12)];
        const card = list[0];
        const result = preventCardToBeFirst(card, list);
        expect(result).not.toBe(list);
        expect(result.map(c => c.id)).toEqual([11, 12, 10]);
    });
});


