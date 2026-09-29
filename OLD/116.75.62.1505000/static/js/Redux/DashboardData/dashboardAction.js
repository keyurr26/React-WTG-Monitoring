import {
    FETCH_TURBINE_ACTIVITY_REPORT_REQUEST,
    FETCH_TURBINE_ACTIVITY_REPORT_SUCCESS,
    FETCH_TURBINE_ACTIVITY_REPORT_FAILURE,
    FETCH_TURBINE_ACTIVITY_AGGREGATION_REQUEST,
    FETCH_TURBINE_ACTIVITY_AGGREGATION_SUCCESS,
    FETCH_TURBINE_ACTIVITY_AGGREGATION_FAILURE,
    FETCH_DPR_DATA_REQUEST,
    FETCH_DPR_DATA_SUCCESS,
    FETCH_DPR_DATA_FAILURE,
    FETCH_TURBINE_FULL_DATA_REQUEST,
    FETCH_TURBINE_FULL_DATA_SUCCESS,
    FETCH_TURBINE_FULL_DATA_FAILURE,
    FETCH_FOUNDATION_SUMMARY_REQUEST,
    FETCH_FOUNDATION_SUMMARY_SUCCESS,
    FETCH_FOUNDATION_SUMMARY_FAILURE,
    FETCH_WTG_SUMMARY_REQUEST,
    FETCH_WTG_SUMMARY_SUCCESS,
    FETCH_WTG_SUMMARY_FAILURE,
    GET_ROAD_SUMMARY_REQUEST,
    GET_ROAD_SUMMARY_SUCCESS,
    GET_ROAD_SUMMARY_FAILURE,
    FETCH_TIMELINE_DATA_REQUEST,
    FETCH_TIMELINE_DATA_SUCCESS,
    FETCH_TIMELINE_DATA_FAILURE,
    GET_DELAY_SUMMARY_REQUEST,
    GET_DELAY_SUMMARY_SUCCESS,
    GET_DELAY_SUMMARY_FAILURE,
    GET_NOTIFICATIONS_REQUEST,
    GET_NOTIFICATIONS_SUCCESS,
    GET_NOTIFICATIONS_FAIL,
    FETCH_WTG_DPR_REQUEST,
    FETCH_WTG_DPR_SUCCESS,
    FETCH_WTG_DPR_FAILURE,

} from "../ActionTypes";

import {
    GetDataApiWTGM
} from '../../utils/api';

export const GetTurbineActivityReport = (turbine_id) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_TURBINE_ACTIVITY_REPORT_REQUEST
        });

        const response = await GetDataApiWTGM(
            `/api/turbine-activity-days-report/${turbine_id}/`
        );

        dispatch({
            type: FETCH_TURBINE_ACTIVITY_REPORT_SUCCESS,
            payload: response,
        });

    } catch (error) {
        dispatch({
            type: FETCH_TURBINE_ACTIVITY_REPORT_FAILURE,
            payload: error.response ? .data || "Failed to fetch Turbine Activity Report",
        });
    }
};

export const GetTurbineActivityAggregation = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_TURBINE_ACTIVITY_AGGREGATION_REQUEST
        });

        const response = await GetDataApiWTGM(
            "/api/turbine-activity-aggregation/", {
                params: filters
            }
        );

        dispatch({
            type: FETCH_TURBINE_ACTIVITY_AGGREGATION_SUCCESS,
            payload: response,
        });
        return response;
    } catch (error) {
        dispatch({
            type: FETCH_TURBINE_ACTIVITY_AGGREGATION_FAILURE,
            payload: error.response ? .data ||
                "Failed to fetch Turbine Activity Aggregation Data",
        });
    }
};


export const GetUnifiedDPRData = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_DPR_DATA_REQUEST
        }); // Make sure to define this constant

        const queryParams = new URLSearchParams(filters).toString();
        const url = `/api/turbine-full-data/dpr/${queryParams ? `?${queryParams}` : ""}`;

        const response = await GetDataApiWTGM(url);

        if (!response) throw new Error("Empty response from API");

        dispatch({
            type: FETCH_DPR_DATA_SUCCESS, // Make sure to define this constant
            payload: response, // This contains { status, total_count, data }
        });
    } catch (error) {
        console.error("❌ API Error (DPR Data):", error);
        dispatch({
            type: FETCH_DPR_DATA_FAILURE,
            payload: error.response ? .data || error.message || "Failed to fetch DPR data",
        });
    }
};


// 1. Action for the Nested Data (Main Table)
export const GetFullTurbineInstallationData = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_TURBINE_FULL_DATA_REQUEST
        });

        // Convert filters object to query string: ?project=1&windfarm=1...
        const queryParams = new URLSearchParams(filters).toString();
        const url = `/api/turbine-full-data/all/${queryParams ? `?${queryParams}` : ""}`;

        const response = await GetDataApiWTGM(url);

        if (!response) throw new Error("Empty response from API");

        dispatch({
            type: FETCH_TURBINE_FULL_DATA_SUCCESS,
            payload: response.data, // This contains the nested "data" array
        });
    } catch (error) {
        console.error("❌ API Error (All Data):", error);
        dispatch({
            type: FETCH_TURBINE_FULL_DATA_FAILURE,
            payload: error.response ? .data || error.message || "Failed to fetch all data",
        });
    }
};


// Action for the Summary Data (Metrics & Charts)
export const GetFoundationSummaryData = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_FOUNDATION_SUMMARY_REQUEST
        });

        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v != null && v !== "")
        );
        const queryParams = new URLSearchParams(activeFilters).toString();

        // Correct URL construction
        const url = `/api/foundation-summary/${queryParams ? `?${queryParams}` : ""}`;

        const response = await GetDataApiWTGM(url);



        if (response && response.statistics) {
            dispatch({
                type: FETCH_FOUNDATION_SUMMARY_SUCCESS,
                payload: response, // Use the whole response directly
            });
        } else {
            throw new Error("Failed to fetch summary data");
        }
    } catch (error) {
        dispatch({
            type: FETCH_FOUNDATION_SUMMARY_FAILURE,
            payload: error.response ? .data ? .message || error.message || "Something went wrong",
        });

        throw new Error(error.message);
    }
};


export const GetWTGSummaryData = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_WTG_SUMMARY_REQUEST
        });

        // Filter out empty strings or nulls from query params
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v != null && v !== "")
        );
        const queryParams = new URLSearchParams(activeFilters).toString();

        // Target the new WTG Installation endpoint
        const url = `/api/wtg-installtion-summary/${queryParams ? `?${queryParams}` : ""}`;

        const response = await GetDataApiWTGM(url);

        if (response && response.metrics) {
            dispatch({
                type: FETCH_WTG_SUMMARY_SUCCESS,
                payload: response,
            });
        } else {
            throw new Error("Invalid response structure from WTG API");
        }
    } catch (error) {
        dispatch({
            type: FETCH_WTG_SUMMARY_FAILURE,
            payload: error.response ? .data ? .message || error.message || "Failed to load WTG data",
        });
    }
};


export const getRoadDashboardSummary = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_ROAD_SUMMARY_REQUEST
        });

        // 1. Filter out empty strings or nulls to clean the query
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v != null && v !== "")
        );
        const queryParams = new URLSearchParams(activeFilters).toString();

        // 2. Target your new Road Summary endpoint
        const url = `/api/road-dashboard-summary/${queryParams ? `?${queryParams}` : ""}`;

        // 3. Use your existing API utility
        const response = await GetDataApiWTGM(url);

        // 4. Validate and Dispatch (Check for 'status' or 'data' based on your Django view)
        if (response && response.status === "success") {
            dispatch({
                type: GET_ROAD_SUMMARY_SUCCESS,
                payload: response.data,
            });
        } else {
            throw new Error("Invalid response structure from Road API");
        }
    } catch (error) {
        dispatch({
            type: GET_ROAD_SUMMARY_FAILURE,
            payload: error.response ? .data ? .message || error.message || "Failed to load Road summary data",
        });
    }
};


//  planned vs actual turbine timeline graph 
//aarti 10-04-2026

export const GetActivityTimelineData = (turbineId, projectId, windfarmId) => async (dispatch) => {
    if (!turbineId) return;

    try {
        dispatch({
            type: FETCH_TIMELINE_DATA_REQUEST
        });

        // URL format: /api/activity-timeline/123/?project=20&windfarm=14
        let url = `/api/activity-timeline/${turbineId}/`;

        const params = [];
        if (projectId) params.push(`project=${projectId}`);
        if (windfarmId) params.push(`windfarm=${windfarmId}`);

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        const response = await GetDataApiWTGM(url);

        if (!response) throw new Error("Empty response from Timeline API");

        dispatch({
            type: FETCH_TIMELINE_DATA_SUCCESS,
            payload: response.data ? response.data : response,
        });
    } catch (error) {
        console.error("❌ API Error (Timeline Data):", error);
        dispatch({
            type: FETCH_TIMELINE_DATA_FAILURE,
            payload: error.response ? .data || error.message || "Failed to fetch timeline data",
        });
    }
};


export const getDelaySummary = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_DELAY_SUMMARY_REQUEST
        });

        // Note the '/summary/' suffix added to the base URL
        const response = await GetDataApiWTGM("/api/delay-analysis/summary/", {
            params
        });

        dispatch({
            type: GET_DELAY_SUMMARY_SUCCESS,
            payload: response, // This contains { summary, cause_distribution, turbine_drilldown }
        });
    } catch (error) {
        dispatch({
            type: GET_DELAY_SUMMARY_FAILURE,
            payload: error.response ? .data ? .detail || "Failed to fetch delay summary",
        });
    }
};

export const GetNotifications = () => async (dispatch, getState) => {
    try {
        const state = getState();

        const user = JSON.parse(sessionStorage.getItem("authTokens")) ? .user;
        const role = user ? .role;


        if (role !== "admin") {
            return;
        }

        dispatch({
            type: GET_NOTIFICATIONS_REQUEST,
        });

        const response = await GetDataApiWTGM(
            "/api/turbine-full-data/notifications/",
        );

        dispatch({
            type: GET_NOTIFICATIONS_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: GET_NOTIFICATIONS_FAIL,
            payload: error.message,
        });
    }
};

export const refreshNotifications = () => ({
    type: "NOTIFICATIONS_REFRESH",
});


export const GetWtgDprData = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_WTG_DPR_REQUEST
        });

        const queryParams = new URLSearchParams(filters).toString();
        // Make sure this matches your Django router URL path
        const url = `/api/turbine-full-data/wtg-dpr/${queryParams ? `?${queryParams}` : ""}`;

        const response = await GetDataApiWTGM(url);

        if (!response) throw new Error("Empty response from API");

        dispatch({
            type: FETCH_WTG_DPR_SUCCESS,
            payload: response, // Contains { status, total_count, data }
        });
    } catch (error) {
        console.error("❌ API Error (WTG DPR Data):", error);
        dispatch({
            type: FETCH_WTG_DPR_FAILURE,
            payload: error.response ? .data || error.message || "Failed to fetch WTG DPR data",
        });
    }
};