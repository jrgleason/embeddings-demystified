import {StrictMode} from 'react'
import {StyledEngineProvider} from '@mui/material/styles';
import {createRoot} from 'react-dom/client'
import {ThemeProvider} from './ThemeContext'
import AppWithTheme from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <StyledEngineProvider enableCssLayer>
            <ThemeProvider>
                <AppWithTheme/>
            </ThemeProvider>
        </StyledEngineProvider>
    </StrictMode>,
)
