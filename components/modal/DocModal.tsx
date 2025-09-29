import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface DocModalProps {
    visible: boolean;
    onClose: () => void;
    language: string;
}

export const DocModal = ({ visible, onClose, language = 'fr' }: DocModalProps) => {
    const [markdownContent, setMarkdownContent] = useState('');

    useEffect(() => {
        if (visible) {
            const docPath = FileSystem.bundleDirectory + `assets/docs/${language}/doc.md`;
            FileSystem.readAsStringAsync(docPath)
                .then(content => setMarkdownContent(content))
                .catch(() => setMarkdownContent('# Error\nContent unavailable.'));
        }
    }, [visible, language]);

    return (
        <Modal visible={visible} onRequestClose={onClose}>
            <ScrollView contentContainerStyle={styles.container}>
                <Markdown style={markdownStyles}>
                    {markdownContent}
                </Markdown>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
});

const markdownStyles = {
    heading1: { fontSize: 24, marginVertical: 10 },
    text: { fontSize: 16, lineHeight: 24 },
};
