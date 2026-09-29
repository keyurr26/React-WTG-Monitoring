import {
    CREATE_T1_INSTALLATION_REQUEST,
    CREATE_T1_INSTALLATION_SUCCESS,
    CREATE_T1_INSTALLATION_FAILURE,
    FETCH_T1_INSTALLATION_REQUEST,
    FETCH_T1_INSTALLATION_SUCCESS,
    FETCH_T1_INSTALLATION_FAILURE,

    CREATE_TOWER_INSTALLATION_REQUEST,
    CREATE_TOWER_INSTALLATION_SUCCESS,
    CREATE_TOWER_INSTALLATION_FAILURE,
    GET_TOWER_INSTALLATIONS_REQUEST,
    GET_TOWER_INSTALLATIONS_SUCCESS,
    GET_TOWER_INSTALLATIONS_FAILURE,

    CREATE_NACELLE_INSTALLATION_REQUEST,
    CREATE_NACELLE_INSTALLATION_SUCCESS,
    CREATE_NACELLE_INSTALLATION_FAILURE,
    FETCH_NACELLE_INSTALLATION_REQUEST,
    FETCH_NACELLE_INSTALLATION_SUCCESS,
    FETCH_NACELLE_INSTALLATION_FAILURE,

    CREATE_ROTOR_HUB_INSTALLATION_REQUEST,
    CREATE_ROTOR_HUB_INSTALLATION_SUCCESS,
    CREATE_ROTOR_HUB_INSTALLATION_FAILURE,
    GET_ROTOR_HUB_INSTALLATION_REQUEST,
    GET_ROTOR_HUB_INSTALLATION_SUCCESS,
    GET_ROTOR_HUB_INSTALLATION_FAILURE,

    CREATE_BLADE_INSTALLATION_REQUEST,
    CREATE_BLADE_INSTALLATION_SUCCESS,
    CREATE_BLADE_INSTALLATION_FAILURE,
    GET_BLADE_INSTALLATIONS_REQUEST,
    GET_BLADE_INSTALLATIONS_SUCCESS,
    GET_BLADE_INSTALLATIONS_FAILURE,

    CREATE_COMMISSIONING_DETAILS_REQUEST,
    CREATE_COMMISSIONING_DETAILS_SUCCESS,
    CREATE_COMMISSIONING_DETAILS_FAILURE,

    FETCH_COMMISSIONING_DETAILS_REQUEST,
    FETCH_COMMISSIONING_DETAILS_SUCCESS,
    FETCH_COMMISSIONING_DETAILS_FAILURE,

    //all patch by shyam
    PATCH_T1_INSTALLATION_REQUEST,
    PATCH_T1_INSTALLATION_SUCCESS,
    PATCH_T1_INSTALLATION_FAILURE,

    PATCH_TOWER_INSTALLATION_REQUEST,
    PATCH_TOWER_INSTALLATION_SUCCESS,
    PATCH_TOWER_INSTALLATION_FAILURE,

    PATCH_NACELLE_INSTALLATION_REQUEST,
    PATCH_NACELLE_INSTALLATION_SUCCESS,
    PATCH_NACELLE_INSTALLATION_FAILURE,

    PATCH_ROTOR_HUB_INSTALLATION_REQUEST,
    PATCH_ROTOR_HUB_INSTALLATION_SUCCESS,
    PATCH_ROTOR_HUB_INSTALLATION_FAILURE,

    PATCH_BLADE_INSTALLATIONS_REQUEST,
    PATCH_BLADE_INSTALLATIONS_SUCCESS,
    PATCH_BLADE_INSTALLATIONS_FAILURE,

    PATCH_COMMISSIONING_DETAILS_REQUEST,
    PATCH_COMMISSIONING_DETAILS_SUCCESS,
    PATCH_COMMISSIONING_DETAILS_FAILURE,



} from '../../ActionTypes';

const initialState = {
    loading: false,
    t1installation: [],
    towersInstallations: [],
    nacelleInstallation: [],
    rotorHubInstallations: [],
    bladeInstallations: [],
    commissioning: [],
    error: null,
};

const wtgInstallationReducer = (state = initialState, action) => {
    switch (action.type) {
        // CREATE T1 installation
        case CREATE_T1_INSTALLATION_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_T1_INSTALLATION_SUCCESS:
            return {
                ...state,
                loading: false,
                t1installation: [...state.towersInstallations, action.payload],
                error: null,
            };

        case CREATE_T1_INSTALLATION_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };


            // FETCH T1 installation
        case FETCH_T1_INSTALLATION_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_T1_INSTALLATION_SUCCESS:
            return { ...state,
                loading: false,
                t1installation: action.payload,
                error: null
            };

        case FETCH_T1_INSTALLATION_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

            // create tower installation
        case CREATE_TOWER_INSTALLATION_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_TOWER_INSTALLATION_SUCCESS:
            return {
                ...state,
                loading: false,

                towersInstallations: [...state.towersInstallations, action.payload],
            };

        case CREATE_TOWER_INSTALLATION_FAILURE:

            return { ...state,
                loading: false,
                error: action.payload
            };

        case GET_TOWER_INSTALLATIONS_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

            // fectch tower installation
        case GET_TOWER_INSTALLATIONS_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case GET_TOWER_INSTALLATIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                towersInstallations: action.payload,
            };

            //post nacelle
        case CREATE_NACELLE_INSTALLATION_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_NACELLE_INSTALLATION_SUCCESS:
            return {
                ...state,
                loading: false,
                nacelleInstallation: [...state.nacelleInstallation, action.payload],

            };

        case CREATE_NACELLE_INSTALLATION_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

            //fetch nacelle 

        case FETCH_NACELLE_INSTALLATION_REQUEST:
            return {
                ...state,
                loading: true,
            };


        case FETCH_NACELLE_INSTALLATION_SUCCESS:
            return {
                ...state,
                loading: false,
                nacelleInstallation: action.payload,
            };

        case FETCH_NACELLE_INSTALLATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            //create rotor 
        case CREATE_ROTOR_HUB_INSTALLATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case CREATE_ROTOR_HUB_INSTALLATION_SUCCESS:
            return {
                ...state,
                loading: false,
                rotorHubInstallations: [...state.rotorHubInstallations, action.payload],
            };
        case CREATE_ROTOR_HUB_INSTALLATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // ===== GET =====
        case GET_ROTOR_HUB_INSTALLATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_ROTOR_HUB_INSTALLATION_SUCCESS:
            return {
                ...state,
                loading: false,
                rotorHubInstallations: action.payload,
            };
        case GET_ROTOR_HUB_INSTALLATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CREATE_BLADE_INSTALLATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case CREATE_BLADE_INSTALLATION_SUCCESS:
            return {
                ...state,
                loading: false,
                bladeInstallations: [...state.bladeInstallations, action.payload],
            };

        case CREATE_BLADE_INSTALLATION_FAILURE:

            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        case GET_BLADE_INSTALLATIONS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case GET_BLADE_INSTALLATIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                bladeInstallations: action.payload,
            };


        case GET_BLADE_INSTALLATIONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CREATE_COMMISSIONING_DETAILS_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };
        case CREATE_COMMISSIONING_DETAILS_SUCCESS:
            return { ...state,
                loading: false,
                commissioning: [...state.commissioning, action.payload]
            };
        case CREATE_COMMISSIONING_DETAILS_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_COMMISSIONING_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case FETCH_COMMISSIONING_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                commissioning: action.payload, // must be array
            };

        case FETCH_COMMISSIONING_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // all batch reducer by shyam

            //t1 installation

        case PATCH_T1_INSTALLATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case PATCH_T1_INSTALLATION_SUCCESS:
            return {
                ...state,
                loading: false,
                t1installation: state.t1installation.map((item) =>
                    item.id === action.payload.id ? action.payload : item

                ),

                sucess: true,

            };

        case PATCH_T1_INSTALLATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }

            //tower installation




        case PATCH_TOWER_INSTALLATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case PATCH_TOWER_INSTALLATION_SUCCESS:
            return {
                ...state,
                loading: false,
                towersInstallations: state.towersInstallations.map((item) =>
                    item.id === action.payload.id ? action.payload : item

                ),

                sucess: true,

            };

        case PATCH_TOWER_INSTALLATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }

            //necelle

        case PATCH_NACELLE_INSTALLATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case PATCH_NACELLE_INSTALLATION_SUCCESS:
            return {
                ...state,
                loading: false,
                nacelleInstallation: state.nacelleInstallation.map((item) =>
                    item.id === action.payload.id ? action.payload : item

                ),

                sucess: true,

            };
        case PATCH_NACELLE_INSTALLATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }



            //rotor hub


        case PATCH_ROTOR_HUB_INSTALLATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case PATCH_ROTOR_HUB_INSTALLATION_SUCCESS:
            return {
                ...state,
                loading: false,
                rotorHubInstallations: state.rotorHubInstallations.map((item) =>
                    item.id === action.payload.id ? action.payload : item

                ),

                sucess: true,

            };

        case PATCH_ROTOR_HUB_INSTALLATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }


            //blade
        case PATCH_BLADE_INSTALLATIONS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case PATCH_BLADE_INSTALLATIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                bladeInstallations: state.bladeInstallations.map((item) =>
                    item.id === action.payload.id ? action.payload : item

                ),

                sucess: true,

            };

        case PATCH_BLADE_INSTALLATIONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }



            // commissioning

        case PATCH_COMMISSIONING_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case PATCH_COMMISSIONING_DETAILS_SUCCESS:
            return {
                ...state,
                loading: false,
                commissioning: state.commissioning.map((item) =>
                    item.id === action.payload.id ? action.payload : item

                ),

                sucess: true,

            };

        case PATCH_COMMISSIONING_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default wtgInstallationReducer;