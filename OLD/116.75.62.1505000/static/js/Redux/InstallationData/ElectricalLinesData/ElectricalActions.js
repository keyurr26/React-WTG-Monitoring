import {
    CREATE_POLE_LINE_REQUEST,
    CREATE_POLE_LINE_SUCCESS,
    CREATE_POLE_LINE_FAILURE,
    FETCH_TURBINE_FILTER_MASTER_REQUEST,
    FETCH_TURBINE_FILTER_MASTER_SUCCESS,
    FETCH_TURBINE_FILTER_MASTER_FAILURE,
    FETCH_POLE_LINES_DATA_REQUEST,
    FETCH_POLE_LINES_DATA_SUCCESS,
    FETCH_POLE_LINES_DATA_FAILURE,
    FETCH_POLE_VIEW_DATA_REQUEST,
    FETCH_POLE_VIEW_DATA_SUCCESS,
    FETCH_POLE_VIEW_DATA_FAILURE,
    PATCH_POLE_LINE_MATERIAL_REQUEST,
    PATCH_POLE_LINE_MATERIAL_SUCCESS,
    PATCH_POLE_LINE_MATERIAL_FAILURE,
    UPSERT_POLE_LINE_DATA_REQUEST,
    UPSERT_POLE_LINE_DATA_SUCCESS,
    UPSERT_POLE_LINE_DATA_FAILURE,
    FETCH_ELECTRICAL_DASHBOARD_REQUEST,
    FETCH_ELECTRICAL_DASHBOARD_SUCCESS,
    FETCH_ELECTRICAL_DASHBOARD_FAILURE,
    FETCH_ELECTRICAL_LINES_NESTED_REQUEST,
    FETCH_ELECTRICAL_LINES_NESTED_SUCCESS,
    FETCH_ELECTRICAL_LINES_NESTED_FAILURE,
    CLEAR_ELECTRICAL_LINES_NESTED,
} from "../../ActionTypes";
import parseErrorMessage from "../../../utils/errorFunction";
import {
    PostDataApiWTGM,
    GetDataApiWTGM,
    PatchDataApiWTGM,
} from "../../../utils/api";

export const GetTurbineFilterData = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_TURBINE_FILTER_MASTER_REQUEST
        });

        // dispatch({ type: "CLEAR_TURBINE_FILTER_DATA" });
        const response = await GetDataApiWTGM("/api/pwct-filter");

        dispatch({
            type: FETCH_TURBINE_FILTER_MASTER_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: FETCH_TURBINE_FILTER_MASTER_FAILURE,
            payload: errorMsg,
        });
    }
};

export const createPoleLineData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_POLE_LINE_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/electrical-pole-lines/",
            formData,
        );

        dispatch({
            type: CREATE_POLE_LINE_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: CREATE_POLE_LINE_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

// patch Data pole material
export const PatchPoleLineMaterialData = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_POLE_LINE_MATERIAL_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/electrical-pole-lines/${id}/`,
            formData,
        );

        dispatch({
            type: PATCH_POLE_LINE_MATERIAL_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: PATCH_POLE_LINE_MATERIAL_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

//! Bulk patch pole materialdata

export const BulkPatchPoleLineMaterialData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_POLE_LINE_MATERIAL_REQUEST
        });

        const response = await PatchDataApiWTGM(
            "/api/electrical-pole-lines/bulk-update/",
            formData,
        );

        dispatch({
            type: PATCH_POLE_LINE_MATERIAL_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: PATCH_POLE_LINE_MATERIAL_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

export const GetPoleLinesData =
    (filters = {}) =>
    async (dispatch) => {
        try {
            dispatch({
                type: FETCH_POLE_LINES_DATA_REQUEST
            });

            // Build query string from filters
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ?
                `/api/electrical-pole-lines/?${queryParams}` :
                "/api/electrical-pole-lines/";

            const response = await GetDataApiWTGM(url);

            dispatch({
                type: FETCH_POLE_LINES_DATA_SUCCESS,
                payload: response,
            });
        } catch (error) {
            const errorMsg = parseErrorMessage(error.response ? .data || error.message);

            dispatch({
                type: FETCH_POLE_LINES_DATA_FAILURE,
                payload: errorMsg,
            });
        }
    };

export const GetPoleViewData = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_POLE_VIEW_DATA_REQUEST
        });

        const response = await GetDataApiWTGM("/api/pole-view/");
        dispatch({
            type: FETCH_POLE_VIEW_DATA_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: FETCH_POLE_VIEW_DATA_FAILURE,
            payload: errorMsg,
        });
    }
};

export const UPSERTPOLELINEDATA = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPSERT_POLE_LINE_DATA_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/pole-line-detail-bulk-upsert/",
            formData,
        );

        dispatch({
            type: UPSERT_POLE_LINE_DATA_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: UPSERT_POLE_LINE_DATA_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

export const GetElectricalDashboardData =
    (params = {}) =>
    async (dispatch) => {
        try {
            dispatch({
                type: FETCH_ELECTRICAL_DASHBOARD_REQUEST
            });

            // ================= QUERY PARAMS =================
            const query = new URLSearchParams();

            if (params.project) query.append("project", params.project);
            if (params.windfarm) query.append("windfarm", params.windfarm);
            if (params.cluster) query.append("cluster", params.cluster);
            if (params.turbine) query.append("turbine", params.turbine);
            if (params.status) query.append("status", params.status);

            // ================= API CALL =================
            const response = await GetDataApiWTGM(
                `/api/electrical-dashboard/?${query.toString()}`,
            );

            dispatch({
                type: FETCH_ELECTRICAL_DASHBOARD_SUCCESS,
                payload: response,
            });
        } catch (error) {
            const errorMsg = parseErrorMessage(error.response ? .data || error.message);

            dispatch({
                type: FETCH_ELECTRICAL_DASHBOARD_FAILURE,
                payload: errorMsg,
            });
        }
    };

// electrical lines Nested Data
export const GetElectricalLinesNestedData =
    (filters = {}) =>
    async (dispatch) => {
        try {
            dispatch({
                type: FETCH_ELECTRICAL_LINES_NESTED_REQUEST,
            });
            const queryParams = new URLSearchParams();
            if (filters.project) {
                queryParams.append("project", filters.project);
            }
            if (filters.windfarm) {
                queryParams.append("windfarm", filters.windfarm);
            }
            if (filters.cluster) {
                queryParams.append("cluster", filters.cluster);
            }
            if (filters.line_type) {
                queryParams.append("line_type", filters.line_type);
            }
            const url = `/api/electrical-lines-nested/?${queryParams.toString()}`;
            const response = await GetDataApiWTGM(url);

            dispatch({
                type: FETCH_ELECTRICAL_LINES_NESTED_SUCCESS,
                payload: response,
            });
        } catch (error) {
            const errorMsg = parseErrorMessage(error.response ? .data || error.message);
            dispatch({
                type: FETCH_ELECTRICAL_LINES_NESTED_FAILURE,
                payload: errorMsg,
            });
        }
    };