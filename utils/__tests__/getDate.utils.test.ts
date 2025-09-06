import { getDate } from '../getDate.utils';

describe('getDate', () => {
    const base = new Date('2023-05-10T12:34:56.000Z');

    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(base);
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('returns today in YYYY-MM-DD', () => {
        expect(getDate(0)).toBe('2023-05-10');
    });

    it('returns tomorrow when n = 1', () => {
        expect(getDate(1)).toBe('2023-05-11');
    });

    it('returns yesterday when n = -1', () => {
        expect(getDate(-1)).toBe('2023-05-09');
    });
});
