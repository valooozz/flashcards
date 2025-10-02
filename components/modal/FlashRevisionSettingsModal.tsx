import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { CardsToRevise, FlashRevisionSettingsType, StepDelimiter } from "../../types/FlashRevisionSettings";
import { SelectionOption } from "../../types/SelectionOption";
import { ButtonSelectionModal } from "./ButtonSelectionModal";
import { NumberSelectionModal } from "./NumberSelectionModal";

interface FlashRevisionSettingsModalProps {
    visible: boolean;
    openRevision: (flashRevisionSettings: FlashRevisionSettingsType) => void;
    closeModal: () => void;
}

export const FlashRevisionSettingsModal = ({ visible, openRevision, closeModal }: FlashRevisionSettingsModalProps) => {

    const { t } = useTranslation();

    const cardsToReviseTitle = t('revision.chooseCards');
    const numberOfCardsTitle = t('revision.chooseNumber');
    const stepDelimiterTitle = t('revision.chooseStep');
    const revisionSideTitle = t('revision.chooseSide');
    const cardsToReviseOptions: SelectionOption[] = [
        { label: t('revision.all'), onPress: () => handleCardsToReviseChoice('all') },
        { label: t('revision.number'), onPress: () => handleCardsToReviseChoice('number') },
        { label: t('revision.step'), onPress: () => handleCardsToReviseChoice('step') },
        { label: t('revision.notLearnt'), onPress: () => handleCardsToReviseChoice('notLearnt') },
    ];

    const [showButtonSelectionModal, setShowButtonSelectionModal] = useState(true);
    const [showNumberSelectionModal, setShowNumberSelectionModal] = useState(false);
    const [showSelector, setShowSelector] = useState(false);

    const [selectionModalTitle, setSelectionModalTitle] = useState(undefined);
    const [selectionModalOptions, setSelectionModalOptions] = useState<SelectionOption[]>([]);

    const [selectedCardsToRevise, setSelectedCardsToRevise] = useState<CardsToRevise>(undefined);

    useEffect(() => {
        if (!visible) {
            return;
        }
        setSelectionModalTitle(cardsToReviseTitle);
        setSelectionModalOptions(cardsToReviseOptions);
        setShowButtonSelectionModal(true);
        setShowNumberSelectionModal(false);
    }, [visible]);

    const handleCardsToReviseChoice = (selectedCardsToRevise: CardsToRevise) => {
        if (selectedCardsToRevise === 'all' || selectedCardsToRevise === 'notLearnt') {
            const revisionSideOptions: SelectionOption[] = [
                { label: t('revision.recto'), onPress: () => handleRevisionSideChoice({ cardsToRevise: selectedCardsToRevise, revisionSide: 'recto' }) },
                { label: t('revision.verso'), onPress: () => handleRevisionSideChoice({ cardsToRevise: selectedCardsToRevise, revisionSide: 'verso' }) },
                { label: t('revision.current'), onPress: () => handleRevisionSideChoice({ cardsToRevise: selectedCardsToRevise, revisionSide: 'current' }) },
                { label: t('revision.random'), onPress: () => handleRevisionSideChoice({ cardsToRevise: selectedCardsToRevise, revisionSide: 'random' }) },
            ];
            setSelectionModalOptions(revisionSideOptions);
            setSelectionModalTitle(revisionSideTitle);
            return;
        }

        setSelectedCardsToRevise(selectedCardsToRevise);
        if (selectedCardsToRevise === 'number') {
            setSelectionModalTitle(numberOfCardsTitle);
            setShowSelector(false);
        } else if (selectedCardsToRevise === 'step') {
            setSelectionModalTitle(stepDelimiterTitle);
            setShowSelector(true);
        }

        setShowButtonSelectionModal(false);
        setShowNumberSelectionModal(true);
    }

    const handleNumberChoice = (selectedCardsToRevise: CardsToRevise, numberChosen?: number, above?: boolean) => {
        let selectedNumberOfCards: number;
        let selectedStepDelimiter: StepDelimiter;

        if (above === undefined) {
            selectedNumberOfCards = numberChosen;
        } else {
            selectedStepDelimiter = {
                above: above,
                step: numberChosen
            };
        }

        const flashRevisionSettings: FlashRevisionSettingsType = {
            cardsToRevise: selectedCardsToRevise,
            revisionSide: 'recto',
            numberOfCards: selectedNumberOfCards,
            stepDelimiter: selectedStepDelimiter,
        }

        const revisionSideOptions: SelectionOption[] = [
            { label: t('revision.recto'), onPress: () => handleRevisionSideChoice(flashRevisionSettings) },
            { label: t('revision.verso'), onPress: () => handleRevisionSideChoice({ ...flashRevisionSettings, revisionSide: 'verso' }) },
            { label: t('revision.current'), onPress: () => handleRevisionSideChoice({ ...flashRevisionSettings, revisionSide: 'current' }) },
            { label: t('revision.random'), onPress: () => handleRevisionSideChoice({ ...flashRevisionSettings, revisionSide: 'random' }) },
        ];
        setSelectionModalOptions(revisionSideOptions);
        setSelectionModalTitle(revisionSideTitle);

        setShowNumberSelectionModal(false);
        setShowButtonSelectionModal(true);
    }

    const handleRevisionSideChoice = (flashRevisionSettings: FlashRevisionSettingsType) => {
        openRevision(flashRevisionSettings);
    }

    return (
        <>
            <ButtonSelectionModal
                visible={visible && showButtonSelectionModal}
                title={selectionModalTitle}
                onRequestClose={closeModal}
                options={selectionModalOptions}
            />
            <NumberSelectionModal
                visible={visible && showNumberSelectionModal}
                title={selectionModalTitle}
                onRequestClose={closeModal}
                showSelector={showSelector}
                selectedCardsToRevise={selectedCardsToRevise}
                validate={handleNumberChoice}
            />
        </>
    )
}