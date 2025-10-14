import { router } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { CardType } from '../../types/CardType';

interface ListCardProps {
    card: CardType;
    openDeck: (id: number, name: string) => void;
}

function SearchCardComponent({ card, openDeck }: ListCardProps) {

    const { colors } = useTheme();

    const handlePress = useCallback(() => {
        router.push(`/modalCard?idDeck=${card.deck}&idCard=${card.id}`)
    }, [card.deck, card.id]);

    const handleLongPress = useCallback(() => {
        openDeck(card.deck, card.name);
    }, [card.deck, card.name]);

    return (
        <Card
            style={[styles.card, { backgroundColor: colors.onPrimary }]}
            elevation={0}
        >
            <TouchableRipple
                onPress={handlePress}
                onLongPress={handleLongPress}
                delayLongPress={300}
                rippleColor={colors.backdrop}
            >
                <>
                    <Card.Title title={`${card.recto} | ${card.verso}`} />
                    <Card.Content style={styles.content}>
                        <Text variant='bodyMedium' style={{ color: colors.primary }}>{card.name}</Text>
                    </Card.Content>
                </>
            </TouchableRipple>
        </Card>
    )
}

const styles = StyleSheet.create({
    card: {
        overflow: 'hidden',
    },
    content: {
        marginBottom: 12,
    }
});

export const SearchCard = memo(SearchCardComponent);
