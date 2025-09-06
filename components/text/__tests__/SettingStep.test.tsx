import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SettingStep } from '../SettingStep';

describe('SettingStep', () => {
    it('renders the label and input with numeric keyboard', () => {
        const { getByText, getByDisplayValue } = render(
            <SettingStep textLabel="Interval" textInput="5" setTextInput={jest.fn()} />
        );

        const label = getByText('Interval');
        expect(label).toBeTruthy();

        const input = getByDisplayValue('5');
        expect(input.props.keyboardType).toBe('numeric');
    });

    it('forwards text changes to setTextInput', () => {
        const setTextInput = jest.fn();
        const { getByDisplayValue } = render(
            <SettingStep textLabel="Days" textInput="1" setTextInput={setTextInput} />
        );

        const input = getByDisplayValue('1');
        fireEvent.changeText(input, '10');
        expect(setTextInput).toHaveBeenCalledWith('10');
    });
});
