import { router, Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toolbar } from '../components/bar/Toolbar';
import { ButtonModal } from '../components/button/ButtonModal';
import { CheckboxWithText } from '../components/text/CheckboxWithText';
import { Header } from '../components/text/Header';
import { SettingStep } from '../components/text/SettingStep';
import { useSettingsContext } from '../context/SettingsContext';
import { Colors } from '../style/Colors';
import { Sizes } from '../style/Sizes';
import { globalStyles } from '../style/Styles';
import { alertAction } from '../utils/alertAction.utils';
import { notify } from '../utils/notify.utils';

export default function Modal() {
  const [newHardThrowback, setNewHardThrowback] = useState(true);
  const [newStopLearning, setNewStopLearning] = useState(false);
  const [step0, setStep0] = useState('1');
  const [step1, setStep1] = useState('2');
  const [step2, setStep2] = useState('4');
  const [step3, setStep3] = useState('7');
  const [step4, setStep4] = useState('14');
  const [step5, setStep5] = useState('30');
  const [step6, setStep6] = useState('30');
  const [step7, setStep7] = useState('30');
  const [step8, setStep8] = useState('60');

  const { hardThrowback, stopLearning, intervals, setSettings, resetSettings } =
    useSettingsContext();

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
    );
    router.back();
    notify(true, '', 'Paramètres mis à jour');
  };

  useFocusEffect(
    useCallback(() => {
      setNewHardThrowback(hardThrowback);
      setNewStopLearning(stopLearning);
      setStep0(String(intervals[0]));
      setStep1(String(intervals[1]));
      setStep2(String(intervals[2]));
      setStep3(String(intervals[3]));
      setStep4(String(intervals[4]));
      setStep5(String(intervals[5]));
      setStep6(String(intervals[6]));
      setStep7(String(intervals[7]));
      setStep8(String(intervals[8]));
    }, [hardThrowback, stopLearning, intervals]),
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ title: 'Settings', headerShown: false }} />
      <Toolbar color={Colors.library.light.contrast} />
      <Header
        level={1}
        text="Paramètres"
        color={Colors.library.light.contrast}
      />
      <View style={styles.container}>
        <CheckboxWithText
          isChecked={newHardThrowback}
          setIsChecked={setNewHardThrowback}
          textLabel="Revenir à la première étape lors d'un oubli"
        />
        <CheckboxWithText
          isChecked={newStopLearning}
          setIsChecked={setNewStopLearning}
          textLabel="Arrêter de réviser les cartes qui passent la dernière étape"
        />
        <Header
          level={3}
          text="Jours d'espacement"
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
        <View style={styles.buttonLineContainer}>
          <ButtonModal text="Annuler" onPress={() => router.back()} />
          <ButtonModal text="Enregistrer" onPress={handleValidate} />
        </View>
        <View style={styles.buttonBottom}>
          <ButtonModal
            text="Réinitialiser les paramètres"
            onPress={() =>
              alertAction(
                'Réinitialiser',
                'revenir aux paramètres par défaut',
                resetSettings,
              )
            }
          />
        </View>
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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  stepsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 24,
    rowGap: 8,
  },
  buttonLineContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonBottom: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    gap: 8,
    height: Sizes.component.small,
  },
});
