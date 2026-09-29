import {
    CREATE_USS_ACTIVITY_REQUEST,
    CREATE_USS_ACTIVITY_SUCCESS,
    CREATE_USS_ACTIVITY_FAILURE,

    GET_USS_DASHBOARD_DATA_REQUEST,
    GET_USS_DASHBOARD_DATA_SUCCESS,
    GET_USS_DASHBOARD_DATA_FAILURE,
} from "../../ActionTypes";

const initialState = {
    loading: false,
    success: false,
    error: null,

    createdActivity: null,

    // Dashboard
    dashboardLoading: false,
    UssdashboardData: null,
    dashboardError: null,
};

export const UssActivityReducer = (state = initialState, action) => {
    switch (action.type) {
        // ================= CREATE USS ACTIVITY =================
        case CREATE_USS_ACTIVITY_REQUEST:
            return {
                ...state,
                loading: true,
                success: false,
                error: null,
            };

        case CREATE_USS_ACTIVITY_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                createdActivity: action.payload,
            };

        case CREATE_USS_ACTIVITY_FAILURE:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload,
            };

            // ================= USS DASHBOARD =================
        case GET_USS_DASHBOARD_DATA_REQUEST:
            return {
                ...state,
                dashboardLoading: true,
                dashboardError: null,
            };

        case GET_USS_DASHBOARD_DATA_SUCCESS:
            return {
                ...state,
                dashboardLoading: false,
                UssdashboardData: action.payload,
            };

        case GET_USS_DASHBOARD_DATA_FAILURE:
            return {
                ...state,
                dashboardLoading: false,
                dashboardError: action.payload,
            };

        default:
            return state;
    }
};