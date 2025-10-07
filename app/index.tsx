import React, { useState } from "react";
import { useColorScheme } from "react-native";
import { BottomNavigation, Icon, PaperProvider, Text } from "react-native-paper";
import { Daily } from "../components/tab/Daily";
import { Home } from "../components/tab/Home";
import { Learning } from "../components/tab/Learning";
import { useTranslation } from "../hooks/useTranslation";
import { dailyDarkTheme, dailyLightTheme, homeDarkTheme, homeLightTheme, learningDarkTheme, learningLightTheme } from "../style/Themes";

export default function Index() {
    const [index, setIndex] = useState(0);

    const { t } = useTranslation();

    const colorScheme = useColorScheme();
    const homeTheme = colorScheme === 'dark' ? homeDarkTheme : homeLightTheme;
    const dailyTheme = colorScheme === 'dark' ? dailyDarkTheme : dailyLightTheme;
    const learningTheme = colorScheme === 'dark' ? learningDarkTheme : learningLightTheme;

    const routes = [
        { key: 'home', title: t('library.title'), icon: 'bookmark-box-multiple', color: homeTheme.colors.primary },
        { key: 'daily', title: t('daily.title'), icon: 'cards', color: dailyTheme.colors.primary },
        { key: 'learning', title: t('learning.title'), icon: 'heart', color: learningTheme.colors.primary },
    ];

    const renderScene = ({ route }) => {
        switch (route.key) {
            case 'home':
                return (
                    <PaperProvider theme={homeTheme}>
                        < Home />
                    </PaperProvider>
                );
            case 'daily':
                return (
                    <PaperProvider theme={dailyTheme}>
                        <Daily />
                    </PaperProvider>
                );
            case 'learning':
                return (
                    <PaperProvider theme={learningTheme}>
                        <Learning />
                    </PaperProvider>
                );
            default:
                return null;
        }
    };

    const getActiveColor = () => {
        switch (routes[index].key) {
            case "home":
                return homeTheme.colors.elevation.level5;
            case "daily":
                return dailyTheme.colors.elevation.level5;
            case "learning":
                return learningTheme.colors.elevation.level5;
            default:
                return "#333";
        }
    }

    const getBarColor = () => {
        switch (routes[index].key) {
            case "home":
                return homeTheme.colors.elevation.level1;
            case "daily":
                return dailyTheme.colors.elevation.level1;
            case "learning":
                return learningTheme.colors.elevation.level1;
            default:
                return "#333";
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
                renderIcon={({ route }) => (
                    <Icon source={route.icon} size={24} color={route.color} />
                )}
                style={{
                    backgroundColor: getBarColor(),
                }}
                renderLabel={({ route }) => (
                    <Text variant="bodySmall" style={{ color: route.color, textAlign: 'center' }}>{route.title}</Text>
                )}
                activeIndicatorStyle={{
                    backgroundColor: getActiveColor(),
                }}
            />
        </>
    );
}