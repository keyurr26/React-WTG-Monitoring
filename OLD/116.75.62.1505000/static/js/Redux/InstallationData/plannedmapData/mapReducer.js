import {
    CREATE_MAP_OBJECT_REQUEST,
    CREATE_MAP_OBJECT_SUCCESS,
    CREATE_MAP_OBJECT_FAILURE,
    CREATE_MAP_COORDINATES_REQUEST,
    CREATE_MAP_COORDINATES_SUCCESS,
    CREATE_MAP_COORDINATES_FAILURE,
    FETCH_MAP_OBJECTS_REQUEST,
    FETCH_MAP_OBJECTS_SUCCESS,
    FETCH_MAP_OBJECTS_FAILURE,
    FETCH_MAP_COORDINATES_REQUEST,
    FETCH_MAP_COORDINATES_SUCCESS,
    FETCH_MAP_COORDINATES_FAILURE
} from '../../ActionTypes';

const initialState = {
    mapObjects: [],
    mapCoordinates: [],
    loading: false,
    creating: false,
    error: null,
};

const mapReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_MAP_OBJECT_REQUEST:
        case CREATE_MAP_COORDINATES_REQUEST:
            return {
                ...state,
                creating: true,
                error: null,
            };

        case CREATE_MAP_OBJECT_SUCCESS:
            return {
                ...state,
                creating: false,
                mapObjects: [...state.mapObjects, action.payload],
                error: null,
            };

        case CREATE_MAP_COORDINATES_SUCCESS:
            return {
                ...state,
                creating: false,
                mapCoordinates: [...state.mapCoordinates, action.payload],
                error: null,
            };

        case CREATE_MAP_OBJECT_FAILURE:
        case CREATE_MAP_COORDINATES_FAILURE:
            return {
                ...state,
                creating: false,
                error: action.payload,
            };

        case FETCH_MAP_OBJECTS_REQUEST:
        case FETCH_MAP_COORDINATES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_MAP_OBJECTS_SUCCESS:
            return {
                ...state,
                loading: false,
                mapObjects: action.payload,
                error: null,
            };

        case FETCH_MAP_COORDINATES_SUCCESS:
            return {
                ...state,
                loading: false,
                mapCoordinates: action.payload,
                error: null,
            };

        case FETCH_MAP_OBJECTS_FAILURE:
        case FETCH_MAP_COORDINATES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default mapReducer;