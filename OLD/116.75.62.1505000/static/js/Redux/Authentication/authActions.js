import {
    PostDataApiWTGM
} from '../../utils/api';
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from './../ActionTypes';
import parseErrorMessage from '../../utils/errorFunction';

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: LOGIN_REQUEST
        });

        const data = await PostDataApiWTGM('/api/user/login/', {
            email,
            password
        });

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data,
        });

        sessionStorage.setItem('authTokens', JSON.stringify(data));
        sessionStorage.setItem('userInfo', JSON.stringify(data.user));

        return data;
    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );
        dispatch({
            type: LOGIN_FAIL,
            payload: errorMsg,
        });
        throw errorMsg;
    }
};

export const logout = () => (dispatch) => {
    sessionStorage.removeItem('authTokens');
    sessionStorage.removeItem('userInfo');
    dispatch({
        type: LOGOUT
    });
};