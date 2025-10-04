import { createContext, FC, ReactNode, useContext, useState } from 'react';

interface TutorialContextType {
    showTutorial: boolean;
    setShowTutorial: (show: boolean) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const useTutorialContext = (): TutorialContextType => {
    const context = useContext(TutorialContext);
    if (!context) {
        throw new Error('useTutorialContext must be used within a TutorialProvider');
    }
    return context;
};

interface TutorialProviderProps {
    children: ReactNode;
}

export const TutorialProvider: FC<TutorialProviderProps> = ({ children }) => {
    const [showTutorial, setShowTutorial] = useState(false);

    return (
        <TutorialContext.Provider value={{ showTutorial, setShowTutorial }}>
            {children}
        </TutorialContext.Provider>
    );
};
