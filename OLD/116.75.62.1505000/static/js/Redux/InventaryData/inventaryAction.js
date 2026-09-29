import {
    FETCH_MATERIAL_AGING_REQUEST,
    FETCH_MATERIAL_AGING_SUCCESS,
    FETCH_MATERIAL_AGING_FAILURE,


} from '../ActionTypes';

import parseErrorMessage from '../../utils/errorFunction';
import {
    PostDataApiWTGM,
    GetDataApiWTGM,
    DeleteDataApiWTGM,
    PatchDataApiWTGM
} from '../../utils/api';


export const GetMaterialAgingData = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_MATERIAL_AGING_REQUEST
        });

        const response = await GetDataApiWTGM(
            "/api/material-aging/", {
                params: filters
            }
        );

        dispatch({
            type: FETCH_MATERIAL_AGING_SUCCESS,
            payload: response,
        });

    } catch (error) {
        dispatch({
            type: FETCH_MATERIAL_AGING_FAILURE,
            payload: error.response ? .data ||
                "Failed to fetch Material Aging Data",
        });
    }
};