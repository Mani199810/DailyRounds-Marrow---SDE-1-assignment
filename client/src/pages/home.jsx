import React, { useState } from 'react';
import SignUp from './signUp';
import { loginUser } from '../redux/user/userActions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(state => state.user);
  console.log('🚀 > Home > user:', user);
  const handleAuthClick = url => {
    window.open(url, '_self');
  };

  const handleSignIn = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userId, password }),
      });
      const data = await res.json();
      console.log('🚀 > Home > data:', data);
      dispatch(
        loginUser({
          name: data.user.name,
          token: data.user.token,
          email: data.user.email,
        }),
      );

      if (data.user.token) {
        navigate('/dashboard');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ width: '100%' }} className='d-flex'>
      <div className='home-left-container'>
        <div className='home-content'>
          <h1>Welcome to Task Manager</h1>
          <p>
            Your Productivity Hub - Organize, Prioritize, and Achieve More Tired
            of juggling multiple tasks and missing deadlines? Task Manager is
            your all-in-one solution to streamline your workflow, enhance
            productivity, and take full control of your daily tasks.
          </p>
          <span>
            Stay focused, <br /> Stay organized,
            <br /> and Turn plans into achievements—effortlessly.
          </span>
        </div>
      </div>

      {isLogin ? (
        <div className='auth-container'>
          <div className='d-flex justify-content-end align-items-center'>
            <div className='auth-form'>
              <h2>Sign in</h2>
              <form onSubmit={handleSignIn}>
                <input
                  type='text'
                  placeholder='userId'
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button type='submit' className='auth-button'>
                  Sign In
                </button>
              </form>
              <div className='mt-2'>
                <p>
                  Don&apos;t have an account? -&gt;{' '}
                  <a href='#/' onClick={() => setIsLogin(false)}>
                    Sign Up
                  </a>
                </p>
                <div className='text-center'>
                  Or <br /> sign in with <br />
                  <div className='mt-2'>
                    <a
                      onClick={() =>
                        handleAuthClick(
                          'http://localhost:5000/api/auth/google/callback',
                        )
                      }
                      href='#/'
                      className='social-link ms-2'
                    >
                      <i className='bi bi-google'></i>
                    </a>
                    <span className='p-2'>|</span>
                    <a
                      href='#/'
                      className='social-link'
                      style={{ color: '#333' }}
                    >
                      <i className='bi bi-github'></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SignUp setIsLogin={setIsLogin} />
      )}
    </div>
  );
};

export default Home;
