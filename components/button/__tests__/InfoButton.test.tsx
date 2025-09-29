import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { InfoButton } from '../InfoButton';

describe('InfoButton', () => {
    it('renders with given color and testID', () => {
        const { getByTestId } = render(
            <InfoButton color="#123456" textLabel="Title" textExplanation="Message" />
        );
        expect(getByTestId('checkbox-info-button')).toBeTruthy();
    });

    it('calls Alert.alert with label and explanation on press', () => {
        jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
        const { getByTestId } = render(
            <InfoButton color="#123456" textLabel="My Title" textExplanation="My Explanation" />
        );
        fireEvent.press(getByTestId('checkbox-info-button'));
        expect(Alert.alert).toHaveBeenCalledWith('My Title', 'My Explanation');
    });
});


