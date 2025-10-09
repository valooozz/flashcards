import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { InfoButton } from "../button/InfoButton";

interface TitleWithInfoProps {
    textLabel: string;
    textExplanation: string;
}

export const TitleWithInfo = ({ textLabel, textExplanation }: TitleWithInfoProps) => {
    return (
        <View style={styles.container}>
            <Text variant='titleMedium' style={styles.text}>{textLabel}</Text>
            <View style={styles.infoButton}>
                <InfoButton textLabel={textLabel} textExplanation={textExplanation} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginRight: 0,
    },
    infoButton: {
        position: 'absolute',
        right: -8,
    }
})