import { configureFonts, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { fontConfig } from "./Fonts";
import { dailyDarkColors, dailyLightColors, homeDarkColors, homeLightColors, learningDarkColors, learningLightColors } from "./ThemeColors";

export const homeLightTheme = { ...MD3LightTheme, colors: homeLightColors, fonts: configureFonts({ config: fontConfig }) };
export const homeDarkTheme = { ...MD3DarkTheme, colors: homeDarkColors, fonts: configureFonts({ config: fontConfig }) };

export const dailyLightTheme = { ...MD3LightTheme, colors: dailyLightColors, fonts: configureFonts({ config: fontConfig }) };
export const dailyDarkTheme = { ...MD3DarkTheme, colors: dailyDarkColors, fonts: configureFonts({ config: fontConfig }) };

export const learningLightTheme = { ...MD3LightTheme, colors: learningLightColors, fonts: configureFonts({ config: fontConfig }) };
export const learningDarkTheme = { ...MD3DarkTheme, colors: learningDarkColors, fonts: configureFonts({ config: fontConfig }) };