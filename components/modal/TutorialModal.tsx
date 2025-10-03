import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '../../hooks/useTranslation';
import { Colors } from '../../style/Colors';
import { Radius } from '../../style/Radius';
import { Sizes } from '../../style/Sizes';
import { TutorialSlide } from '../../types/TutorialSlide';

interface TutorialModalProps {
    visible: boolean;
    slides: TutorialSlide[];
    onSkip: () => void;
    onDone: () => void;
}

export const TutorialModal = ({ visible, slides, onSkip, onDone }: TutorialModalProps) => {
    const { width } = Dimensions.get('window');
    const [index, setIndex] = useState(0);
    const flatListRef = useRef<FlatList<TutorialSlide>>(null);

    const { t } = useTranslation();

    const isLast = useMemo(() => index === slides.length - 1, [index, slides.length]);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const xOffset = e.nativeEvent.contentOffset.x;
        const newIndex = Math.round(xOffset / width);
        if (newIndex !== index) {
            setIndex(newIndex);
        }
    };

    const goNext = () => {
        if (isLast) {
            onDone();
            return;
        }
        const nextIndex = Math.min(index + 1, slides.length - 1);
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setIndex(nextIndex);
    };

    const goPrev = () => {
        const prevIndex = Math.max(index - 1, 0);
        flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
        setIndex(prevIndex);
    };

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.backdrop}>
                <View style={styles.container}>
                    <FlatList
                        ref={flatListRef}
                        data={slides}
                        keyExtractor={(item) => item.key}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        renderItem={({ item }) => (
                            <View style={[styles.slide, { width }]}>
                                {item.hasTitle && (
                                    <Text style={styles.title}>{t(`tuto.${item.key}.title`)}</Text>
                                )}
                                <Image source={item.image} style={styles.image} resizeMode="contain" />
                                <Text style={styles.text}>{t(`tuto.${item.key}.text`)}</Text>
                            </View>
                        )}
                    />

                    <View style={styles.dotsContainer}>
                        {slides.map((_, i) => (
                            <View key={i} style={[styles.dot, i === index ? styles.dotActive : undefined]} />
                        ))}
                    </View>

                    <View style={styles.buttonsContainer}>
                        {index > 0 ? (
                            <TouchableOpacity onPress={goPrev} style={[styles.button, styles.secondaryButton]}>
                                <MaterialIcons name="navigate-before" size={40} color={Colors.logo.tertiary} />
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: '25%' }} />
                        )}

                        <TouchableOpacity onPress={onSkip} style={styles.button}>
                            <MaterialIcons name={'close'} size={40} color={Colors.logo.tertiary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={goNext} style={[styles.button, styles.primaryButton]}>
                            <MaterialIcons name={isLast ? 'done' : 'navigate-next'} size={40} color={Colors.logo.tertiary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: Colors.logo.background,
        width: '100%',
        height: '100%',
        paddingVertical: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        overflow: 'hidden',
    },
    slide: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '60%',
        borderRadius: Radius.big,
    },
    title: {
        fontFamily: 'JosefinSemiBold',
        fontSize: Sizes.font.large,
        color: Colors.logo.tertiary,
        textAlign: 'center',
    },
    text: {
        fontFamily: 'JosefinRegular',
        fontSize: Sizes.font.small,
        color: Colors.logo.tertiary,
        textAlign: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 6,
        paddingVertical: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.navigation.light,
    },
    dotActive: {
        backgroundColor: Colors.navigation.dark,
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    button: {
        borderRadius: Radius.small,
        paddingVertical: 8,
        width: '25%',
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: Colors.logo.primary,
    },
    secondaryButton: {
        backgroundColor: Colors.logo.secondary,
    },
});


