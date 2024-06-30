import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import axiosInstance from '../../helper/AxiosInstance'

const initialState = {
    backlog: 0,
    todo: 0,
    progress: 0,
    done: 0,
    low: 0,
    high: 0,
    moderate: 0,
    dueTask: 0
}

export const getBacklogTask = createAsyncThunk("task/backlog", async () => {
    try {
        const response = await axiosInstance.get("/task/status?status=backlog")
        return response.data
    } catch (error) {
        console.error(error.message)
    }
})

export const getTodoTask = createAsyncThunk("task/todo", async () => {
    try {
        const response = await axiosInstance.get("/task/status?status=todo")
        return response.data
    } catch (error) {
        console.error(error.message)
    }
})

export const getProgressTask = createAsyncThunk("task/progress", async () => {
    try {
        const response = await axiosInstance.get("/task/status?status=progress")
        return response.data
    } catch (error) {
        console.error(error.message)
    }
})

export const getDoneTask = createAsyncThunk("task/done", async () => {
    try {
        const response = await axiosInstance.get("/task/status?status=done")
        return response.data
    } catch (error) {
        console.error(error.message)
    }
})

export const getHighPriority = createAsyncThunk("task/priority/high", async () => {
    try {
        const response = await axiosInstance.get("/task/priority?priority=high")
        return response.data
    } catch (error) {
        console.error(error.message)
    }
})

export const getLowPriority = createAsyncThunk("task/priority/low", async () => {
    try {
        const response = await axiosInstance.get("/task/priority?priority=low")
        return response.data
    } catch (error) {
        console.error(error.message)
    }
})

export const getModeratePriority = createAsyncThunk("task/priority/moderate", async () => {
    try {
        const response = await axiosInstance.get("/task/priority?priority=moderate")
        return response.data
    } catch (error) {
        console.error(error.message)
    }
})

export const getDueTask = createAsyncThunk("task/due", async () => {
    try {
        const response = await axiosInstance.get("/task/all/dueTasks")
        return response.data
    } catch (error) {
        console.error(error.message)
    }
})

const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        resetAnalytics: () => {
            return initialState
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBacklogTask.fulfilled, (state, action) => {
                state.backlog = action.payload?.data?.totalTask;
            })
            .addCase(getTodoTask.fulfilled, (state, action) => {
                state.todo = action.payload?.data?.totalTask;
            })
            .addCase(getProgressTask.fulfilled, (state, action) => {
                state.progress = action.payload?.data?.totalTask;
            })
            .addCase(getDoneTask.fulfilled, (state, action) => {
                state.done = action.payload?.data?.totalTask;
            })
            .addCase(getHighPriority.fulfilled, (state, action) => {
                state.high = action.payload?.data?.totalTask;
            })
            .addCase(getLowPriority.fulfilled, (state, action) => {
                state.low = action.payload?.data?.totalTask;
            })
            .addCase(getModeratePriority.fulfilled, (state, action) => {
                state.moderate = action.payload?.data?.totalTask;
            })
            .addCase(getDueTask.fulfilled, (state, action) => {
                state.dueTask = action.payload?.data?.overdueTasks;
            })
    }
})

export default analyticsSlice.reducer