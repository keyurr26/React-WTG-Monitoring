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

const initialState = {
    loading: false,
    success: false,
    patchLoading: false,
    poledata: null,
    getturbinefilter: [],
    getpoLineData: [],
    getpoleView: [],
    upsertPoleLineData: [],
    electricalDashboardData: [],
    getElectricalLinesNested: [],
    patchpolematerial: null,
    error: null,
};

export const ElectricalDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_POLE_LINE_REQUEST:
            return {
                ...state,
                loading: true,
                success: false,
                error: null,
            };

        case CREATE_POLE_LINE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                poledata: action.payload,
            };

        case CREATE_POLE_LINE_FAILURE:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload,
            };
        case FETCH_TURBINE_FILTER_MASTER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_TURBINE_FILTER_MASTER_SUCCESS:
            //  console.log("Reducer Payload pwct:", action.payload);
            return {
                ...state,
                loading: false,
                getturbinefilter: action.payload,
            };

        case FETCH_TURBINE_FILTER_MASTER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case FETCH_POLE_LINES_DATA_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_POLE_LINES_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                getpoLineData: action.payload,
            };

        case FETCH_POLE_LINES_DATA_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case FETCH_POLE_VIEW_DATA_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_POLE_VIEW_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                getpoleView: action.payload,
            };

        case FETCH_POLE_VIEW_DATA_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            // patch pole Data
            // 🔥 PATCH MATERIAL
        case PATCH_POLE_LINE_MATERIAL_REQUEST:
            return {
                ...state,
                // loading: true,
                patchLoading: true,
                error: null,
            };

        case PATCH_POLE_LINE_MATERIAL_SUCCESS:
            return {
                ...state,
                // loading: false,
                patchLoading: false,
                // ✅ Safely check if getpoLineData exists and is an array
                getpoLineData: state.getpoLineData && Array.isArray(state.getpoLineData) ?
                    state.getpoLineData.map((item) =>
                        item.id === action.payload ? .id ?
                        { ...item,
                            ...action.payload
                        } :
                        item,
                    ) :
                    state.getpoLineData || [], // Return empty array if undefined
                patchpolematerial: action.payload,
                error: null,
            };

        case PATCH_POLE_LINE_MATERIAL_FAILURE:
            return {
                ...state,
                // loading: false,
                patchLoading: false,
                error: action.payload,
            };

            // rushi upsert pole Line Data 13-04-2026
        case UPSERT_POLE_LINE_DATA_REQUEST:
            return {
                ...state,
                loading: true,
                success: false,
                error: null,
            };

        case UPSERT_POLE_LINE_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                upsertPoleLineData: action.payload,
            };

        case UPSERT_POLE_LINE_DATA_FAILURE:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload,
            };

        case FETCH_ELECTRICAL_DASHBOARD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_ELECTRICAL_DASHBOARD_SUCCESS:
            return {
                ...state,
                loading: false,
                electricalDashboardData: action.payload,
            };

        case FETCH_ELECTRICAL_DASHBOARD_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case FETCH_ELECTRICAL_LINES_NESTED_REQUEST:
            return {
                ...state,
                // loading: true,
                error: null,
            };

        case FETCH_ELECTRICAL_LINES_NESTED_SUCCESS:
            return {
                ...state,
                loading: false,
                getElectricalLinesNested: action.payload,
            };

        case FETCH_ELECTRICAL_LINES_NESTED_FAILURE:
            return {
                ...state,
                // loading: false,
                error: action.payload,
            };

        case CLEAR_ELECTRICAL_LINES_NESTED:
            return {
                ...state,
                loading: false,
                error: null,
                getElectricalLinesNested: [],
            };

        default:
            return state;
    }
};