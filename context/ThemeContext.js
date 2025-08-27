import { createContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import { Colors } from '@/constants/Colors';

export const ThemeContext = createContext();
export default function ({ children }) {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
    const [theme, setTheme] = useState(colorScheme === 'dark' ? Colors.dark : Colors.light);
    useEffect(() => {
        const toggleTheme = () => {
            if (colorScheme === 'dark')
                setTheme(Colors.dark);
            else
                setTheme(Colors.light);
        }
        toggleTheme();
    }, [colorScheme])

    return (
        <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>{children}</ThemeContext.Provider>
    )

}