import { AUTHENTICATED_USER, LOGOUT_USER, SEARCH_TASK } from './userActions'; // Import action types

// Load user from localStorage if available
const savedUser = JSON.parse(localStorage.getItem('user')) || {};

const initialState = {
  name: savedUser.name || '',
  token: savedUser.token || null,
  email: savedUser.email || null,
  searchTerm: '',
};

// User Reducer Function
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATED_USER: {
      const newUser = {
        name: action.payload.name,
        token: action.payload.token,
        email: action.payload.email,
      };
      localStorage.setItem('user', JSON.stringify(newUser)); // Persist login
      return { ...state, ...newUser };
    }
    case LOGOUT_USER:
      localStorage.removeItem('user'); // Clear storage on logout
      return { ...initialState, searchTerm: '' };

    case SEARCH_TASK:
      console.log(action.payload);
      return { ...state, searchTerm: action.payload };

    default:
      return state;
  }
};

export default userReducer;
