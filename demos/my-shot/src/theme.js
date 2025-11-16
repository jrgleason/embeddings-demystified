import { createTheme } from '@mui/material/styles';

// Create a theme that uses Tailwind CSS custom properties for typography
// Note: Colors are handled via Tailwind classes rather than MUI theme
// because CSS variables can't be used in createTheme (MUI needs actual color values)
const theme = createTheme({
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

export default theme;
