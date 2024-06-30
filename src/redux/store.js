import { configureStore } from '@reduxjs/toolkit'

import AnalyticsSlice from './slices/AnalyticsSlice.js'
import AuthSlice from './slices/AuthSlice.js'
import TaskSlice from './slices/TaskSlice.js'

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        analytics: AnalyticsSlice,
        task: TaskSlice
    },
    devTools: true
})

export default store