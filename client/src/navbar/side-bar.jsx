import React from 'react';
import { Button, Nav } from 'react-bootstrap';
import { FaPlusCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/user/userActions';
import { useNavigate } from 'react-router-dom';
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  return (
    <div
      className='d-flex flex-column bg-light'
      style={{ position: 'fixed', width: '200px', height: '90vh' }}
    >
      <Nav className='flex-column flex-grow-1'>
        <Nav.Link href='/dashboard' className='app-nav-text'>
          Home
        </Nav.Link>
        <Nav.Link href='/work-history' className='app-nav-text'>
          Work History
        </Nav.Link>
        <Nav.Link href='/settings' className='app-nav-text'>
          Teams
        </Nav.Link>
        <Nav.Link href='/settings' className='app-nav-text'>
          Reports
        </Nav.Link>
        <Nav.Link
          onClick={() => {
            navigator('/'), dispatch(logoutUser());
          }}
          className='app-nav-text'
        >
          Log Out
        </Nav.Link>
      </Nav>
      <div className='mt-auto p-3'>
        <Button
          href='/create-task'
          style={{ width: '100%', background: '#7042a3', border: 'none' }}
        >
          <div
            style={{ height: '20%' }}
            className='d-flex flex-column align-items-center'
          >
            <FaPlusCircle className='mb-1' />
            <span style={{ fontSize: '12px' }}>Create New Task</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
