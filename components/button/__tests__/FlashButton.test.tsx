import React from 'react';
import { render } from '@testing-library/react-native';
import { fireEvent } from '@testing-library/react-native';
import { FlashButton } from '../FlashButton';

describe('FlashButton', () => {
    it('renders label and calls handler on press', () => {
        const onClick = jest.fn();
        const { getByText, getByTestId } = render(
            <FlashButton text="Flip" backgroundColor="#111" textColor="#eee" handleClick={onClick} />
        );
        expect(getByText('Flip')).toBeTruthy();
        fireEvent.press(getByTestId('flash-button'));
        expect(onClick).toHaveBeenCalled();
    });
});
