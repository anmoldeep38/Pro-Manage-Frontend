import "../../styles/Analytics.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../../layout/Layout";
import {
    getBacklogTask,
    getDoneTask,
    getDueTask,
    getHighPriority,
    getLowPriority,
    getModeratePriority,
    getProgressTask,
    getTodoTask,
} from "../../redux/slices/AnalyticsSlice";

function Analytics() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const { backlog, todo, progress, done, low, high, moderate, dueTask } = useSelector((state) => state.analytics);

    useEffect(() => {
        setIsLoading(true)
        dispatch(getBacklogTask());
        dispatch(getDoneTask());
        dispatch(getProgressTask());
        dispatch(getTodoTask());
        dispatch(getHighPriority());
        dispatch(getLowPriority());
        dispatch(getModeratePriority());
        dispatch(getDueTask());
        setIsLoading(false)
    }, []);

    const formatTaskCount = (count) => {
        return count < 10 ? `0${count}` : count;
    };
    return (
        <Layout>
            <div className="analytics-container">
                <h2>Analytics</h2>
                {
                    isLoading ? (
                        <div className="loader-container">
                            <div className="loader"></div>
                        </div>
                    ) : (
                        <div className="analytics-sections">
                            <div className="task-status-section">
                                <ul>
                                    <li>
                                        <div className="title-container">
                                            <span className="dot"></span>
                                            <span>Backlog Tasks</span>
                                        </div>
                                        <span className="task-count">
                                            {formatTaskCount(backlog)}
                                        </span>
                                    </li>
                                    <li>
                                        <div className="title-container">
                                            <span className="dot"></span>
                                            <span>To-do Tasks</span>
                                        </div>
                                        <span className="task-count">
                                            {formatTaskCount(todo)}
                                        </span>
                                    </li>
                                    <li>
                                        <div className="title-container">
                                            <span className="dot"></span>
                                            <span>In-Progress Tasks</span>
                                        </div>
                                        <span className="task-count">
                                            {formatTaskCount(progress)}
                                        </span>
                                    </li>
                                    <li>
                                        <div className="title-container">
                                            <span className="dot"></span>
                                            <span>Completed Tasks</span>
                                        </div>
                                        <span className="task-count">
                                            {formatTaskCount(done)}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="task-priority-section">
                                <ul>
                                    <li>
                                        <div className="title-container">
                                            <span className="dot"></span>
                                            <span>Low Priority</span>
                                        </div>
                                        <span className="task-count">{formatTaskCount(low)}</span>
                                    </li>
                                    <li>
                                        <div className="title-container">
                                            <span className="dot"></span>
                                            <span>Moderate Priority</span>
                                        </div>
                                        <span className="task-count">{formatTaskCount(moderate)}</span>
                                    </li>
                                    <li>
                                        <div className="title-container">
                                            <span className="dot"></span>
                                            <span>High Priority</span>
                                        </div>
                                        <span className="task-count">{formatTaskCount(high)}</span>
                                    </li>
                                    <li>
                                        <div className="title-container">
                                            <span className="dot"></span>
                                            <span>Due Date Tasks</span>
                                        </div>
                                        <span className="task-count">{formatTaskCount(dueTask)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )
                }
            </div>
        </Layout>
    );
}

export default Analytics;
