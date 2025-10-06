import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "../../hooks/useTranslation";

interface InfoDialogProps {
    visible: boolean;
    hideDialog: () => void;
    title: string;
    text: string;
}

export const InfoDialog = ({ visible, hideDialog, title, text }: InfoDialogProps) => {

    const { t } = useTranslation();

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyLarge">{text}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={hideDialog}>{t('common.ok')}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}