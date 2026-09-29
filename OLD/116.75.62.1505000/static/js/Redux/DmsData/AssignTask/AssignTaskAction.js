import {
    CREATE_ASSIGN_TASK_REQUEST,
    CREATE_ASSIGN_TASK_SUCCESS,
    CREATE_ASSIGN_TASK_FAILURE,

    FETCH_ASSIGN_TASK_REQUEST,
    FETCH_ASSIGN_TASK_SUCCESS,
    FETCH_ASSIGN_TASK_FAILURE,

    FETCH_MY_PROJECTS_REQUEST,
    FETCH_MY_PROJECTS_SUCCESS,
    FETCH_MY_PROJECTS_FAILURE,


} from "../../ActionTypes";

import parseErrorMessage from "../../../utils/errorFunction.js";


import {

    GetDataApiWTGM,
    PostDataApiWTGM,
} from "../../../utils/api.js";

// ================= CREATE ASSIGN TASK =================
export const CreateAssignTaskData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_ASSIGN_TASK_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/dms/assigned-projects/",
            formData
        );

        dispatch({
            type: CREATE_ASSIGN_TASK_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: CREATE_ASSIGN_TASK_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

// ================= FETCH ASSIGN TASK =================
export const GetAssignTaskData = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_ASSIGN_TASK_REQUEST
        });

        const response = await GetDataApiWTGM(
            "/api/dms/assigned-projects/"
        );

        dispatch({
            type: FETCH_ASSIGN_TASK_SUCCESS,
            payload: response.results || response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_ASSIGN_TASK_FAILURE,
            payload: error.response ? .data ||
                "Failed to fetch assigned projects",
        });
    }
};




// ================= FETCH MY PROJECTS =================
export const GetMyProjectsData = () => async (dispatch) => {
    try {
        // 1. Start Loading
        dispatch({
            type: FETCH_MY_PROJECTS_REQUEST,
        });

        // 2. Call API
        const response = await GetDataApiWTGM(
            "/api/dms/assigned-projects/my-projects/"
        );

        // 3. Save Data to Redux
        dispatch({
            type: FETCH_MY_PROJECTS_SUCCESS,
            payload: response.results || response,
        });

        // Optional: return response if needed
        return response;
    } catch (error) {

        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: FETCH_MY_PROJECTS_FAILURE,
            payload: errorMsg,
        });

        console.error(errorMsg);

        return null;
    }
};