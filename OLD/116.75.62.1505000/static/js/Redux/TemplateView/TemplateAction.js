import {
    GetDataApiWTGM
} from "../../utils/api";

import {
    GET_PROJECT_NESTED_TEMPLATE_REQUEST,
    GET_PROJECT_NESTED_TEMPLATE_SUCCESS,
    GET_PROJECT_NESTED_TEMPLATE_FAILURE,
} from "../ActionTypes";

import parseErrorMessage from "../../utils/errorFunction";

export const GetProjectNestedTemplate =
    (filters = {}) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GET_PROJECT_NESTED_TEMPLATE_REQUEST,
            });

            // ================= CLEAN FILTERS =================
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(
                    ([_, value]) =>
                    value !== "" &&
                    value !== null &&
                    value !== undefined &&
                    !(Array.isArray(value) && value.length === 0) // ✅ Remove empty arrays
                )
            );

            // ================= HANDLE ARRAY VALUES =================
            // Convert arrays to comma-separated strings (for backend)
            const normalizedFilters = {};
            Object.entries(cleanFilters).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    // Join array with commas: ['soil', 'pcc'] => 'soil,pcc'
                    normalizedFilters[key] = value.join(",");
                } else {
                    normalizedFilters[key] = value;
                }
            });

            const params = new URLSearchParams(normalizedFilters).toString();

            const url = `/api/project-nested-template-viewset/${
        params ? `?${params}` : ""
      }`;

            console.log("Project Nested Template API URL:", url);

            const response = await GetDataApiWTGM(url);

            dispatch({
                type: GET_PROJECT_NESTED_TEMPLATE_SUCCESS,
                payload: response,
            });
        } catch (error) {
            dispatch({
                type: GET_PROJECT_NESTED_TEMPLATE_FAILURE,
                payload: parseErrorMessage(
                    error.response ? .data || error.message
                ),
            });
        }
    };