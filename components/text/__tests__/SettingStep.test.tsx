import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SettingStep } from '../SettingStep';

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

// Stub NumberPickerModal to a simple component that instantly triggers onSelect when a button is pressed
jest.mock('../../modal/NumberPickerModal', () => ({
    NumberPickerModal: ({ visible, onSelect, title }: any) => {
        const React = require('react');
        const { View, Text, TouchableOpacity } = require('react-native');
        if (!visible) return null;
        return (
            React.createElement(View, null,
                React.createElement(Text, { testID: 'modal-title' }, title),
                React.createElement(TouchableOpacity, { onPress: () => onSelect(7), testID: 'pick-7' }, React.createElement(Text, null, '7'))
            )
        );
    },
}));

describe('SettingStep', () => {
    it('opens number picker on card press and updates selected step', () => {
        const setSelectedStep = jest.fn();
        const { getByText, getByTestId } = render(
            <PaperProvider>
                <SettingStep stepNumber={3} selectedStep={5} setSelectedStep={setSelectedStep} />
            </PaperProvider>
        );

        // Card shows current selected step
        expect(getByText('3 :')).toBeTruthy();
        expect(getByText('5')).toBeTruthy();

        // Open modal
        fireEvent.press(getByText('5'));

        // Modal title uses translation key and step number
        expect(getByTestId('modal-title').props.children).toBe('settings.stepSpacing 3');

        // Pick a new value
        fireEvent.press(getByTestId('pick-7'));
        expect(setSelectedStep).toHaveBeenCalledWith(7);
    });
});


