import {ThemeProvider as MuiThemeProvider} from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {routes} from './routes';
import {useThemeMode} from './hooks/useThemeMode';
import {createAppTheme} from './theme';

const router = createBrowserRouter(routes);

// Component that consumes the theme context
function AppWithTheme() {
    const {mode} = useThemeMode();
    const theme = createAppTheme(mode);

    return (
        <MuiThemeProvider theme={theme}>
            <GlobalStyles styles="@layer theme, base, mui, components, utilities;"/>
            <RouterProvider router={router}/>
        </MuiThemeProvider>
    );
}

export default AppWithTheme;
