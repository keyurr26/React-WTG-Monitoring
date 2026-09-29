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
    CREATE_FOUNDATION_REQUEST,
    CREATE_FOUNDATION_SUCCESS,
    CREATE_FOUNDATION_FAILURE,
    GET_FOUNDATION_REQUEST,
    GET_FOUNDATION_SUCCESS,
    GET_FOUNDATION_FAILURE,
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
    PATCH_DESHUTTERING_REQUEST,
    PATCH_DESHUTTERING_SUCCESS,
    PATCH_DESHUTTERING_FAILURE,
    PATCH_BACKFILLING_REQUEST,
    PATCH_BACKFILLING_SUCCESS,
    PATCH_BACKFILLING_FAILURE,


    //  dashboard actions
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

} from "../../ActionTypes";

const initialState = {
    foundationLoading: false,
    error: null,
    soilEvaluations: [],
    availableTurbines: [],
    list: [],
    pccLayers: [],
    conductLayings: [],
    anchorCages: [],
    createdItem: null,
    reinforcements: [],
    createdReinforcement: null,
    // created: null,
    foundations: [],
    pouringCards: [],
    createdCard: null,
    cubeSamples: [],
    createdSample: null,
    cubeSamplePhotos: [],
    createdPhoto: null,
    wateringSchedule: [],
    cubeTestResults: [],
    createdResult: [],
    //   dashboard
    soilEvaluationsView: [],
    excavationView: [],
    pccView: [],
    conductLayingView: [],
    anchorCageView: [],
    foundationView: [],
    pouringView: [],
    reinforcementView: [],
    postSuccess: false,
    successMessage: null,
    data: null,
    deshutteringList: [],
    backfillingList: [],

    delays: [],
    newDelay: null,
    // deshutteringCreate: null,
};
const updateItemById = (items, updatedItem) => {
    return items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
};

export const foundationReducer = (state = initialState, action) => {
    switch (action.type) {
        // case FETCH_SOIL_EVALUATIONS_REQUEST:
        //   return { ...state, foundationLoading : true, error: null };
        case FETCH_SOIL_EVALUATIONS_REQUEST:
            return { ...state,
                foundationLoading: true,
                soilEvaluations: []
            };
        case FETCH_SOIL_EVALUATIONS_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                loaded: true,
                soilEvaluations: action.payload,
            };
        case FETCH_SOIL_EVALUATIONS_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

        case CREATE_SOIL_EVALUATION_REQUEST:
            return { ...state,
                foundationLoading: true,
                success: false,
                error: null
            };
        case CREATE_SOIL_EVALUATION_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                success: true,
                soilEvaluations: [...state.soilEvaluations, action.payload], // add new record
            };
        case CREATE_SOIL_EVALUATION_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

            /// for turbine submitted list
        case FETCH_AVAILABLE_SOIL_TURBINES_REQUEST:
            return { ...state,
                foundationLoading: true,
                error: null
            };

        case FETCH_AVAILABLE_SOIL_TURBINES_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                availableTurbines: action.payload,
            };

        case FETCH_AVAILABLE_SOIL_TURBINES_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

        case UPDATE_SOIL_EVALUATION_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };

        case UPDATE_SOIL_EVALUATION_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                soilEvaluations: state.soilEvaluations.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                ),
                success: true,
            };

        case UPDATE_SOIL_EVALUATION_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };
        case FETCH_EXCAVATION_REQUEST:
            // return { ...state, foundationLoading : true, error: null };
            return { ...state,
                foundationLoading: true,
                list: []
            };

        case FETCH_EXCAVATION_SUCCESS:
            return { ...state,
                foundationLoading: false,
                list: action.payload
            };

        case FETCH_EXCAVATION_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

        case CREATE_EXCAVATION_REQUEST:
            return { ...state,
                foundationLoading: true,
                error: null
            };

        case CREATE_EXCAVATION_SUCCESS:
            // return { ...state, foundationLoading : false, created: action.payload };
            return {
                ...state,
                foundationLoading: false,
                list: [...state.list, action.payload], // append new layer
                error: null,
            };
        case CREATE_EXCAVATION_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

        case UPDATE_EXCAVATION_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };

        case UPDATE_EXCAVATION_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                list: state.list.map((item) =>
                    item.id === action.payload.id ?
                    action.payload // replace updated record
                    :
                    item,
                ),
            };

        case UPDATE_EXCAVATION_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };
        case GET_PCC_LAYER_REQUEST:
            // return { ...state, foundationLoading : true };
            return { ...state,
                foundationLoading: true,
                pccLayers: []
            };

        case GET_PCC_LAYER_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                pccLayers: action.payload,
                error: null,
            };

        case GET_PCC_LAYER_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

        case CREATE_PCC_LAYER_REQUEST:
            return { ...state,
                foundationLoading: true
            };

        case CREATE_PCC_LAYER_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                pccLayers: [...state.pccLayers, action.payload], // append new layer
                error: null,
            };

        case CREATE_PCC_LAYER_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

        case GET_CONDUCT_LAYING_REQUEST:
            return { ...state,
                foundationLoading: true,
                conductLayings: []
            };

        case GET_CONDUCT_LAYING_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                conductLayings: action.payload,
                error: null,
            };

        case GET_CONDUCT_LAYING_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

        case CREATE_CONDUCT_LAYING_REQUEST:
            return { ...state,
                foundationLoading: true
            };

        case CREATE_CONDUCT_LAYING_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                conductLayings: [...state.conductLayings, action.payload], // add new item
                error: null,
            };

        case CREATE_CONDUCT_LAYING_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

        case GET_ANCHOR_CAGE_REQUEST:
            return { ...state,
                foundationLoading: true,
                anchorCages: []
            };

        case GET_ANCHOR_CAGE_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                anchorCages: action.payload,
                error: null,
            };

        case GET_ANCHOR_CAGE_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

        case CREATE_ANCHOR_CAGE_REQUEST:
            return { ...state,
                foundationLoading: true,
                error: null
            };

        case CREATE_ANCHOR_CAGE_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                anchorCages: [...state.anchorCages, action.payload],
                error: null,
            };

        case CREATE_ANCHOR_CAGE_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

        case GET_REINFORCEMENT_REQUEST:
            return { ...state,
                foundationLoading: true,
                reinforcements: []
            };

        case GET_REINFORCEMENT_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                reinforcements: action.payload,
                error: null,
            };

        case GET_REINFORCEMENT_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

            // POST reinforcement
        case CREATE_REINFORCEMENT_REQUEST:
            return { ...state,
                foundationLoading: true,
                error: null
            };

        case CREATE_REINFORCEMENT_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                createdReinforcement: action.payload,
                error: null,
            };
        case CREATE_REINFORCEMENT_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

        case GET_FOUNDATION_REQUEST:
            return { ...state,
                foundationLoading: true,
                foundations: []
            };

        case GET_FOUNDATION_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                foundations: action.payload,
            };

        case GET_FOUNDATION_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

            // POST new foundation
        case CREATE_FOUNDATION_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
                postSuccess: false,
            };

        case CREATE_FOUNDATION_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                foundations: [...state.foundations, action.payload],
                postSuccess: true,
            };

        case CREATE_FOUNDATION_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
                postSuccess: false,
            };

        case GET_POURING_CARDS_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };
        case GET_POURING_CARDS_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                pouringCards: action.payload,
            };
        case GET_POURING_CARDS_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

            // CREATE
        case CREATE_POURING_CARD_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };
        case CREATE_POURING_CARD_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                createdCard: action.payload,
                pouringCards: [...state.pouringCards, action.payload], // Optional: update list
            };
        case CREATE_POURING_CARD_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

        case GET_CUBE_SAMPLES_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };
        case GET_CUBE_SAMPLES_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                cubeSamples: action.payload,
            };
        case GET_CUBE_SAMPLES_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

            // CREATE
        case CREATE_CUBE_SAMPLE_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };
        case CREATE_CUBE_SAMPLE_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                createdSample: action.payload,
                cubeSamples: [...state.cubeSamples, action.payload],
            };
        case CREATE_CUBE_SAMPLE_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

        case GET_CUBE_SAMPLE_PHOTOS_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };
        case GET_CUBE_SAMPLE_PHOTOS_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                cubeSamplePhotos: action.payload,
            };
        case GET_CUBE_SAMPLE_PHOTOS_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

            // CREATE
        case CREATE_CUBE_SAMPLE_PHOTO_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };
        case CREATE_CUBE_SAMPLE_PHOTO_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                createdPhoto: action.payload,
                cubeSamplePhotos: [...state.cubeSamplePhotos, action.payload],
            };
        case CREATE_CUBE_SAMPLE_PHOTO_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

        case CREATE_WATERING_SCHEDULE_REQUEST:
            return { ...state,
                foundationLoading: true,
                error: null
            };

        case CREATE_WATERING_SCHEDULE_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                wateringSchedule: [...state.wateringSchedule, action.payload],
            };

        case CREATE_WATERING_SCHEDULE_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

        case GET_WATERING_SCHEDULE_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };

        case GET_WATERING_SCHEDULE_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                wateringSchedule: action.payload,
            };

        case GET_WATERING_SCHEDULE_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

        case GET_CUBE_TEST_RESULTS_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };
        case GET_CUBE_TEST_RESULTS_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                cubeTestResults: action.payload,
            };
        case GET_CUBE_TEST_RESULTS_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

            // CREATE cube test result data
        case CREATE_CUBE_TEST_RESULT_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };
        case CREATE_CUBE_TEST_RESULT_SUCCESS:
            {
                return {
                    ...state,
                    foundationLoading: false,
                    // cubeTestResults: action.payload,
                    successMessage: action.payload.message,
                    //     cubeTestResults: [
                    //     ...(state.cubeTestResults || []),
                    //     ...(action.payload.data || [])
                    // ],
                };

                // let newResults = [];

                // if (Array.isArray(action.payload)) {
                //     newResults = action.payload;
                // } else if (action.payload?.id) {
                //     newResults = [action.payload];
                // }
                // return {
                //     ...state,
                //     foundationLoading : false,
                //     createdResult: newResults,
                //     cubeTestResults: [
                //         ...state.cubeTestResults,
                //         ...newResults
                //     ],
                // };
            }

        case CREATE_CUBE_TEST_RESULT_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

            /* ================= PCC ================= */
        case UPDATE_PCC_LAYER_REQUEST:
            return { ...state,
                foundationLoading: true,
                error: null
            };

        case UPDATE_PCC_LAYER_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                pccLayers: updateItemById(state.pccLayers, action.payload),
            };

        case UPDATE_PCC_LAYER_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

            /* ================= CONDUCT LAYING ================= */
        case UPDATE_CONDUCT_LAYING_REQUEST:
            return { ...state,
                foundationLoading: true,
                error: null
            };

        case UPDATE_CONDUCT_LAYING_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                conductLayings: updateItemById(state.conductLayings, action.payload),
            };

        case UPDATE_CONDUCT_LAYING_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

            /* ================= ANCHOR CAGE ================= */
        case UPDATE_ANCHOR_CAGE_REQUEST:
            return { ...state,
                foundationLoading: true,
                error: null
            };

        case UPDATE_ANCHOR_CAGE_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                anchorCages: updateItemById(state.anchorCages, action.payload),
            };

        case UPDATE_ANCHOR_CAGE_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

            /* ================= REINFORCEMENT ================= */
        case UPDATE_REINFORCEMENT_REQUEST:
            return { ...state,
                foundationLoading: true,
                error: null
            };

        case UPDATE_REINFORCEMENT_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                reinforcements: updateItemById(state.reinforcements, action.payload),
            };

        case UPDATE_REINFORCEMENT_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

            /* ================= FOUNDATION ================= */
        case UPDATE_FOUNDATION_REQUEST:
            return { ...state,
                foundationLoading: true,
                error: null
            };

        case UPDATE_FOUNDATION_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                foundations: updateItemById(state.foundations, action.payload),
            };

        case UPDATE_FOUNDATION_FAILURE:
            return { ...state,
                foundationLoading: false,
                error: action.payload
            };

            // ----------------------------shyam Patch Code__________________________________________________________________________

            //excavation
        case PATCH_EXCAVATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
            // case PATCH_EXCAVATION_SUCCESS:
            //   return {
            //     ...state,
            //     loading : false,
            //     list: state.list.map((item) =>
            //       item.id === action.payload.id
            //         ? action.payload // replace updated record
            //         : item,
            //     ),
            //     sucess: true,
            //   };

        case PATCH_EXCAVATION_SUCCESS:
            return {
                ...state,
                loading: false,
                list: state.list.map((item) => {
                    // ✅ Use .turbine?.id if it's an object, or just .turbine if it's an ID
                    const payloadTurbineId = action.payload.turbine ? .id || action.payload.turbine;
                    const itemTurbineId = item.turbine ? .id || item.turbine;

                    if (action.payload.approve_date && itemTurbineId === payloadTurbineId) {
                        return {
                            ...item,
                            ...action.payload,
                            // status: 'Approved'
                        };
                    }
                    return item.id === action.payload.id ? action.payload : item;
                }),
                success: true,
            };
        case PATCH_EXCAVATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            //conduit laying

        case PATCH_CONDUCT_LAYING_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case PATCH_CONDUCT_LAYING_SUCCESS:
            return {
                ...state,
                loading: false,
                conductLayings: state.conductLayings.map((item) => {

                    const payloadTurbineId = action.payload.turbine ? .id || action.payload.turbine;
                    const itemTurbineId = item.turbine ? .id || item.turbine;


                    if (action.payload.approve_date && itemTurbineId === payloadTurbineId) {
                        return {
                            ...item,
                            // Update only the approval metadata
                            approve_date: action.payload.approve_date,
                            approved_by: action.payload.approved_by,

                        };
                    }

                    return item.id === action.payload.id ? action.payload : item;
                }),
                sucess: true,
            };
        case PATCH_CONDUCT_LAYING_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // anchorcage

        case PATCH_ANCHOR_CAGE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case PATCH_ANCHOR_CAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                anchorCages: state.anchorCages.map((item) => {

                    const payloadTurbineId = action.payload.turbine ? .id || action.payload.turbine;
                    const itemTurbineId = item.turbine ? .id || item.turbine;


                    if (action.payload.approve_date && itemTurbineId === payloadTurbineId) {
                        return {
                            ...item,
                            // Update only the approval metadata
                            approve_date: action.payload.approve_date,
                            approved_by: action.payload.approved_by,

                        };
                    }

                    return item.id === action.payload.id ? action.payload : item;
                }),
                sucess: true,
            };
        case PATCH_ANCHOR_CAGE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // reinforcement

        case PATCH_REINFORCEMENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case PATCH_REINFORCEMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                reinforcements: state.reinforcements.map((item) => {

                    const payloadTurbineId = action.payload.turbine ? .id || action.payload.turbine;
                    const itemTurbineId = item.turbine ? .id || item.turbine;


                    if (action.payload.approve_date && itemTurbineId === payloadTurbineId) {
                        return {
                            ...item,
                            // Update only the approval metadata
                            approve_date: action.payload.approve_date,
                            approved_by: action.payload.approved_by,

                        };
                    }

                    return item.id === action.payload.id ? action.payload : item;
                }),
                success: true,
            };

        case PATCH_REINFORCEMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // foundation

        case PATCH_FOUNDATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case PATCH_FOUNDATION_SUCCESS:
            return {
                ...state,
                loading: false,
                foundations: state.foundations.map((item) => {

                    const payloadTurbineId = action.payload.turbine ? .id || action.payload.turbine;
                    const itemTurbineId = item.turbine ? .id || item.turbine;


                    if (action.payload.approve_date && itemTurbineId === payloadTurbineId) {
                        return {
                            ...item,
                            // Update only the approval metadata
                            approve_date: action.payload.approve_date,
                            approved_by: action.payload.approved_by,

                        };
                    }

                    return item.id === action.payload.id ? action.payload : item;
                }),

                sucess: true,
            };

        case PATCH_FOUNDATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // pouring card

        case PATCH_POURING_CARD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case PATCH_POURING_CARD_SUCCESS:
            return {
                ...state,
                loading: false,
                pouringCards: state.pouringCards.map((item) => {

                    const payloadTurbineId = action.payload.turbine ? .id || action.payload.turbine;
                    const itemTurbineId = item.turbine ? .id || item.turbine;


                    if (action.payload.approve_date && itemTurbineId === payloadTurbineId) {
                        return {
                            ...item,
                            // Update only the approval metadata
                            approve_date: action.payload.approve_date,
                            approved_by: action.payload.approved_by,

                        };
                    }

                    return item.id === action.payload.id ? action.payload : item;
                }),
                sucess: true,
            };

        case PATCH_POURING_CARD_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // cube sample

        case PATCH_CUBE_SAMPLES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case PATCH_CUBE_SAMPLES_SUCCESS:
            return {
                ...state,
                loading: false,
                cubeSamples: state.cubeSamples.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                ),

                sucess: true,
            };
        case PATCH_CUBE_SAMPLES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            //watering schedule

        case PATCH_WATERING_SCHEDULE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case PATCH_WATERING_SCHEDULE_SUCCESS:
            return {
                ...state,
                loading: false,
                wateringSchedule: state.wateringSchedule.map((item) => {

                    const payloadTurbineId = action.payload.turbine ? .id || action.payload.turbine;
                    const itemTurbineId = item.turbine ? .id || item.turbine;


                    if (action.payload.approve_date && itemTurbineId === payloadTurbineId) {
                        return {
                            ...item,
                            // Update only the approval metadata
                            approve_date: action.payload.approve_date,
                            approved_by: action.payload.approved_by,

                        };
                    }

                    return item.id === action.payload.id ? action.payload : item;
                }),

                sucess: true,
            };

        case PATCH_WATERING_SCHEDULE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // cubetestresult

        case PATCH_CUBE_TEST_RESULTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case PATCH_CUBE_TEST_RESULTS_SUCCESS:
            return {
                ...state,
                loading: false,
                cubeTestResults: state.cubeTestResults.map((item) => {

                    const payloadTurbineId = action.payload.turbine ? .id || action.payload.turbine;
                    const itemTurbineId = item.turbine ? .id || item.turbine;


                    if (action.payload.approve_date && itemTurbineId === payloadTurbineId) {
                        return {
                            ...item,
                            // Update only the approval metadata
                            approve_date: action.payload.approve_date,
                            approved_by: action.payload.approved_by,

                        };
                    }

                    return item.id === action.payload.id ? action.payload : item;
                }),

                sucess: true,
            };

        case PATCH_CUBE_TEST_RESULTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case PATCH_DESHUTTERING_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case PATCH_DESHUTTERING_SUCCESS:
            return {
                ...state,
                loading: false,
                // Updates the specific deshuttering record in the list
                deshutteringList: state.deshutteringList.map((item) => {

                    const payloadTurbineId = action.payload.turbine ? .id || action.payload.turbine;
                    const itemTurbineId = item.turbine ? .id || item.turbine;


                    if (action.payload.approve_date && itemTurbineId === payloadTurbineId) {
                        return {
                            ...item,
                            // Update only the approval metadata
                            approve_date: action.payload.approve_date,
                            approved_by: action.payload.approved_by,

                        };
                    }

                    return item.id === action.payload.id ? action.payload : item;
                }),
                success: true,
            };

        case PATCH_DESHUTTERING_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case PATCH_BACKFILLING_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

            // case PATCH_BACKFILLING_SUCCESS:
            //   return {
            //     ...state,
            //     loading: false,
            //     // Updates the specific backfilling record in the list
            //     backfillingList: state.backfillingList.map((item) =>
            //       item.id === action.payload.id ? action.payload : item,
            //     ),
            //     success: true,
            //   };

        case PATCH_BACKFILLING_SUCCESS:
            return {
                ...state,
                loading: false,

                backfillingList: state.backfillingList.map((item) => {

                    const payloadTurbineId = action.payload.turbine ? .id || action.payload.turbine;
                    const itemTurbineId = item.turbine ? .id || item.turbine;


                    if (action.payload.approve_date && itemTurbineId === payloadTurbineId) {
                        return {
                            ...item,
                            // Update only the approval metadata
                            approve_date: action.payload.approve_date,
                            approved_by: action.payload.approved_by,

                        };
                    }

                    return item.id === action.payload.id ? action.payload : item;
                }),
                success: true,
            };

        case PATCH_BACKFILLING_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            //dashboard

        case FETCH_SOIL_EVALUATIONS_view_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };

        case FETCH_SOIL_EVALUATIONS_view_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                soilEvaluationsView: action.payload,
            };

        case FETCH_SOIL_EVALUATIONS_view_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };


        case FETCH_EXCAVATION_VIEW_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };
        case FETCH_EXCAVATION_VIEW_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                excavationView: action.payload,
            };
        case FETCH_EXCAVATION_VIEW_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };


        case FETCH_PCC_VIEW_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };

        case FETCH_PCC_VIEW_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                pccView: action.payload,
            };
        case FETCH_PCC_VIEW_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

        case FETCH_CONDUCT_LAYING_VIEW_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };
        case FETCH_CONDUCT_LAYING_VIEW_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                conductLayingView: action.payload,
            };

        case FETCH_CONDUCT_LAYING_VIEW_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };



        case FETCH_ANCHOR_CAGE_VIEW_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };

        case FETCH_ANCHOR_CAGE_VIEW_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                anchorCageView: action.payload,
            };

        case FETCH_ANCHOR_CAGE_VIEW_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };



        case FETCH_FOUNDATION_VIEW_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };

        case FETCH_FOUNDATION_VIEW_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                foundationView: action.payload,
            };
        case FETCH_FOUNDATION_VIEW_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };



        case FETCH_POURING_VIEW_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };

        case FETCH_POURING_VIEW_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                pouringView: action.payload,
            };

        case FETCH_POURING_VIEW_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };


        case FETCH_REINFORCEMENT_VIEW_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };

        case FETCH_REINFORCEMENT_VIEW_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                reinforcementView: action.payload,
            };
        case FETCH_REINFORCEMENT_VIEW_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

        case CREATE_DESHUTTERING_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };

        case CREATE_DESHUTTERING_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                deshutteringList: [...(state.deshutteringList || []), action.payload],
            };

        case CREATE_DESHUTTERING_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

        case GET_DESHUTTERING_REQUEST:
            return {
                ...state,
                foundationLoading: true,
                error: null,
            };

        case GET_DESHUTTERING_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                deshutteringList: action.payload,
            };

        case GET_DESHUTTERING_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };


        case CREATE_BACKFILLING_REQUEST:
            return {
                ...state,
                foundationLoading: true,
            };

        case CREATE_BACKFILLING_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                backfillingList: [...(state.backfillingList || []), action.payload],
            };

        case CREATE_BACKFILLING_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload,
            };

        case GET_BACKFILLING_REQUEST:
            return {
                ...state,
                foundationLoading: true
            };

        case GET_BACKFILLING_SUCCESS:
            return {
                ...state,
                foundationLoading: false,
                backfillingList: Array.isArray(action.payload) ?
                    action.payload :
                    [],
            };

        case GET_BACKFILLING_FAILURE:
            return {
                ...state,
                foundationLoading: false,
                error: action.payload
            };

        case CREATE_DELAY_ANALYSIS_REQUEST:

            return {
                ...state,
                loading: true,
                error: null,
                success: false
            };


            // Success: Creating New Record
        case CREATE_DELAY_ANALYSIS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                newDelay: action.payload,

                delays: [action.payload, ...state.delays],
                error: null
            };

        case CREATE_DELAY_ANALYSIS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        case GET_DELAY_ANALYSIS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: false
            };
            // Success: Fetching List
        case GET_DELAY_ANALYSIS_SUCCESS:
            return {
                ...state,
                loading: false,
                delays: action.payload,
                error: null
            };


            // Handling all "Failure" types

        case GET_DELAY_ANALYSIS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

            // case RESET_DELAY_ANALYSIS:
            //     return initialState;

        default:
            return state;
    }
};