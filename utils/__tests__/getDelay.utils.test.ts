import { getDelay } from '../getDelay.utils';

describe('getDelay', () => {
    it('returns 0 for today', () => {
        const today = new Date().toISOString();
        const result = getDelay(today);
        expect(result).toBe(0);
    });

    it('returns positive number of days for past dates', () => {
        const past = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
        const result = getDelay(past);
        expect(result).toBeGreaterThanOrEqual(3);
    });

    it('returns negative number of days for future dates', () => {
        const future = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
        const result = getDelay(future);
        expect(result).toBeLessThanOrEqual(-5);
    });
});
