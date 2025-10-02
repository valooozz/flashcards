import { ButtonGroup } from '@rneui/themed';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { Sizes } from '../../style/Sizes';
import { CardsToRevise } from '../../types/FlashRevisionSettings';
import { ButtonModal } from '../button/ButtonModal';
import { Input } from '../text/Input';
import { SelectionModal } from './SelectionModal';

interface NumberSelectionModalProps {
    visible: boolean;
    title: string;
    showSelector: boolean;
    selectedCardsToRevise: CardsToRevise;
    validate: (selectedCardsToRevise: CardsToRevise, numberChosen: number, above?: boolean) => void;
    onRequestClose: () => void;
}

export const NumberSelectionModal = ({ visible, title, showSelector, selectedCardsToRevise, validate, onRequestClose }: NumberSelectionModalProps) => {
    const [numberChosen, setNumberChosen] = useState('');
    const [aboveSelector, setAboveSelector] = useState(0);

    const { t } = useTranslation();

    const handleValidate = () => {
        validate(selectedCardsToRevise, Number(numberChosen), showSelector ? Boolean(aboveSelector) : undefined);
    }

    return (
        <SelectionModal visible={visible} title={title} onRequestClose={onRequestClose}>
            {showSelector && (
                <ButtonGroup
                    containerStyle={styles.selector}
                    selectedButtonStyle={{ backgroundColor: Colors.library.dark.main }}
                    buttonStyle={{ backgroundColor: Colors.library.simple.main }}
                    textStyle={{ color: Colors.library.dark.main }}
                    selectedTextStyle={{ color: Colors.library.dark.contrast }}
                    buttons={[
                        <Text style={styles.selectorText}>{t('revision.under')}</Text>,
                        <Text style={styles.selectorText}>{t('revision.above')}</Text>,
                    ]}
                    selectedIndex={aboveSelector}
                    onPress={setAboveSelector}
                />
            )}
            <Input text={numberChosen} setText={setNumberChosen} numeric autofocus />
            <View style={styles.buttonLineContainer}>
                <ButtonModal text={t('common.validate')} onPress={handleValidate} />
            </View>
        </SelectionModal>
    );
};

const styles = StyleSheet.create({
    selector: {
        width: '100%',
        height: Sizes.component.small,
        marginHorizontal: 'auto',
        borderWidth: 0,
        borderRadius: 0,
    },
    selectorText: {
        fontSize: Sizes.font.small,
        fontFamily: 'JosefinRegular',
    },
    buttonLineContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});


