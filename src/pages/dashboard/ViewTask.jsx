import '../../styles/ViewTask.css'

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import siteLogo from "../../assets/sitelogo.png";
import { getTask } from '../../redux/slices/TaskSlice'

function ViewTask() {
    const dispatch = useDispatch()
    const { taskId } = useParams()

    const [task, setTask] = useState({})
    const [loading, setIsLoading] = useState(false)

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true)
            const res = await dispatch(getTask(taskId))
            if (res.payload?.success) {
                setTask(res.payload?.data)
            }
            setIsLoading(false)
        }
        getData()
    }, [])

    const convertPriority = (priority) => {
        switch (priority) {
            case "high":
                return "HIGH PRIORITY";
            case "low":
                return "LOW PRIORITY";
            case "moderate":
                return "MODERATE PRIORITY";
            default:
                return "";
        }
    };

    const formattedDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" });

        const getDaySuffix = (day) => {
            if (day > 3 && day < 21) return "th";
            switch (day % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th";
            }
        };

        return `${month} ${day}${getDaySuffix(day)}`;
    };

    if (loading) {
        return (
            <div className='loader-container'>
                <div className='loader'></div>
            </div>
        )
    }

    return (
        <div className="view-task-container">
            <div className="logo">
                <img src={siteLogo} alt="logo" />
                <h1>Pro Manage</h1>
            </div>
            <div className="task-container">
                <div className="view-task-priority">
                    <span className={task?.priority}></span>
                    <span className='view-priority'>{convertPriority(task?.priority)}</span>
                </div>
                <h1 className="view-task-title">{task?.title}</h1>
                <div className="task-checklist">
                    <h2>Checklist ({task?.checklists?.filter(c => c?.isCompleted)?.length}/{task?.checklists?.length})</h2>
                    <div className="all-checklist view-checklist">
                        {task?.checklists?.map((checklist) => {
                            return (
                                <div className="checklist" key={checklist?._id}>
                                    <input
                                        type="checkbox"
                                        checked={checklist?.isCompleted}
                                        readOnly
                                        id={checklist?._id}
                                    />
                                    <span>{checklist?.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {task?.dueDate && (
                    <div className="task-due-date">
                        <span>Due Date</span>
                        <span className='view-date'>{formattedDate(task?.dueDate)}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewTask
