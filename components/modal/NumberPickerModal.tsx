import React, { useEffect, useRef } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';

interface NumberPickerModalProps {
    visible: boolean;
    items: number[];
    selectedItem: number;
    onSelect: (value: number) => void;
    onClose: () => void;
    title?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export function NumberPickerModal({
    visible,
    items,
    selectedItem,
    onSelect,
    onClose,
    title = 'Select Number',
}: NumberPickerModalProps) {
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSelect = (value: number) => {
        onSelect(value);
        onClose();
    };

    useEffect(() => {
        if (visible && scrollViewRef.current) {
            // Calculate the scroll position to center the selected item
            const itemWidth = 60; // width of each item
            const margin = 5; // marginHorizontal from styles
            const totalItemWidth = itemWidth + (margin * 2); // total width per item including margins

            // Find the index of the selected item
            const selectedIndex = items.findIndex(item => item === selectedItem);

            if (selectedIndex !== -1) {
                // Calculate scroll position to center the selected item
                const scrollPosition = selectedIndex * totalItemWidth - (screenWidth * 0.9 - totalItemWidth) / 2;

                // Use setTimeout to ensure the modal is fully rendered before scrolling
                setTimeout(() => {
                    scrollViewRef.current?.scrollTo({
                        x: Math.max(0, scrollPosition),
                        animated: true,
                    });
                }, 100);
            }
        }
    }, [visible, selectedItem, items]);

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            testID='number-picker-modal-title'
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <Text variant="titleMedium">{title}</Text>
                        <IconButton icon="close" onPress={onClose} />
                    </View>

                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        snapToInterval={70}
                        decelerationRate="normal"
                    >
                        {items.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.item,
                                    selectedItem === item && styles.selectedItem,
                                ]}
                                onPress={() => handleSelect(item)}
                            >
                                <Text variant='bodyLarge'>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: screenWidth * 0.9,
        maxHeight: 300,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    scrollContent: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    item: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 30,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedItem: {
        borderColor: 'black',
    },
});
