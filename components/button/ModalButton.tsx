import { Button, useTheme } from "react-native-paper";

interface PrimaryButtonProps {
    text: string;
    onPress?: () => void;
    onPressIn?: () => void;
    variant: 'primary' | 'secondary' | 'tertiary';
}

export const ModalButton = ({ text, onPress, onPressIn, variant }: PrimaryButtonProps) => {
    const { colors } = useTheme();

    const textColor = variant === 'primary' ? colors.onPrimary : variant === 'secondary' ? colors.onSecondary : colors.primary;
    const buttonColor = variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.secondary : colors.onPrimary;

    return (
        <Button mode="elevated" textColor={textColor} buttonColor={buttonColor} onPress={onPress} onPressIn={onPressIn}>
            {text}
        </Button>
    )
}