import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SelectionOption } from '../../types/SelectionOption';
import { ButtonModal } from '../button/ButtonModal';
import { SelectionModal } from './SelectionModal';

interface SelectionModalProps {
    visible: boolean;
    title: string;
    options: SelectionOption[];
    onRequestClose: () => void;
}

export const ButtonSelectionModal = ({ visible, title, options, onRequestClose }: SelectionModalProps) => {
    return (
        <SelectionModal visible={visible} title={title} onRequestClose={onRequestClose}>
            {options.map((option) => (
                <View style={styles.buttonLineContainer} key={option.label}>
                    <ButtonModal text={option.label} onPress={option.onPress} />
                </View>
            ))}
        </SelectionModal>
    );
};

const styles = StyleSheet.create({
    buttonLineContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});


