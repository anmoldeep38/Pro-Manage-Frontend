import Cookies from 'js-cookie';
import { Navigate, Outlet } from 'react-router-dom';

function UnprotectedRoute() {
    const token = Cookies.get('authToken');
    return token ? <Navigate to="/board" /> : <Outlet />;
}

export default UnprotectedRoute
