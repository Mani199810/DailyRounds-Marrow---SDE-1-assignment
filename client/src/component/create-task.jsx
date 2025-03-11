import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Button, Dropdown } from 'react-bootstrap';
import { IoIosAttach } from 'react-icons/io';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
const baseUrl = 'http://localhost:5000/api/tasks';
const CreateTask = () => {
  const taskId = useParams();
  console.log('🚀 > CreateTask > taskId.id.id:', taskId.id);
  const navigate = useNavigate();
  const [taskType, setTaskType] = useState('Task');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Select Priority');
  const [description, setDescription] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('Pending');
const existsUser=useSelector(stat => stat.existUser);
const [assignedTo, setAssignedTo] = useState('Select Person');
console.log('existsUser=',existsUser.users);
  const token = useSelector(stat => stat.user.token);
  console.log("🚀 > CreateTask > token:", token);
  useEffect(() => {
    if (taskId.id) {
      const fetchTaskDetails = async () => {
        try {
          const response = await axios.get(
            `${baseUrl}/${taskId.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const task = response.data;
          setTaskType(task.taskType);
          setTitle(task.title);
          setPriority(task.priority);
          setAssignedTo(task.assignedTo);
          setDescription(task.description);
          setDeliveryDate(task.deliveryDate);
          setStatus(task.status);
        } catch (error) {
          console.error('Error fetching task details:', error);
        }
      };
      fetchTaskDetails();
    }
  }, [taskId.id, token]);

  const handleFileAttach = event => {
    setAttachedFiles([...event.target.files]);
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'High':
        return 'danger';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'light';
    }
  };

  const createOrUpdateTask = useCallback(
    async event => {
      event.preventDefault();
      const newErrors = {};
      if (!title) newErrors.title = 'Title is required';
      if (priority === 'Select Priority')
        newErrors.priority = 'Priority is required';
      if (assignedTo === 'Select Person')
        newErrors.assignedTo = 'Assigned person is required';
      if (!description) newErrors.description = 'Description is required';
      if (!deliveryDate) newErrors.deliveryDate = 'Delivery date is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('taskType', taskType);
      formData.append('priority', priority);
      formData.append('assignedTo', assignedTo);
      formData.append('description', description);
      formData.append('deliveryDate', deliveryDate);
      formData.append('status', status);

      attachedFiles.forEach(file => {
        formData.append('attachments', file);
      });

      try {
        const response = taskId.id
          ? await axios.put(
              `${baseUrl}/${taskId.id}`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'multipart/form-data',
                },
              },
            )
          : await axios.post(`${baseUrl}`, formData, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            });

        if (response.status === 200) {
          console.log('Task Submitted:', response.data);
          navigate('/dashboard');
        } else {
          console.error('Error:', response.data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    [
      assignedTo,
      attachedFiles,
      deliveryDate,
      description,
      navigate,
      priority,
      status,
      taskId.id,
      taskType,
      title,
      token,
    ],
  );

  return (
    <div className='create-task-container mt-3'>
      <Card className='p-3'>
        <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mb-3'>
          <h5 className='mb-0'>{taskId.id ? 'Update Task' : 'New Task'}</h5>
          <span className='edit-icon'>✏️</span>
        </div>

        <Form onSubmit={createOrUpdateTask}>
          <Form.Group className='mb-3'>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type='text'
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            {errors.title && <div className='text-danger'>{errors.title}</div>}
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Task Type</Form.Label>
            <Dropdown style={{ width: '10%' }}>
              <Dropdown.Toggle
                variant='light'
                className='w-100 text-start d-flex justify-content-between align-items-center'
              >
                {taskType}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setTaskType('Bug')}>
                  Bug
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTaskType('Task')}>
                  Task
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setTaskType('Issue')}>
                  Issue
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>

          <Form.Group className='mb-3'>
    <Form.Label>Assign to</Form.Label>
    <Dropdown style={{ width: '15%' }}>
        <Dropdown.Toggle
            variant='light'
            className='w-100 text-start d-flex justify-content-between align-items-center'
        >
            {assignedTo || 'Select a user'} 
        </Dropdown.Toggle>
        <Dropdown.Menu>
    {existsUser?.users?.length > 0 ? (
        existsUser.users.map((user, index) => (
            <Dropdown.Item
                key={user._id || index}
                onClick={() => setAssignedTo(user.name)}
            >
                {user.name}
            </Dropdown.Item>
        ))
    ) : (
        <Dropdown.Item disabled>No users available</Dropdown.Item>
    )}
</Dropdown.Menu>

    </Dropdown>
    {errors?.assignedTo && (
        <div className='text-danger'>{errors.assignedTo}</div>
    )}
</Form.Group>


          <Form.Group className='mb-3'>
            <Form.Label>Priority</Form.Label>
            <Dropdown style={{ width: '15%' }}>
              <Dropdown.Toggle
                variant={getPriorityColor(priority)}
                className='w-100 text-start d-flex justify-content-between align-items-center'
              >
                {priority}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setPriority('High')}>
                  High
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPriority('Medium')}>
                  Medium
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setPriority('Low')}>
                  Low
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {errors.priority && (
              <div className='text-danger'>{errors.priority}</div>
            )}
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Task Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
            {errors.description && (
              <div className='text-danger'>{errors.description}</div>
            )}
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Delivery Date</Form.Label>
            <Form.Control
              type='date'
              value={deliveryDate}
              onChange={e => setDeliveryDate(e.target.value)}
              required
            />
            {errors.deliveryDate && (
              <div className='text-danger'>{errors.deliveryDate}</div>
            )}
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Label>Attachments</Form.Label>
            <div className='mt-2'>
              <label className='btn editor-toolbar btn btn-outline-dark'>
                Attach files
                <IoIosAttach />
                <input
                  type='file'
                  multiple
                  onChange={handleFileAttach}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
            {attachedFiles.length > 0 && (
              <div className='mt-2'>
                <span>Attached Files:</span>
                <ul>
                  {attachedFiles.map((file, index) => (
                    <li key={index}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          color: '#2075f4',
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Form.Group>

          <div className='d-flex justify-content-end'>
            <Button variant='primary' type='submit'>
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTask;
