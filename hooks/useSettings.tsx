import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const useSettings = () => {
  const [hardThrowback, setHardThrowback] = useState(true);

  const [intervals, setIntervals] = useState([1, 2, 4, 7, 14, 30, 30, 30, 60]);

  useEffect(() => {
    AsyncStorage.getItem('intervals')
      .then((result) => {
        if (result) {
          console.log('Intervalles:', result);
          setIntervals(JSON.parse(result));
        }
      })
      .catch((error) => console.log(error));

    AsyncStorage.getItem('hardThrowback')
      .then((result) => {
        if (result) {
          console.log('hardThrowback:', result);
          setHardThrowback(JSON.parse(result));
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const saveSettings = async () => {
    AsyncStorage.setItem('intervals', JSON.stringify(intervals)).catch(
      (error) => console.log(error),
    );

    AsyncStorage.setItem('hardThrowback', JSON.stringify(hardThrowback)).catch(
      (error) => console.log(error),
    );
  };

  const setSettings = async (
    newIntervals: number[],
    newHardThrowback: boolean,
  ) => {
    if (newIntervals.length !== 9) {
      console.error(
        "La liste des intervalles n'est pas de la bonne longueur : " +
          newIntervals.length,
      );
    }

    setIntervals(newIntervals);
    setHardThrowback(newHardThrowback);
    saveSettings();
  };

  return { hardThrowback, intervals, setSettings };
};

export default useSettings;
