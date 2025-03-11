import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import authUser from './user/userReducer';
import existUser from './existuser/existUsersReducer';
const rootReducer = combineReducers({
  user: authUser,
  existUser: existUser,
});
const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
