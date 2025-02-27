import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Home from './pages/home';
import PrivateRoute from './route/PrivateRoute';
import Dashboard from './pages/dashboard';
import TopNavbar from './navbar/top-bar';
import Sidebar from './navbar/side-bar';
import { Container, Row, Col } from 'react-bootstrap';
import CreateTask from './component/create-task';
import PropTypes from 'prop-types';
import ViewTask from './component/view-task';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return isHomePage ? (
    <>{children}</>
  ) : (
    <>
      <TopNavbar />
      <Container fluid>
        <Row>
          <Col xs={2} className='bg-light'>
            <Sidebar />
          </Col>
          <Col xs={10}>{children}</Col>
        </Row>
      </Container>
    </>
  );
};
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/create-task' element={<CreateTask />} />
          <Route path='/edit-task/:id' element={<CreateTask />} />
          <Route path='/view-task/:id' element={<ViewTask />} />
        </Route>
      </Routes>
    </Layout>
  </Router>
);

export default App;
