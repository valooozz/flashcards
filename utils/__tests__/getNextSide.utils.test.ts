import { getNextSide } from '../getNextSide.utils';

describe('getNextSide', () => {
    it('toggles side when changeSide is truthy', () => {
        expect(getNextSide(0, 1)).toBe(1);
        expect(getNextSide(1, 1)).toBe(0);
        expect(getNextSide(0, -5)).toBe(1);
        expect(getNextSide(1, 42)).toBe(0);
    });

    it('returns 1 when changeSide is falsy', () => {
        expect(getNextSide(0, 0)).toBe(1);
        expect(getNextSide(1, 0)).toBe(1);
    });
});
