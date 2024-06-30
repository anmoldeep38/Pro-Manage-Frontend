import "../styles/CreateTask.css";
import "react-datepicker/dist/react-datepicker.css";

import { format } from "date-fns";
import { useState } from "react";
import DatePicker from "react-datepicker";
import toast from 'react-hot-toast'
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDispatch } from 'react-redux'

import { createTask } from "../redux/slices/TaskSlice";

function CreateTask({ visibility, cancelCreateTask, setRefresh }) {
    const dispatch = useDispatch()
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("");
    const [title, setTitle] = useState("");
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [checklists, setChecklists] = useState([
        { id: 1, name: "", isCompleted: false },
    ]);

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handlePrioritySelect = (selectedPriority) => {
        setPriority(selectedPriority);
    };

    const formatDate = (date) => {
        return format(date, "dd/MM/yyyy");
    };

    const handleDateChange = (date) => {
        setDueDate(date);
        setIsDatePickerVisible(false);
    };

    const handleDateSelectClick = () => {
        setIsDatePickerVisible(!isDatePickerVisible);
    };

    const handleAddChecklistItem = () => {
        const newItem = {
            id: checklists.length + 1,
            name: "",
            isCompleted: false,
        };
        setChecklists([...checklists, newItem]);
    };

    const handleRemoveChecklistItem = (id) => {
        setChecklists(checklists.filter((item) => item.id !== id));
    };

    const handleChecklistChange = (id, event) => {
        const newList = checklists.map((item) => {
            if (item.id === id) {
                return { ...item, name: event.target.value };
            }
            return item;
        });
        setChecklists(newList);
    };

    const handleChecklistCheck = (id) => {
        const newList = checklists.map((item) => {
            if (item.id === id) {
                return { ...item, isCompleted: !item.isCompleted };
            }
            return item;
        });
        setChecklists(newList);
    };

    const completedChecklistCount = checklists.filter(
        (item) => item.isCompleted
    ).length;

    const validate = () => {
        if (!title.trim()) {
            toast.error("Task title is required")
            return false
        }
        if (!priority) {
            toast.error("Task priority is required")
            return false
        }
        for (let i = 0; i < checklists.length; i++) {
            const checklist = checklists[i].name

            if (!checklist.trim()) {
                toast.error(`Checklist ${i + 1} name is required`)
                return false
            }
        }
        return true
    }


    const handlesave = async () => {
        if (validate()) {
            const task = {
                title,
                priority,
                checklists,
                dueDate: dueDate ? formatDate(dueDate) : ""
            }
            const response = await dispatch(createTask(task))
            if (response.payload?.success) {
                setDueDate("")
                setPriority("")
                setTitle("")
                setChecklists([
                    {
                        id: 1,
                        name: "",
                        isCompleted: false
                    }
                ])
                setRefresh(true)
                cancelCreateTask()
            }
        }
    }

    return (
        <div className="create-task-modal" style={{ display: visibility }}>
            <div className="create-task-modal__content">
                <div className="create-task-modal__title">
                    <label htmlFor="title">
                        Title <span className="create-task-modal__required">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="create-task-title"
                        placeholder="Enter Task Title"
                        className="create-task-modal__input"
                        value={title}
                        onChange={handleTitleChange}
                    />
                </div>
                <div className="create-task-modal__priority">
                    <label>
                        Select Priority{" "}
                        <span className="create-task-modal__required">*</span>
                    </label>
                    <div className="create-task-modal__priority-options">
                        <div className={`create-task-modal__priority-option ${priority === "high" ? "selected" : ""}`} onClick={() => handlePrioritySelect("high")} >
                            <span className="high"></span>
                            <span>HIGH PRIORITY</span>
                        </div>
                        <div className={`create-task-modal__priority-option ${priority === "moderate" ? "selected" : ""}`} onClick={() => handlePrioritySelect("moderate")} >
                            <span className="moderate"></span>
                            <span>MODERATE PRIORITY</span>
                        </div>
                        <div className={`create-task-modal__priority-option ${priority === "low" ? "selected" : ""}`} onClick={() => handlePrioritySelect("low")}>
                            <span className="low"></span>
                            <span>LOW PRIORITY</span>
                        </div>
                    </div>
                </div>
                <div className="create-task-modal__checklist">
                    <label>
                        Checklist({completedChecklistCount}/{checklists.length})
                        <span className="create-task-modal__required">*</span>
                    </label>
                    <div className="create-task-modal__checklist-inputs">
                        {checklists.map((item, index) => (
                            <div key={item.id} className="create-task-modal__checklist-item">
                                <div className="create-task-modal__checklist-input">
                                    <input
                                        type="checkbox"
                                        id={`checkbox-${item.id}`}
                                        checked={item.isCompleted}
                                        onChange={() => handleChecklistCheck(item.id)}
                                        className="create-task-modal__checklist-checkbox"
                                    />
                                    <input
                                        type="text"
                                        value={item.name}
                                        name={item.name}
                                        id={item.id}
                                        onChange={(event) => handleChecklistChange(item.id, event)}
                                        placeholder="Add a task"
                                        className="create-task-modal__checklist-text"
                                    />
                                </div>
                                {index !== 0 && (
                                    <MdDelete
                                        onClick={() => handleRemoveChecklistItem(item.id)}
                                        className="create-task-modal__checklist-delete"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <span
                        className="create-task-modal__checklist-add-new"
                        onClick={handleAddChecklistItem}
                    >
                        <FaPlus /> Add New
                    </span>
                </div>
                {isDatePickerVisible && (
                    <div className="date-picker">
                        <DatePicker selected={dueDate} onChange={handleDateChange} inline />
                    </div>
                )}
                <div className="create-task-modal__actions">
                    <span
                        className="create-task-modal__btn--date"
                        onClick={handleDateSelectClick}
                    >
                        {dueDate ? formatDate(dueDate) : "Select Due Date"}
                    </span>
                    <div className="create-task-modal__btn-group">
                        <button className="create-task-modal__btn create-task-modal__btn--cancel" onClick={cancelCreateTask}>
                            Cancel
                        </button>
                        <button className="create-task-modal__btn create-task-modal__btn--save" onClick={handlesave}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateTask;
