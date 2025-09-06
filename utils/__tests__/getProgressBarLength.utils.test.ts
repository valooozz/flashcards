import { getProgressBarLength } from '../getProgressBarLength';

describe('getProgressBarLength', () => {
    it('returns 0 for step 0', () => {
        expect(getProgressBarLength(0)).toBe(0);
    });

    it('returns 12.5 for step 1', () => {
        expect(getProgressBarLength(1)).toBe(12.5);
    });

    it('returns 50 for step 4', () => {
        expect(getProgressBarLength(4)).toBe(50);
    });

    it('returns 100 for step 8', () => {
        expect(getProgressBarLength(8)).toBe(100);
    });
});
