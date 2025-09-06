import { getPreviousStep } from '../getPreviousStep.utils';

describe('getPreviousStep', () => {
    it('decrements the step when above 0', () => {
        expect(getPreviousStep(1)).toBe(0);
        expect(getPreviousStep(5)).toBe(4);
    });

    it('floors at 0 when step is 0', () => {
        expect(getPreviousStep(0)).toBe(0);
    });

    it('floors at 0 when step is below 0', () => {
        expect(getPreviousStep(-3)).toBe(0);
    });
});
