import '../../styles/Settings.css'

import { useEffect, useState } from 'react';
import { CiLock } from "react-icons/ci";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { TiUserOutline } from "react-icons/ti";
import { useDispatch, useSelector } from 'react-redux'

import Layout from '../../layout/Layout'
import { getProfile, updateProfile } from '../../redux/slices/AuthSlice';

function Settings() {
    const dispatch = useDispatch()
    const profileName = useSelector((state) => state.auth?.data?.name);
    const [formData, setFormData] = useState({
        name: profileName,
        oldPassword: '',
        newPassword: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        oldPassword: '',
        newPassword: ''
    });
    const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

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
        setIsOldPasswordVisible(!isOldPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsNewPasswordVisible(!isNewPasswordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formIsValid = true;
        const newErrors = { ...errors };

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (formData.newPassword && !passwordRegex.test(formData.newPassword)) {
            formIsValid = false;
            newErrors.newPassword = 'New Password must be at least 6 characters long and include both letters and numbers';
        } else if (formData.newPassword && !formData.oldPassword) {
            formIsValid = false;
            newErrors.oldPassword = 'Old Password is required to set a new password';
        }

        setErrors(newErrors);
        if (formIsValid) {
            const updatePayload = {};
            if (formData.name) {
                updatePayload.name = formData.name;
            }
            if (formData.newPassword) {
                updatePayload.oldPassword = formData.oldPassword;
                updatePayload.newPassword = formData.newPassword;
            }

            const response = await dispatch(updateProfile(updatePayload));
            if (response.payload?.success) {
                await dispatch(getProfile());
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    oldPassword: '',
                    newPassword: ''
                }));
            }
        }
    };

    useEffect(() => {
        dispatch(getProfile());
    }, [dispatch, profileName]);

    return (
        <Layout>
            <div className="setting-container">
                <h1>Settings</h1>
                <form onSubmit={handleSubmit}>
                    <div className='input-container'>
                        <div className='form-input'>
                            <TiUserOutline color='#828282' />
                            <input
                                type="text"
                                name="name"
                                id='name'
                                value={formData?.name}
                                onChange={handleChange}
                                placeholder="Name"
                                autoComplete="off"
                            />
                        </div>
                        <span className='error'>{errors?.name}</span>
                    </div>
                    <div className="input-container">
                        <div className="form-input">
                            <CiLock color='#828282' />
                            <input
                                type={isOldPasswordVisible ? "text" : "Password"}
                                name="oldPassword"
                                id='oldPassword'
                                value={formData?.oldPassword}
                                onChange={handleChange}
                                placeholder="Old Password"
                                autoComplete="off"
                            />
                            {isOldPasswordVisible ? (
                                <FiEye color='#828282' onClick={togglePasswordVisibility} cursor='pointer' />
                            ) : (
                                <FiEyeOff color='#828282' onClick={togglePasswordVisibility} cursor='pointer' />
                            )}
                        </div>
                        <span className="error">{errors?.oldPassword}</span>
                    </div>
                    <div className="input-container">
                        <div className="form-input">
                            <CiLock color='#828282' />
                            <input
                                type={isNewPasswordVisible ? "text" : "Password"}
                                name="newPassword"
                                id='newPassword'
                                value={formData?.newPassword}
                                onChange={handleChange}
                                placeholder="New Password"
                                autoComplete="off"
                            />
                            {isNewPasswordVisible ? (
                                <FiEye color='#828282' onClick={toggleConfirmPasswordVisibility} cursor='pointer' />
                            ) : (
                                <FiEyeOff color='#828282' onClick={toggleConfirmPasswordVisibility} cursor='pointer' />
                            )}
                        </div>
                        <span className="error">{errors?.newPassword}</span>
                    </div>
                    <button type="submit">Update</button>
                </form>
            </div>
        </Layout>
    );
}

export default Settings
