import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "../../hooks/useTranslation";

interface StatsDeckDialogProps {
    visible: boolean;
    hideDialog: () => void;
    nbCardsLearnt: number;
    nbCardsToLearn: number;
    progress: number;
}

export const StatsDeckDialog = ({ visible, hideDialog, nbCardsLearnt, nbCardsToLearn, progress }: StatsDeckDialogProps) => {

    const { t } = useTranslation();

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>{t('common.stats')}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyLarge">{t('deck.cardsLearnt')} : {nbCardsLearnt}</Text>
                    <Text variant="bodyLarge">{t('deck.cardsToLearn')} : {nbCardsToLearn}</Text>
                    <Text variant="bodyLarge">{t('deck.progress')} : {(progress * 100).toFixed(2)} %</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>{t('common.ok')}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}