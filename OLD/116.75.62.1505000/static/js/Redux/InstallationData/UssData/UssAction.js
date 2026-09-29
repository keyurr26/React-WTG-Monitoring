import {
    CREATE_USS_ACTIVITY_REQUEST,
    CREATE_USS_ACTIVITY_SUCCESS,
    CREATE_USS_ACTIVITY_FAILURE,
    GET_USS_ACTIVITY_REQUEST,
    GET_USS_ACTIVITY_SUCCESS,
    GET_USS_ACTIVITY_FAILURE,

    GET_USS_DASHBOARD_DATA_REQUEST,
    GET_USS_DASHBOARD_DATA_SUCCESS,
    GET_USS_DASHBOARD_DATA_FAILURE,
} from "../../ActionTypes";

import parseErrorMessage from "../../../utils/errorFunction";

import {
    PostDataApiWTGM,
    GetDataApiWTGM,
    DeleteDataApiWTGM,
    PatchDataApiWTGM,
} from "../../../utils/api";

export const createUssActivity = (formData) => async (dispatch) => {
    dispatch({
        type: CREATE_USS_ACTIVITY_REQUEST
    });
    try {
        const data = await PostDataApiWTGM(
            "/api/uss-turbine-activity/",
            formData,
            true,
        );

        dispatch({
            type: CREATE_USS_ACTIVITY_SUCCESS,
            payload: data,
        });
        return data;
    } catch (error) {
        const serverError = error.response ? .data;
        const errorMsg = parseErrorMessage(serverError);
        // const errorMsg = parseErrorMessage(error.response?.data || error.message);
        dispatch({
            type: CREATE_USS_ACTIVITY_FAILURE,
            payload: errorMsg,
        });
        throw errorMsg;
    }
};



export const getUSSDashboardSummary = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_USS_DASHBOARD_DATA_REQUEST
        });

        // Remove empty filters
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) => value !== null && value !== undefined && value !== ""
            )
        );

        const queryParams = new URLSearchParams(activeFilters).toString();

        // API URL
        const url = `/api/uss-dashboard-summary/${queryParams ? `?${queryParams}` : ""}`;

        // Call API
        const response = await GetDataApiWTGM(url);

        if (response && response.status === "success") {
            dispatch({
                type: GET_USS_DASHBOARD_DATA_SUCCESS,
                payload: response ? .data,
            });
        } else {
            throw new Error("Invalid response structure from USS Dashboard API");
        }
    } catch (error) {
        dispatch({
            type: GET_USS_DASHBOARD_DATA_FAILURE,
            payload: error.response ? .data ? .message ||
                error.message ||
                "Failed to load USS Dashboard data",
        });
    }
};