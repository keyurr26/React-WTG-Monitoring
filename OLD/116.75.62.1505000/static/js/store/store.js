import {
    createStore,
    applyMiddleware,
    compose
} from 'redux';
import {
    thunk
} from 'redux-thunk';
import rootReducer from '../Redux';

const middleware = [thunk];

// 1. Pull both User and Tokens from Storage
const userInfo = sessionStorage.getItem("userInfo") ?
    JSON.parse(sessionStorage.getItem("userInfo")) :
    null;

const authTokens = sessionStorage.getItem("authTokens") ?
    JSON.parse(sessionStorage.getItem("authTokens")) :
    null;

// 2. Ensure the initial state matches your Reducer's structure
const initialState = {
    auth: {
        isAuthenticated: !!authTokens, // Use tokens to determine if logged in
        user: userInfo,
        tokens: authTokens, // 👈 CRITICAL: Add this for the interceptor/refresh logic
        loading: false,
        error: null,
    },
};

const store = createStore(
    rootReducer,
    initialState,
    compose(applyMiddleware(...middleware)) // fallback only
);

export default store;