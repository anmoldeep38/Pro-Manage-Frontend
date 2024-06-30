import { useDispatch } from 'react-redux'

import { deleteTask } from '../redux/slices/TaskSlice';

function DeleteModel({ taskId, display, onCancel, setRefresh }) {
    const dispatch = useDispatch()
    const handleDelete = async () => {
        await dispatch(deleteTask(taskId));
        setRefresh(true)
        onCancel();
    };
    return (
        <div className='delete-model' style={{ display: display }}>
            <div className='model'>
                <p>Are you sure you want to Delete? </p>
                <div className="delete-buttons">
                    <button className="delete-button" onClick={handleDelete}>Yes, Delete</button>
                    <button className="cancel" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteModel
