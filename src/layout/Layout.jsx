import "../styles/Layout.css";

import { useState } from "react";
import { FiLayout, FiSettings } from "react-icons/fi";
import { GoDatabase } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";

import siteLogo from "../assets/sitelogo.png";
import CreateTask from "../components/CreateTask";
import DeleteModel from "../components/DeleteModel";
import EditTask from "../components/EditTask";
import LogoutModel from "../components/LogoutModel";

function Layout({
    children,
    taskId,
    display,
    setDeleteModelInfo,
    setRefresh,
    setCreateTaskModel,
    visibility,
    editTaskVisibility,
    setEditTaskVisibility,
    selectedTask
}) {
    const [logoutDisplay, setLogoutDisplay] = useState("none");

    const hideDeleteModel = () => {
        setDeleteModelInfo((prevInfo) => ({
            ...prevInfo,
            display: "none",
        }));
    };

    const onLogout = () => {
        setLogoutDisplay("flex");
    };

    const cancelLogout = () => {
        setLogoutDisplay("none");
    };

    const cancelCreateTask = () => {
        setCreateTaskModel("none");
    };

    const cancelEditTask = () => {
        setEditTaskVisibility("none")
    }

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <img src={siteLogo} alt="logo" />
                    <h1>Pro Manage</h1>
                </div>
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <NavLink to="/board">
                                <FiLayout /> Board
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/analytics">
                                <GoDatabase /> Analytics
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/settings">
                                <FiSettings /> Settings
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <div className="sidebar-footer">
                    <button onClick={onLogout}>
                        <IoLogOutOutline /> Log out
                    </button>
                </div>
            </aside>
            <main className="main-content">{children}</main>
            <DeleteModel
                display={display}
                taskId={taskId}
                onCancel={hideDeleteModel}
                setRefresh={setRefresh}
            />
            <LogoutModel logoutDisplay={logoutDisplay} cancelLogout={cancelLogout} />
            <CreateTask
                visibility={visibility}
                cancelCreateTask={cancelCreateTask}
                setRefresh={setRefresh}
            />
            <EditTask editTaskVisibility={editTaskVisibility} cancelEditTask={cancelEditTask} task={selectedTask} setRefresh={setRefresh} />
        </div>
    );
}

export default Layout;
