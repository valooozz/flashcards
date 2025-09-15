import { router, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toolbar } from '../components/bar/Toolbar';
import { BackButton } from '../components/button/BackButton';
import { ButtonModal } from '../components/button/ButtonModal';
import { ImportExportButton } from '../components/button/ImportExportButton';
import { LanguageButton } from '../components/button/LanguageButton';
import { CheckboxWithText } from '../components/text/CheckboxWithText';
import { Header } from '../components/text/Header';
import { SettingStep } from '../components/text/SettingStep';
import { useSettingsContext } from '../context/SettingsContext';
import { useTranslation } from '../hooks/useTranslation';
import { Colors } from '../style/Colors';
import { globalStyles } from '../style/Styles';
import { alertAction } from '../utils/alertAction.utils';
import { notify } from '../utils/notify.utils';

export default function Modal() {
  const [newHardThrowback, setNewHardThrowback] = useState(true);
  const [newStopLearning, setNewStopLearning] = useState(false);
  const [newAdvancedRevisionMode, setNewAdvancedRevisionMode] = useState(false);
  const [step0, setStep0] = useState('1');
  const [step1, setStep1] = useState('2');
  const [step2, setStep2] = useState('4');
  const [step3, setStep3] = useState('7');
  const [step4, setStep4] = useState('14');
  const [step5, setStep5] = useState('30');
  const [step6, setStep6] = useState('30');
  const [step7, setStep7] = useState('30');
  const [step8, setStep8] = useState('60');

  const { hardThrowback, stopLearning, advancedRevisionMode, intervals, setSettings, switchLanguage, resetSettings } =
    useSettingsContext();
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

  useFocusEffect(
    useCallback(() => {
      console.log(advancedRevisionMode);
      setNewHardThrowback(hardThrowback);
      setNewStopLearning(stopLearning);
      setNewAdvancedRevisionMode(advancedRevisionMode)
      setStep0(String(intervals[0]));
      setStep1(String(intervals[1]));
      setStep2(String(intervals[2]));
      setStep3(String(intervals[3]));
      setStep4(String(intervals[4]));
      setStep5(String(intervals[5]));
      setStep6(String(intervals[6]));
      setStep7(String(intervals[7]));
      setStep8(String(intervals[8]));
    }, [hardThrowback, stopLearning, advancedRevisionMode, intervals]),
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ title: t('settings.title'), headerShown: false }} />
      <Toolbar>
        <BackButton color={Colors.library.light.contrast} />
        <LanguageButton color={Colors.library.light.contrast} switchLanguage={switchLanguage} />
        <ImportExportButton color={Colors.library.light.contrast} />
      </Toolbar>
      <Header
        level={1}
        text={t('settings.title')}
        color={Colors.library.light.contrast}
      />
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollableWindow} showsVerticalScrollIndicator={false}>
        <Header
          level={3}
          text={t('settings.intervals')}
          color={Colors.library.light.contrast}
        />
        <View style={styles.stepsContainer}>
          <SettingStep
            textLabel="1 :"
            textInput={step0}
            setTextInput={setStep0}
          />
          <SettingStep
            textLabel="2 :"
            textInput={step1}
            setTextInput={setStep1}
          />
          <SettingStep
            textLabel="3 :"
            textInput={step2}
            setTextInput={setStep2}
          />
          <SettingStep
            textLabel="4 :"
            textInput={step3}
            setTextInput={setStep3}
          />
          <SettingStep
            textLabel="5 :"
            textInput={step4}
            setTextInput={setStep4}
          />
          <SettingStep
            textLabel="6 :"
            textInput={step5}
            setTextInput={setStep5}
          />
          <SettingStep
            textLabel="7 :"
            textInput={step6}
            setTextInput={setStep6}
          />
          <SettingStep
            textLabel="8 :"
            textInput={step7}
            setTextInput={setStep7}
          />
          <SettingStep
            textLabel="9 :"
            textInput={step8}
            setTextInput={setStep8}
          />
        </View>
        <Header
          level={3}
          text={t('settings.revisionSettings')}
          color={Colors.library.light.contrast}
        />
        <View style={styles.checkboxContainer}>
          <CheckboxWithText
            isChecked={newHardThrowback}
            setIsChecked={setNewHardThrowback}
            textLabel={t('settings.hardThrowback')}
          />
          <CheckboxWithText
            isChecked={newStopLearning}
            setIsChecked={setNewStopLearning}
            textLabel={t('settings.stopLearning')}
          />
          <CheckboxWithText
            isChecked={newAdvancedRevisionMode}
            setIsChecked={setNewAdvancedRevisionMode}
            textLabel={t('settings.advancedMode')}
          />
        </View>
        <View style={styles.buttonLineContainer}>
          <ButtonModal
            text={t('settings.resetSettings')}
            onPress={() =>
              alertAction(
                t('notifications.confirm'),
                t('common.reset'),
                t('settings.resettingSettings'),
                t('common.cancel'),
                resetSettings,
              )
            }
          />
        </View>
      </ScrollView>
      <View style={styles.buttonBottom}>
        <ButtonModal text={t('common.cancel')} onPress={() => router.back()} />
        <ButtonModal text={t('common.save')} onPress={handleValidate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...globalStyles.page,
    backgroundColor: Colors.library.light.main,
  },
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  scrollableWindow: {
    marginBottom: 16,
  },
  stepsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 24,
    rowGap: 8,
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    rowGap: 8,
  },
  buttonLineContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonBottom: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
