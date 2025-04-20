import { createContext, FC, ReactNode, useContext } from 'react';
import useSettings from '../hooks/useSettings';

interface SettingsContextType {
  hardThrowback: boolean;
  stopLearning: boolean;
  intervals: number[];
  setSettings: (
    newIntervals: number[],
    newHardThrowback: boolean,
    newStopLearning: boolean,
  ) => Promise<void>;
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
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
