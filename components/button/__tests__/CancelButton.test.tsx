import React from 'react';
import { render } from '@testing-library/react-native';
import { fireEvent } from '@testing-library/react-native';
import { CancelButton } from '../CancelButton';

describe('CancelButton', () => {
    it('handles press when handler provided', () => {
        const onClick = jest.fn();
        const { getByTestId } = render(
            <CancelButton backgroundColor="#fff" color="#000" handleClick={onClick} />
        );
        fireEvent.press(getByTestId('cancel-button'));
        expect(onClick).toHaveBeenCalled();
    });
});
