// src/reducers/authReducer.js
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from './../ActionTypes'

const tokenData = sessionStorage.getItem('authTokens') ?
    JSON.parse(sessionStorage.getItem('authTokens')) :
    null;

const userData = sessionStorage.getItem("userInfo") ?
    JSON.parse(sessionStorage.getItem("userInfo")) :
    null;

const initialState = {
    loading: false,
    error: null,
    tokens: tokenData, // contains access & refresh
    user: userData,
    isAuthenticated: !!tokenData,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };
        case LOGIN_SUCCESS:
            // Save to storage so it's there on next page refresh
            sessionStorage.setItem('authTokens', JSON.stringify(action.payload));
            sessionStorage.setItem('userInfo', JSON.stringify(action.payload.user));
            return {

                ...state,
                loading: false,
                tokens: action.payload,
                user: action.payload.user,
                isAuthenticated: true,
            };

        case 'UPDATE_TOKENS': // <--- IMPORTANT: Handles background token refreshes
            return {
                ...state,
                tokens: action.payload,
            };
        case LOGIN_FAIL:
            // sessionStorage.removeItem("authTokens");
            // sessionStorage.removeItem("userInfo");
            return {
                ...state,
                loading: false,
                error: action.payload,
                tokens: null,
                user: null,
                isAuthenticated: false,
            };
        case LOGOUT:
            //  sessionStorage.clear();
            // sessionStorage.removeItem("authTokens");
            // sessionStorage.removeItem("userInfo");
            return {
                ...state,
                tokens: null,
                loading: false,
                error: null,
                user: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};

export default authReducer;