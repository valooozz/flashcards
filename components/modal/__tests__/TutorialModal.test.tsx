import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { TutorialModal } from '../TutorialModal';

jest.mock('../../../hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('TutorialModal', () => {
    const slides = [
        {
            key: 'welcome',
            image: require('../../../assets/images/logo.png'),
            hasTitle: true,
        },
        {
            key: 'progress',
            image: require('../../../assets/images/splash.png'),
            hasTitle: false,
        },
    ];

    const onSkip = jest.fn();
    const onDone = jest.fn();

    const defaultProps = {
        visible: true,
        slides,
        onSkip,
        onDone,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders when visible and shows translated title/text for first slide', () => {
        const { getByText } = render(<TutorialModal {...defaultProps} />);

        expect(getByText('tuto.welcome.title')).toBeTruthy();
        expect(getByText('tuto.welcome.text')).toBeTruthy();
    });

    it('does not render when not visible', () => {
        const { queryByText } = render(<TutorialModal {...defaultProps} visible={false} />);

        expect(queryByText('tuto.welcome.title')).toBeNull();
        expect(queryByText('tuto.welcome.text')).toBeNull();
    });

    it('calls onSkip when middle button is pressed', () => {
        const { getByTestId } = render(<TutorialModal {...defaultProps} />);

        const closeButton = getByTestId('tuto-close-button');
        fireEvent.press(closeButton);
        expect(onSkip).toHaveBeenCalledTimes(1);
    });

    it('navigates to next slide and shows Back button, then calls onDone at end', () => {
        const { getByTestId, rerender } = render(<TutorialModal {...defaultProps} />);

        const nextButton = getByTestId('tuto-next-button');
        fireEvent.press(nextButton);

        const previousButton = getByTestId('tuto-previous-button');
        expect(previousButton).toBeTruthy();

        fireEvent.press(nextButton);
        expect(onDone).toHaveBeenCalledTimes(1);

        rerender(<TutorialModal {...defaultProps} visible={false} />);
    });
});


