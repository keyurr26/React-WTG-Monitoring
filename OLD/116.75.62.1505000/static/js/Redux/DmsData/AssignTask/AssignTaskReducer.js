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
} from "../../ActionTypes"

const initialState = {
    loading: false,

    // Assign Project Data
    assignedTasks: [],
    createAssignTaskResponse: null,

    // My Projects Data
    projects: [],

    // Common Error
    error: null,
};

const assignTaskReducer = (state = initialState, action) => {
    switch (action.type) {
        // ================= REQUEST =================
        case CREATE_ASSIGN_TASK_REQUEST:
        case FETCH_ASSIGN_TASK_REQUEST:
        case FETCH_MY_PROJECTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

            // ================= CREATE ASSIGN TASK SUCCESS =================
        case CREATE_ASSIGN_TASK_SUCCESS:
            return {
                ...state,
                loading: false,
                createAssignTaskResponse: action.payload,
                assignedTasks: [...state.assignedTasks, action.payload],
                error: null,
            };

            // ================= FETCH ASSIGNED TASK SUCCESS =================
        case FETCH_ASSIGN_TASK_SUCCESS:
            return {
                ...state,
                loading: false,
                assignedTasks: action.payload,
                error: null,
            };

            // ================= FETCH MY PROJECTS SUCCESS =================
        case FETCH_MY_PROJECTS_SUCCESS:
            return {
                ...state,
                loading: false,
                projects: action.payload,
                error: null,
            };

            // ================= FAILURE =================
        case CREATE_ASSIGN_TASK_FAILURE:
        case FETCH_ASSIGN_TASK_FAILURE:
        case FETCH_MY_PROJECTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // ================= DEFAULT =================
        default:
            return state;
    }
};

export default assignTaskReducer;