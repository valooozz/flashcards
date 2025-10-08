import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, SegmentedButtons, TextInput } from "react-native-paper";
import { useTranslation } from "../../hooks/useTranslation";
import { CardsToRevise, CardsToReviseLearnt, FlashRevisionSettingsType, RevisionSide, StepSide } from "../../types/FlashRevisionSettings";
import { TitleWithInfo } from "../text/TitleWithInfo";

interface FlashRevisionDialogProps {
    visible: boolean;
    hideDialog: () => void;
    validate: (flashRevisionSettings: FlashRevisionSettingsType) => void;
}

export const FlashRevisionDialog = ({ visible, hideDialog, validate }: FlashRevisionDialogProps) => {
    const { t } = useTranslation();

    const [cardsToRevise, setCardsToRevise] = useState<CardsToRevise>('all');
    const [cardsToReviseLearnt, setCardsToReviseLearnt] = useState<CardsToReviseLearnt>('all');
    const [numberOfCards, setNumberOfCards] = useState('1');
    const [step, setStep] = useState('1');
    const [stepSide, setStepSide] = useState<StepSide>('under');
    const [revisionSide, setRevisionSide] = useState<RevisionSide>('recto');

    return (
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Icon icon='flash' />
            <Dialog.Content style={styles.container}>
                <TitleWithInfo textLabel={t('revision.chooseCards')} textExplanation={t('revision.chooseCardsExplanation')} />
                <SegmentedButtons
                    value={cardsToRevise}
                    onValueChange={(newValue: CardsToRevise) => setCardsToRevise(newValue)}
                    buttons={[
                        {
                            value: 'all',
                            label: t('revision.all'),
                        },
                        {
                            value: 'number',
                            label: t('revision.number'),
                        },
                        {
                            value: 'step',
                            label: t('revision.step'),
                        },
                    ]}
                />
                {cardsToRevise === 'step' && (
                    <SegmentedButtons
                        value={stepSide}
                        onValueChange={(newValue: StepSide) => setStepSide(newValue)}
                        buttons={[
                            {
                                value: 'under',
                                label: t('revision.under'),
                            },
                            {
                                value: 'above',
                                label: t('revision.above'),
                            },
                        ]}
                    />
                )}
                {cardsToRevise !== 'all' && (
                    <TextInput
                        label={cardsToRevise === 'number' ? t('revision.chooseNumber') : t('revision.chooseStep')}
                        value={cardsToRevise === 'number' ? numberOfCards : step}
                        onChangeText={cardsToRevise === 'number' ? setNumberOfCards : setStep}
                        keyboardType="numeric"
                    />
                )}
                <SegmentedButtons
                    value={cardsToReviseLearnt}
                    onValueChange={(newValue: CardsToReviseLearnt) => setCardsToReviseLearnt(newValue)}
                    buttons={[
                        {
                            value: 'notLearnt',
                            label: t('revision.notLearnt'),
                        },
                        {
                            value: 'all',
                            label: t('revision.all'),
                        },
                        {
                            value: 'learnt',
                            label: t('revision.learnt'),
                        },
                    ]}
                />
                <TitleWithInfo textLabel={t('revision.chooseSide')} textExplanation={t('revision.chooseSideExplanation')} />
                <SegmentedButtons
                    value={revisionSide}
                    onValueChange={(newValue: RevisionSide) => setRevisionSide(newValue)}
                    buttons={[
                        {
                            value: 'recto',
                            label: t('revision.recto'),
                        },
                        {
                            value: 'verso',
                            label: t('revision.verso'),
                        },
                        {
                            value: 'current',
                            label: t('revision.current'),
                        },
                        {
                            value: 'random',
                            label: t('revision.random'),
                        },
                    ]}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={hideDialog}>{t('common.cancel')}</Button>
                <Button onPress={() => validate({
                    cardsToRevise,
                    cardsToReviseLearnt,
                    revisionSide,
                    numberOfCards: Number(numberOfCards),
                    stepDelimiter: { above: stepSide === 'above', step: Number(step) }
                })}>{t('common.validate')}</Button>
            </Dialog.Actions>
        </Dialog>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        rowGap: 8,
    }
})