import { formatDate } from "../formatDate.utils";

describe('formatDate', () => {
    it('should format a standard ISO date string', () => {
        expect(formatDate('2023-06-15T12:34:56Z')).toBe('15/06/2023');
        expect(formatDate('2021-12-01')).toBe('01/12/2021');
    });

    it('should handle date strings without time', () => {
        expect(formatDate('1999-01-31')).toBe('31/01/1999');
    });

    it('should handle date strings with different months and days', () => {
        expect(formatDate('2000-02-29')).toBe('29/02/2000');
        expect(formatDate('2010-11-09')).toBe('09/11/2010');
    });
});
