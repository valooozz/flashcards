import { StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "../../hooks/useTranslation";

interface ConfirmDialogProps {
    visible: boolean;
    hideDialog: () => void;
    actionVerb: string;
    element: string;
    onValidate: () => void;
}

export const ConfirmDialog = ({ visible, hideDialog, actionVerb, element, onValidate }: ConfirmDialogProps) => {

    const { t } = useTranslation();

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>{actionVerb} ?</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyLarge">{t('dialog.confirm')} {actionVerb.toLowerCase()} {element} ?</Text>
                </Dialog.Content>
                <Dialog.Actions style={styles.actions}>
                    <Button onPress={hideDialog}>{t('common.cancel')}</Button>
                    <Button onPress={onValidate}>{actionVerb}  </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

const styles = StyleSheet.create({
    actions: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
    }
})