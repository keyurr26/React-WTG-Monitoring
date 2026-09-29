import {
    FETCH_TURBINE_LOCATIONS_REQUEST,
    FETCH_TURBINE_LOCATIONS_SUCCESS,
    FETCH_TURBINE_LOCATIONS_FAILURE,
    CREATE_TURBINE_LOCATION_REQUEST,
    CREATE_TURBINE_LOCATION_SUCCESS,
    CREATE_TURBINE_LOCATION_FAILURE,

    FETCH_ELIGIBLE_TURBINES_REQUEST,
    FETCH_ELIGIBLE_TURBINES_SUCCESS,
    FETCH_ELIGIBLE_TURBINES_FAILURE,
    CLEAR_ELIGIBLE_TURBINES,

    GET_DAILY_PROGRESS_REQUEST,
    GET_DAILY_PROGRESS_SUCCESS,
    GET_DAILY_PROGRESS_FAILURE,
    CREATE_DAILY_PROGRESS_REQUEST,
    CREATE_DAILY_PROGRESS_SUCCESS,
    CREATE_DAILY_PROGRESS_FAILURE,

    GET_PLANNED_VS_ACTUAL_REQUEST,
    GET_PLANNED_VS_ACTUAL_SUCCESS,
    GET_PLANNED_VS_ACTUAL_FAILURE,
} from '../ActionTypes';

const initialState = {
    loading: false,
    turbineLocations: [],
    // turbineCache: {},
    // eligibleTurbines: [],
    eligibleTurbines: {
        // Phase I: Civil Substructure
        SOIL: [],
        EXC: [],
        PCC: [],
        CONDUIT: [],
        ANCHOR: [],
        REINF: [],
        CAST: [],
        POUR: [],

        // Phase II: Curing & Infrastructure Progressions
        DESHUTTER: [],
        WATER: [],
        CUBE_RESULT: [],
        BACKFILL: [],
        PLATFORM: [],

        // Phase III: Mechanical Structural Erection
        T1_INSTALL: [],
        TOWER_INSTALL: [],
        NACELLE: [],
        ROTOR_HUB: [],
        BLADES: [],

        // Phase IV: Electrical Termination
        COMMISSION: []
    },
    dailyProgressList: [],
    graphData: [],
    error: null,
    createdTurbine: null,
};

const TurbineReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_TURBINE_LOCATIONS_REQUEST:

            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_TURBINE_LOCATIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                turbineLocations: action.payload,
            };
        case FETCH_TURBINE_LOCATIONS_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case CREATE_TURBINE_LOCATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case CREATE_TURBINE_LOCATION_SUCCESS:
            return {
                ...state,
                loading: false,
                createdTurbine: action.payload,
            };


        case CREATE_TURBINE_LOCATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case FETCH_ELIGIBLE_TURBINES_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_ELIGIBLE_TURBINES_SUCCESS:
            return { ...state,
                loading: false,
                eligibleTurbines: action.payload
            };
            // return {
            //   ...state,
            //   loading: false,
            //   eligibleTurbines: { ...state.eligibleTurbines, ...action.payload },
            // };

        case FETCH_ELIGIBLE_TURBINES_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case CLEAR_ELIGIBLE_TURBINES:
            return { ...state,
                eligibleTurbines: {},
                error: null
            };

        case GET_DAILY_PROGRESS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_DAILY_PROGRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                dailyProgressList: action.payload,
            };

        case GET_DAILY_PROGRESS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CREATE_DAILY_PROGRESS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case CREATE_DAILY_PROGRESS_SUCCESS:
            // Upsert in frontend state as well
            const updatedList = [...state.dailyProgressList];
            const idx = updatedList.findIndex(
                (item) =>
                item.turbine === action.payload.turbine &&
                item.activity === action.payload.activity &&
                item.date === action.payload.date,
            );

            if (idx >= 0) {
                updatedList[idx] = action.payload; // update existing
            } else {
                updatedList.push(action.payload); // add new
            }

            return {
                ...state,
                loading: false,
                dailyProgressList: updatedList,
            };


        case CREATE_DAILY_PROGRESS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case GET_PLANNED_VS_ACTUAL_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_PLANNED_VS_ACTUAL_SUCCESS:
            return {
                ...state,
                loading: false,
                graphData: action.payload,
            };

        case GET_PLANNED_VS_ACTUAL_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        default:
            return state;
    }
};

export default TurbineReducer;