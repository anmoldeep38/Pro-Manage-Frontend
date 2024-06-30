import "../../styles/Board.css";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    VscAdd,
    VscChevronDown,
    VscChevronUp,
    VscCollapseAll,
    VscEllipsis,
} from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../../layout/Layout";
import {
    changeTaskStatus,
    getTimeFrameTask,
    markChecklist,
} from "../../redux/slices/TaskSlice";

function Board() {
    const dispatch = useDispatch();

    const name = useSelector((state) => state.auth?.data?.name);

    const [refresh, setRefresh] = useState(false);
    const [checklistVisibility, setChecklistVisibility] = useState({});
    const [showDropdown, setShowDropdown] = useState(false);
    const [threeDot, setThreeDot] = useState({});
    const [timeFrame, setTimeFrame] = useState("week");
    const [tasks, setTasks] = useState([]);
    const [data, setData] = useState({
        taskId: "",
        checklistId: "",
        isCompleted: "",
    });
    const [taskStatus, setTaskStatus] = useState({
        taskId: "",
        fromStatus: "",
        toStatus: "",
    });
    const [deleteModelInfo, setDeleteModelInfo] = useState({
        display: "none",
        taskId: "",
    });
    const [createTaskModel, setCreateTaskModel] = useState("none");
    const [editTaskVisibility, setEditTaskVisibility] = useState("none");
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setIsLoading] = useState(false)

    const toggleThreeDot = (taskId) => () => {
        setThreeDot((prevState) => ({
            ...prevState,
            [taskId]: !prevState[taskId],
        }));
    };

    const handleEditClick = (task) => {
        setSelectedTask(task);
        setEditTaskVisibility("flex");
        setThreeDot((prevState) => ({
            ...prevState,
            [task?._id]: !prevState[task?._id],
        }));
    };

    const handleClickPlus = () => {
        setCreateTaskModel("flex");
    };

    const handleDeleteClick = (taskId) => {
        setDeleteModelInfo({
            display: "flex",
            taskId: taskId,
        });
        setThreeDot((prevState) => ({
            ...prevState,
            [taskId]: !prevState[taskId],
        }));
    };

    const updateStatus = (taskId, fromStatus, toStatus) => {
        setTaskStatus({
            taskId: taskId,
            fromStatus: fromStatus,
            toStatus: toStatus,
        });
    };

    const getFormattedDate = () => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.toLocaleString("default", { month: "short" });
        const year = currentDate.getFullYear();

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

        return `${day}${getDaySuffix(day)} ${month}, ${year}`;
    };

    const handleTimeFrameChange = (timeFrame) => {
        setTimeFrame(timeFrame);
        setShowDropdown(false);
    };


    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const toggleChecklistVisibility = (taskId) => {
        setChecklistVisibility((prevState) => ({
            ...prevState,
            [taskId]: !prevState[taskId],
        }));
    };

    const convertTimeFrame = (newTimeFrame) => {
        switch (newTimeFrame) {
            case "today":
                return "Today";
            case "week":
                return "This Week";
            case "month":
                return "This Month";
            default:
                return "This Week";
        }
    };
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

    const filterTasksByStatus = (status) =>
        tasks.filter((task) => task?.status === status);
    const getOtherBoards = (currentStatus) => {
        const allStatuses = ["backlog", "todo", "progress", "done"];
        return allStatuses.filter((status) => status !== currentStatus);
    };
    const countCompletedChecklists = (checklists) => {
        return checklists.filter((checklist) => checklist?.isCompleted)?.length;
    };

    const toggleChecklistCompletion = (taskId, checklistId) => {
        setTasks((currentTasks) =>
            currentTasks?.map((task) => {
                if (task?._id === taskId) {
                    const updatedChecklists = task?.checklists?.map((checklist) => {
                        if (checklist?._id === checklistId) {
                            const newIsCompleted = !checklist?.isCompleted;
                            setData({
                                taskId: taskId,
                                checklistId: checklistId,
                                isCompleted: newIsCompleted,
                            });

                            return { ...checklist, isCompleted: newIsCompleted };
                        }
                        return checklist;
                    });

                    return { ...task, checklists: updatedChecklists };
                }
                return task;
            })
        );
    };

    const getDueDateStyles = (status, dueDate) => {
        const currentDate = new Date();
        const due = new Date(dueDate);
        currentDate.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        if (status === "done") {
            return { backgroundColor: "#63C05B", color: "white" };
        } else if (due < currentDate) {
            return { backgroundColor: "#CF3636", color: "white" };
        } else {
            return { backgroundColor: "#DBDBDB", color: "#767575" };
        }
    };

    const collapseAllChecklists = (boardStatus) => {
        setChecklistVisibility((prevState) => {
            const newState = { ...prevState };
            filterTasksByStatus(boardStatus)?.forEach((task) => {
                newState[task?._id] = false;
            });
            return newState;
        });
    };

    const handleShareClick = (taskId) => {
        const url = import.meta.env.VITE_FRONTEND_URL
        const taskLink = `${url}/task/${taskId}`;
        navigator.clipboard.writeText(taskLink);
        toast.success("Link copied");
        setThreeDot((prevState) => ({
            ...prevState,
            [taskId]: !prevState[taskId],
        }));
    };

    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true)
            const response = await dispatch(getTimeFrameTask(timeFrame));
            setTasks(response.payload?.data);
            setIsLoading(false)
        };
        fetchTasks();
        if (refresh) {
            setRefresh(false);
        }
    }, [timeFrame, dispatch, refresh]);

    useEffect(() => {
        if (data.taskId && data.checklistId) {
            const markTheChecklist = async () => {
                await dispatch(markChecklist(data));
                setRefresh(true);
            };
            markTheChecklist();
        }
    }, [data, dispatch]);

    useEffect(() => {
        const { taskId, fromStatus, toStatus } = taskStatus;

        if (taskId && fromStatus && toStatus) {
            const updateStatus = async () => {
                const res = await dispatch(changeTaskStatus(taskStatus));
                if (res.payload?.success) {
                    setRefresh(true);
                }
            };

            updateStatus();
        }
    }, [taskStatus, dispatch]);

    return (
        <Layout
            taskId={deleteModelInfo.taskId}
            display={deleteModelInfo.display}
            setDeleteModelInfo={setDeleteModelInfo}
            setRefresh={setRefresh}
            visibility={createTaskModel}
            setCreateTaskModel={setCreateTaskModel}
            editTaskVisibility={editTaskVisibility}
            setEditTaskVisibility={setEditTaskVisibility}
            selectedTask={selectedTask}
        >
            <div className="board-container">
                <header>
                    <h1>Welcome! {name}</h1>
                    <span className="today-date">{getFormattedDate()}</span>
                </header>
                <div className="sub-header">
                    <h1>Board</h1>
                    <div className="timeframe">
                        <span onClick={toggleDropdown} className="timeframe-name">
                            {convertTimeFrame(timeFrame)}{" "}
                            {showDropdown ? <VscChevronUp /> : <VscChevronDown />}
                        </span>
                        {showDropdown && (
                            <div className="timeframe-dropdown">
                                <span onClick={() => handleTimeFrameChange("today")}>
                                    Today
                                </span>
                                <span onClick={() => handleTimeFrameChange("week")}>
                                    This Week
                                </span>
                                <span onClick={() => handleTimeFrameChange("month")}>
                                    This Month
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="boards">
                    {["backlog", "todo", "progress", "done"].map((status) => (
                        <div key={status} className="board">
                            <div className="board-name">
                                <span>
                                    {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
                                </span>
                                {status === "todo" ? (
                                    <div className="add-task">
                                        <VscAdd onClick={handleClickPlus} />
                                        <VscCollapseAll
                                            onClick={() => collapseAllChecklists(status)}
                                        />
                                    </div>
                                ) : (
                                    <VscCollapseAll
                                        onClick={() => collapseAllChecklists(status)}
                                    />
                                )}
                            </div>
                            {
                                loading ? (
                                    <div className="loader-container">
                                        <div className="loader"></div>
                                    </div>
                                ) : (
                                    <div className="all-task">
                                        {
                                            filterTasksByStatus(status).length === 0 ? (
                                                <p className="no-task-message">
                                                    No {status} task found {convertTimeFrame(timeFrame)}
                                                </p>
                                            ) : (
                                                filterTasksByStatus(status).map((task) => (
                                                    <div key={task?._id} className="task">
                                                        <header className="task-priority">
                                                            <div className="priority">
                                                                <span className={task?.priority}></span>
                                                                <span>{convertPriority(task?.priority)}</span>
                                                            </div>
                                                            <div className="dropdown-container">
                                                                <span onClick={toggleThreeDot(task?._id)}>
                                                                    <VscEllipsis />
                                                                </span>
                                                                {threeDot[task?._id] && (
                                                                    <div className="dropdown">
                                                                        <span onClick={() => handleEditClick(task)}>Edit</span>
                                                                        <span onClick={() => handleShareClick(task?._id)}>
                                                                            Share
                                                                        </span>
                                                                        <span onClick={() => handleDeleteClick(task?._id)}>
                                                                            Delete
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </header>
                                                        <h1 className="task-title" title={task?.title}>
                                                            {task?.title}
                                                        </h1>
                                                        <div className="checklist-header">
                                                            <span>
                                                                Checklist ({countCompletedChecklists(task?.checklists)}/
                                                                {task?.checklists?.length})
                                                            </span>
                                                            <div>
                                                                {checklistVisibility[task?._id] ? (
                                                                    <VscChevronUp
                                                                        onClick={() => toggleChecklistVisibility(task?._id)}
                                                                    />
                                                                ) : (
                                                                    <VscChevronDown
                                                                        onClick={() => toggleChecklistVisibility(task?._id)}
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                        {checklistVisibility[task?._id] && (
                                                            <div className="all-checklist">
                                                                {task?.checklists?.map((checklist) => {
                                                                    return (
                                                                        <div className="checklist" key={checklist?._id}>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={checklist?.isCompleted}
                                                                                onChange={() =>
                                                                                    toggleChecklistCompletion(
                                                                                        task?._id,
                                                                                        checklist?._id
                                                                                    )
                                                                                }
                                                                            />
                                                                            <span className="checklist-name">{checklist?.name}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                        <div className="task-footer">
                                                            <span
                                                                style={
                                                                    task?.dueDate
                                                                        ? getDueDateStyles(task?.status, task?.dueDate)
                                                                        : { backgroundColor: "transparent" }
                                                                }
                                                            >
                                                                {task?.dueDate ? formattedDate(task?.dueDate) : ""}
                                                            </span>
                                                            <div className="other-boards">
                                                                {getOtherBoards(status).map((otherStatus) => (
                                                                    <span
                                                                        key={otherStatus}
                                                                        onClick={() =>
                                                                            updateStatus(task?._id, status, otherStatus)
                                                                        }
                                                                    >
                                                                        {otherStatus.charAt(0).toUpperCase() +
                                                                            otherStatus.slice(1)}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default Board;
