import {createTheme} from '@mui/material/styles';

// Create a theme that uses Tailwind CSS custom properties for typography
// This function accepts a mode parameter to generate light or dark theme
export const createAppTheme = (mode = 'light') => createTheme({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                primary: {
                    main: '#1976d2',
                },
                background: {
                    default: '#ffffff',
                    paper: '#f5f5f5',
                },
                text: {
                    primary: 'rgba(0, 0, 0, 0.87)',
                    secondary: 'rgba(0, 0, 0, 0.6)',
                },
            }
            : {
                primary: {
                    main: '#90caf9',
                },
                background: {
                    default: '#121212',
                    paper: '#1e1e1e',
                },
                text: {
                    primary: '#ffffff',
                    secondary: 'rgba(255, 255, 255, 0.7)',
                },
            }),
    },
    typography: {
        fontFamily: 'var(--font-mono)',
        fontSize: 16, // matches --text-base (1rem = 16px)

        // Map MUI typography variants to Tailwind theme values
        h1: {
            fontSize: 'var(--text-4xl)',
            lineHeight: 1.2,
        },
        h2: {
            fontSize: 'var(--text-3xl)',
            lineHeight: 1.3,
        },
        h3: {
            fontSize: 'var(--text-2xl)',
            lineHeight: 1.4,
        },
        h4: {
            fontSize: 'var(--text-xl)',
            lineHeight: 1.5,
        },
        h5: {
            fontSize: 'var(--text-lg)',
            lineHeight: 'var(--text-lg--line-height)',
        },
        h6: {
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--text-base--line-height)',
        },
        body1: {
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--text-base--line-height)',
        },
        body2: {
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--text-sm--line-height)',
        },
        caption: {
            fontSize: 'var(--text-xs)',
            lineHeight: 'var(--text-xs--line-height)',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    fontFamily: 'var(--font-mono)',
                },
            },
        },
    },
});

// Export default light theme for backward compatibility
export default createAppTheme('light');
