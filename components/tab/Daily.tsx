import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { useSettingsContext } from '../../context/SettingsContext';
import { Colors } from '../../style/Colors';
import { GlobalStyles } from '../../style/GlobalStyles';
import { DailyAction } from '../../types/Actions';
import { FlashCardType } from '../../types/FlashCardType';
import { NbCardsToReviseType } from '../../types/NbCardsToReviseType';
import { getCardsToRevise } from '../../utils/database/card/get/getCardsToRevise.utils';
import { getNbCardsToReviseThisWeek } from '../../utils/database/card/get/getNbCardsToReviseThisWeek.utils';
import { cancelLastActionOnCard } from '../../utils/database/card/update/cancelLastActionOnCard.utils';
import { putCardToNextStep } from '../../utils/database/card/update/putCardToNextStep.utils';
import { putCardToPreviousStep } from '../../utils/database/card/update/putCardToPreviousStep.utils';
import { putCardToReviseTommorow } from '../../utils/database/card/update/putCardToReviseTommorow.utils';
import { putCardToSameStep } from '../../utils/database/card/update/putCardToSameStep.utils';
import { addForgottenCard } from '../../utils/database/forgotten/addForgottenCard.utils';
import { getForgottenCards } from '../../utils/database/forgotten/getForgottenCards.utils';
import { removeForgottenCard } from '../../utils/database/forgotten/removeForgottenCard.utils';
import { decrementStatOfToday } from '../../utils/database/stats/decrementStatOfToday.utils';
import { getStatsOfDay } from '../../utils/database/stats/getStatsOfDay.utils';
import { incrementStatOfToday } from '../../utils/database/stats/incrementStatOfToday.utils';
import { getDate } from '../../utils/getDate.utils';
import { getDelay } from '../../utils/getDelay.utils';
import { isLastItem } from '../../utils/isLastItem.utils';
import { preventCardToBeFirst } from '../../utils/preventCardToBeFirst.utils';
import { shuffle } from '../../utils/shuffle.utils';
import { FlashButton } from '../button/FlashButton';
import { FlashCard } from '../card/FlashCard';
import { InfoDialog } from '../dialog/InfoDialog';

export function Daily() {
    const [cardsToRevise, setCardsToRevise] = useState<FlashCardType[]>([]);
    const [forgottenCards, setForgottenCards] = useState<FlashCardType[]>([]);
    const [cardToShow, setCardToShow] = useState<FlashCardType>(undefined);
    const [delay, setDelay] = useState<number>(0);
    const [inSecondPhase, setInSecondPhase] = useState<boolean>(false);

    const [nbRevised, setNbRevised] = useState(0);
    const [nbKnown, setNbKown] = useState(0);
    const [nbForgotten, setNbForgotten] = useState(0);
    const [nbCardsToReviseThisWeek, setNbCardsToReviseThisWeek] = useState<
        NbCardsToReviseType[]
    >([]);

    const [previousCard, setPreviousCard] = useState<FlashCardType>(undefined);
    const [previousStatIncremented, setPreviousStatIncremented] =
        useState<string>(undefined);

    const [showHelpDialog, setShowHelpDialog] = useState(false);

    const { hardThrowback, stopLearning, advancedRevisionMode, intervals } = useSettingsContext();

    const { t } = useTranslation();
    const { colors } = useTheme();

    const database = useSQLiteContext();

    useFocusEffect(
        useCallback(() => {
            setPreviousCard(undefined);
            getCardsToRevise(database).then((cardsResult) => {
                shuffle(cardsResult);
                updateCardsToRevise(cardsResult);
                setInSecondPhase(false);

                if (cardsResult.length === 0) {
                    getNbCardsToReviseThisWeek(database).then((result) => {
                        setNbCardsToReviseThisWeek(result);
                    });
                }
            });
        }, []),
    );

    const udpateCardToShow = (newCard: FlashCardType) => {
        setCardToShow(newCard);
        if (newCard === undefined) {
            getStatsOfDay(database, getDate(0)).then((stats) => {
                setNbRevised(stats.nbRevised);
                setNbKown(stats.nbKnown);
                setNbForgotten(stats.nbForgotten);
            });
            getNbCardsToReviseThisWeek(database).then((result) => {
                setNbCardsToReviseThisWeek(result);
            });
            return;
        }

        setDelay(getDelay(newCard.nextRevision));
    };

    const updateCardsToRevise = (newCardsToRevise: FlashCardType[]) => {
        setCardsToRevise(newCardsToRevise);
        if (newCardsToRevise?.length > 0) {
            udpateCardToShow(newCardsToRevise[0]);
        } else {
            getForgottenCards(database).then((cardsResult) => {
                shuffle(cardsResult);
                cardsResult = preventCardToBeFirst(cardToShow, cardsResult);
                updateForgottenCards(cardsResult);
                setInSecondPhase(true);
            });
            setPreviousCard(undefined);
        }
    };

    const updateForgottenCards = (newForgottenCards: FlashCardType[]) => {
        if (forgottenCards.length === 1) {
            setPreviousCard(undefined);
        }
        setForgottenCards(newForgottenCards);
        udpateCardToShow(newForgottenCards[0]);
    };

    const handlePrevious = () => {
        if (inSecondPhase) {
            if (isLastItem(previousCard, forgottenCards)) {
                updateForgottenCards([previousCard, ...forgottenCards.slice(0, -1)]);
            } else {
                updateForgottenCards([previousCard, ...forgottenCards]);
                addForgottenCard(database, previousCard.id);
            }
        } else {
            updateCardsToRevise([previousCard, ...cardsToRevise]);
            removeForgottenCard(database, previousCard.id);
            decrementStatOfToday(database, previousStatIncremented);
            cancelLastActionOnCard(
                database,
                previousCard.id,
                previousCard.step,
                previousCard.nextRevision,
                previousCard.rectoFirst,
            );
        }
        setPreviousCard(undefined);
        setPreviousStatIncremented(undefined);
    };

    const handleNext = (dailyAction: DailyAction) => {
        setPreviousCard(cardToShow);

        if (inSecondPhase) {
            if (dailyAction === 'known') {
                removeForgottenCard(database, cardToShow.id);
                updateForgottenCards(forgottenCards.slice(1));
            } else if (dailyAction === 'forgotten') {
                updateForgottenCards([...forgottenCards.slice(1), cardToShow]);
            }
            return;
        }

        if (dailyAction === 'known') {
            incrementStatOfToday(database, 'nbKnown');
            setPreviousStatIncremented('nbKnown');
            putCardToNextStep(
                database,
                intervals,
                cardToShow.id,
                cardToShow.step,
                cardToShow.rectoFirst,
                cardToShow.changeSide,
                stopLearning,
            );
        } else if (dailyAction === 'difficult') {
            incrementStatOfToday(database, 'nbKnown');
            setPreviousStatIncremented('nbKnown');
            putCardToSameStep(database, intervals, cardToShow.id, cardToShow.step, cardToShow.rectoFirst, cardToShow.changeSide);
        } else if (dailyAction === 'almost') {
            incrementStatOfToday(database, 'nbForgotten');
            setPreviousStatIncremented('nbForgotten');
            addForgottenCard(database, cardToShow.id);
            putCardToPreviousStep(database, intervals, cardToShow.id, cardToShow.step);
        } else if (dailyAction === 'forgotten') {
            incrementStatOfToday(database, 'nbForgotten');
            setPreviousStatIncremented('nbForgotten');
            addForgottenCard(database, cardToShow.id);
            if (hardThrowback || advancedRevisionMode) {
                putCardToReviseTommorow(database, cardToShow.id);
            } else {
                putCardToPreviousStep(
                    database,
                    intervals,
                    cardToShow.id,
                    cardToShow.step,
                );
            }
        }
        updateCardsToRevise(cardsToRevise.slice(1));
    };

    const getHelpText = () => {
        if (advancedRevisionMode) {
            return t('daily.help.known') + t('daily.help.difficult') + t('daily.help.almost') + t('daily.help.forgotten');
        }
        if (hardThrowback) {
            return t('daily.help.known') + t('daily.help.forgottenHard');
        }
        return t('daily.help.known') + t('daily.help.forgottenSoft');
    }

    return (
        <>
            <View style={[GlobalStyles.container, { backgroundColor: colors.primary }]}>
                <Appbar.Header style={{ backgroundColor: colors.elevation.level1 }}>
                    <Appbar.Content title={t('daily.title')} titleStyle={{ width: '140%' }} />
                    <Appbar.Content
                        title={cardsToRevise.length + forgottenCards.length > 0 ? (cardsToRevise.length + forgottenCards.length).toString() : ''}
                        titleStyle={{ marginHorizontal: 'auto' }}
                    />
                    <Appbar.Action icon="help" onPressIn={() => setShowHelpDialog(true)} />
                </Appbar.Header>
                {cardToShow ? (
                    <>
                        <FlashCard
                            recto={cardToShow.recto}
                            verso={cardToShow.verso}
                            rectoImage={cardToShow.rectoImage}
                            versoImage={cardToShow.versoImage}
                            deckName={cardToShow.name}
                            delay={delay}
                            backgroundColor={Colors.daily.simple.main}
                            textDeckColor={Colors.daily.dark.main}
                            previousPossible={previousCard !== undefined}
                            handlePrevious={handlePrevious}
                        />
                        <View style={GlobalStyles.flashButtonContainer}>
                            <FlashButton
                                text={t('daily.forgotten')}
                                backgroundColor={Colors.daily.light.main}
                                textColor={Colors.daily.light.contrast}
                                handleClick={() => handleNext('forgotten')}
                            />
                            {(advancedRevisionMode && !inSecondPhase) && (
                                <>
                                    <FlashButton
                                        text={t('daily.almost')}
                                        backgroundColor={Colors.daily.middleLight.main}
                                        textColor={Colors.daily.middleLight.contrast}
                                        handleClick={() => handleNext('almost')}
                                    /><FlashButton
                                        text={t('daily.difficult')}
                                        backgroundColor={Colors.daily.middleDark.main}
                                        textColor={Colors.daily.middleDark.contrast}
                                        handleClick={() => handleNext('difficult')}
                                    />
                                </>)}
                            <FlashButton
                                text={t('daily.known')}
                                backgroundColor={Colors.daily.intermediate.main}
                                textColor={Colors.daily.intermediate.contrast}
                                handleClick={() => handleNext('known')}
                            />
                        </View>
                    </>
                ) : (
                    <View style={styles.container}>
                        <Text variant='titleMedium' style={[GlobalStyles.centerText, { color: colors.onPrimary }]}>{t('daily.over')}</Text>
                        <View>
                            <Text variant='headlineLarge' style={{ color: colors.onPrimary }}>{t('days.today')}</Text>
                            <Text variant='bodyLarge' style={{ color: colors.onPrimary }}>{t('daily.cardsReviewed')} : {nbRevised}</Text>
                            <Text variant='bodyLarge' style={{ color: colors.onPrimary }}>{t('daily.cardsKnown')} : {nbKnown}</Text>
                            <Text variant='bodyLarge' style={{ color: colors.onPrimary }}>{t('daily.cardsForgotten')} : {nbForgotten}</Text>
                        </View>
                        <View>
                            <Text variant='headlineLarge' style={{ color: colors.onPrimary }}>{t('daily.weekRevisions')}</Text>
                            {nbCardsToReviseThisWeek.map((nbCardsToRevise) => {
                                const revisionDate = new Date();
                                revisionDate.setDate(revisionDate.getDate() + nbCardsToRevise.daysFromToday);

                                let dayLabel: string;
                                if (nbCardsToRevise.daysFromToday === 1) {
                                    dayLabel = t('days.tomorrow');
                                } else {
                                    const weekdayIndex = revisionDate.getDay();
                                    dayLabel = t(`days.${weekdayIndex}`);
                                }

                                return (
                                    <Text variant='bodyLarge' style={{ color: colors.onPrimary }} key={nbCardsToRevise.daysFromToday}>
                                        {dayLabel} : {nbCardsToRevise.nbCards}
                                    </Text>
                                );
                            })}
                        </View>
                    </View>
                )}
            </View>

            <InfoDialog
                visible={showHelpDialog}
                hideDialog={() => setShowHelpDialog(false)}
                title={t('common.help')}
                text={getHelpText()}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        rowGap: 16,
    },
});
