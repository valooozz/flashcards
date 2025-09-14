import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, FC, ReactNode, useContext } from 'react';
import useSettings from '../hooks/useSettings';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsContextType {
  hardThrowback: boolean;
  stopLearning: boolean;
  intervals: number[];
  setSettings: (
    newIntervals: number[],
    newHardThrowback: boolean,
    newStopLearning: boolean,
  ) => Promise<void>;
  switchLanguage: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export const useSettingsContext = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error(
      'useSettingsContext doit être utilisé dans un SettingsProvider',
    );
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: FC<SettingsProviderProps> = ({ children }) => {
  const settings = useSettings();
  const { changeLanguage, getCurrentLanguage } = useTranslation();

  const switchLanguage = async () => {
    const currentLanguage = getCurrentLanguage();
    let newLanguage = 'fr';

    if (currentLanguage === 'fr') {
      newLanguage = 'en';
    }

    changeLanguage(newLanguage);

    AsyncStorage.setItem('language', newLanguage).catch(
      (error) => console.log(error),
    );
  }

  return (
    <SettingsContext.Provider value={{
      ...settings,
      switchLanguage,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
