import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

import axiosInstance from '../../helper/AxiosInstance'

const initialState = {
    data: JSON.parse(localStorage.getItem('userData')) || {}
}

export const createAccount = createAsyncThunk("auth/signup", async (data) => {
    try {
        const res = axiosInstance.post("/user/signup", data);
        toast.dismiss()
        toast.promise(res, {
            loading: "Wait! Creating your account",
            success: (data) => {
                return data?.data?.message;
            },
            error: (error) => {
                return error?.response?.data?.message
            },
        });
        return (await res).data
    } catch (error) {
        console.error(error.message)
    }
})

export const login = createAsyncThunk("auth/login", async (data) => {
    try {
        const res = axiosInstance.post("/user/login", data);
        toast.dismiss()
        toast.promise(res, {
            loading: "Loading...",
            success: (data) => {
                return data?.data?.message;
            },
            error: (error) => {
                return error?.response?.data?.message
            },
        });
        return (await res).data
    } catch (error) {
        console.error(error.message)
    }
})

export const logout = createAsyncThunk("auth/logout", async () => {
    toast.dismiss()
    try {
        const res = axiosInstance.post("/user/logout");
        toast.promise(res, {
            loading: "Loging out...",
            success: (data) => {
                return data?.data?.message;
            },
            error: (error) => {
                return error?.response?.data?.message
            },
        });
        return (await res).data
    } catch (error) {
        console.error(error.message)
    }
})

export const getProfile = createAsyncThunk("auth/profile", async () => {
    try {
        const res = await axiosInstance.get("/user/profile");
        return res.data
    } catch (error) {
        console.error(error.message)
    }
})

export const updateProfile = createAsyncThunk("auth/updateProfile", async (data) => {
    toast.dismiss()
    try {
        const res = axiosInstance.patch("/user/update-profile", data);
        toast.promise(res, {
            loading: "Loading...",
            success: (data) => {
                return data?.data?.message;
            },
            error: (error) => {
                return error?.response?.data?.message
            },
        });
        return (await res).data
    } catch (error) {
        console.error(error.message)
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.data = action?.payload?.data
            if (action?.payload?.data) {
                localStorage.setItem('userData', JSON.stringify(state.data));
            }
        })
        builder.addCase(logout.fulfilled, (state) => {
            state.data = {};
            localStorage.removeItem('userData');
        })
        builder.addCase(getProfile.fulfilled, (state, action) => {
            state.data = action?.payload?.data
            localStorage.setItem('userData', JSON.stringify(state.data));
        })
    }
})

export default authSlice.reducer