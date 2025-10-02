export type CardsToRevise = 'all' | 'number' | 'step' | 'notLearnt';

export type StepDelimiter = {
    above: boolean;
    step: number;
}

export type RevisionSide = 'recto' | 'verso' | 'current' | 'random';

export type FlashRevisionSettingsType = {
    cardsToRevise: CardsToRevise;
    revisionSide: RevisionSide;
    numberOfCards?: number;
    stepDelimiter?: StepDelimiter;
}