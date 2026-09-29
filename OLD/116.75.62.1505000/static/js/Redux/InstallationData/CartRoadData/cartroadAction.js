// redux/actions/cartRoadActions.js

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
} from "../../ActionTypes";
import parseErrorMessage from "../../../utils/errorFunction";
import {
    PostDataApiWTGM,
    GetDataApiWTGM,
    PatchDataApiWTGM,
} from "../../../utils/api";

// export const createCluster = (data) => async (dispatch) => {
//     try {
//         dispatch({ type: CREATE_CLUSTER_REQUEST });

//         const response = await PostDataApiWTGM('/api/cluster-master/', data);

//         dispatch({
//             type: CREATE_CLUSTER_SUCCESS,
//             payload: response,
//         });
//     } catch (error) {
//         dispatch({
//             type: CREATE_CLUSTER_FAILURE,
//             payload: error.response?.data || 'Failed to create Cluster',
//         });
//     }
// };

export const createBulkClusters = (data) => async (dispatch) => {
    dispatch({
        type: CREATE_CLUSTER_REQUEST
    });

    try {
        const res = await PostDataApiWTGM("/api/cluster/bulk/", data);
        dispatch({
            type: CREATE_CLUSTER_SUCCESS,
            payload: res
        });
    } catch (err) {
        dispatch({
            type: CREATE_CLUSTER_FAILURE,
            payload: err
        });
        throw err;
    }
};

export const getClusters = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_CLUSTER_REQUEST
        });

        const response = await GetDataApiWTGM("/api/cluster-master/");

        dispatch({
            type: FETCH_CLUSTER_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_CLUSTER_FAILURE,
            payload: error.response ? .data || "Failed to fetch Clusters",
        });
    }
};

export const createRoadPoint = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_ROADPOINT_REQUEST
        });

        const response = await PostDataApiWTGM("/api/road-point/", data);

        dispatch({
            type: CREATE_ROADPOINT_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: CREATE_ROADPOINT_FAILURE,
            payload: error.response ? .data || "Failed to create RoadPoint",
        });
    }
};

// export const previewRoadPoint = (payload) => async (dispatch) => {
//     try {
//         dispatch({ type: ROAD_POINT_PREVIEW_REQUEST });

//         const res = await PostDataApiWTGM('/api/road-point/preview/', payload);

//         dispatch({
//             type: ROAD_POINT_PREVIEW_SUCCESS,
//             payload: res.data,
//         });
//     } catch (error) {
//         dispatch({
//             type: ROAD_POINT_PREVIEW_FAIL,
//             payload: error.response?.data || error.message,
//         });
//     }
// };

export const previewRoadPoint = (data) => async (dispatch) => {
    try {
        dispatch({
            type: ROAD_POINT_PREVIEW_REQUEST
        });

        const response = await PostDataApiWTGM("/api/road-point/preview/", data);
        dispatch({
            type: ROAD_POINT_PREVIEW_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: ROAD_POINT_PREVIEW_FAIL,
            payload: error.response ? .data ? .error ||
                error.response ? .data ? .detail ||
                error.message,
        });
    }
};

export const getRoadPoints =
    (windfarmId = "") =>
    async (dispatch) => {
        try {
            dispatch({
                type: FETCH_ROADPOINT_REQUEST
            });

            // const url = windfarmId
            //     ? `/api/road-point/?windfarm_id=${windfarmId}`
            //     : `/api/road-point/`;
            const params = new URLSearchParams();
            if (windfarmId) params.append("windfarm_id", windfarmId);

            const url = `/api/road-point/${params.toString() ? `?${params}` : ""}`;

            const response = await GetDataApiWTGM(url);

            dispatch({
                type: FETCH_ROADPOINT_SUCCESS,
                payload: response,
            });
        } catch (error) {
            dispatch({
                type: FETCH_ROADPOINT_FAILURE,
                payload: error.response ? .data || "Failed to fetch RoadPoints",
            });
        }
    };

export const createCartRoadMaster = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_CARTROAD_REQUEST
        });

        const response = await PostDataApiWTGM("/api/card-road-master/", data);

        dispatch({
            type: CREATE_CARTROAD_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: CREATE_CARTROAD_FAILURE,
            payload: error.response ? .data || "Failed to create CartRoad",
        });
    }
};

// export const getCartRoadMaster = () => async (dispatch) => {
//     try {
//         dispatch({ type: FETCH_CARTROAD_REQUEST });

//         const response = await GetDataApiWTGM('/api/card-road-master/');

//         dispatch({
//             type: FETCH_CARTROAD_SUCCESS,
//             payload: response,
//         });
//     } catch (error) {
//         dispatch({
//             type: FETCH_CARTROAD_FAILURE,
//             payload: error.response?.data || 'Failed to fetch CartRoadMaster',
//         });
//     }
// };

export const getCartRoadMaster =
    (windfarmId = "") =>
    async (dispatch) => {
        try {
            dispatch({
                type: FETCH_CARTROAD_REQUEST
            });

            const url = windfarmId ?
                `/api/card-road-master/?windfarm_id=${windfarmId}` :
                `/api/card-road-master/`;

            const response = await GetDataApiWTGM(url);

            dispatch({
                type: FETCH_CARTROAD_SUCCESS,
                payload: response,
            });
        } catch (error) {
            dispatch({
                type: FETCH_CARTROAD_FAILURE,
                payload: error.response ? .data || "Failed to fetch CartRoadMaster",
            });
        }
    };

export const postCartRoadDPR = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_CART_ROAD_DPR_REQUEST
        });

        const data = await PostDataApiWTGM("/api/cart-roads-dpr/", formData, true);

        dispatch({
            type: CREATE_CART_ROAD_DPR_SUCCESS,
            payload: data,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_CART_ROAD_DPR_FAILURE,
            payload: errorMsg,
        });
    }
};

export const getCartRoadDPR = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_CART_ROAD_DPR_REQUEST
        });

        const response = await GetDataApiWTGM("/api/cart-roads-dpr/");
        dispatch({
            type: FETCH_CART_ROAD_DPR_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: FETCH_CART_ROAD_DPR_FAILURE,
            payload: errorMsg,
        });
    }
};

export const getRoadMapView = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_ROAD_MASTER_VIEW_REQUEST
        });

        const response = await GetDataApiWTGM("/api/map-view-set/");

        dispatch({
            type: FETCH_ROAD_MASTER_VIEW_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_ROAD_MASTER_VIEW_FAILURE,
            payload: error.response ? .data || "Failed to fetch RoadMasterView",
        });
    }
};

export const getNestedProjects =
    ({
        projectId = null,
        windfarmId = null,
        clusterId = null
    } = {}) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GET_NESTED_PROJECT_REQUEST
            });

            const params = new URLSearchParams();

            if (projectId !== null && projectId !== "")
                params.append("project", projectId);

            if (windfarmId !== null && windfarmId !== "")
                params.append("windfarm", windfarmId);

            if (clusterId !== null && clusterId !== "")
                params.append("cluster", clusterId);

            const url =
                params.toString().length > 0 ?
                `/api/project-nested/?${params.toString()}` :
                `/api/project-nested/`;

            const response = await GetDataApiWTGM(url);

            dispatch({
                type: GET_NESTED_PROJECT_SUCCESS,
                payload: response,
            });
        } catch (error) {
            dispatch({
                type: GET_NESTED_PROJECT_FAILURE,
                payload: error.response ? .data ||
                    error.message ||
                    "Failed to fetch Nested Project Data",
            });
        }
    };

export const GETPWCFilterData = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_PWC_REQUEST
        });

        const response = await GetDataApiWTGM("/api/project-filter/");

        dispatch({
            type: GET_PWC_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: GET_PWC_FAILURE,
            payload: error.response ? .data || "Failed to fetch Map Coordinates",
        });
    }
};

export const getCartRoadDPRView = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_CART_ROAD_DPR_VIEW_REQUEST
        });

        const response = await GetDataApiWTGM("/api/cart-road-view/");
        dispatch({
            type: FETCH_CART_ROAD_DPR_VIEW_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: FETCH_CART_ROAD_DPR_VIEW_FAILURE,
            payload: errorMsg,
        });
    }
};

//patch for roadDPR
export const patchCartRoadDPR = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_CART_ROAD_DPR_REQUEST
        });

        // Convert to FormData for multipart/form-data
        const formDataObj = new FormData();
        formDataObj.append('approve_date', formData.approve_date);
        formDataObj.append('status', formData.status);

        // If you have other fields, add them here
        // formDataObj.append('remarks', formData.remarks || '');

        const response = await PatchDataApiWTGM(
            `/api/cart-roads-dpr/${id}/`,
            formDataObj, // Send as FormData
            true,
        );

        dispatch({
            type: PATCH_CART_ROAD_DPR_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_CART_ROAD_DPR_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};
export const PatchDPRAttachment = (id, formData) => async (dispatch) => {
    dispatch({
        type: PATCH_DPR_ATTACHMENT_REQUEST
    });

    try {
        const data = await PatchDataApiWTGM(
            `/api/cart-roads-dpr/${id}/`,
            formData,
            true, // multipart
        );

        dispatch({
            type: PATCH_DPR_ATTACHMENT_SUCCESS,
            payload: data,
        });

        return {
            success: true,
            data
        };
    } catch (error) {
        dispatch({
            type: PATCH_DPR_ATTACHMENT_FAILURE,
            payload: error.response ? .data || error.message,
        });

        return {
            success: false
        };
    }
};


export const PatchDPRSubmit = (id, formData) => async (dispatch) => {
    dispatch({
        type: PATCH_DPR_SUBMIT_REQUEST
    });

    try {
        const data = await PatchDataApiWTGM(
            `/api/cart-roads-dpr/${id}/`,
            formData,
            true, // multipart
        );

        dispatch({
            type: PATCH_DPR_SUBMIT_SUCCESS,
            payload: data,
        });

        return {
            success: true,
            data
        };
    } catch (error) {
        dispatch({
            type: PATCH_DPR_SUBMIT_FAILURE,
            payload: error.response ? .data || error.message,
        });

        return {
            success: false,
            error: error.response ? .data
        };
    }
};
// rushi Code dashboard Road

export const getRoadDPRDashboardData = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_ROAD_DASHBOARD_REQUEST
        });

        const response = await GetDataApiWTGM(
            "/api/mapobjects-progress-dashboard/",
        );

        dispatch({
            type: GET_ROAD_DASHBOARD_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: GET_ROAD_DASHBOARD_FAILURE,
            payload: error.response ? .data || "Failed to fetch Map Coordinates",
        });
    }
};

//rushi -> 10-02-2026 map object turbine data

export const GetMapObjectTurbineData = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_MAP_OBJECTS_TURBINE_REQUEST
        });

        const response = await GetDataApiWTGM("/api/mapobjects-turbine-data");

        dispatch({
            type: GET_MAP_OBJECTS_TURBINE_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response || error.message);

        dispatch({
            type: GET_MAP_OBJECTS_TURBINE_FAILURE,
            payload: errorMsg,
        });
    }
};