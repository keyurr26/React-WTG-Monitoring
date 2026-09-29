import {
    CREATE_PLATFORM_MASTER_REQUEST,
    CREATE_PLATFORM_MASTER_SUCCESS,
    CREATE_PLATFORM_MASTER_FAILURE,
    GET_PLATFORM_MASTER_REQUEST,
    GET_PLATFORM_MASTER_SUCCESS,
    GET_PLATFORM_MASTER_FAILURE,
    CREATE_PLATFORM_DPR_REQUEST,
    CREATE_PLATFORM_DPR_SUCCESS,
    CREATE_PLATFORM_DPR_FAILURE,
    GET_PLATFORM_DPR_REQUEST,
    GET_PLATFORM_DPR_SUCCESS,
    GET_PLATFORM_DPR_FAILURE,
    PATCH_PLATFORM_MASTER_REQUEST,
    PATCH_PLATFORM_MASTER_SUCCESS,
    PATCH_PLATFORM_MASTER_FAILURE,
    PATCH_PLATFORM_DPR_REQUEST,
    PATCH_PLATFORM_DPR_SUCCESS,
    PATCH_PLATFORM_DPR_FAILURE,
} from "../../ActionTypes";

import {
    GetDataApiWTGM,
    PostDataApiWTGM,
    PatchDataApiWTGM
} from "../../../utils/api";
import parseErrorMessage from "../../../utils/errorFunction";


// POST Platform Master
export const postPlatformMaster = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_PLATFORM_MASTER_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/platform-master/",
            formData,
            true // multipart/form-data (for FDD / MDD attachments)
        );

        dispatch({
            type: CREATE_PLATFORM_MASTER_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: CREATE_PLATFORM_MASTER_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

// GET Platform Master
export const getPlatformMaster = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_PLATFORM_MASTER_REQUEST
        });

        const response = await GetDataApiWTGM("/api/platform-master/", {
            params
        });

        dispatch({
            type: GET_PLATFORM_MASTER_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: GET_PLATFORM_MASTER_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};


// POST Platform DPR (Daily Progress Entry)
export const postPlatformDPR = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_PLATFORM_DPR_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/platform-dpr/",
            formData,
            true // multipart/form-data (required for Photo and Document uploads)
        );

        dispatch({
            type: CREATE_PLATFORM_DPR_SUCCESS,
            payload: response,
        });

        return {
            success: true
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: CREATE_PLATFORM_DPR_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

// GET Platform DPR (Fetch table data with filters)
export const getPlatformDPR = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_PLATFORM_DPR_REQUEST
        });

        // This will handle ?project=1&windfarm=2 etc.
        const response = await GetDataApiWTGM("/api/platform-dpr/", {
            params
        });

        dispatch({
            type: GET_PLATFORM_DPR_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: GET_PLATFORM_DPR_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};


export const patchPlatformMaster = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_PLATFORM_MASTER_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/platform-master/${id}/`,
            formData,
            true,
        );

        dispatch({
            type: PATCH_PLATFORM_MASTER_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_PLATFORM_MASTER_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};


export const patchPlatformDPR = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_PLATFORM_DPR_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/platform-dpr/${id}/`,
            formData,
            false,
        );

        dispatch({
            type: PATCH_PLATFORM_DPR_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: PATCH_PLATFORM_DPR_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};