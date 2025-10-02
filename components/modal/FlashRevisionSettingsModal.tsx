import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { CardsToRevise, RevisionSide, StepDelimiter } from "../../types/FlashRevisionSettings";
import { SelectionOption } from "../../types/SelectionOption";
import { ButtonSelectionModal } from "./ButtonSelectionModal";
import { NumberSelectionModal } from "./NumberSelectionModal";

interface FlashRevisionSettingsModalProps {
    visible: boolean;
    openRevision: (cardsToRevise: CardsToRevise, revisionSide: RevisionSide, numberOfCards?: number, stepDelimiter?: StepDelimiter) => void;
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

    const handleCardsToReviseChoice = (newSelectedCardsToRevise: CardsToRevise) => {
        if (newSelectedCardsToRevise === 'all' || newSelectedCardsToRevise === 'notLearnt') {
            const revisionSideOptions: SelectionOption[] = [
                { label: t('revision.recto'), onPress: () => handleRevisionSideChoice(newSelectedCardsToRevise, 'recto', undefined, undefined) },
                { label: t('revision.verso'), onPress: () => handleRevisionSideChoice(newSelectedCardsToRevise, 'verso', undefined, undefined) },
                { label: t('revision.current'), onPress: () => handleRevisionSideChoice(newSelectedCardsToRevise, 'current', undefined, undefined) },
                { label: t('revision.random'), onPress: () => handleRevisionSideChoice(newSelectedCardsToRevise, 'random', undefined, undefined) },
            ];
            setSelectionModalOptions(revisionSideOptions);
            setSelectionModalTitle(revisionSideTitle);
            return;
        }

        setSelectedCardsToRevise(newSelectedCardsToRevise);
        if (newSelectedCardsToRevise === 'number') {
            setSelectionModalTitle(numberOfCardsTitle);
            setShowSelector(false);
        } else if (newSelectedCardsToRevise === 'step') {
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

        const revisionSideOptions: SelectionOption[] = [
            { label: t('revision.recto'), onPress: () => handleRevisionSideChoice(selectedCardsToRevise, 'recto', selectedNumberOfCards, selectedStepDelimiter) },
            { label: t('revision.verso'), onPress: () => handleRevisionSideChoice(selectedCardsToRevise, 'verso', selectedNumberOfCards, selectedStepDelimiter) },
            { label: t('revision.current'), onPress: () => handleRevisionSideChoice(selectedCardsToRevise, 'current', selectedNumberOfCards, selectedStepDelimiter) },
            { label: t('revision.random'), onPress: () => handleRevisionSideChoice(selectedCardsToRevise, 'random', selectedNumberOfCards, selectedStepDelimiter) },
        ];
        setSelectionModalOptions(revisionSideOptions);
        setSelectionModalTitle(revisionSideTitle);

        setShowNumberSelectionModal(false);
        setShowButtonSelectionModal(true);
    }

    const handleRevisionSideChoice = (selectedCardsToRevise: CardsToRevise, selectedRevisionSide: RevisionSide, selectedNumberOfCards?: number, selectedStepDelimiter?: StepDelimiter) => {
        openRevision(selectedCardsToRevise, selectedRevisionSide, selectedNumberOfCards, selectedStepDelimiter);
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