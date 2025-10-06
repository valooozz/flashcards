import React, { useState } from "react";
import { BottomNavigation, Icon } from "react-native-paper";
import { Daily } from "../components/tab/Daily";
import { Home } from "../components/tab/Home";
import { Learning } from "../components/tab/Learning";
import { useTranslation } from "../hooks/useTranslation";

export default function Index() {
    const [index, setIndex] = useState(0);

    const { t } = useTranslation();

    const routes = [
        { key: 'home', title: t('library.title'), icon: 'bookmark-box-multiple' },
        { key: 'daily', title: t('daily.title'), icon: 'cards' },
        { key: 'learning', title: t('learning.title'), icon: 'heart' },
    ];

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'home':
                return <Home />;
            case 'daily':
                return <Daily />;
            case 'learning':
                return <Learning />;
            default:
                return null;
        }
    };

    return (
        <>
            {renderScene({ route: routes[index] })}
            <BottomNavigation.Bar
                navigationState={{ index, routes }}
                onTabPress={({ route }) => {
                    const newIndex = routes.findIndex((r) => r.key === route.key);
                    if (newIndex !== -1) {
                        setIndex(newIndex);
                    }
                }}
                renderIcon={({ route, color }) => (
                    <Icon source={route.icon} size={24} color={color} />
                )}
                getLabelText={({ route }) => route.title}
            />
        </>
    );
}