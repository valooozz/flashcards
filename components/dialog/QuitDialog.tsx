import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "../../hooks/useTranslation";

interface QuitDialogProps {
    visible: boolean;
    hideDialog: () => void;
    saveAction: () => void;
}

export const QuitDialog = ({ visible, hideDialog, saveAction }: QuitDialogProps) => {

    const { t } = useTranslation();

    const quit = () => {
        hideDialog();
        router.back();
    }

    const saveAndQuit = () => {
        saveAction();
        hideDialog();
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>{t('dialog.leave')}</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyLarge">{t('dialog.notSaved')}</Text>
                </Dialog.Content>
                <Dialog.Actions style={styles.actions}>
                    <Button onPress={hideDialog}>{t('dialog.noQuit')}</Button>
                    <Button onPress={quit}>{t('dialog.quit')}</Button>
                    <Button onPress={saveAndQuit}>{t('dialog.saveAndQuit')}  </Button>
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