import { isLastItem } from '../isLastItem.utils';
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

describe('isLastItem', () => {
    it('returns true when the card is the last in the list', () => {
        const list = [makeCard(1), makeCard(2), makeCard(3)];
        expect(isLastItem(list[2], list)).toBe(true);
    });

    it('returns false when the card is not the last in the list', () => {
        const list = [makeCard(1), makeCard(2), makeCard(3)];
        expect(isLastItem(list[0], list)).toBe(false);
        expect(isLastItem(list[1], list)).toBe(false);
    });

    it('returns true for a single-item list', () => {
        const list = [makeCard(99)];
        expect(isLastItem(list[0], list)).toBe(true);
    });
});
