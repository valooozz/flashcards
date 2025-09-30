import React from 'react';
import { Modal, ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useTranslation } from '../../hooks/useTranslation';

interface DocModalProps {
    visible: boolean;
    onClose: () => void;
}

export const DocModal = ({ visible, onClose }: DocModalProps) => {
    const { t } = useTranslation();

    return (
        <Modal visible={visible} onRequestClose={onClose}>
            <ScrollView contentContainerStyle={styles.container}>
                <Markdown>
                    {t(`common.doc`)}
                </Markdown>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
});