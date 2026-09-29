// src/Redux/InstallationData/ExcavationData/excavationAction.js
import {
    FETCH_SOIL_EVALUATIONS_REQUEST,
    FETCH_SOIL_EVALUATIONS_SUCCESS,
    FETCH_SOIL_EVALUATIONS_FAILURE,
    CREATE_SOIL_EVALUATION_REQUEST,
    CREATE_SOIL_EVALUATION_SUCCESS,
    CREATE_SOIL_EVALUATION_FAILURE,
    UPDATE_SOIL_EVALUATION_REQUEST,
    UPDATE_SOIL_EVALUATION_SUCCESS,
    UPDATE_SOIL_EVALUATION_FAILURE,

    FETCH_AVAILABLE_SOIL_TURBINES_REQUEST,
    FETCH_AVAILABLE_SOIL_TURBINES_SUCCESS,
    FETCH_AVAILABLE_SOIL_TURBINES_FAILURE,

    CREATE_EXCAVATION_REQUEST,
    CREATE_EXCAVATION_SUCCESS,
    CREATE_EXCAVATION_FAILURE,
    FETCH_EXCAVATION_REQUEST,
    FETCH_EXCAVATION_SUCCESS,
    FETCH_EXCAVATION_FAILURE,
    UPDATE_EXCAVATION_REQUEST,
    UPDATE_EXCAVATION_SUCCESS,
    UPDATE_EXCAVATION_FAILURE,

    CREATE_PCC_LAYER_REQUEST,
    CREATE_PCC_LAYER_SUCCESS,
    CREATE_PCC_LAYER_FAILURE,
    GET_PCC_LAYER_REQUEST,
    GET_PCC_LAYER_SUCCESS,
    GET_PCC_LAYER_FAILURE,

    CREATE_CONDUCT_LAYING_REQUEST,
    CREATE_CONDUCT_LAYING_SUCCESS,
    CREATE_CONDUCT_LAYING_FAILURE,
    GET_CONDUCT_LAYING_REQUEST,
    GET_CONDUCT_LAYING_SUCCESS,
    GET_CONDUCT_LAYING_FAILURE,

    CREATE_ANCHOR_CAGE_REQUEST,
    CREATE_ANCHOR_CAGE_SUCCESS,
    CREATE_ANCHOR_CAGE_FAILURE,
    GET_ANCHOR_CAGE_REQUEST,
    GET_ANCHOR_CAGE_SUCCESS,
    GET_ANCHOR_CAGE_FAILURE,

    CREATE_REINFORCEMENT_REQUEST,
    CREATE_REINFORCEMENT_SUCCESS,
    CREATE_REINFORCEMENT_FAILURE,
    GET_REINFORCEMENT_REQUEST,
    GET_REINFORCEMENT_SUCCESS,
    GET_REINFORCEMENT_FAILURE,

    CREATE_POURING_CARD_REQUEST,
    CREATE_POURING_CARD_SUCCESS,
    CREATE_POURING_CARD_FAILURE,
    GET_POURING_CARDS_REQUEST,
    GET_POURING_CARDS_SUCCESS,
    GET_POURING_CARDS_FAILURE,

    CREATE_CUBE_SAMPLE_REQUEST,
    CREATE_CUBE_SAMPLE_SUCCESS,
    CREATE_CUBE_SAMPLE_FAILURE,
    GET_CUBE_SAMPLES_REQUEST,
    GET_CUBE_SAMPLES_SUCCESS,
    GET_CUBE_SAMPLES_FAILURE,

    CREATE_CUBE_SAMPLE_PHOTO_REQUEST,
    CREATE_CUBE_SAMPLE_PHOTO_SUCCESS,
    CREATE_CUBE_SAMPLE_PHOTO_FAILURE,
    GET_CUBE_SAMPLE_PHOTOS_REQUEST,
    GET_CUBE_SAMPLE_PHOTOS_SUCCESS,
    GET_CUBE_SAMPLE_PHOTOS_FAILURE,

    CREATE_WATERING_SCHEDULE_REQUEST,
    CREATE_WATERING_SCHEDULE_SUCCESS,
    CREATE_WATERING_SCHEDULE_FAILURE,
    GET_WATERING_SCHEDULE_REQUEST,
    GET_WATERING_SCHEDULE_SUCCESS,
    GET_WATERING_SCHEDULE_FAILURE,

    CREATE_CUBE_TEST_RESULT_REQUEST,
    CREATE_CUBE_TEST_RESULT_SUCCESS,
    CREATE_CUBE_TEST_RESULT_FAILURE,
    GET_CUBE_TEST_RESULTS_REQUEST,
    GET_CUBE_TEST_RESULTS_SUCCESS,
    GET_CUBE_TEST_RESULTS_FAILURE,

    UPDATE_PCC_LAYER_REQUEST,
    UPDATE_PCC_LAYER_SUCCESS,
    UPDATE_PCC_LAYER_FAILURE,

    UPDATE_CONDUCT_LAYING_REQUEST,
    UPDATE_CONDUCT_LAYING_SUCCESS,
    UPDATE_CONDUCT_LAYING_FAILURE,

    UPDATE_ANCHOR_CAGE_REQUEST,
    UPDATE_ANCHOR_CAGE_SUCCESS,
    UPDATE_ANCHOR_CAGE_FAILURE,

    UPDATE_REINFORCEMENT_REQUEST,
    UPDATE_REINFORCEMENT_SUCCESS,
    UPDATE_REINFORCEMENT_FAILURE,

    UPDATE_FOUNDATION_REQUEST,
    UPDATE_FOUNDATION_SUCCESS,
    UPDATE_FOUNDATION_FAILURE,

    //patch types shyams

    PATCH_EXCAVATION_REQUEST,
    PATCH_EXCAVATION_SUCCESS,
    PATCH_EXCAVATION_FAILURE,

    PATCH_CONDUCT_LAYING_REQUEST,
    PATCH_CONDUCT_LAYING_SUCCESS,
    PATCH_CONDUCT_LAYING_FAILURE,

    PATCH_ANCHOR_CAGE_REQUEST,
    PATCH_ANCHOR_CAGE_SUCCESS,
    PATCH_ANCHOR_CAGE_FAILURE,

    PATCH_REINFORCEMENT_REQUEST,
    PATCH_REINFORCEMENT_SUCCESS,
    PATCH_REINFORCEMENT_FAILURE,

    PATCH_FOUNDATION_REQUEST,
    PATCH_FOUNDATION_SUCCESS,
    PATCH_FOUNDATION_FAILURE,

    PATCH_POURING_CARD_REQUEST,
    PATCH_POURING_CARD_SUCCESS,
    PATCH_POURING_CARD_FAILURE,

    PATCH_CUBE_SAMPLES_REQUEST,
    PATCH_CUBE_SAMPLES_SUCCESS,
    PATCH_CUBE_SAMPLES_FAILURE,

    PATCH_WATERING_SCHEDULE_REQUEST,
    PATCH_WATERING_SCHEDULE_SUCCESS,
    PATCH_WATERING_SCHEDULE_FAILURE,

    PATCH_CUBE_TEST_RESULTS_REQUEST,
    PATCH_CUBE_TEST_RESULTS_SUCCESS,
    PATCH_CUBE_TEST_RESULTS_FAILURE,

    // dashboard actions 

    FETCH_SOIL_EVALUATIONS_view_REQUEST,
    FETCH_SOIL_EVALUATIONS_view_SUCCESS,
    FETCH_SOIL_EVALUATIONS_view_FAILURE,

    FETCH_EXCAVATION_VIEW_REQUEST,
    FETCH_EXCAVATION_VIEW_SUCCESS,
    FETCH_EXCAVATION_VIEW_FAILURE,

    FETCH_PCC_VIEW_REQUEST,
    FETCH_PCC_VIEW_SUCCESS,
    FETCH_PCC_VIEW_FAILURE,

    FETCH_CONDUCT_LAYING_VIEW_REQUEST,
    FETCH_CONDUCT_LAYING_VIEW_SUCCESS,
    FETCH_CONDUCT_LAYING_VIEW_FAILURE,

    FETCH_ANCHOR_CAGE_VIEW_REQUEST,
    FETCH_ANCHOR_CAGE_VIEW_SUCCESS,
    FETCH_ANCHOR_CAGE_VIEW_FAILURE,

    FETCH_FOUNDATION_VIEW_REQUEST,
    FETCH_FOUNDATION_VIEW_SUCCESS,
    FETCH_FOUNDATION_VIEW_FAILURE,

    FETCH_POURING_VIEW_REQUEST,
    FETCH_POURING_VIEW_SUCCESS,
    FETCH_POURING_VIEW_FAILURE,

    FETCH_REINFORCEMENT_VIEW_REQUEST,
    FETCH_REINFORCEMENT_VIEW_SUCCESS,
    FETCH_REINFORCEMENT_VIEW_FAILURE,

    CREATE_DESHUTTERING_REQUEST,
    CREATE_DESHUTTERING_SUCCESS,
    CREATE_DESHUTTERING_FAILURE,

    GET_DESHUTTERING_REQUEST,
    GET_DESHUTTERING_SUCCESS,
    GET_DESHUTTERING_FAILURE,

    CREATE_BACKFILLING_REQUEST,
    CREATE_BACKFILLING_SUCCESS,
    CREATE_BACKFILLING_FAILURE,
    GET_BACKFILLING_REQUEST,
    GET_BACKFILLING_SUCCESS,
    GET_BACKFILLING_FAILURE,

    CREATE_DELAY_ANALYSIS_REQUEST,
    CREATE_DELAY_ANALYSIS_SUCCESS,
    CREATE_DELAY_ANALYSIS_FAILURE,
    GET_DELAY_ANALYSIS_REQUEST,
    GET_DELAY_ANALYSIS_SUCCESS,
    GET_DELAY_ANALYSIS_FAILURE,


    // RESET_DELAY_ANALYSIS,

} from "../../ActionTypes";
import parseErrorMessage from "../../../utils/errorFunction";
import {
    PostDataApiWTGM,
    GetDataApiWTGM,
    PatchDataApiWTGM,
    PutDataApiWTGM
} from "../../../utils/api";



// GET Soil Evaluations
// export const fetchSoilEvaluations = () => async (dispatch) => {
//     dispatch({ type: FETCH_SOIL_EVALUATIONS_REQUEST });
//     try {
//         const data = await GetDataApiWTGM('/api/soil-evaluations/');
//         dispatch({
//             type: FETCH_SOIL_EVALUATIONS_SUCCESS,
//             payload: data,
//         });
//     } catch (error) {
//         dispatch({
//             type: FETCH_SOIL_EVALUATIONS_FAILURE,
//             payload: error.response?.data || error.message,
//         });
//     }
// };

export const fetchAvailableSoilTurbines = () => async (dispatch) => {
    dispatch({
        type: FETCH_AVAILABLE_SOIL_TURBINES_REQUEST
    });

    try {
        const data = await GetDataApiWTGM(
            "/api/soil-evaluations/available_turbines/"
        );

        dispatch({
            type: FETCH_AVAILABLE_SOIL_TURBINES_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_AVAILABLE_SOIL_TURBINES_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};

// POST Soil Evaluation
export const createSoilEvaluation = (formData) => async (dispatch) => {
    dispatch({
        type: CREATE_SOIL_EVALUATION_REQUEST
    });
    try {

        const data = await PostDataApiWTGM('/api/soil-evaluations/', formData, true);

        dispatch({
            type: CREATE_SOIL_EVALUATION_SUCCESS,
            payload: data,
        });
        return data;
    } catch (error) {
        const serverError = error.response ? .data;
        const errorMsg = parseErrorMessage(serverError);
        // const errorMsg = parseErrorMessage(error.response?.data || error.message);
        dispatch({
            type: CREATE_SOIL_EVALUATION_FAILURE,
            payload: errorMsg,
        });
        throw errorMsg;
    }
};

export const updateSoilEvaluation = (id, formData) => async (dispatch) => {
    dispatch({
        type: UPDATE_SOIL_EVALUATION_REQUEST
    });

    try {
        // const config = {
        //     headers: {
        //         "Content-Type": formData instanceof FormData
        //             ? "multipart/form-data"
        //             : "application/json",
        //     },
        // };

        const data = await PatchDataApiWTGM(
            `/api/soil-evaluations/${id}/`,
            formData,
            true
        );

        dispatch({
            type: UPDATE_SOIL_EVALUATION_SUCCESS,
            payload: data,
        });

        return {
            success: true,
            data
        };
    } catch (error) {
        const serverError = error.response ? .data;
        const errorMsg = parseErrorMessage(serverError);

        dispatch({
            type: UPDATE_SOIL_EVALUATION_FAILURE,
            payload: errorMsg,
        });

        return {
            success: false,
            error: errorMsg
        };
    }
};


// ✅ POST Excavation
export const postExcavation = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_EXCAVATION_REQUEST
        });

        const response = await PostDataApiWTGM("/api/excavations/", formData, true);

        dispatch({
            type: CREATE_EXCAVATION_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_EXCAVATION_FAILURE,
            payload: errorMsg,
        });
        throw errorMsg;
    }
};

// ✅ GET Excavation
// export const fetchExcavations = () => async (dispatch) => {
//     try {
//         dispatch({ type: FETCH_EXCAVATION_REQUEST });

//         const data = await GetDataApiWTGM("/api/excavations/");

//         dispatch({
//             type: FETCH_EXCAVATION_SUCCESS,
//             payload: data,
//         });
//     } catch (error) {

//         dispatch({
//             type: FETCH_EXCAVATION_FAILURE,
//             payload:
//                 error.response?.data || error.message,
//         });
//     }
// };

export const updateExcavation = (id, formData) => async (dispatch) => {
    dispatch({
        type: UPDATE_EXCAVATION_REQUEST
    });

    try {
        const data = await PutDataApiWTGM(
            `/api/excavations/${id}/`,
            formData,
            true // multipart
        );

        dispatch({
            type: UPDATE_EXCAVATION_SUCCESS,
            payload: data,
        });

        return {
            success: true,
            data
        };
    } catch (error) {
        dispatch({
            type: UPDATE_EXCAVATION_FAILURE,
            payload: error.response ? .data || error.message,
        });

        return {
            success: false
        };
    }
};

// POST PCC Layer
export const postPCCLayer = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_PCC_LAYER_REQUEST
        });

        const response = await PostDataApiWTGM("/api/pcc-layers/", formData, true); // `true` for multipart/form-data

        dispatch({
            type: CREATE_PCC_LAYER_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_PCC_LAYER_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

// GET PCC Layers
// export const getPCCLayers = () => async (dispatch) => {
//     try {
//         dispatch({ type: GET_PCC_LAYER_REQUEST });

//         const response = await GetDataApiWTGM("/api/pcc-layers/");

//         dispatch({
//             type: GET_PCC_LAYER_SUCCESS,
//             payload: response,
//         });
//     } catch (error) {
//         dispatch({
//             type: GET_PCC_LAYER_FAILURE,
//             payload: error.response?.data || error.message,
//         });
//     }
// };

export const updatePCCLayer = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_PCC_LAYER_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/pcc-layers/${id}/`,
            formData,
            true
        );

        dispatch({
            type: UPDATE_PCC_LAYER_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: UPDATE_PCC_LAYER_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};


// POST conduct laying
export const postConductLaying = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_CONDUCT_LAYING_REQUEST
        });

        const response = await PostDataApiWTGM("/api/conduct-laying/", formData, true);

        dispatch({
            type: CREATE_CONDUCT_LAYING_SUCCESS,
            payload: response,
        });
        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        // const errorMsg =
        //     error.response?.data?.turbine?.[0] || error.response?.data?.error || error.message;
        dispatch({
            type: CREATE_CONDUCT_LAYING_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

// GET conduct laying list
// export const getConductLaying = () => async (dispatch) => {
//     try {
//         dispatch({ type: GET_CONDUCT_LAYING_REQUEST });

//         const response = await GetDataApiWTGM("/api/conduct-laying/");

//         dispatch({
//             type: GET_CONDUCT_LAYING_SUCCESS,
//             payload: response,
//         });
//     } catch (error) {
//         dispatch({
//             type: GET_CONDUCT_LAYING_FAILURE,
//             payload: error.response?.data || error.message,
//         });
//     }
// };

export const updateConductLaying = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_CONDUCT_LAYING_REQUEST
        });

        const response = await PutDataApiWTGM(
            `/api/conduct-laying/${id}/`,
            formData,
            true
        );

        dispatch({
            type: UPDATE_CONDUCT_LAYING_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg =
            error.response ? .data ? .turbine ? .[0] ||
            error.response ? .data ? .error ||
            error.message;

        dispatch({
            type: UPDATE_CONDUCT_LAYING_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

// POST anchor cage placement
export const postAnchorCage = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_ANCHOR_CAGE_REQUEST
        });

        const response = await PostDataApiWTGM("/api/anchor-cages/", formData, true);
        // `true` means it will send as multipart/form-data if required (for file uploads)

        dispatch({
            type: CREATE_ANCHOR_CAGE_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_ANCHOR_CAGE_FAILURE,
            payload: errorMsg,
        });
        throw errorMsg;
    }
};

// GET anchor cage placements
// export const getAnchorCages = () => async (dispatch) => {
//     try {
//         dispatch({ type: GET_ANCHOR_CAGE_REQUEST });

//         const response = await GetDataApiWTGM("/api/anchor-cages/");

//         dispatch({
//             type: GET_ANCHOR_CAGE_SUCCESS,
//             payload: response,
//         });
//     } catch (error) {
//         dispatch({
//             type: GET_ANCHOR_CAGE_FAILURE,
//             payload: error.response?.data || error.message,
//         });
//     }
// };

export const updateAnchorCage = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_ANCHOR_CAGE_REQUEST
        });

        const response = await PutDataApiWTGM(
            `/api/anchor-cages/${id}/`,
            formData,
            true
        );

        dispatch({
            type: UPDATE_ANCHOR_CAGE_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: UPDATE_ANCHOR_CAGE_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

export const postReinforcement = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_REINFORCEMENT_REQUEST
        });

        // Assuming formData can be JSON or FormData; adjust 3rd arg if needed for multipart/form-data
        const response = await PostDataApiWTGM("/api/reinforcement/", formData, false);

        dispatch({
            type: CREATE_REINFORCEMENT_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_REINFORCEMENT_FAILURE,
            payload: errorMsg,
        });
        throw errorMsg;
    }
};

// GET reinforcements
// export const getReinforcements = () => async (dispatch) => {
//     try {
//         dispatch({ type: GET_REINFORCEMENT_REQUEST });

//         const response = await GetDataApiWTGM("/api/reinforcement/");

//         dispatch({
//             type: GET_REINFORCEMENT_SUCCESS,
//             payload: response,
//         });
//     } catch (error) {
//         dispatch({
//             type: GET_REINFORCEMENT_FAILURE,
//             payload: error.response?.data || error.message,
//         });
//     }
// };

export const updateReinforcement = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_REINFORCEMENT_REQUEST
        });

        const response = await PutDataApiWTGM(
            `/api/reinforcement/${id}/`,
            formData,
            false
        );

        dispatch({
            type: UPDATE_REINFORCEMENT_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: UPDATE_REINFORCEMENT_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

// Create Foundation - POST
export const postFoundation = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: "CREATE_FOUNDATION_REQUEST"
        });

        const response = await PostDataApiWTGM("/api/foundations/", formData, true);
        // `true` sends as multipart/form-data if files are attached

        dispatch({
            type: "CREATE_FOUNDATION_SUCCESS",
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: "CREATE_FOUNDATION_FAILURE",
            payload: errorMsg,
        });

        throw errorMsg;
    }
};

// Get Foundation Data - GET
// export const getFoundationData = () => async (dispatch) => {
//     try {
//         dispatch({ type: "GET_FOUNDATION_REQUEST" });

//         const response = await GetDataApiWTGM("/api/foundations/");

//         dispatch({
//             type: "GET_FOUNDATION_SUCCESS",
//             payload: response,
//         });
//     } catch (error) {
//         dispatch({
//             type: "GET_FOUNDATION_FAILURE",
//             payload: error.response?.data || "Failed to fetch Foundation data",
//         });
//     }
// };

export const updateFoundation = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_FOUNDATION_REQUEST
        });

        const response = await PutDataApiWTGM(
            `/api/foundations/${id}/`,
            formData,
            true
        );

        dispatch({
            type: UPDATE_FOUNDATION_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: UPDATE_FOUNDATION_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

//get pouring card data
export const GetPouringCards = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_POURING_CARDS_REQUEST
        });

        const response = await GetDataApiWTGM('/api/pouring-cards/', {
            params
        });

        dispatch({
            type: GET_POURING_CARDS_SUCCESS,
            payload: response,
        });
        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: GET_POURING_CARDS_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

export const PostPouringCard = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_POURING_CARD_REQUEST
        });

        const response = await PostDataApiWTGM('/api/pouring-cards/', formData);

        dispatch({
            type: CREATE_POURING_CARD_SUCCESS,
            payload: response,
        });
        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_POURING_CARD_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

export const PostCubeSample = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_CUBE_SAMPLE_REQUEST
        });

        const response = await PostDataApiWTGM('/api/cube-samples/', formData, true);

        dispatch({
            type: CREATE_CUBE_SAMPLE_SUCCESS,
            payload: response,
        });
        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_CUBE_SAMPLE_FAILURE,
            payload: errorMsg,
        });
        throw errorMsg;
    }
};

export const GetCubeSamples = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_CUBE_SAMPLES_REQUEST
        });

        const response = await GetDataApiWTGM('/api/cube-samples/', {
            params
        });

        dispatch({
            type: GET_CUBE_SAMPLES_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: GET_CUBE_SAMPLES_FAILURE,
            payload: errorMsg,
        });
    }
};

export const PostCubeSamplePhoto = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_CUBE_SAMPLE_PHOTO_REQUEST
        });

        const response = await PostDataApiWTGM('/api/cube-sample-photos/', formData, true);

        dispatch({
            type: CREATE_CUBE_SAMPLE_PHOTO_SUCCESS,
            payload: response,
        });
        return {
            payload: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_CUBE_SAMPLE_PHOTO_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

export const GetCubeSamplePhotos = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_CUBE_SAMPLE_PHOTOS_REQUEST
        });

        const response = await GetDataApiWTGM('/api/cube-sample-photos/');

        dispatch({
            type: GET_CUBE_SAMPLE_PHOTOS_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: GET_CUBE_SAMPLE_PHOTOS_FAILURE,
            payload: errorMsg,
        });
    }
};

export const PostWateringSchedule = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_WATERING_SCHEDULE_REQUEST
        });

        const response = await PostDataApiWTGM('/api/watering-schedules/', formData);

        dispatch({
            type: CREATE_WATERING_SCHEDULE_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_WATERING_SCHEDULE_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

export const GetWateringSchedule = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_WATERING_SCHEDULE_REQUEST
        });

        const response = await GetDataApiWTGM('/api/watering-schedules/', {
            params
        });

        dispatch({
            type: GET_WATERING_SCHEDULE_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: GET_WATERING_SCHEDULE_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

export const PostCubeTestResult = (formData, ) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_CUBE_TEST_RESULT_REQUEST
        });

        const response = await PostDataApiWTGM('/api/cube-tests/bulk/', formData, true);

        dispatch({
            type: CREATE_CUBE_TEST_RESULT_SUCCESS,
            payload: response,
        });
        return response
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_CUBE_TEST_RESULT_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};


export const GetCubeTestResults = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_CUBE_TEST_RESULTS_REQUEST
        });

        const response = await GetDataApiWTGM('/api/cube-test-results/', {
            params
        });

        dispatch({
            type: GET_CUBE_TEST_RESULTS_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: GET_CUBE_TEST_RESULTS_FAILURE,
            payload: errorMsg,
        });
    }
};


// patch for all by shyam

export const patchExcavation = (id, formData) => async (dispatch) => {
    dispatch({
        type: PATCH_EXCAVATION_REQUEST
    });
    try {
        const data = await PatchDataApiWTGM(
            `/api/excavations/${id}/`,
            formData,
            true // multipart
        );

        dispatch({
            type: PATCH_EXCAVATION_SUCCESS,
            payload: data,
        });

        return {
            success: true,
            data
        };
    } catch (error) {
        dispatch({
            type: PATCH_EXCAVATION_FAILURE,
            payload: error.response ? .data || error.message,
        });
        return {
            success: false
        };
    }
};


//conduit laying

export const patchConductLaying = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_CONDUCT_LAYING_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/conduct-laying/${id}/`,
            formData,
            true
        );

        dispatch({
            type: PATCH_CONDUCT_LAYING_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg =
            error.response ? .data ? .turbine ? .[0] ||
            error.response ? .data ? .error ||
            error.message;

        dispatch({
            type: PATCH_CONDUCT_LAYING_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

// anchorcage


export const patchAnchorCage = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_ANCHOR_CAGE_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/anchor-cages/${id}/`,
            formData,
            true
        );

        dispatch({
            type: PATCH_ANCHOR_CAGE_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_ANCHOR_CAGE_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};



// reinforcement


export const patchReinforcement = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_REINFORCEMENT_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/reinforcement/${id}/`,
            formData,
            false
        );

        dispatch({
            type: PATCH_REINFORCEMENT_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_REINFORCEMENT_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

// foundation



export const patchFoundation = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_FOUNDATION_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/foundations/${id}/`,
            formData,
            true
        );

        dispatch({
            type: PATCH_FOUNDATION_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_FOUNDATION_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};



//pouring card



export const patchPouringCard = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_POURING_CARD_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/pouring-cards/${id}/`,
            formData,
            true
        );

        dispatch({
            type: PATCH_POURING_CARD_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_POURING_CARD_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};


// cube sample

export const patchCubeSamples = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_CUBE_SAMPLES_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/cube-samples/${id}/`,
            formData,
            true
        );

        dispatch({
            type: PATCH_CUBE_SAMPLES_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_CUBE_SAMPLES_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

// watering


export const patchWateringSchedule = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_WATERING_SCHEDULE_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/watering-schedules/${id}/`,
            formData,
            true
        );

        dispatch({
            type: PATCH_WATERING_SCHEDULE_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_WATERING_SCHEDULE_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};



// cubetest result


export const patchCubeTestResults = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_CUBE_TEST_RESULTS_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/cube-test-results/${id}/`,
            formData,
            true
        );

        dispatch({
            type: PATCH_CUBE_TEST_RESULTS_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_CUBE_TEST_RESULTS_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

// --- PATCH DESHUTTERING ---
export const patchDeshuttering = (id, formData) => async (dispatch) => {
    try {
        // Replace with your actual constant names (e.g., PATCH_DESHUTTERING_REQUEST)
        dispatch({
            type: "PATCH_DESHUTTERING_REQUEST"
        });

        const response = await PatchDataApiWTGM(
            `/api/deshuttering/${id}/`,
            formData,
            true
        );

        dispatch({
            type: "PATCH_DESHUTTERING_SUCCESS",
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: "PATCH_DESHUTTERING_FAILURE",
            payload: errorMsg,
        });
        throw error;
    }
};

// --- PATCH BACKFILLING ---
export const patchBackfilling = (id, formData) => async (dispatch) => {
    try {
        // Replace with your actual constant names (e.g., PATCH_BACKFILLING_REQUEST)
        dispatch({
            type: "PATCH_BACKFILLING_REQUEST"
        });

        const response = await PatchDataApiWTGM(
            `/api/backfilling/${id}/`,
            formData,
            true
        );

        dispatch({
            type: "PATCH_BACKFILLING_SUCCESS",
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: "PATCH_BACKFILLING_FAILURE",
            payload: errorMsg,
        });
        throw error;
    }
};


//dashboard views api from query

// GET Soil Evaluations
export const fetchSoilEvaluationsView = () => async (dispatch) => {
    dispatch({
        type: FETCH_SOIL_EVALUATIONS_view_REQUEST
    });
    try {
        const data = await GetDataApiWTGM('/api/soil-evaluation-summary/');
        dispatch({
            type: FETCH_SOIL_EVALUATIONS_view_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_SOIL_EVALUATIONS_view_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};


export const fetchExcavationsView = () => async (dispatch) => {
    dispatch({
        type: FETCH_EXCAVATION_VIEW_REQUEST
    });
    try {
        const data = await GetDataApiWTGM('/api/excavation-summary/');
        dispatch({
            type: FETCH_EXCAVATION_VIEW_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_EXCAVATION_VIEW_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};



export const fetchPCCView = () => async (dispatch) => {
    dispatch({
        type: FETCH_PCC_VIEW_REQUEST
    });
    try {
        const data = await GetDataApiWTGM('/api/pcc-summary/');
        dispatch({
            type: FETCH_PCC_VIEW_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_PCC_VIEW_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};





export const fetchConductLayingView = () => async (dispatch) => {
    dispatch({
        type: FETCH_CONDUCT_LAYING_VIEW_REQUEST
    });
    try {
        const data = await GetDataApiWTGM('/api/conduct-laying-summary/');
        dispatch({
            type: FETCH_CONDUCT_LAYING_VIEW_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_CONDUCT_LAYING_VIEW_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};




export const fetchAnchorCageView = () => async (dispatch) => {
    dispatch({
        type: FETCH_ANCHOR_CAGE_VIEW_REQUEST
    });
    try {
        const data = await GetDataApiWTGM('/api/get_anchor_cage_placement/');
        dispatch({
            type: FETCH_ANCHOR_CAGE_VIEW_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_ANCHOR_CAGE_VIEW_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};



export const fetchFoundationView = () => async (dispatch) => {
    dispatch({
        type: FETCH_FOUNDATION_VIEW_REQUEST
    });
    try {
        const data = await GetDataApiWTGM('/api/get_foundation_summary/');
        dispatch({
            type: FETCH_FOUNDATION_VIEW_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_FOUNDATION_VIEW_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};




export const fetchPouringView = () => async (dispatch) => {
    dispatch({
        type: FETCH_POURING_VIEW_REQUEST
    });
    try {
        const data = await GetDataApiWTGM('/api/get_pouring_summary/');
        dispatch({
            type: FETCH_POURING_VIEW_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_POURING_VIEW_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};


export const fetchReinforcementView = () => async (dispatch) => {
    dispatch({
        type: FETCH_REINFORCEMENT_VIEW_REQUEST
    });
    try {
        const data = await GetDataApiWTGM('/api/get_reinforcement_data/');
        dispatch({
            type: FETCH_REINFORCEMENT_VIEW_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_REINFORCEMENT_VIEW_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};


export const fetchSoilEvaluations = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_SOIL_EVALUATIONS_REQUEST
        });
        // let url = "/api/soil-evaluations/";

        // if (fromDate && toDate) {
        //     url += `?from_date=${fromDate}&to_date=${toDate}`;
        // }

        const data = await GetDataApiWTGM("/api/soil-evaluations/", {
            params
        });

        dispatch({
            type: FETCH_SOIL_EVALUATIONS_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: FETCH_SOIL_EVALUATIONS_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};

export const fetchExcavations = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_EXCAVATION_REQUEST
        });


        const data = await GetDataApiWTGM("/api/excavations/", {
            params
        });

        dispatch({
            type: FETCH_EXCAVATION_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: FETCH_EXCAVATION_FAILURE,
            payload: error.response ? .data || error.message,
        });

    }
}

export const getPCCLayers = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_PCC_LAYER_REQUEST
        });

        const response = await GetDataApiWTGM("/api/pcc-layers/", {
            params
        });

        dispatch({
            type: GET_PCC_LAYER_SUCCESS,
            payload: response,
        });

    } catch (error) {
        dispatch({
            type: GET_PCC_LAYER_FAILURE,
            payload: error.response ? .data || error.message,
        });
        throw error;
    }
};

export const getConductLaying = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_CONDUCT_LAYING_REQUEST
        });

        const response = await GetDataApiWTGM("/api/conduct-laying/", {
            params
        });

        dispatch({
            type: GET_CONDUCT_LAYING_SUCCESS,
            payload: response,
        });

    } catch (error) {
        dispatch({
            type: GET_CONDUCT_LAYING_FAILURE,
            payload: error.response ? .data || error.message,
        });
        throw error;
    }
};

export const getAnchorCages = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_ANCHOR_CAGE_REQUEST
        });

        const response = await GetDataApiWTGM("/api/anchor-cages/", {
            params
        });

        dispatch({
            type: GET_ANCHOR_CAGE_SUCCESS,
            payload: response,
        });

    } catch (error) {
        dispatch({
            type: GET_ANCHOR_CAGE_FAILURE,
            payload: error.response ? .data || error.message,
        });
        throw error;
    }
};

export const getReinforcements = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_REINFORCEMENT_REQUEST
        });

        const response = await GetDataApiWTGM("/api/reinforcement/", {
            params
        });

        dispatch({
            type: GET_REINFORCEMENT_SUCCESS,
            payload: response,
        });

    } catch (error) {
        dispatch({
            type: GET_REINFORCEMENT_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};

// Get Foundation Data - GET
export const getFoundationData = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: "GET_FOUNDATION_REQUEST"
        });

        const response = await GetDataApiWTGM("/api/foundations/", {
            params
        });

        dispatch({
            type: "GET_FOUNDATION_SUCCESS",
            payload: response,
        });

    } catch (error) {
        dispatch({
            type: "GET_FOUNDATION_FAILURE",
            payload: error.response ? .data || "Failed to fetch Foundation data",
        });
    }
};

export const postDeshuttering = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_DESHUTTERING_REQUEST
        });

        const response = await PostDataApiWTGM("/api/deshuttering/", formData, true);

        dispatch({
            type: CREATE_DESHUTTERING_SUCCESS,
            payload: response,
        });

    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: CREATE_DESHUTTERING_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};


export const getDeshuttering = (params = {}) => async (dispatch) => {
    try {

        dispatch({
            type: GET_DESHUTTERING_REQUEST
        });

        const response = await GetDataApiWTGM("/api/deshuttering/", {
            params
        });

        dispatch({
            type: GET_DESHUTTERING_SUCCESS,
            payload: response,
        });

    } catch (error) {

        dispatch({
            type: GET_DESHUTTERING_FAILURE,
            payload: error.response ? .data || error.message,
        });
        throw error;
    }
};


// POST Backfilling
export const postBackfilling = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_BACKFILLING_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/backfilling/",
            formData,
            true // multipart/form-data for files
        );

        dispatch({
            type: CREATE_BACKFILLING_SUCCESS,
            payload: response,
        });

    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: CREATE_BACKFILLING_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

// GET Backfilling List
export const getBackfilling = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_BACKFILLING_REQUEST
        });

        const response = await GetDataApiWTGM("/api/backfilling/", {
            params
        });

        dispatch({
            type: GET_BACKFILLING_SUCCESS,
            payload: response,
        });

    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: GET_BACKFILLING_FAILURE,
            payload: errorMsg,
        });
    }
};


// POST Delay Analysis


// POST Delay Analysis

export const postDelayAnalysis = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_DELAY_ANALYSIS_REQUEST
        });
        const response = await PostDataApiWTGM(
            "/api/delay-analysis/save-delay-analysis/",
            formData,
            false,
        );
        dispatch({
            type: CREATE_DELAY_ANALYSIS_SUCCESS,
            payload: response,
        });
        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );
        dispatch({
            type: CREATE_DELAY_ANALYSIS_FAILURE,
            payload: errorMsg,
        });
        throw errorMsg;
    }
};


// GET Delay Analysis List
export const getDelayAnalysis = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_DELAY_ANALYSIS_REQUEST
        });

        const response = await GetDataApiWTGM("/api/delay-analysis/", {
            params
        });

        dispatch({
            type: GET_DELAY_ANALYSIS_SUCCESS,
            payload: response,
        });

    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: GET_DELAY_ANALYSIS_FAILURE,
            payload: errorMsg,
        });
    }
};


// CHECK Delay Status
export const checkDelayStatus = (params = {}) => async (dispatch) => {
    try {
        const response = await GetDataApiWTGM(
            "/api/delay-analysis/check-delay-status/", {
                params
            },
        );

        return response;

    } catch (error) {

        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        console.log("Delay check error:", errorMsg);

        throw errorMsg;
    }
};