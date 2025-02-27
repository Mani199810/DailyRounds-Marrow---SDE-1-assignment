import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button, Table } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';
const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const token = useSelector(state => state.user.token);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/tasks/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setTask(response.data);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [id, token]);

  if (!task) {
    return <div className='loading'>Loading...</div>;
  }
  const handleDownload = async (taskId, filename) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/tasks/${taskId}/attachment/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className='task-details container mt-4'>
      <h2 className='mb-3'>Task Details</h2>
      <div className='task-table'>
        <Table bordered>
          <tbody>
            <tr>
              <td>
                <strong>ID</strong>
              </td>
              <td>{task._id}</td>
            </tr>
            <tr>
              <td>
                <strong>Title</strong>
              </td>
              <td>{task.title}</td>
            </tr>
            <tr>
              <td>
                <strong>Priority</strong>
              </td>
              <td>{task.priority}</td>
            </tr>
            <tr>
              <td>
                <strong>Description</strong>
              </td>
              <td>{task.description}</td>
            </tr>
            <tr>
              <td>
                <strong>Assignee</strong>
              </td>
              <td>{task.assignedTo}</td>
            </tr>
            <tr>
              <td>
                <strong>Due Date</strong>
              </td>
              <td>{task.deliveryDate}</td>
            </tr>
            <tr>
              <td>
                <strong>Status</strong>
              </td>
              <td>{task.status}</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div className='attachments'>
        <h5>Attachments</h5>
        <ul>
          {task.attachments.map(attachment => (
            <li key={attachment.filename}>
              <div>
                <span
                  style={{
                    cursor: 'pointer',
                    color: 'blue',
                    textDecoration: 'underline',
                  }}
                  onClick={() => handleDownload(task._id, attachment.filename)}
                >
                  {attachment.filename}
                </span>
                <button
                  key={attachment.filename}
                  className='btn'
                  onClick={e => {
                    e.stopPropagation();
                    handleDownload(task._id, attachment.filename);
                  }}
                >
                  <FaDownload className='text-muted' />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskDetails;
