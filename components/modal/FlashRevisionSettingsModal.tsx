import { useEffect, useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { CardsToRevise, RevisionSide } from "../../types/FlashRevisionSettings";
import { SelectionOption } from "../../types/SelectionOption";
import { SelectionModal } from "./SelectionModal";

interface FlashRevisionSettingsModalProps {
    visible: boolean;
    openRevision: (cardsToRevise: CardsToRevise, revisionSide: RevisionSide, numberOfCards?: number, step?: number) => void;
    closeModal: () => void;
}

export const FlashRevisionSettingsModal = ({ visible, openRevision, closeModal }: FlashRevisionSettingsModalProps) => {

    const { t } = useTranslation();

    const cardsToReviseTitle = t('revision.chooseCards');
    const revisionSideTitle = t('revision.chooseSide');
    const cardsToReviseOptions: SelectionOption[] = [
        { label: t('revision.all'), onPress: () => handleCardsToReviseChoice('all') },
        { label: t('revision.number'), onPress: () => handleCardsToReviseChoice('number') },
        { label: t('revision.step'), onPress: () => handleCardsToReviseChoice('step') },
    ];

    const [showSelectionModal, setShowSelectionModal] = useState(true);
    const [showNumberModal, setShowNumberModal] = useState(false);
    const [showStepModal, setShowStepModal] = useState(false);

    const [selectionModalTitle, setSeletionModalTitle] = useState(undefined);
    const [selectionModalOptions, setSelectionModalOptions] = useState<SelectionOption[]>([]);

    useEffect(() => {
        if (!visible) {
            return;
        }
        setSeletionModalTitle(cardsToReviseTitle);
        setSelectionModalOptions(cardsToReviseOptions);
    }, [visible]);

    const handleCardsToReviseChoice = (selectedCardsToRevise: CardsToRevise) => {
        setSeletionModalTitle(revisionSideTitle);
        const newRevisionSideOptions: SelectionOption[] = [
            { label: t('revision.recto'), onPress: () => handleRevisionSideChoice(selectedCardsToRevise, 'recto',) },
            { label: t('revision.verso'), onPress: () => handleRevisionSideChoice(selectedCardsToRevise, 'verso') },
            { label: t('revision.current'), onPress: () => handleRevisionSideChoice(selectedCardsToRevise, 'current') },
            { label: t('revision.random'), onPress: () => handleRevisionSideChoice(selectedCardsToRevise, 'random') },
        ];
        setSelectionModalOptions(newRevisionSideOptions);
    }

    const handleRevisionSideChoice = (selectedCardsToRevise: CardsToRevise, selectedRevisionSide: RevisionSide) => {
        openRevision(selectedCardsToRevise, selectedRevisionSide);
    }

    return (
        <SelectionModal
            visible={visible && showSelectionModal}
            title={selectionModalTitle}
            onRequestClose={closeModal}
            options={selectionModalOptions}
        />
    )
}