import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, FC, ReactNode, useContext } from 'react';
import useSettings from '../hooks/useSettings';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsContextType {
  hardThrowback: boolean;
  stopLearning: boolean;
  advancedRevisionMode: boolean;
  intervals: number[];
  setSettings: (
    newIntervals: number[],
    newHardThrowback: boolean,
    newStopLearning: boolean,
    newAdvancedRevisionMode: boolean,
  ) => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
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

  const setLanguage = async (language: string) => {
    const currentLanguage = getCurrentLanguage();
    if (currentLanguage === language) return;

    let newLanguage = language;
    try {
      changeLanguage(newLanguage);
    } catch {
      changeLanguage('fr');
      newLanguage = 'fr';
    }

    AsyncStorage.setItem('language', newLanguage).catch(
      (error) => console.error(error),
    );
  }

  return (
    <SettingsContext.Provider value={{
      ...settings,
      setLanguage,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
