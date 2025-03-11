const EXIST_USER = 'EXIST_USER';

const savedUser = JSON.parse(localStorage.getItem('existUser')) || [];

const initialState = {
    users: savedUser,
};

export const setExistUser = (users) => {
    localStorage.setItem('existUser', JSON.stringify(users)); 
    return {
        type: EXIST_USER,
        payload: users,
    };
};

const existUserReducer = (state = initialState, action) => {
    switch (action.type) {
        case EXIST_USER:
            return { ...state, users: action.payload };
        default:
            return state;
    }
};

export default existUserReducer;
