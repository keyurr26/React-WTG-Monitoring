import {
    FETCH_TURBINE_LOCATIONS_REQUEST,
    FETCH_TURBINE_LOCATIONS_SUCCESS,
    FETCH_TURBINE_LOCATIONS_FAILURE,
    CREATE_TURBINE_LOCATION_REQUEST,
    CREATE_TURBINE_LOCATION_SUCCESS,
    CREATE_TURBINE_LOCATION_FAILURE,

    FETCH_ELIGIBLE_TURBINES_REQUEST,
    FETCH_ELIGIBLE_TURBINES_SUCCESS,
    FETCH_ELIGIBLE_TURBINES_FAILURE,

    GET_DAILY_PROGRESS_REQUEST,
    GET_DAILY_PROGRESS_SUCCESS,
    GET_DAILY_PROGRESS_FAILURE,
    CREATE_DAILY_PROGRESS_REQUEST,
    CREATE_DAILY_PROGRESS_SUCCESS,
    CREATE_DAILY_PROGRESS_FAILURE,

    GET_PLANNED_VS_ACTUAL_REQUEST,
    GET_PLANNED_VS_ACTUAL_SUCCESS,
    GET_PLANNED_VS_ACTUAL_FAILURE,

} from '../ActionTypes';

import {
    GetDataApiWTGM,
    PostDataApiWTGM
} from '../../utils/api'; // adjust the path
import parseErrorMessage from '../../utils/errorFunction'; // optional error parser

// 🔹 GET API: Fetch turbine locations
// export const getTurbineLocations = () => async (dispatch) => {
//     try {
//         dispatch({ type: FETCH_TURBINE_LOCATIONS_REQUEST });

//         const response = await GetDataApiWTGM('/api/turbine-locations/');

//         dispatch({
//             type: FETCH_TURBINE_LOCATIONS_SUCCESS,
//             payload: response,
//         });
//     } catch (error) {
//         const errorMsg = parseErrorMessage(error.response?.data || error.message);
//         dispatch({
//             type: FETCH_TURBINE_LOCATIONS_FAILURE,
//             payload: errorMsg,
//         });
//     }
// };

export const getTurbineLocations =
    (params = {}) =>
    async (dispatch) => {
        try {
            dispatch({
                type: FETCH_TURBINE_LOCATIONS_REQUEST
            });

            const query = new URLSearchParams(params).toString();

            const response = await GetDataApiWTGM(`/api/turbine-locations/?${query}`);

            dispatch({
                type: FETCH_TURBINE_LOCATIONS_SUCCESS,
                payload: response,
            });
        } catch (error) {
            const errorMsg = parseErrorMessage(error.response ? .data || error.message);

            dispatch({
                type: FETCH_TURBINE_LOCATIONS_FAILURE,
                payload: errorMsg,
            });
        }
    };

// export const getEligibleTurbines =
//   (activity, project, windfarm, cluster) =>
//   async (dispatch) => {

//     dispatch({ type: FETCH_ELIGIBLE_TURBINES_REQUEST });

//     try {
//       const query = new URLSearchParams({ activity });

//       if (project) query.append("project", project);
//       if (windfarm) query.append("windfarm", windfarm);
//       if (cluster) query.append("cluster", cluster);

//       const response = await GetDataApiWTGM(
//         `/api/eligible-turbines/?${query.toString()}`
//       );


//       dispatch({
//         type: FETCH_ELIGIBLE_TURBINES_SUCCESS,
//         payload: response, 
//       });

//     } catch (err) {
//       dispatch({
//         type: FETCH_ELIGIBLE_TURBINES_FAILURE,
//         payload: err?.response?.data || err.message,
//       });
//     }
// };


export const getEligibleTurbines =
    (project = null, windfarm = null, cluster = null, activity = null, category = null) =>
    async (dispatch) => {
        dispatch({
            type: FETCH_ELIGIBLE_TURBINES_REQUEST,
        });

        try {
            const query = new URLSearchParams();
            if (project) query.append("project", project);
            if (windfarm) query.append("windfarm", windfarm);
            if (cluster) query.append("cluster", cluster);
            if (activity) query.append("activity", activity);
            if (category) query.append("category", category);

            const response = await GetDataApiWTGM(
                `/api/eligible-turbines/?${query.toString()}`,
            );

            // Save the complete matrix directly to your reducer state
            dispatch({
                type: FETCH_ELIGIBLE_TURBINES_SUCCESS,
                payload: response,
            });

            return response;
        } catch (err) {
            dispatch({
                type: FETCH_ELIGIBLE_TURBINES_FAILURE,
                payload: err ? .message || "Failed to fetch turbines matrix",
            });

            throw err;
        }
    };


// 🔹 POST API: Create turbine location
// export const createTurbineLocation = (formData) => async (dispatch) => {
//     try {
//         dispatch({ type: CREATE_TURBINE_LOCATION_REQUEST });

//         const response = await PostDataApiWTGM('/api/turbine-locations/', formData, true);

//         dispatch({
//             type: CREATE_TURBINE_LOCATION_SUCCESS,
//             payload: response,
//         });
//     } catch (error) {
//         const errorMsg = parseErrorMessage(error.response?.data || error.message);
//         dispatch({
//             type: CREATE_TURBINE_LOCATION_FAILURE,
//             payload: errorMsg,
//         });
//         throw error; // rethrow if UI wants to catch
//     }
// };

// 🔹 POST API: Bulk create turbine locations
export const createBulkTurbineLocations = (payload) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_TURBINE_LOCATION_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/turbine-locations/bulk/",
            payload
        );

        dispatch({
            type: CREATE_TURBINE_LOCATION_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_TURBINE_LOCATION_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};



// Fetch daily progress with optional filters
export const getDailyProgress = (filters) => async (dispatch) => {
    try {
        dispatch({
            type: GET_DAILY_PROGRESS_REQUEST
        });
        const query = new URLSearchParams(filters).toString();
        const response = await GetDataApiWTGM(`/api/daily-activity-progress/?${query}`);
        dispatch({
            type: GET_DAILY_PROGRESS_SUCCESS,
            payload: response
        });
    } catch (error) {
        dispatch({
            type: GET_DAILY_PROGRESS_FAILURE,
            payload: error.message
        });
    }
};

// Upsert daily progress
export const upsertDailyProgress = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_DAILY_PROGRESS_REQUEST
        });
        const response = await PostDataApiWTGM(`/api/daily-activity-progress/`, formData, true);
        dispatch({
            type: CREATE_DAILY_PROGRESS_SUCCESS,
            payload: response
        });
        return response;
    } catch (error) {
        dispatch({
            type: CREATE_DAILY_PROGRESS_FAILURE,
            payload: error.message
        });
        throw error;
    }
};


// 🔹 GET: Activity Planned vs Actual (Graph API)
export const getActivityPlannedVsActual = (filters) => async (dispatch) => {
    try {
        dispatch({
            type: GET_PLANNED_VS_ACTUAL_REQUEST
        });

        const query = new URLSearchParams(filters).toString();

        const response = await GetDataApiWTGM(
            `/api/activity-planned-vs-actual/?${query}`
        );

        dispatch({
            type: GET_PLANNED_VS_ACTUAL_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: GET_PLANNED_VS_ACTUAL_FAILURE,
            payload: errorMsg,
        });
    }
};