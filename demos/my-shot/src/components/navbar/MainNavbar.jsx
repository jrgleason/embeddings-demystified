import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

function MainNavbar({title}) {
    return (
        <nav className="border-b">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <h1 className="text-xl font-semibold">{title}</h1>
                <div className="flex items-center gap-6">
                    <Link component={RouterLink} to="/" underline="hover">
                        Home
                    </Link>
                    <Link component={RouterLink} to="/vector-store" underline="hover">
                        Vector Store
                    </Link>
                    <Link component={RouterLink} to="/lorem" underline="hover">
                        Lorem
                    </Link>
                </div>
            </div>
        </nav>
    )
}
export default MainNavbar