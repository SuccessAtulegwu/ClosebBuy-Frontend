/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#10B981';
const tintColorDark = '#34D399';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#687076',
    primary: '#2563EB',
    background_input: '#F9F9F9',
    secondary: '#10B981',
    cardcolor: '#F9FAFB',
    accent: '#F97316',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    error: "#DC3545",
    success: "#8BC34A",
    warning: "#FFC107"
  },
  dark: {
    text: '#F9FAFB',
    background: '#111827',
    tint: tintColorDark,
    icon: '#9BA1A6',
    primary: '#3B82F6',
    cardcolor: '#1F2937',
    secondary: '#8BC34A',
    accent: '#F59E0B',
    tabIconDefault: '#9BA1A6',
    background_input: '#2C2C2C',
    tabIconSelected: tintColorDark,
    error: "#CF6679",
    success: "#03DAC5",
    warning: "#FF9800"
  },
};
