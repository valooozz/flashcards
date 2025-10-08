import { useState } from 'react';
import { IconButton } from 'react-native-paper';
import { InfoDialog } from '../dialog/InfoDialog';

interface InfoButtonProps {
    textLabel: string;
    textExplanation: string;
}

export function InfoButton({ textLabel, textExplanation }: InfoButtonProps) {
    const [showInfoDialog, setShowInfoDialog] = useState(false);

    return (
        <>
            <IconButton
                icon="information-outline"
                size={20}
                onPress={() => setShowInfoDialog(true)}
                testID='checkbox-info-button'
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
