import {Link as RouterLink, useLocation} from 'react-router-dom';
import {IconButton, Link, Tooltip} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {useThemeMode} from '../../hooks/useThemeMode';

function MainNavbar({title}) {
    const {mode, toggleTheme} = useThemeMode();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const getLinkStyles = (path) => ({
        fontWeight: isActive(path) ? 600 : 400,
        color: isActive(path) ? 'primary.main' : 'text.primary',
        borderBottom: isActive(path) ? '2px solid' : 'none',
        borderColor: 'primary.main',
        paddingBottom: '2px',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline'
        }
    });

    return (
        <nav className="border-b border-theme bg-header">
            <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="flex items-center gap-3">
                    <img
                        src={mode === 'light' ? '/computer-black.svg' : '/computer-white.svg'}
                        alt="Computer icon"
                        className="w-8 h-8"
                    />
                    <h1 className="text-xl font-semibold">{title}</h1>
                </div>
                <div className="flex items-center gap-6">
                    <Link
                        component={RouterLink}
                        to="/"
                        sx={getLinkStyles('/')}
                    >
                        Home
                    </Link>
                    <Link
                        component={RouterLink}
                        to="/embedding-display"
                        sx={getLinkStyles('/embedding-display')}
                    >
                        Embedding
                    </Link>
                    <Link
                        component={RouterLink}
                        to="/vector-store"
                        sx={getLinkStyles('/vector-store')}
                    >
                        Vector Store
                    </Link>
                    <Link
                        component={RouterLink}
                        to="/tsne-viz"
                        sx={getLinkStyles('/tsne-viz')}
                    >
                        t-SNE Viz
                    </Link>
                    <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                        <IconButton onClick={toggleTheme} color="inherit" size="small">
                            {mode === 'light' ? <Brightness4Icon/> : <Brightness7Icon/>}
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </nav>
    )
}

export default MainNavbar
