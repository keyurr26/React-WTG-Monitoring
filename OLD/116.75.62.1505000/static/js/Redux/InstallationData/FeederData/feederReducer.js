import {
    CREATE_FEEDER_REQUEST,
    CREATE_FEEDER_SUCCESS,
    CREATE_FEEDER_FAILURE,
    GET_FEEDER_REQUEST,
    GET_FEEDER_SUCCESS,
    GET_FEEDER_FAILURE,

    GET_FEEDER_DETAILS_REQUEST,
    GET_FEEDER_DETAILS_SUCCESS,
    GET_FEEDER_DETAILS_FAILURE,
    POST_FEEDER_DETAILS_REQUEST,
    POST_FEEDER_DETAILS_SUCCESS,
    POST_FEEDER_DETAILS_FAILURE,
} from '../../ActionTypes';

const initialState = {
    feeders: [],
    feederDetails: [],
    loading: false,
    error: null,
};

export const feederReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_FEEDER_REQUEST:

            return {
                ...state,
                loading: true,
                error: null,
            };

        case CREATE_FEEDER_SUCCESS:
            return {
                ...state,
                loading: false,
                feeders: [...state.feeders, action.payload],
            };
        case CREATE_FEEDER_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case GET_FEEDER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_FEEDER_SUCCESS:
            return {
                ...state,
                loading: false,
                feeders: action.payload,
            };


        case GET_FEEDER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case GET_FEEDER_DETAILS_REQUEST:

            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_FEEDER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                feederDetails: action.payload,
            };

        case GET_FEEDER_DETAILS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        case POST_FEEDER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case POST_FEEDER_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                feederDetails: [...state.feederDetails, action.payload],
            };


        case POST_FEEDER_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};