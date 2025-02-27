import React from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { FaSearch, FaUser, FaCog, FaBell } from 'react-icons/fa';
import { setSearchTerm } from '../redux/user/userActions';
import { useDispatch } from 'react-redux';

const TopNavbar = () => {
  const dispatch = useDispatch();

  const handleSearch = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Handle the search logic here
      console.log('Search:', event.target.value);
      dispatch(setSearchTerm(event.target.value));
    }
  };

  return (
    <Navbar
      style={{ backgroundColor: '#7042a3' }}
      variant='dark'
      expand='lg'
      className='ps-4 pe-2 sticky-top'
    >
      <Navbar.Brand href='/'>Task Manager</Navbar.Brand>
      <Navbar.Toggle aria-controls='basic-navbar-nav' />
      <Navbar.Collapse id='basic-navbar-nav' className='justify-content-end'>
        <Nav className='ml-auto'>
          <Nav.Link href='/profile'>
            <FaUser />
          </Nav.Link>
          <Nav.Link href='/settings'>
            <FaCog />
          </Nav.Link>
          <Nav.Link href='/notifications' className='position-relative'>
            <FaBell />
            <span
              className='badge bg-danger text-white rounded-circle position-absolute'
              style={{ fontSize: '0.6rem', top: '3px', right: '0px' }}
            >
              5
            </span>
          </Nav.Link>
        </Nav>
        <Form className='d-flex ms-2 gap-2'>
          <FormControl
            type='text'
            placeholder='Search task name ...!'
            className='mr-sm-2'
            onKeyPress={handleSearch}
          />
          <Button className='bg-light text-dark border-0 d-flex align-items-center justify-content-center'>
            <FaSearch className='text-dark' />
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNavbar;
