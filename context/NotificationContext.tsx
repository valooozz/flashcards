import { FC, ReactNode, createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Snackbar, useTheme } from 'react-native-paper';

type SnackbarVariant = 'default' | 'success' | 'error';

interface ShowOptions {
    duration?: number;
    actionLabel?: string;
    onActionPress?: () => void;
    variant?: SnackbarVariant;
}

interface NotificationContextType {
    showSnackbar: (message: string, options?: ShowOptions) => void;
    hideSnackbar: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return ctx;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
    const theme = useTheme();
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [actionLabel, setActionLabel] = useState<string | undefined>(undefined);
    const actionHandlerRef = useRef<(() => void) | undefined>(undefined);
    const [duration, setDuration] = useState<number | undefined>(3000);
    const [variant, setVariant] = useState<SnackbarVariant>('default');
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearExistingTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const hideSnackbar = useCallback(() => {
        clearExistingTimeout();
        setVisible(false);
    }, [clearExistingTimeout]);

    const showSnackbar = useCallback(
        (text: string, options?: ShowOptions) => {
            clearExistingTimeout();
            setMessage(text);
            setActionLabel(options?.actionLabel);
            actionHandlerRef.current = options?.onActionPress;
            setDuration(options?.duration ?? 3000);
            setVariant(options?.variant ?? 'default');
            setVisible(true);

            const autoDuration = options?.duration ?? 3000;
            if (autoDuration && autoDuration > 0) {
                timeoutRef.current = setTimeout(() => {
                    setVisible(false);
                    timeoutRef.current = null;
                }, autoDuration);
            }
        },
        [clearExistingTimeout],
    );

    const value = useMemo(
        () => ({ showSnackbar, hideSnackbar }),
        [showSnackbar, hideSnackbar],
    );

    const backgroundColor = useMemo(() => {
        switch (variant) {
            case 'success':
                return theme.colors.inversePrimary;
            case 'error':
                return theme.colors.error;
            default:
                return theme.colors.inverseOnSurface;
        }
    }, [variant, theme.colors]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <Snackbar
                visible={visible}
                onDismiss={hideSnackbar}
                duration={duration}
                style={{ backgroundColor, marginBottom: 96 }}
                onIconPress={hideSnackbar}
                action={actionLabel ? { label: actionLabel, onPress: () => actionHandlerRef.current?.() } : undefined}
                theme={{
                    colors: {
                        inverseOnSurface: theme.colors.onPrimaryContainer,
                    }
                }}
            >
                {message}
            </Snackbar>
        </NotificationContext.Provider>
    );
};
