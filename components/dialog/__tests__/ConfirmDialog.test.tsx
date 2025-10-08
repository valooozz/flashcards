import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { ConfirmDialog } from '../ConfirmDialog';

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('ConfirmDialog', () => {
    const defaultProps = {
        visible: true,
        actionVerb: 'Delete',
        element: 'deck',
    } as const;

    it('renders title and content with provided props', () => {
        const hideDialog = jest.fn();
        const onValidate = jest.fn();

        const { getByText } = render(
            <PaperProvider>
                <ConfirmDialog
                    visible={defaultProps.visible}
                    hideDialog={hideDialog}
                    actionVerb={defaultProps.actionVerb}
                    element={defaultProps.element}
                    onValidate={onValidate}
                />
            </PaperProvider>
        );

        // Title shows the action verb with a question mark
        expect(getByText('Delete ?')).toBeTruthy();

        // Content uses translation key and lowercased action verb
        expect(
            getByText(`dialog.confirm ${defaultProps.actionVerb.toLowerCase()} ${defaultProps.element} ?`)
        ).toBeTruthy();
    });

    it('calls handlers for Cancel and Validate actions', () => {
        const hideDialog = jest.fn();
        const onValidate = jest.fn();

        const { getByText } = render(
            <PaperProvider>
                <ConfirmDialog
                    visible={defaultProps.visible}
                    hideDialog={hideDialog}
                    actionVerb={defaultProps.actionVerb}
                    element={defaultProps.element}
                    onValidate={onValidate}
                />
            </PaperProvider>
        );

        fireEvent.press(getByText('common.cancel'));
        expect(hideDialog).toHaveBeenCalled();

        fireEvent.press(getByText(defaultProps.actionVerb));
        expect(onValidate).toHaveBeenCalled();
    });
});


