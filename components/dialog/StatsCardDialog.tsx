import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "../../hooks/useTranslation";
import { formatDate } from "../../utils/formatDate.utils";
import { getDelay } from "../../utils/getDelay.utils";

interface StatsCardDialogProps {
    visible: boolean;
    hideDialog: () => void;
    learningStep: number;
    nextRevision: string;
}

export const StatsCardDialog = ({ visible, hideDialog, learningStep, nextRevision }: StatsCardDialogProps) => {
    const delay = getDelay(nextRevision);

    const { t } = useTranslation();

    const getNextRevisionText = () => {
        return nextRevision
            ? delay < 0
                ? `${t('card.nextRevision')} : ${formatDate(nextRevision)} (${-delay} ${t('common.dayAbbreviation')})`
                : delay > 0
                    ? `${delay} ${delay > 1 ? t('common.dayPlural') : t('common.daySingular')} ${t('card.delayInRevisions')}`
                    : t('card.reviseToday')
            : t('card.notLearnt')
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>{t('common.info')}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyLarge">{t('card.learningStep')} : {learningStep}</Text>
                    <Text variant="bodyLarge">{getNextRevisionText()}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>{t('common.ok')}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}