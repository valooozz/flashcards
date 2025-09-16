import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const useSettings = () => {
  const [hardThrowback, setHardThrowback] = useState(true);
  const [stopLearning, setStopLearning] = useState(false);
  const [advancedRevisionMode, setAdvancedRevisionMode] = useState(false);
  const [intervals, setIntervals] = useState([1, 2, 4, 7, 14, 30, 30, 30, 60]);

  useEffect(() => {
    AsyncStorage.getItem('intervals')
      .then((result) => {
        if (result) {
          setIntervals(JSON.parse(result));
        }
      })
      .catch((error) => console.log(error));

    AsyncStorage.getItem('hardThrowback')
      .then((result) => {
        if (result) {
          setHardThrowback(JSON.parse(result));
        }
      })
      .catch((error) => console.log(error));

    AsyncStorage.getItem('stopLearning')
      .then((result) => {
        if (result) {
          setStopLearning(JSON.parse(result));
        }
      })
      .catch((error) => console.log(error));

    AsyncStorage.getItem('advancedRevisionMode')
      .then((result) => {
        if (result) {
          setAdvancedRevisionMode(JSON.parse(result));
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const saveSettings = async (newIntervals: number[], newHardThrowback: boolean, newStopLearning: boolean, newAdvancedRevisionMode: boolean) => {
    AsyncStorage.setItem('intervals', JSON.stringify(newIntervals)).catch(
      (error) => console.log(error),
    );

    AsyncStorage.setItem('hardThrowback', JSON.stringify(newHardThrowback)).catch(
      (error) => console.log(error),
    );

    AsyncStorage.setItem('stopLearning', JSON.stringify(newStopLearning)).catch(
      (error) => console.log(error),
    );

    AsyncStorage.setItem('advancedRevisionMode', JSON.stringify(newAdvancedRevisionMode)).catch(
      (error) => console.log(error),
    );
  };

  const setSettings = async (
    newIntervals: number[],
    newHardThrowback: boolean,
    newStopLearning: boolean,
    newAdvancedRevisionMode: boolean,
  ) => {
    if (newIntervals.length !== 9) {
      console.error(
        "La liste des intervalles n'est pas de la bonne longueur : " +
        newIntervals.length,
      );
    }

    setIntervals(newIntervals);
    setHardThrowback(newHardThrowback);
    setStopLearning(newStopLearning);
    setAdvancedRevisionMode(newAdvancedRevisionMode);
    saveSettings(newIntervals, newHardThrowback, newStopLearning, newAdvancedRevisionMode);
  };

  const resetSettings = async () => {
    setSettings([1, 2, 4, 7, 14, 30, 30, 30, 60], true, false, false);
  };

  return { hardThrowback, stopLearning, advancedRevisionMode, intervals, setSettings, resetSettings };
};

export default useSettings;
