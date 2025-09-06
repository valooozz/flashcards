import React from 'react';
import { render } from '@testing-library/react-native';
import { fireEvent } from '@testing-library/react-native';
import { ImportExportButton } from '../ImportExportButton';

jest.mock('expo-sqlite', () => ({
    useSQLiteContext: () => ({}),
}));

jest.mock('../../../utils/database/deck/exportAllDecks.utils', () => ({
    exportAllDecks: jest.fn(),
}));

jest.mock('../../../utils/import/importDocument.utils', () => ({
    importDocument: jest.fn(),
}));

describe('ImportExportButton', () => {
    it('calls exportAllDecks on press', () => {
        const { exportAllDecks } = require('../../../utils/database/deck/exportAllDecks.utils');
        (exportAllDecks as jest.Mock).mockClear();
        const { getByTestId } = render(<ImportExportButton color="#000" />);
        fireEvent.press(getByTestId('import-export-button'));
        expect(exportAllDecks).toHaveBeenCalledWith({});
    });

    it('calls importDocument on long press', () => {
        const { importDocument } = require('../../../utils/import/importDocument.utils');
        (importDocument as jest.Mock).mockClear();
        const { getByTestId } = render(<ImportExportButton color="#000" />);
        fireEvent(getByTestId('import-export-button'), 'longPress');
        expect(importDocument).toHaveBeenCalledWith({}, 'json');
    });
});
