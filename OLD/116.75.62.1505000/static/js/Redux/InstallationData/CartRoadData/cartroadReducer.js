// redux/reducers/cartRoadReducer.js

import {
    CREATE_CLUSTER_REQUEST,
    CREATE_CLUSTER_SUCCESS,
    CREATE_CLUSTER_FAILURE,
    FETCH_CLUSTER_REQUEST,
    FETCH_CLUSTER_SUCCESS,
    FETCH_CLUSTER_FAILURE,

    CREATE_ROADPOINT_REQUEST,
    CREATE_ROADPOINT_SUCCESS,
    CREATE_ROADPOINT_FAILURE,
    FETCH_ROADPOINT_REQUEST,
    FETCH_ROADPOINT_SUCCESS,
    FETCH_ROADPOINT_FAILURE,

    ROAD_POINT_PREVIEW_REQUEST,
    ROAD_POINT_PREVIEW_SUCCESS,
    ROAD_POINT_PREVIEW_FAIL,

    CREATE_CARTROAD_REQUEST,
    CREATE_CARTROAD_SUCCESS,
    CREATE_CARTROAD_FAILURE,
    FETCH_CARTROAD_REQUEST,
    FETCH_CARTROAD_SUCCESS,
    FETCH_CARTROAD_FAILURE,

    CREATE_CART_ROAD_DPR_REQUEST,
    CREATE_CART_ROAD_DPR_SUCCESS,
    CREATE_CART_ROAD_DPR_FAILURE,

    FETCH_CART_ROAD_DPR_REQUEST,
    FETCH_CART_ROAD_DPR_SUCCESS,
    FETCH_CART_ROAD_DPR_FAILURE,

    FETCH_ROAD_MASTER_VIEW_REQUEST,
    FETCH_ROAD_MASTER_VIEW_SUCCESS,
    FETCH_ROAD_MASTER_VIEW_FAILURE,

    GET_NESTED_PROJECT_REQUEST,
    GET_NESTED_PROJECT_SUCCESS,
    GET_NESTED_PROJECT_FAILURE,
    GET_PWC_REQUEST,
    GET_PWC_SUCCESS,
    GET_PWC_FAILURE,

    FETCH_CART_ROAD_DPR_VIEW_REQUEST,
    FETCH_CART_ROAD_DPR_VIEW_SUCCESS,
    FETCH_CART_ROAD_DPR_VIEW_FAILURE,

    PATCH_CART_ROAD_DPR_REQUEST,
    PATCH_CART_ROAD_DPR_SUCCESS,
    PATCH_CART_ROAD_DPR_FAILURE,

    PATCH_DPR_ATTACHMENT_REQUEST,
    PATCH_DPR_ATTACHMENT_SUCCESS,
    PATCH_DPR_ATTACHMENT_FAILURE,

    GET_ROAD_DASHBOARD_REQUEST,
    GET_ROAD_DASHBOARD_SUCCESS,
    GET_ROAD_DASHBOARD_FAILURE,

    GET_MAP_OBJECTS_TURBINE_REQUEST,
    GET_MAP_OBJECTS_TURBINE_SUCCESS,
    GET_MAP_OBJECTS_TURBINE_FAILURE,

    PATCH_DPR_SUBMIT_REQUEST,
    PATCH_DPR_SUBMIT_SUCCESS,
    PATCH_DPR_SUBMIT_FAILURE,

} from '../../ActionTypes';

const initialState = {
    loading: false,
    clusters: [],
    roadPoints: [],
    cartRoadMaster: [],
    cartRoadDPR: [],
    roadMapView: [],
    cartroadview: [],
    patchattachment: null,
    roadDashboard: [],
    getmapobjectturbineData: [],
    preview: {
        name: "",
        loading: false,
        error: null,
    },
    error: null,
    submitLoading: false,
    submitSuccess: false,
    submitError: null,
};

export const CartRoadReducer = (state = initialState, action) => {
    switch (action.type) {

        case CREATE_CLUSTER_REQUEST:

            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_CLUSTER_SUCCESS:
            return {
                ...state,
                loading: false,
                clusters: [...state.clusters, action.payload],
            };
        case CREATE_CLUSTER_FAILURE:

            return { ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_CLUSTER_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_CLUSTER_SUCCESS:
            return { ...state,
                loading: false,
                clusters: action.payload
            };


        case FETCH_CLUSTER_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case CREATE_ROADPOINT_REQUEST:

            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_ROADPOINT_SUCCESS:
            return {
                ...state,
                loading: false,
                roadPoints: [...state.roadPoints, action.payload],
            };

        case CREATE_ROADPOINT_FAILURE:

            return { ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_ROADPOINT_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_ROADPOINT_SUCCESS:
            return { ...state,
                loading: false,
                roadPoints: action.payload
            };


        case FETCH_ROADPOINT_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case ROAD_POINT_PREVIEW_REQUEST:
            return {
                ...state,
                preview: {
                    name: "",
                    loading: true,
                    error: null
                }
            };

        case ROAD_POINT_PREVIEW_SUCCESS:
            return {
                ...state,
                preview: {
                    name: action.payload.name,
                    loading: false,
                    error: null
                }
            };

        case ROAD_POINT_PREVIEW_FAIL:
            return {
                ...state,
                preview: {
                    name: "",
                    loading: false,
                    error: action.payload
                }
            };

        case CREATE_CARTROAD_REQUEST:

            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_CARTROAD_SUCCESS:
            return {
                ...state,
                loading: false,
                cartRoadMaster: [...state.cartRoadMaster, action.payload],
            };

        case CREATE_CARTROAD_FAILURE:

            return { ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_CARTROAD_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_CARTROAD_SUCCESS:
            return { ...state,
                loading: false,
                cartRoadMaster: action.payload
            };


        case FETCH_CARTROAD_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case CREATE_CART_ROAD_DPR_REQUEST:
            return {
                ...state,
                submitLoading: true, // ← ALAG STATE
                error: null
            };

        case CREATE_CART_ROAD_DPR_SUCCESS:
            return {
                ...state,
                submitLoading: false, // ← ALAG STATE
                cartRoadDPR: [...state.cartRoadDPR, action.payload],
                error: null,
            };

        case CREATE_CART_ROAD_DPR_FAILURE:
            return {
                ...state,
                submitLoading: false, // ← ALAG STATE
                cartRoadDPR: [],
                error: action.payload
            };
        case FETCH_CART_ROAD_DPR_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };
        case FETCH_CART_ROAD_DPR_SUCCESS:
            return { ...state,
                loading: false,
                cartRoadDPR: action.payload,
            };
        case FETCH_CART_ROAD_DPR_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_ROAD_MASTER_VIEW_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_ROAD_MASTER_VIEW_SUCCESS:
            return { ...state,
                loading: false,
                roadMapView: action.payload
            };

        case FETCH_ROAD_MASTER_VIEW_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

            // rushi work
        case GET_NESTED_PROJECT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_NESTED_PROJECT_SUCCESS:
            return {
                ...state,
                loading: false,
                nestedprojects: action.payload, // 👈 renamed
                error: null,
            };

        case GET_NESTED_PROJECT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };




        case GET_PWC_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_PWC_SUCCESS:
            return {
                ...state,
                loading: false,
                getpwc: action.payload, // 👈 renamed
                error: null,
            };

        case GET_PWC_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // cartroadview
        case FETCH_CART_ROAD_DPR_VIEW_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_CART_ROAD_DPR_VIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                cartroadview: action.payload, // 👈 renamed
                error: null,
            };

        case FETCH_CART_ROAD_DPR_VIEW_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case PATCH_CART_ROAD_DPR_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            }
        case PATCH_CART_ROAD_DPR_SUCCESS:
            return {
                ...state,
                loading: false,
                cartRoadDPR: state.cartRoadDPR.map((item) =>
                    item.id === action.payload.id ? action.payload : item,

                ),
            }
        case PATCH_CART_ROAD_DPR_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }

            // pathc Attachment Data bY Rushi
        case PATCH_DPR_ATTACHMENT_REQUEST:
            return { ...state,
                patchLoading: true,
                patchError: null
            };
        case PATCH_DPR_ATTACHMENT_SUCCESS:
            return { ...state,
                patchLoading: false,
                patchSuccess: true,
                patchattachment: action.payload
            };
        case PATCH_DPR_ATTACHMENT_FAILURE:
            return { ...state,
                patchLoading: false,
                patchError: action.Payload
            };
            // ==================== PATCH DPR SUBMIT ====================
        case PATCH_DPR_SUBMIT_REQUEST:
            return {
                ...state,
                submitLoading: true,
                submitError: null,
                submitSuccess: false,
            };

        case PATCH_DPR_SUBMIT_SUCCESS:
            return {
                ...state,
                submitLoading: false,
                submitSuccess: true,
                submitError: null,
                // Update the specific DPR in cartroadview
                cartroadview: state.cartroadview.map(item =>
                    item.dpr_id === action.payload ? .id ?
                    {
                        ...item,
                        submitted_at: action.payload ? .submitted_at || new Date().toISOString(),
                    } :
                    item
                ),
            };

        case PATCH_DPR_SUBMIT_FAILURE:
            return {
                ...state,
                submitLoading: false,
                submitSuccess: false,
                submitError: action.payload,
            };
            // rushi Code

        case GET_ROAD_DASHBOARD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_ROAD_DASHBOARD_SUCCESS:
            return {
                ...state,
                loading: false,
                roadDashboard: action.payload, // 👈 renamed
                error: null,
            };

        case GET_ROAD_DASHBOARD_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // rushi Work getmapobject turbineData (filtered) 10-03-2026

        case GET_MAP_OBJECTS_TURBINE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_MAP_OBJECTS_TURBINE_SUCCESS:
            return {
                ...state,
                loading: false,
                getmapobjectturbineData: action.payload, // 👈 renamed
                error: null,
            };

        case GET_MAP_OBJECTS_TURBINE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        default:
            return state;
    }
};