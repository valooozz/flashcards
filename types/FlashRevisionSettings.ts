export type CardsToRevise = 'all' | 'number' | 'step';

export type CardsToReviseLearnt = 'notLearnt' | 'all' | 'learnt';

export type StepSide = 'under' | 'above';

export type StepDelimiter = {
    above: boolean;
    step: number;
}

export type RevisionSide = 'recto' | 'verso' | 'current' | 'random';

export type FlashRevisionSettingsType = {
    cardsToRevise: CardsToRevise;
    cardsToReviseLearnt: CardsToReviseLearnt;
    revisionSide: RevisionSide;
    numberOfCards?: number;
    stepDelimiter?: StepDelimiter;
}