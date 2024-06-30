import '../../styles/Auth.css'

import Cookies from 'js-cookie';
import { useState } from 'react';
import { CiLock } from "react-icons/ci";
import { FaRegEnvelope } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import logo from '../../assets/logo.png'
import { login } from '../../redux/slices/AuthSlice';
function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const token = import.meta.env.VITE_ACCESS_TOKEN
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors, [name]: ''
        }))
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = { ...errors };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) {
            formIsValid = false;
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            formIsValid = false;
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            formIsValid = false;
            newErrors.password = 'Password is required';
        }

        if (formIsValid) {
            const response = await dispatch(login(formData));
            if (response.payload?.success) {
                setFormData({
                    email: '',
                    password: ''
                })
                navigate('/board')
                Cookies.set('authToken', token, { expires: 7 });
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className="register-container">
            <div className="welcome-section">
                <div className="welcome-image">
                    <span className="color"></span>
                    <img src={logo} alt="logo" />
                </div>
                <div className="welcome-text">
                    <h1>Welcome aboard my friend</h1>
                    <p>just a couple of clicks and we start</p>
                </div>
            </div>
            <div className="form-section">
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <div className="form-inputs">
                        <div className="input-container">
                            <div className="form-input">
                                <FaRegEnvelope color='#828282' />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            <span className="error">{errors.email}</span>
                        </div>
                        <div className="input-container">
                            <div className="form-input">
                                <CiLock color='#828282' />
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    autoComplete="off"
                                    required
                                />
                                {isPasswordVisible ? (
                                    <FiEye color='#828282' onClick={togglePasswordVisibility} cursor='pointer' />
                                ) : (
                                    <FiEyeOff color='#828282' onClick={togglePasswordVisibility} cursor='pointer' />
                                )}
                            </div>
                            <span className="error">{errors.password}</span>
                        </div>
                    </div>
                    <div className='form-buttons'>
                        <button type="submit">Log in</button>
                        <p>Have no account yet ?</p>
                        <Link to={'/'} className='login'>Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
