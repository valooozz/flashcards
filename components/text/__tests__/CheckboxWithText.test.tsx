import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { CheckboxWithText } from '../CheckboxWithText';

// Mock only the Checkbox to make it easily pressable and selectable via testID
jest.mock('react-native-paper', () => {
    const actual = jest.requireActual('react-native-paper');
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');
    const Checkbox = ({ onPress, status }: any) => (
        React.createElement(TouchableOpacity, { onPress, testID: 'checkbox' }, React.createElement(Text, null, status))
    );
    return { ...actual, Checkbox };
});

describe('CheckboxWithText', () => {
    it('renders label and toggles checkbox state on press', () => {
        const setIsChecked = jest.fn();
        const { getByText, getByTestId } = render(
            <PaperProvider>
                <CheckboxWithText isChecked={false} setIsChecked={setIsChecked} textLabel="Enable feature" />
            </PaperProvider>
        );

        expect(getByText('Enable feature')).toBeTruthy();

        fireEvent.press(getByTestId('checkbox'));
        expect(setIsChecked).toHaveBeenCalledWith(true);
    });

    it('shows InfoButton only when textExplanation is provided', () => {
        const { queryByTestId, rerender } = render(
            <PaperProvider>
                <CheckboxWithText isChecked={true} setIsChecked={jest.fn()} textLabel="Label" />
            </PaperProvider>
        );

        expect(queryByTestId('checkbox-info-button')).toBeNull();

        rerender(
            <PaperProvider>
                <CheckboxWithText
                    isChecked={true}
                    setIsChecked={jest.fn()}
                    textLabel="Label"
                    textExplanation="More info"
                />
            </PaperProvider>
        );

        expect(queryByTestId('checkbox-info-button')).toBeTruthy();
    });
});


