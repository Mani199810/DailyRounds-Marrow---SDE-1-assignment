export const AUTHENTICATED_USER = 'AUTHENTICATED_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SEARCH_TASK = 'SEARCH_TASK';
export const loginUser = userData => {
  return dispatch => {
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch({
      type: AUTHENTICATED_USER,
      payload: userData,
    });
  };
};


export const logoutUser = () => {
  return dispatch => {
    dispatch({
      type: LOGOUT_USER,
    });
  };
};
export const setSearchTerm = searchTerm => {
  return dispatch => {
    console.log('searchTerm', searchTerm);
    dispatch({
      type: SEARCH_TASK,
      payload: searchTerm,
    });
  };
};
