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

    GET_SQ_ELECTRICAL_REQUEST,
    GET_SQ_ELECTRICAL_SUCCESS,
    GET_SQ_ELECTRICAL_FAILURE,

    GET_SQ_ROAD_LIST_REQUEST,
    GET_SQ_ROAD_LIST_SUCCESS,
    GET_SQ_ROAD_LIST_FAILURE,

    GET_USS_RECORDS_REQUEST,
    GET_USS_RECORDS_SUCCESS,
    GET_USS_RECORDS_FAILURE,
} from "../ActionTypes";

const initialState = {
    loading: false,
    sqlist: [],
    dashboard: null,
    electricalRecordList: [],
    RoadList: [],
    UssList: [],
    error: null,
};

const sqReducer = (state = initialState, action) => {
    switch (action.type) {
        /* ================= GET LIST ================= */

        case GET_SQ_RECORDS_REQUEST:
            return {
                ...state,
                loadingList: true,
                error: null,
            };

        case GET_SQ_RECORDS_SUCCESS:
            return {
                ...state,
                loadingList: false,
                sqlist: action.payload,
            };

        case GET_SQ_RECORDS_FAILURE:
            return {
                ...state,
                loadingList: false,
                error: action.payload,
            };

            /* ================= CREATE ================= */

        case CREATE_SQ_RECORD_REQUEST:
            return {
                ...state,
                loadingCreate: true,
                error: null,
            };

        case CREATE_SQ_RECORD_SUCCESS:
            return {
                ...state,
                loadingCreate: false,
                sqlist: [action.payload, ...state.sqlist],
            };

        case CREATE_SQ_RECORD_FAILURE:
            return {
                ...state,
                loadingCreate: false,
                error: action.payload,
            };

            /* ================= UPDATE ================= */

        case UPDATE_SQ_RECORD_REQUEST:
            return {
                ...state,
                loadingUpdate: true,
                error: null,
            };

        case UPDATE_SQ_RECORD_SUCCESS:
            return {
                ...state,
                loadingUpdate: false,
                sqlist: state.sqlist.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                ),
            };

        case UPDATE_SQ_RECORD_FAILURE:
            return {
                ...state,
                loadingUpdate: false,
                error: action.payload,
            };

        case GET_SQ_DASHBOARD_REQUEST:
            return { ...state,
                loading: true
            };

        case GET_SQ_DASHBOARD_SUCCESS:
            return { ...state,
                loading: false,
                dashboard: action.payload
            };

        case GET_SQ_DASHBOARD_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case GET_USS_RECORDS_REQUEST:
            return { ...state,
                loading: true
            };

        case GET_USS_RECORDS_SUCCESS:
            return { ...state,
                loading: false,
                UssList: action.payload
            };

        case GET_USS_RECORDS_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case GET_SQ_ROAD_LIST_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_SQ_ROAD_LIST_SUCCESS:
            // console.log("Reducer Payload:", action.payload);
            return {
                ...state,
                loading: false,
                RoadList: action.payload,
                error: null,
            };

        case GET_SQ_ROAD_LIST_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case GET_SQ_ELECTRICAL_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_SQ_ELECTRICAL_SUCCESS:
            // console.log("Reducer Payload:", action.payload);

            return {
                ...state,
                loading: false,
                electricalRecordList: action.payload,
                error: null,
            };

        case GET_SQ_ELECTRICAL_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        default:
            return state;
    }
};

export default sqReducer;