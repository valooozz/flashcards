import { biToTri } from '../biToTri.utils';

describe('biToTri', () => {
    it('returns 2 when input is 1', () => {
        expect(biToTri(1)).toBe(2);
    });

    it('returns 0 when input is 0', () => {
        expect(biToTri(0)).toBe(0);
    });

    it('returns 1 for any other number', () => {
        expect(biToTri(-1)).toBe(1);
        expect(biToTri(2)).toBe(1);
        expect(biToTri(999)).toBe(1);
    });

    it('returns 1 for null value', () => {
        expect(biToTri(null)).toBe(1);
    })
});


