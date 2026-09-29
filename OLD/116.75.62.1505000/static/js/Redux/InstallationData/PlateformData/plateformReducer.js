import {
    CREATE_PLATFORM_MASTER_REQUEST,
    CREATE_PLATFORM_MASTER_SUCCESS,
    CREATE_PLATFORM_MASTER_FAILURE,
    GET_PLATFORM_MASTER_REQUEST,
    GET_PLATFORM_MASTER_SUCCESS,
    GET_PLATFORM_MASTER_FAILURE,
    GET_PLATFORM_DPR_REQUEST,
    GET_PLATFORM_DPR_SUCCESS,
    GET_PLATFORM_DPR_FAILURE,
    CREATE_PLATFORM_DPR_REQUEST,
    CREATE_PLATFORM_DPR_SUCCESS,
    CREATE_PLATFORM_DPR_FAILURE,
    PATCH_PLATFORM_MASTER_REQUEST,
    PATCH_PLATFORM_MASTER_SUCCESS,
    PATCH_PLATFORM_MASTER_FAILURE,
    PATCH_PLATFORM_DPR_REQUEST,
    PATCH_PLATFORM_DPR_SUCCESS,
    PATCH_PLATFORM_DPR_FAILURE,
} from "../../ActionTypes";


const initialState = {
    loading: false,
    platforMasterData: [],
    platformDPRData: [],
    error: null,
    success: false,
};

export const platformReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_PLATFORM_MASTER_REQUEST:
            return { ...state,
                loading: true
            };

        case CREATE_PLATFORM_MASTER_SUCCESS:
            return {
                ...state,
                loading: false,
                platforMasterData: [action.payload, ...state.platforMasterData],
            };

        case CREATE_PLATFORM_MASTER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        case GET_PLATFORM_MASTER_REQUEST:
            return { ...state,
                loading: true
            };

        case GET_PLATFORM_MASTER_SUCCESS:
            return {
                ...state,
                loading: false,
                platforMasterData: action.payload,
            };


        case GET_PLATFORM_MASTER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // get plateform dpr
        case GET_PLATFORM_DPR_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_PLATFORM_DPR_SUCCESS:
            return {
                ...state,
                loading: false,
                platformDPRData: action.payload,
                error: null,
            };
        case GET_PLATFORM_DPR_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // --- POST REQUESTS (Creating New Daily Entry) ---
        case CREATE_PLATFORM_DPR_REQUEST:
            return {
                ...state,
                loading: true,
                success: false,
                error: null,
            };
        case CREATE_PLATFORM_DPR_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                // Add the new record to the top of the existing list immediately
                platformDPRData: [action.payload, ...state.platformDPRData],
                error: null,
            };
        case CREATE_PLATFORM_DPR_FAILURE:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload,
            };

        case PATCH_PLATFORM_MASTER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case PATCH_PLATFORM_MASTER_SUCCESS:
            return {
                ...state,
                loading: false,
                platforMasterData: state.platforMasterData.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                ),

                sucess: true,
            };

        case PATCH_PLATFORM_MASTER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case PATCH_PLATFORM_DPR_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case PATCH_PLATFORM_DPR_SUCCESS:
            return {
                ...state,
                loading: false,
                platformDPRData: state.platformDPRData.map((item) => {
                    const payloadTurbineId =
                        action.payload.turbine ? .id || action.payload.turbine;
                    const itemTurbineId = item.turbine ? .id || item.turbine;

                    if (
                        action.payload.approve_date &&
                        itemTurbineId === payloadTurbineId
                    ) {
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

        case PATCH_PLATFORM_DPR_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};