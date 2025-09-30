import { triToBi } from '../triToBi.utils';

describe('triToBi', () => {
    it('returns true when input is 2', () => {
        expect(triToBi(2)).toBe(true);
    });

    it('returns false when input is 0', () => {
        expect(triToBi(0)).toBe(false);
    });

    it('returns null for any other number', () => {
        expect(triToBi(1)).toBeNull();
        expect(triToBi(-1)).toBeNull();
        expect(triToBi(999)).toBeNull();
    });

    it('returns null for null value', () => {
        expect(triToBi(null)).toBeNull();
    });
});


