import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { logout } from '../redux/slices/AuthSlice';

function LogoutModel({ logoutDisplay, cancelLogout }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleLogout = async () => {
        await dispatch(logout());
        navigate('/login')
        Cookies.remove('authToken')
    }

    return (
        <div className='logout-model' style={{ display: logoutDisplay }}>
            <div className='logout-container'>
                <p>Are you sure you want to Logout? </p>
                <div className="logout-buttons">
                    <button className="delete-button" onClick={handleLogout}>Yes, logout</button>
                    <button className="cancel" onClick={cancelLogout}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default LogoutModel
