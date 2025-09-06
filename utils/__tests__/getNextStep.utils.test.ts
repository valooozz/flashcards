import { getNextStep } from '../getNextStep.utils';

describe('getNextStep', () => {
    it('increments the step when below 8', () => {
        expect(getNextStep(0)).toBe(1);
        expect(getNextStep(3)).toBe(4);
        expect(getNextStep(7)).toBe(8);
    });

    it('caps at 8 when step is 8', () => {
        expect(getNextStep(8)).toBe(8);
    });

    it('caps at 8 when step is above 8', () => {
        expect(getNextStep(9)).toBe(8);
        expect(getNextStep(42)).toBe(8);
    });
});
