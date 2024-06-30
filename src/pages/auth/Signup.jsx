import '../../styles/Auth.css'

import { useState } from 'react';
import { CiLock } from "react-icons/ci";
import { FaRegEnvelope } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { TiUserOutline } from "react-icons/ti";
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import logo from '../../assets/logo.png'
import { createAccount } from '../../redux/slices/AuthSlice';
function Signup() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

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

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = { ...errors };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (!formData.name) {
            formIsValid = false;
            newErrors.name = 'Name is required';
        }
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
        } else if (!passwordRegex.test(formData.password)) {
            formIsValid = false;
            newErrors.password = 'Password must be at least 6 characters long and include both letters and numbers';
        }

        if (!formData.confirmPassword) {
            formIsValid = false;
            newErrors.confirmPassword = 'Confirm Password is required';
        } else if (formData.password !== formData.confirmPassword) {
            formIsValid = false;
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formIsValid) {
            const response = await dispatch(createAccount(formData));
            if (response.payload?.success) {
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                })
                navigate('/login')
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
                    <h2>Register</h2>
                    <div className="form-inputs">
                        <div className='input-container'>
                            <div className='form-input'>
                                <TiUserOutline color='#828282' />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                            <span className='error'>{errors.name}</span>
                        </div>
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
                        <div className="input-container">
                            <div className="form-input">
                                <CiLock color='#828282' />
                                <input
                                    type={isConfirmPasswordVisible ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    autoComplete="off"
                                    required
                                />
                                {isConfirmPasswordVisible ? (
                                    <FiEye color='#828282' onClick={toggleConfirmPasswordVisibility} cursor='pointer' />
                                ) : (
                                    <FiEyeOff color='#828282' onClick={toggleConfirmPasswordVisibility} cursor='pointer' />
                                )}
                            </div>
                            <span className="error">{errors.confirmPassword}</span>
                        </div>
                    </div>
                    <div className="form-buttons">
                        <button type="submit">Register</button>
                        <p>Have an account ?</p>
                        <Link to={'/login'} className='login'>Log in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
