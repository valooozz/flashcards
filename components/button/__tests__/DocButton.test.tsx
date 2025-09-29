import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { DocButton } from '../DocButton';

describe('DocButton', () => {
    it('renders and triggers openDoc on press', () => {
        const openDoc = jest.fn();
        const { getByTestId } = render(<DocButton color="#123456" openDoc={openDoc} />);

        const touchable = getByTestId('doc-button');
        fireEvent.press(touchable);
        expect(openDoc).toHaveBeenCalledTimes(1);
    });
});


