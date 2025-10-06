import { router, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Menu, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModalButton } from '../components/button/ModalButton';
import { ConfirmDialog } from '../components/dialog/ConfirmDialog';
import { QuitDialog } from '../components/dialog/QuitDialog';
import { CheckboxWithText } from '../components/text/CheckboxWithText';
import { SettingStep } from '../components/text/SettingStep';
import { useSettingsContext } from '../context/SettingsContext';
import { useTutorialContext } from '../context/TutorialContext';
import { useTranslation } from '../hooks/useTranslation';
import { GlobalStyles } from '../style/GlobalStyles';
import { notify } from '../utils/notify.utils';

export default function Modal() {
  const [newHardThrowback, setNewHardThrowback] = useState(true);
  const [newStopLearning, setNewStopLearning] = useState(false);
  const [newAdvancedRevisionMode, setNewAdvancedRevisionMode] = useState(false);
  const [step0, setStep0] = useState(1);
  const [step1, setStep1] = useState(2);
  const [step2, setStep2] = useState(4);
  const [step3, setStep3] = useState(7);
  const [step4, setStep4] = useState(14);
  const [step5, setStep5] = useState(30);
  const [step6, setStep6] = useState(30);
  const [step7, setStep7] = useState(30);
  const [step8, setStep8] = useState(60);
  const [initialHardThrowback, setInitialHardThrowback] = useState(true);
  const [initialStopLearning, setInitialStopLearning] = useState(false);
  const [initialAdvancedRevisionMode, setInitialAdvancedRevisionMode] = useState(false);
  const [initialStep0, setInitialStep0] = useState(1);
  const [initialStep1, setInitialStep1] = useState(2);
  const [initialStep2, setInitialStep2] = useState(4);
  const [initialStep3, setInitialStep3] = useState(7);
  const [initialStep4, setInitialStep4] = useState(14);
  const [initialStep5, setInitialStep5] = useState(30);
  const [initialStep6, setInitialStep6] = useState(30);
  const [initialStep7, setInitialStep7] = useState(30);
  const [initialStep8, setInitialStep8] = useState(60);

  const [showQuitDialog, setShowQuitDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const { hardThrowback, stopLearning, advancedRevisionMode, intervals, setSettings, setLanguage, resetSettings } =
    useSettingsContext();
  const { setShowTutorial } = useTutorialContext();
  const { t } = useTranslation();

  const handleValidate = async () => {
    setSettings(
      [
        Number(step0),
        Number(step1),
        Number(step2),
        Number(step3),
        Number(step4),
        Number(step5),
        Number(step6),
        Number(step7),
        Number(step8),
      ],
      newHardThrowback,
      newStopLearning,
      newAdvancedRevisionMode
    );
    router.back();
    notify(true, '', t('settings.updatedSettings'));
  };

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    setShowLanguageMenu(false);
  }

  useFocusEffect(
    useCallback(() => {
      setNewHardThrowback(hardThrowback);
      setNewStopLearning(stopLearning);
      setNewAdvancedRevisionMode(advancedRevisionMode)
      setStep0(intervals[0]);
      setStep1(intervals[1]);
      setStep2(intervals[2]);
      setStep3(intervals[3]);
      setStep4(intervals[4]);
      setStep5(intervals[5]);
      setStep6(intervals[6]);
      setStep7(intervals[7]);
      setStep8(intervals[8]);
      setInitialHardThrowback(hardThrowback);
      setInitialStopLearning(stopLearning);
      setInitialAdvancedRevisionMode(advancedRevisionMode);
      setInitialStep0(intervals[0]);
      setInitialStep1(intervals[1]);
      setInitialStep2(intervals[2]);
      setInitialStep3(intervals[3]);
      setInitialStep4(intervals[4]);
      setInitialStep5(intervals[5]);
      setInitialStep6(intervals[6]);
      setInitialStep7(intervals[7]);
      setInitialStep8(intervals[8]);
    }, [hardThrowback, stopLearning, advancedRevisionMode, intervals]),
  );

  const hasChanged = (): boolean => {
    return (
      newHardThrowback !== initialHardThrowback ||
      newStopLearning !== initialStopLearning ||
      newAdvancedRevisionMode !== initialAdvancedRevisionMode ||
      step0 !== initialStep0 ||
      step1 !== initialStep1 ||
      step2 !== initialStep2 ||
      step3 !== initialStep3 ||
      step4 !== initialStep4 ||
      step5 !== initialStep5 ||
      step6 !== initialStep6 ||
      step7 !== initialStep7 ||
      step8 !== initialStep8
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: t('settings.title'), headerShown: false }} />
      <Appbar.Header>
        <Appbar.BackAction onPress={hasChanged() ? () => setShowQuitDialog(true) : () => router.back()} />
        <Appbar.Content title={t('settings.title')} />
        <Menu
          visible={showLanguageMenu}
          onDismiss={() => setShowLanguageMenu(false)}
          anchor={<Appbar.Action icon="ab-testing" onPress={() => setShowLanguageMenu(true)} />}
        >
          <Menu.Item title='Français' onPress={() => changeLanguage('fr')} />
          <Menu.Item title='English' onPress={() => changeLanguage('en')} />
        </Menu>
        <Appbar.Action icon="help" onPress={() => setShowTutorial(true)} />
        <Appbar.Action icon="restore" onPress={() => setShowConfirmDialog(true)} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={[GlobalStyles.modalContainer]}>
        <Text variant='titleLarge' style={GlobalStyles.titleCenter}>{t('settings.intervals')}</Text>
        <View style={styles.stepsContainer}>
          <SettingStep
            stepNumber={1}
            selectedStep={step0}
            setSelectedStep={setStep0}
          />
          <SettingStep
            stepNumber={2}
            selectedStep={step1}
            setSelectedStep={setStep1}
          />
          <SettingStep
            stepNumber={3}
            selectedStep={step2}
            setSelectedStep={setStep2}
          />
          <SettingStep
            stepNumber={4}
            selectedStep={step3}
            setSelectedStep={setStep3}
          />
          <SettingStep
            stepNumber={5}
            selectedStep={step4}
            setSelectedStep={setStep4}
          />
          <SettingStep
            stepNumber={6}
            selectedStep={step5}
            setSelectedStep={setStep5}
          />
          <SettingStep
            stepNumber={7}
            selectedStep={step6}
            setSelectedStep={setStep6}
          />
          <SettingStep
            stepNumber={8}
            selectedStep={step7}
            setSelectedStep={setStep7}
          />
          <SettingStep
            stepNumber={9}
            selectedStep={step8}
            setSelectedStep={setStep8}
          />
        </View>
        <View>
          <Text variant='titleLarge' style={GlobalStyles.titleCenter}>{t('settings.revisionSettings')}</Text>
          <CheckboxWithText
            isChecked={newHardThrowback}
            setIsChecked={setNewHardThrowback}
            textLabel={t('settings.hardThrowback')}
            textExplanation={t('settings.hardThrowbackExplanation')}
          />
          <CheckboxWithText
            isChecked={newStopLearning}
            setIsChecked={setNewStopLearning}
            textLabel={t('settings.stopLearning')}
            textExplanation={t('settings.stopLearningExplanation')}
          />
          <CheckboxWithText
            isChecked={newAdvancedRevisionMode}
            setIsChecked={setNewAdvancedRevisionMode}
            textLabel={t('settings.advancedMode')}
            textExplanation={t('settings.advancedModeExplanation')}
          />
        </View>
        <View style={GlobalStyles.buttonLineContainer}>
          <ModalButton variant='tertiary' text={t('common.cancel')} onPress={() => router.back()} />
          <ModalButton variant='primary' text={t('common.save')} onPress={handleValidate} />
        </View>
      </ScrollView>

      <QuitDialog
        visible={showQuitDialog}
        hideDialog={() => setShowQuitDialog(false)}
        saveAction={handleValidate}
      />

      <ConfirmDialog
        visible={showConfirmDialog}
        hideDialog={() => setShowConfirmDialog(false)}
        actionVerb={t('common.reset')}
        element={t('settings.resettingSettings')}
        onValidate={handleValidate}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  stepsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    columnGap: 24,
    rowGap: 8,
    marginBottom: 8,
  },
});
