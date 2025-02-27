import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authUser from './user/userReducer';

const rootReducer = combineReducers({
  user: authUser,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
