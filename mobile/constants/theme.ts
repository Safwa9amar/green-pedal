/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
import { DefaultTheme as DT, DarkTheme as DKT } from "@react-navigation/native";
import type { Theme } from "@react-navigation/native";

export interface GreenRideTheme extends Theme {
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    tabIconDefault: string;
    tabIconSelected: string;
    secondary: string;
    accent: string;
    surface: string;
    error: string;
    success: string;
    warning: string;
    logoGreen: string;
    leafGreen: string;
    tint: string;
  };
  fonts: any;
}

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    ...DT.colors,
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    primary: "#A5D6A7", // logo dark green
    secondary: "#00F5FF", // leaf green
    accent: "#18F8E3",
    surface: "#F5F5F5",
    error: "#FF5252",
    success: "#4CAF50",
    warning: "#FFC107",
    border: "#E0E0E0",
    card: "#FFFFFF",
    logoGreen: "#23451B",
    leafGreen: "#4BAA2B",
    notification: "#FFEB3B",
  },
  dark: {
    ...DKT.colors,
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    primary: "#23451B", // logo dark green
    secondary: "#4BAA2B", // leaf green
    accent: "#18F8E3",
    surface: "#222",
    error: "#FF5252",
    success: "#4CAF50",
    warning: "#FFC107",
    border: "#333",
    card: "#1A1A1A",
    logoGreen: "#23451B",
    leafGreen: "#4BAA2B",
    notification: "#FFEB3B",
  },
};

export const defaultTheme: GreenRideTheme = {
  ...DT,
  dark: false,
  colors: Colors.light,
};

export const darkTheme: GreenRideTheme = {
  ...DKT,
  dark: true,
  colors: Colors.dark,
};
