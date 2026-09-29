import {
    FETCH_MATERIAL_AGING_REQUEST,
    FETCH_MATERIAL_AGING_SUCCESS,
    FETCH_MATERIAL_AGING_FAILURE,


} from '../ActionTypes';

const initialState = {
    loading: false,
    materialAging: [],
    error: null
};

export const InventaryDataReducer = (state = initialState, action) => {
    switch (action.type) {

        case FETCH_MATERIAL_AGING_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case FETCH_MATERIAL_AGING_SUCCESS:
            return {
                ...state,
                loading: false,
                materialAging: action.payload,
            };

        case FETCH_MATERIAL_AGING_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        default:
            return state;
    }
}