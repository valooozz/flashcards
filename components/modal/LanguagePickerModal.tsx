import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface LanguagePickerModalProps {
    visible: boolean;
    onSelect: (lang: 'en' | 'fr') => void;
}

export function LanguagePickerModal({ visible, onSelect }: LanguagePickerModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.container}>
                    <Text variant="titleMedium" style={{ marginBottom: 16 }}>
                        Choose your language / Choisis ta langue
                    </Text>
                    <View style={styles.buttons}>
                        <Button mode="contained" onPress={() => onSelect('en')} style={styles.button}>
                            English
                        </Button>
                        <Button mode="contained" onPress={() => onSelect('fr')} style={styles.button}>
                            Français
                        </Button>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '85%',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        flex: 1,
    },
});


