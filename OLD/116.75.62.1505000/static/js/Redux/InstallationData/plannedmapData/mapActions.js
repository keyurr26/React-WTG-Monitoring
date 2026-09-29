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
    FETCH_MAP_COORDINATES_FAILURE,
} from "../../ActionTypes";
// import { PostDataApiWTGM, GetDataApiWTGM } from '../../utils/api';

import {
    PostDataApiWTGM,
    GetDataApiWTGM
} from "../../../utils/api";

// Create Map Object
export const createMapObject = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_MAP_OBJECT_REQUEST
        });

        const response = await PostDataApiWTGM("/api/mapobjects/", data);

        dispatch({
            type: CREATE_MAP_OBJECT_SUCCESS,
            payload: response,
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        dispatch({
            type: CREATE_MAP_OBJECT_FAILURE,
            payload: error.response ? .data || error.message,
        });
        return {
            success: false,
            error: error.response ? .data || error.message
        };
    }
};

// Create Map Coordinates
export const createMapCoordinates = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_MAP_COORDINATES_REQUEST
        });

        const response = await PostDataApiWTGM("/api/mapcoordinates/", data);

        dispatch({
            type: CREATE_MAP_COORDINATES_SUCCESS,
            payload: response,
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        dispatch({
            type: CREATE_MAP_COORDINATES_FAILURE,
            payload: error.response ? .data || error.message,
        });
        return {
            success: false,
            error: error.response ? .data || error.message
        };
    }
};

// Get Map Objects
export const getMapObjects = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_MAP_OBJECTS_REQUEST
        });

        const response = await GetDataApiWTGM("/api/mapobjects/");

        dispatch({
            type: FETCH_MAP_OBJECTS_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        dispatch({
            type: FETCH_MAP_OBJECTS_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};

// Get Map Coordinates
export const getMapCoordinates = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_MAP_COORDINATES_REQUEST
        });

        const response = await GetDataApiWTGM("/api/mapcoordinates/");

        dispatch({
            type: FETCH_MAP_COORDINATES_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        dispatch({
            type: FETCH_MAP_COORDINATES_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};

// Batch Create Map Data with Coordinates
export const batchCreateMapData =
    (mapObjectData, coordinatesData) => async (dispatch) => {
        try {
            // Create Map Object
            dispatch({
                type: CREATE_MAP_OBJECT_REQUEST
            });
            const mapObjectRes = await PostDataApiWTGM(
                "/api/mapobjects/",
                mapObjectData
            );
            dispatch({
                type: CREATE_MAP_OBJECT_SUCCESS,
                payload: mapObjectRes,
            });

            // Create Coordinates with map_object ID
            const coordinatesWithId = coordinatesData.map((coord) => ({
                ...coord,
                map_object: mapObjectRes.id,
            }));

            dispatch({
                type: CREATE_MAP_COORDINATES_REQUEST
            });
            const coordinatesRes = await PostDataApiWTGM(
                "/api/mapcoordinates/",
                coordinatesWithId
            );
            dispatch({
                type: CREATE_MAP_COORDINATES_SUCCESS,
                payload: coordinatesRes,
            });

            return {
                success: true,
                mapObject: mapObjectRes,
                coordinates: coordinatesRes,
            };
        } catch (error) {
            dispatch({
                type: CREATE_MAP_OBJECT_FAILURE,
                payload: error.response ? .data || error.message,
            });
            return {
                success: false,
                error: error.response ? .data || error.message
            };
        }
    };