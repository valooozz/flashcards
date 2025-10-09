import { useState } from 'react';
import { IconButton, useTheme } from 'react-native-paper';
import { InfoDialog } from '../dialog/InfoDialog';

interface InfoButtonProps {
    textLabel: string;
    textExplanation: string;
}

export function InfoButton({ textLabel, textExplanation }: InfoButtonProps) {
    const [showInfoDialog, setShowInfoDialog] = useState(false);

    const { colors } = useTheme();

    return (
        <>
            <IconButton
                icon="information-outline"
                size={20}
                onPress={() => setShowInfoDialog(true)}
                testID='checkbox-info-button'
                iconColor={colors.primary}
            />
            <InfoDialog
                visible={showInfoDialog}
                hideDialog={() => setShowInfoDialog(false)}
                title={textLabel}
                text={textExplanation}
            />
        </>
    );
}
