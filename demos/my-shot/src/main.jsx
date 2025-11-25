import { StrictMode, useMemo } from 'react'
import { StyledEngineProvider, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import { routes } from './routes'
import { ThemeProvider, useThemeMode } from './ThemeContext'
import { createAppTheme } from './theme'
import './index.css'

const router = createBrowserRouter(routes);

// Component that consumes the theme context
function AppWithTheme() {
  const { mode } = useThemeMode();
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <MuiThemeProvider theme={theme}>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <RouterProvider router={router} />
    </MuiThemeProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyledEngineProvider enableCssLayer>
      <ThemeProvider>
        <AppWithTheme />
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
)
