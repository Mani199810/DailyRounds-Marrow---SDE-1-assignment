import React, { useCallback, useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaDownload, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdOutlineArrowDropDown } from 'react-icons/md';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { setExistUser } from '../redux/existuser/existUsersReducer';
const baseUrl = 'http://localhost:5000/api';

const Dashboard = () => {
    const dispatch = useDispatch();
const existsUser=useSelector(state=>state.existUser);
  console.log("🚀 > Dashboard > existsUser:", existsUser.users);
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortedTasks, setSortedTasks] = useState([]);
  const tasksPerPage = 10;
  const [selectedUser, setSelectedUser] = useState('All');
const [users, setUsers] = useState([]);
  console.log("🚀 > Dashboard > users:", users);
  const { token, searchTerm } = useSelector(state => state.user);
  const navigate = useNavigate();
  const fetchUsers = useCallback(async () => {
    try {
        const response = await axios.get(`${baseUrl}/auth/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
        });

        dispatch(setExistUser(response.data));
        response.data.unshift({ name: 'All' });
        setUsers(response.data);
    } catch (error) {
        console.error('Error fetching users:', error.response?.data || error.message);
    }
}, [dispatch, token]);
useEffect(() => {
    fetchUsers();
}, [fetchUsers]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/tasks?title=${searchTerm || ''}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [searchTerm, token]);

  const handleEdit = (e, taskId) => {
    e.stopPropagation();
    navigate(`/edit-task/${taskId}`);
  };

  const handleDelete = async taskId => {
    try {
      await axios.delete(`${baseUrl}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDownload = async (taskId, filename) => {
    try {
      const response = await axios.get(
        `${baseUrl}/tasks/export`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        },
      );
      console.log('csv response',response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tasks.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleSortByStatus = useCallback(
    (e, status) => {
      const filteredValues = tasks.filter(task => task.status === status);
      setSortedTasks(filteredValues);
    },
    [tasks],
  );
  const handleSortByPriority = useCallback(
    (e, priority) => {
      const filteredValues = tasks.filter(task => task.priority === priority);
      setSortedTasks(filteredValues);
    },
    [tasks],
  );
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = (sortedTasks.length ? sortedTasks : tasks).slice(
    indexOfFirstTask,
    indexOfLastTask,
  );
  console.log('🚀 > Dashboard > currentTasks:', currentTasks);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleRowClick = taskId => {
    navigate(`/view-task/${taskId}`);
  };

  const handleStatusUpdate = async (e, task) => {
    e.stopPropagation();
    const newStatus = e.target.value;

    if (task.status === newStatus) return;
    const formData = new FormData();
    formData.append('title', task.title);
    formData.append('taskType', task.taskType);
    formData.append('priority', task.priority);
    formData.append('assignedTo', task.assignedTo);
    formData.append('description', task.description);
    formData.append('deliveryDate', task.deliveryDate);
    formData.append('status', newStatus);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.status === 200) {
        setTasks(
          tasks.map(t =>
            t._id === task._id ? { ...t, status: newStatus } : t,
          ),
        );
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleUserSelect = (userName) => {
    setSelectedUser(userName);
    const filteredTasks = tasks.filter(task => task.assignedTo === userName);
    setSortedTasks(filteredTasks);
  };
  return (
    <div className='container mt-2'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <div className='d-flex align-items-center'>
        <h4 className='me-2'>Tasks</h4>
        <Dropdown as={ButtonGroup}>
      <Button variant="light" className=' d-flex align-items-center gap-2'> <FaUserCircle className='fs-5' />{selectedUser}</Button>
      <Dropdown.Toggle split variant="light" id="dropdown-split-basic" />
      <Dropdown.Menu>
        {users && users.map(user => (
          <Dropdown.Item
            key={user.name}
            onClick={() => handleUserSelect(user.name)}
          >
            <span role="img" aria-label={user.name}></span>{user.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
        </div>
        <div>
          <select
            className='form-select'
            style={{
              display: 'inline-block',
              width: 'auto',
              marginRight: '10px',
            }}
          >
            <option value='project1'>Project 1</option>
            <option value='project2'>Project 2</option>
            <option value='project3'>Project 3</option>
          </select>
          <button className='btn' onClick={() => handleDownload()}>
            <FaDownload className='text-muted' />
          </button>
        </div>
      </div>
      <div>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>Task ID</th>
              <th scope='col'>Task Name</th>
              <th scope='col'>
                <div className='d-flex justify-content-between align-items-center'>
                  <div>Status</div>

                  <div
                    style={{
                      position: 'relative',
                      right: 0,
                      display: 'inline-block',
                    }}
                  >
                    <select
                      className='form-select'
                      onChange={e => handleSortByStatus(e, e.target.value)}
                      style={{
                        opacity: 0, 
                        position: 'absolute',
                        width: '20px',
                        height: '100%',
                        cursor: 'pointer',
                      }}
                    >
                      <option value=''>Sort by</option>
                      <option value='Pending'>Pending</option>
                      <option value='In Progress'>In Progress</option>
                      <option value='Completed'>Completed</option>
                    </select>
                    <MdOutlineArrowDropDown
                      style={{ fontSize: '30px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </th>
              <th scope='col'>
                <div className='d-flex justify-content-between align-items-center'>
                  <div>Priority</div>
                  <div
                    style={{ position: 'relative', display: 'inline-block' }}
                  >
                    <select
                      className='form-select'
                      onChange={e => handleSortByPriority(e, e.target.value)}
                      style={{
                        opacity: 0, 
                        position: 'absolute',
                        width: '20px',
                        height: '100%',
                        cursor: 'pointer', 
                      }}
                    >
                      <option value=''>Sort by</option>
                      <option value='High'>High</option>
                      <option value='Medium'>Medium</option>
                      <option value='Low'>Low</option>
                    </select>
                    <MdOutlineArrowDropDown
                      style={{ fontSize: '30px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </th>
              <th scope='col'>Assigned to</th>

              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.map(task => (
              <tr
                key={task._id}
                style={
                  task.status === 'Completed'
                    ? { backgroundColor: '#d4edda' }
                    : {}
                }
                onClick={() => handleRowClick(task._id)}
              >
                <td>{task._id}</td>
                <td>{task.title}</td>
                <td>
                  <select
                    value={task.status}
                    className='form-select'
                    onMouseDown={e => e.stopPropagation()}
                    onClick={e => e.stopPropagation()}
                    onChange={e => handleStatusUpdate(e, task)}
                  >
                    {['Pending', 'In Progress', 'Completed'].map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>

                <td className='text-center'>
                  <button
                    className={`btn badge badge-pill ${
                      task.priority === 'High'
                        ? 'btn-danger'
                        : task.priority === 'Medium'
                          ? 'btn-warning'
                          : 'btn-secondary'
                    }`}
                    style={{ width: '100px' }}
                  >
                    {task.priority}
                  </button>
                </td>
                <td>{task.assignedTo}</td>
                <td>
                  <button
                    className='btn'
                    onClick={e => handleEdit(e, task._id)}
                  >
                    <FaEdit className='text-muted' />
                  </button>
                  <button
                    className='btn'
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(task._id);
                    }}
                  >
                    <FaTrash className='text-muted' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className='d-flex justify-content-center mt-3 fixed-bottom'>
        <ul className='pagination'>
          <li className='page-item'>
            <button
              className='page-link'
              onClick={() => paginate(currentPage - 1)}
              aria-label='Previous'
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
          </li>
          {Array.from(
            { length: Math.ceil(tasks.length / tasksPerPage) },
            (_, index) => (
              <li key={index + 1} className='page-item'>
                <button
                  onClick={() => paginate(index + 1)}
                  className='page-link'
                >
                  {index + 1}
                </button>
              </li>
            ),
          )}
          <li className='page-item'>
            <button
              className='page-link'
              onClick={() => paginate(currentPage + 1)}
              aria-label='Next'
              disabled={currentPage === Math.ceil(tasks.length / tasksPerPage)}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Dashboard;
