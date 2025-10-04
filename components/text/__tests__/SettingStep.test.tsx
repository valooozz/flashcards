import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { SettingStep } from '../SettingStep';

describe('SettingStep', () => {
    it('renders the label and input with numeric keyboard', () => {
        const { getByText, getByDisplayValue } = render(
            <SettingStep stepNumber="Interval" selectedStep="5" setSelectedStep={jest.fn()} />
        );

        const label = getByText('Interval');
        expect(label).toBeTruthy();

        const input = getByDisplayValue('5');
        expect(input.props.keyboardType).toBe('numeric');
    });

    it('forwards text changes to setTextInput', () => {
        const setTextInput = jest.fn();
        const { getByDisplayValue } = render(
            <SettingStep stepNumber="Days" selectedStep="1" setSelectedStep={setTextInput} />
        );

        const input = getByDisplayValue('1');
        fireEvent.changeText(input, '10');
        expect(setTextInput).toHaveBeenCalledWith('10');
    });
});
