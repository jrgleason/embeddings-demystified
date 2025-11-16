import { StrictMode } from 'react'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import { routes } from './routes'
import theme from './theme'
import './index.css'

const router = createBrowserRouter(routes);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StyledEngineProvider enableCssLayer>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
)
