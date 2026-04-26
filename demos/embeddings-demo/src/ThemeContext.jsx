import {useEffect, useState} from 'react';
import {ThemeContext} from './hooks/useThemeMode';

export const ThemeProvider = ({children}) => {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('themeMode');
        return saved || 'light';
    });

    useEffect(() => {
        // Save to localStorage
        localStorage.setItem('themeMode', mode);

        // Update data-theme attribute for Tailwind CSS
        document.documentElement.setAttribute('data-theme', mode);
    }, [mode]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{mode, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};
