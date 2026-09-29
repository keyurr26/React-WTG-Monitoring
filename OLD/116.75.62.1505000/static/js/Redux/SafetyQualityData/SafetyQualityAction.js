import {
    GET_SQ_RECORDS_REQUEST,
    GET_SQ_RECORDS_SUCCESS,
    GET_SQ_RECORDS_FAILURE,
    CREATE_SQ_RECORD_REQUEST,
    CREATE_SQ_RECORD_SUCCESS,
    CREATE_SQ_RECORD_FAILURE,
    UPDATE_SQ_RECORD_REQUEST,
    UPDATE_SQ_RECORD_SUCCESS,
    UPDATE_SQ_RECORD_FAILURE,

    GET_SQ_DASHBOARD_REQUEST,
    GET_SQ_DASHBOARD_SUCCESS,
    GET_SQ_DASHBOARD_FAILURE,

    GET_SQ_ROAD_LIST_REQUEST,
    GET_SQ_ROAD_LIST_SUCCESS,
    GET_SQ_ROAD_LIST_FAILURE,

    GET_SQ_ELECTRICAL_REQUEST,
    GET_SQ_ELECTRICAL_SUCCESS,
    GET_SQ_ELECTRICAL_FAILURE,

    GET_USS_RECORDS_REQUEST,
    GET_USS_RECORDS_SUCCESS,
    GET_USS_RECORDS_FAILURE,
} from "../ActionTypes";

import {
    GetDataApiWTGM,
    PatchDataApiWTGM,
    PostDataApiWTGM,
    PutDataApiWTGM
} from "../../utils/api";
import parseErrorMessage from '../../utils/errorFunction';

/* ================= GET SQ RECORDS ================= */

export const GetSQRecords = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_SQ_RECORDS_REQUEST
        });

        // ================= CLEAN FILTERS =================
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) => value !== "" && value !== null && value !== undefined
            )
        );

        const params = new URLSearchParams(cleanFilters).toString();

        const url = `/api/safety-quality-details/${params ? `?${params}` : ""}`;

        const response = await GetDataApiWTGM(url);
        // console.log("sqrecord list action",response)

        dispatch({
            type: GET_SQ_RECORDS_SUCCESS,
            payload: response,
        });

    } catch (error) {
        dispatch({
            type: GET_SQ_RECORDS_FAILURE,
            payload: parseErrorMessage(error.response ? .data || error.message),
        });
    }
};
export const GETUSSRecordList = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_USS_RECORDS_REQUEST
        });

        // ================= CLEAN FILTERS =================
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) => value !== "" && value !== null && value !== undefined
            )
        );

        const params = new URLSearchParams(cleanFilters).toString();

        const url = `/api/uss-master-activities/${params ? `?${params}` : ""}`;

        const response = await GetDataApiWTGM(url);
        // console.log("Uss list Data.Data",response)

        dispatch({
            type: GET_USS_RECORDS_SUCCESS,
            payload: response,
        });

    } catch (error) {
        dispatch({
            type: GET_USS_RECORDS_FAILURE,
            payload: parseErrorMessage(error.response ? .data || error.message),
        });
    }
};




/* ================= CREATE SQ RECORD ================= */
export const PostSQRecord = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_SQ_RECORD_REQUEST
        });

        // ✅ multipart/form-data
        const response = await PostDataApiWTGM(
            "/api/safety-quality-details/",
            formData,
            true
        );

        dispatch({
            type: CREATE_SQ_RECORD_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: CREATE_SQ_RECORD_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

/* ================= UPDATE SQ RECORD ================= */
export const UpdateSQRecord = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_SQ_RECORD_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/safety-quality-details/${id}/`,
            formData,
            true
        );

        dispatch({
            type: UPDATE_SQ_RECORD_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: UPDATE_SQ_RECORD_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

export const ApproveSQRecord = (id) => async (dispatch) => {
    try {
        await PostDataApiWTGM(`/api/safety-quality-details/${id}/approve/`);

        dispatch({
            type: "SQ_RECORD_APPROVED",
            payload: {
                id
            },

        });

        // Refresh list
        dispatch(GetSQRecords());
    } catch (error) {
        // console.error("Approve failed", error);
    }
};

export const GetSQDashboard = (filters) => async (dispatch) => {
    try {
        dispatch({
            type: GET_SQ_DASHBOARD_REQUEST
        });

        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
        );

        const query = new URLSearchParams(cleanFilters).toString();

        const response = await GetDataApiWTGM(
            `/api/sq-dashboard/?${query}`
        );

        dispatch({
            type: GET_SQ_DASHBOARD_SUCCESS,
            payload: response,
        });

    } catch (error) {
        dispatch({
            type: GET_SQ_DASHBOARD_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};

// electrical action 


export const GetSqElectricalRecordList = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_SQ_ELECTRICAL_REQUEST
        });

        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) =>
                value !== "" &&
                value !== null &&
                value !== undefined
            )
        );

        const query = new URLSearchParams(cleanFilters).toString();

        const url = query ?
            `/api/electrical-master-line-list/?${query}` :
            `/api/electrical-master-line-list/`;

        const response = await GetDataApiWTGM(url);
        // console.log("electrical response ",response)

        dispatch({
            type: GET_SQ_ELECTRICAL_SUCCESS,
            payload: response,

        });
    } catch (error) {
        dispatch({
            type: GET_SQ_ELECTRICAL_FAILURE,
            payload: error.response || error.message,
        });
    }
};

// map objects list 



export const GetRoadFilterData = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_SQ_ROAD_LIST_REQUEST
        });

        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(
                ([_, value]) =>
                value !== "" &&
                value !== null &&
                value !== undefined
            )
        );

        const query = new URLSearchParams(cleanFilters).toString();

        const url = query ?
            `/api/map-object-list/?${query}` :
            `/api/map-object-list/`;

        const response = await GetDataApiWTGM(url);
        // console.log("electrical response ",response)

        dispatch({
            type: GET_SQ_ROAD_LIST_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: GET_SQ_ROAD_LIST_FAILURE,
            payload: error.response || error.message,
        });
    }
};