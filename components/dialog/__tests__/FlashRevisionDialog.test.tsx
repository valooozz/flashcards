import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { FlashRevisionDialog } from '../FlashRevisionDialog';

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('FlashRevisionDialog', () => {
    const baseProps = {
        visible: true,
    } as const;

    it('renders base UI and handles cancel', () => {
        const hideDialog = jest.fn();
        const validate = jest.fn();

        const { getByText, getAllByText } = render(
            <PaperProvider>
                <FlashRevisionDialog
                    visible={baseProps.visible}
                    hideDialog={hideDialog}
                    validate={validate}
                />
            </PaperProvider>
        );

        // Base labels present
        expect(getByText('revision.chooseCards')).toBeTruthy();
        expect(getAllByText('revision.all')).toBeTruthy();
        expect(getByText('revision.number')).toBeTruthy();
        expect(getByText('revision.step')).toBeTruthy();
        expect(getByText('revision.chooseSide')).toBeTruthy();
        expect(getByText('revision.recto')).toBeTruthy();
        expect(getByText('revision.verso')).toBeTruthy();
        expect(getByText('revision.current')).toBeTruthy();
        expect(getByText('revision.random')).toBeTruthy();

        // Cancel closes
        fireEvent.press(getByText('common.cancel'));
        expect(hideDialog).toHaveBeenCalled();
    });

    it('selects options and validates with correct payload (number path)', () => {
        const hideDialog = jest.fn();
        const validate = jest.fn();

        const { getByText, getByDisplayValue } = render(
            <PaperProvider>
                <FlashRevisionDialog
                    visible={baseProps.visible}
                    hideDialog={hideDialog}
                    validate={validate}
                />
            </PaperProvider>
        );

        // Choose cardsToRevise = number
        fireEvent.press(getByText('revision.number'));

        // The numeric input appears with default '1'
        const input = getByDisplayValue('1');
        fireEvent.changeText(input, '5');

        // Choose learnt state = learnt
        fireEvent.press(getByText('revision.learnt'));

        // Choose revision side = verso
        fireEvent.press(getByText('revision.verso'));

        // Validate
        fireEvent.press(getByText('common.validate'));

        expect(validate).toHaveBeenCalledWith({
            cardsToRevise: 'number',
            cardsToReviseLearnt: 'learnt',
            revisionSide: 'verso',
            numberOfCards: 5,
            stepDelimiter: { above: false, step: 1 },
        });
    });

    it('selects options and validates with correct payload (step path, above)', () => {
        const hideDialog = jest.fn();
        const validate = jest.fn();

        const { getByText, getByDisplayValue } = render(
            <PaperProvider>
                <FlashRevisionDialog
                    visible={baseProps.visible}
                    hideDialog={hideDialog}
                    validate={validate}
                />
            </PaperProvider>
        );

        // Choose cardsToRevise = step, then choose 'above'
        fireEvent.press(getByText('revision.step'));
        fireEvent.press(getByText('revision.above'));

        // Step input appears with default '1'
        const stepInput = getByDisplayValue('1');
        fireEvent.changeText(stepInput, '3');

        // Choose notLearnt for coverage
        fireEvent.press(getByText('revision.notLearnt'));

        // Choose recto
        fireEvent.press(getByText('revision.recto'));

        // Validate
        fireEvent.press(getByText('common.validate'));

        expect(validate).toHaveBeenCalledWith({
            cardsToRevise: 'step',
            cardsToReviseLearnt: 'notLearnt',
            revisionSide: 'recto',
            numberOfCards: 1,
            stepDelimiter: { above: true, step: 3 },
        });
    });
});


