import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Toolbar } from '../Toolbar';

jest.mock('../../button/BackButton', () => {
    const { Pressable } = require('react-native');
    return {
        BackButton: ({ action }: any) => (
            <Pressable testID="back-button" onPress={action} />
        ),
    };
});

jest.mock('../../button/SettingsButton', () => {
    const { Pressable } = require('react-native');
    return {
        SettingsButton: ({ route }: any) => (
            <Pressable testID={`settings-button-${route}`} />
        ),
    };
});

jest.mock('../../button/ImportExportButton', () => {
    const { Pressable } = require('react-native');
    return {
        ImportExportButton: () => <Pressable testID="import-export-button" />,
    };
});

describe('Toolbar', () => {
    it('renders back button by default and triggers action on press', () => {
        const onBack = jest.fn();
        const { getByTestId } = render(
            <Toolbar color="#000" actionBackButton={onBack} />
        );
        fireEvent.press(getByTestId('back-button'));
        expect(onBack).toHaveBeenCalled();
    });

    it('hides back button when noBackButton is true', () => {
        const { queryByTestId } = render(
            <Toolbar color="#000" noBackButton />
        );
        expect(queryByTestId('back-button')).toBeNull();
    });

    it('renders settings button when routeSettingsButton provided', () => {
        const { getByTestId } = render(
            <Toolbar color="#000" routeSettingsButton="/settings" />
        );
        expect(getByTestId('settings-button-/settings')).toBeTruthy();
    });

    it('renders import/export button when importExportButton is true', () => {
        const { getByTestId } = render(
            <Toolbar color="#000" importExportButton />
        );
        expect(getByTestId('import-export-button')).toBeTruthy();
    });
});
