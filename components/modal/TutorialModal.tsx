import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

    useEffect(() => {
        if (visible) {
            setIndex(0);
            requestAnimationFrame(() => {
                flatListRef.current?.scrollToIndex({ index: 0, animated: false });
            });
        }
    }, [visible]);

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

    const renderItem = useCallback(({ item }: { item: TutorialSlide }) => (
        <View style={[styles.slide, { width }]}>
            {item.hasTitle && (
                <Text style={styles.title}>{t(`tuto.${item.key}.title`)}</Text>
            )}
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <ScrollView style={styles.scrollText}>
                <Text style={styles.text}>{t(`tuto.${item.key}.text`)}</Text>
            </ScrollView>
        </View>
    ), [t, width]);

    const keyExtractor = useCallback((item: TutorialSlide) => item.key, []);

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.backdrop}>
                <View style={styles.container}>
                    <FlatList
                        ref={flatListRef}
                        data={slides}
                        keyExtractor={keyExtractor}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
                        onScrollToIndexFailed={(info) => {
                            requestAnimationFrame(() => {
                                flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                            });
                        }}
                        renderItem={renderItem}
                        initialNumToRender={3}
                        maxToRenderPerBatch={3}
                        windowSize={5}
                    />

                    <View style={styles.dotsContainer}>
                        {slides.map((_, i) => (
                            <View key={i} style={[styles.dot, i === index ? styles.dotActive : undefined]} />
                        ))}
                    </View>

                    <View style={styles.buttonsContainer}>
                        {index > 0 ? (
                            <TouchableOpacity onPress={goPrev} style={[styles.button, styles.leftButton]} testID='tuto-previous-button'>
                                <MaterialIcons name="navigate-before" size={40} color={Colors.library.dark.contrast} />
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: '30%' }} />
                        )}

                        <TouchableOpacity onPress={onSkip} style={[styles.button, styles.middleButton]} testID='tuto-close-button'>
                            <MaterialIcons name={'close'} size={40} color={Colors.daily.dark.contrast} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={goNext} style={[styles.button, styles.rightButton]} testID='tuto-next-button'>
                            <MaterialIcons name={isLast ? 'done' : 'navigate-next'} size={40} color={Colors.learning.dark.contrast} />
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
        backgroundColor: 'white',
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
        rowGap: 8
    },
    image: {
        width: '100%',
        height: '70%',
        borderRadius: Radius.big,
    },
    title: {
        fontFamily: 'JosefinSemiBold',
        fontSize: Sizes.font.medium,
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 8
    },
    scrollText: {
        flexGrow: 1,
    },
    text: {
        fontFamily: 'JosefinRegular',
        fontSize: Sizes.font.small,
        color: 'black',
        textAlign: 'center',
        paddingHorizontal: 16,
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
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    button: {
        borderRadius: Radius.small,
        paddingVertical: 8,
        width: '30%',
        alignItems: 'center',
    },
    rightButton: {
        backgroundColor: Colors.learning.dark.main,
    },
    middleButton: {
        backgroundColor: Colors.daily.dark.main,
    },
    leftButton: {
        backgroundColor: Colors.library.dark.main,
    },
});


