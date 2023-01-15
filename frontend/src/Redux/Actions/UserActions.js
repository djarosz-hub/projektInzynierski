import { USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGIN_FAIL, USER_LOGOUT, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_REGISTER_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL, USER_DETAILS_RESET, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS, USER_UPDATE_PROFILE_FAIL, USER_INITIAL_DATA, USER_INITIAL_DATA_REQUEST, USER_INITIAL_DATA_SUCCESS, USER_INITIAL_DATA_FAIL, USER_REGISTER_RESET } from './../Constants/UserConstants';
import axios from 'axios';
import { ORDER_USER_LIST_RESET } from '../Constants/OrderConstants';


export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_REGISTER_REQUEST });

        // const config = {
        //     headers: {
        //         "Content-Type": "application/json",
        //     }
        // }

        const { data } = await axios.post(`/api/users`, { name, email, password });

        dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

        // localStorage.setItem("userInfo", JSON.stringify(data));

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
};


export const getInitialUserData = () => {
    return async dispatch => {
        try {
            dispatch({ type: USER_LOGIN_REQUEST });

            // dispatch({ type: USER_INITIAL_DATA_REQUEST })
            const { data } = await axios.get(`/api/users/initialUserData`);
            console.log('data in action: ')
            console.log(data);
            // dispatch(testfunc(data))
            // dispatch({
            //     type: USER_INITIAL_DATA_SUCCESS,
            //     payload: data
            // })
            dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
        }
        catch (e) {
            console.log(e)
            dispatch({ type: USER_LOGIN_FAIL })
            // dispatch({ type: USER_INITIAL_DATA_FAIL })
        }
    }
};

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({ type: USER_LOGIN_REQUEST });
        const { data } = await axios.post(`/api/users/login`, { email, password });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
};

export const logout = () => (dispatch) => {

    console.log('logout fired')
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_DETAILS_RESET });
    dispatch({ type: ORDER_USER_LIST_RESET });
    dispatch({ type: USER_REGISTER_RESET });
    fetch(`/api/users/logout`);
    window.location.assign('/login');
};

export const getUserDetails = () => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_DETAILS_REQUEST });
        // const {
        //     userLogin: { userInfo },
        // } = getState();

        // const config = {
        //     headers: {
        //         Authorization: `Bearer ${userInfo.token}`
        //     }
        // }
        // console.log('user details before')
        const { data } = await axios.get(`/api/users/profile`);
        dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
        // console.log('user details after')

    } catch (error) {
        // console.log('user details error')
        dispatch(logout())
    }
};

export const updateProfile = (userData) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_UPDATE_PROFILE_REQUEST });

        const { data } = await axios.put(`/api/users/profile`, userData);

        dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
        dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
        dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        if (error.response && error.response.status === 401) {
            dispatch(logout());
        }
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: message,
        });
    }
};