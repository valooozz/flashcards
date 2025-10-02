import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { SelectionOption } from '../../types/SelectionOption';
import { ButtonModal } from '../button/ButtonModal';

interface SelectionModalProps {
    visible: boolean;
    title: string;
    options: SelectionOption[];
    onRequestClose: () => void;
}

export const SelectionModal = ({ visible, title, options, onRequestClose }: SelectionModalProps) => {
    return (
        <Modal visible={visible} onRequestClose={onRequestClose} transparent>
            <TouchableOpacity style={styles.backdrop} onPress={onRequestClose} activeOpacity={1}>
                <View style={styles.container}>
                    <Text style={styles.text}>
                        {title}
                    </Text>
                    {options.map((option) => (
                        <View style={styles.buttonLineContainer} key={option.label}>
                            <ButtonModal text={option.label} onPress={option.onPress} />
                        </View>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: Colors.library.simple.main,
        padding: 10,
        borderRadius: 8,
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        rowGap: 8,
    },
    buttonLineContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        color: Colors.daily.simple.contrast,
        fontSize: Sizes.font.medium,
        fontFamily: 'JosefinRegular',
        paddingVertical: 16
    },
});


