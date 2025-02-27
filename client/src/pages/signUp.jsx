import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/user/userActions';
import { useNavigate } from 'react-router-dom';
const SignUp = ({ setIsLogin }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (!formData.username.trim()) newErrors.username = 'Username is required.';
    if (!formData.password) newErrors.password = 'Password is required.';
    if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
    if (!formData.termsAccepted)
      newErrors.termsAccepted = 'You must accept the Terms and Privacy Policy.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('current formData:', formData);

    if (!validateForm()) return;

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log('SignUp > data:', data);
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
        throw new Error(data.message);
      }
      alert('Registration successful!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='auth-container'>
      <div className='d-flex justify-content-start align-items-center'>
        <form className='auth-form' onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <input
            type='text'
            name='name'
            placeholder='Full Name'
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className='text-danger'>{errors.name}</p>}

          <input
            type='email'
            name='email'
            placeholder='Email address'
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className='text-danger'>{errors.email}</p>}

          <input
            type='text'
            name='username'
            placeholder='Username'
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className='text-danger'>{errors.username}</p>}

          <input
            type='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className='text-danger'>{errors.password}</p>}

          <input
            type='password'
            name='confirmPassword'
            placeholder='Repeat Password'
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className='text-danger'>{errors.confirmPassword}</p>
          )}

          <div className='terms-label'>
            <input
              type='checkbox'
              id='terms'
              name='termsAccepted'
              checked={formData.termsAccepted}
              onChange={handleChange}
            />
            <label htmlFor='terms'>
              I agree to the <a href='#/'>Terms of Use</a> and{' '}
              <a href='/#'>Privacy Policy</a>
            </label>
          </div>
          {errors.termsAccepted && (
            <p className='text-danger'>{errors.termsAccepted}</p>
          )}

          <button type='submit' className='auth-button mb-2'>
            Sign Up
          </button>
          <button
            onClick={() => setIsLogin(true)}
            type='button'
            className='auth-button'
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
SignUp.propTypes = {
  setIsLogin: PropTypes.func.isRequired,
};

export default SignUp;
