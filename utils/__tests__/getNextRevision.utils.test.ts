import { getNextRevision } from '../getNextRevision.utils';
import { getDate } from '../getDate.utils';

jest.mock('../getDate.utils', () => ({
    getDate: jest.fn(),
}));

describe('getNextRevision', () => {
    beforeEach(() => {
        (getDate as jest.Mock).mockReset();
    });

    it('uses the interval at the given step and returns the date', () => {
        (getDate as jest.Mock).mockReturnValue('2023-05-11');

        const intervals = [0, 1, 3, 7];
        const result = getNextRevision(intervals, 2);

        expect(getDate).toHaveBeenCalledWith(3);
        expect(result).toBe('2023-05-11');
    });

    it('works for step 0', () => {
        (getDate as jest.Mock).mockReturnValue('2023-05-10');

        const intervals = [0, 2, 4];
        const result = getNextRevision(intervals, 0);

        expect(getDate).toHaveBeenCalledWith(0);
        expect(result).toBe('2023-05-10');
    });
});
