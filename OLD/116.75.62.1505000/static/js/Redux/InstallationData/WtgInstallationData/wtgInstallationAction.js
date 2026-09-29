import {
    PostDataApiWTGM,
    GetDataApiWTGM,
    PutDataApiWTGM,
    PatchDataApiWTGM
} from "../../../utils/api";

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

    UPDATE_T1_INSTALLATION_REQUEST,
    UPDATE_T1_INSTALLATION_SUCCESS,
    UPDATE_T1_INSTALLATION_FAILURE,

    UPDATE_TOWER_INSTALLATION_REQUEST,
    UPDATE_TOWER_INSTALLATION_SUCCESS,
    UPDATE_TOWER_INSTALLATION_FAILURE,

    UPDATE_NACELLE_INSTALLATION_REQUEST,
    UPDATE_NACELLE_INSTALLATION_SUCCESS,
    UPDATE_NACELLE_INSTALLATION_FAILURE,

    UPDATE_ROTOR_HUB_INSTALLATION_REQUEST,
    UPDATE_ROTOR_HUB_INSTALLATION_SUCCESS,
    UPDATE_ROTOR_HUB_INSTALLATION_FAILURE,

    UPDATE_BLADE_INSTALLATION_REQUEST,
    UPDATE_BLADE_INSTALLATION_SUCCESS,
    UPDATE_BLADE_INSTALLATION_FAILURE,

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



} from '../../ActionTypes'

import parseErrorMessage from "../../../utils/errorFunction";

export const createT1InstallationData = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_T1_INSTALLATION_REQUEST
        });

        const response = await PostDataApiWTGM('/api/t1-installation/', data, true);

        dispatch({
            type: CREATE_T1_INSTALLATION_SUCCESS,
            payload: response,
        });

        return response;

    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: CREATE_T1_INSTALLATION_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};



export const GetT1InstalltionData = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_T1_INSTALLATION_REQUEST
        });

        const response = await GetDataApiWTGM('/api/t1-installation/', {
            params
        });


        dispatch({
            type: FETCH_T1_INSTALLATION_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_T1_INSTALLATION_FAILURE,
            payload: error.response ? .data || 'Failed to  T1-Installation Data',
        });
    }
};

export const updateT1Installation = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_T1_INSTALLATION_REQUEST
        });

        const response = await PutDataApiWTGM(
            `/api/t1-installation/${id}/`,
            formData
        );

        dispatch({
            type: UPDATE_T1_INSTALLATION_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_T1_INSTALLATION_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};
// 🌟 POST - Create Tower Installation
export const PostTowerInstallation = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_TOWER_INSTALLATION_REQUEST
        });

        const response = await PostDataApiWTGM("/api/tower-installations/", formData, true);

        dispatch({
            type: CREATE_TOWER_INSTALLATION_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data);

        dispatch({
            type: CREATE_TOWER_INSTALLATION_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

// 🌟 GET - Fetch All Tower Installations
export const GetTowerInstallations = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_TOWER_INSTALLATIONS_REQUEST
        });

        const response = await GetDataApiWTGM("/api/tower-installations/", {
            params
        });

        dispatch({
            type: GET_TOWER_INSTALLATIONS_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const parsedError =
            error.response ? .data ? .detail || "Failed to load tower installations.";

        dispatch({
            type: GET_TOWER_INSTALLATIONS_FAILURE,
            payload: parsedError,
        });

        throw new Error(parsedError);
    }
};

export const PostNacelleInstallation = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_NACELLE_INSTALLATION_REQUEST
        });

        const response = await PostDataApiWTGM('/api/nacelle-installation/', data);

        dispatch({
            type: CREATE_NACELLE_INSTALLATION_SUCCESS,
            payload: response,
        });

        return response; // allow chaining
    } catch (error) {
        const parsedError = parseErrorMessage(error.response ? .data);

        dispatch({
            type: CREATE_NACELLE_INSTALLATION_FAILURE,
            payload: parsedError,
        });
        throw error;

        //  throw parsedError;
        //   }
        // throw new Error(parsedError); // 💥 throw for component to catch
    }
};

export const GetNacelleInstallation = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_NACELLE_INSTALLATION_REQUEST
        });

        const response = await GetDataApiWTGM('/api/nacelle-installation/', {
            params
        });

        dispatch({
            type: FETCH_NACELLE_INSTALLATION_SUCCESS,
            payload: response,
        });

        return response; // optional chaining if needed
    } catch (error) {
        const parsedError = parseErrorMessage(error.response ? .data);

        dispatch({
            type: FETCH_NACELLE_INSTALLATION_FAILURE,
            payload: parsedError,
        });

        throw new Error(parsedError);
    }
};


export const PostRotorHubInstallation = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_ROTOR_HUB_INSTALLATION_REQUEST
        });

        const response = await PostDataApiWTGM('/api/rotor-hubs/', data);

        dispatch({
            type: CREATE_ROTOR_HUB_INSTALLATION_SUCCESS,
            payload: response,
        });

        return response; // for chaining
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data);

        dispatch({
            type: CREATE_ROTOR_HUB_INSTALLATION_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

export const GetRotorHubInstallations = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_ROTOR_HUB_INSTALLATION_REQUEST
        });

        const response = await GetDataApiWTGM('/api/rotor-hubs/', {
            params
        });

        dispatch({
            type: GET_ROTOR_HUB_INSTALLATION_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const parsedError = parseErrorMessage(error.response ? .data);

        dispatch({
            type: GET_ROTOR_HUB_INSTALLATION_FAILURE,
            payload: parsedError,
        });

        throw new Error(parsedError);
    }
};

export const PostBladeInstallation = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_BLADE_INSTALLATION_REQUEST
        });

        const response = await PostDataApiWTGM('/api/blade-installations/', data);

        dispatch({
            type: CREATE_BLADE_INSTALLATION_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data);

        dispatch({
            type: CREATE_BLADE_INSTALLATION_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

export const GetBladeInstallations = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_BLADE_INSTALLATIONS_REQUEST
        });

        const response = await GetDataApiWTGM('/api/blade-installations/', {
            params
        });

        dispatch({
            type: GET_BLADE_INSTALLATIONS_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const parsedError = error.response ? .data ? .detail || 'Failed to load blade installations.';

        dispatch({
            type: GET_BLADE_INSTALLATIONS_FAILURE,
            payload: parsedError,
        });

        throw new Error(parsedError);
    }
};



export const updateTowerInstallation = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_TOWER_INSTALLATION_REQUEST
        });

        const response = await PutDataApiWTGM(
            `/api/tower-installations/${id}/`,
            formData
        );

        dispatch({
            type: UPDATE_TOWER_INSTALLATION_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_TOWER_INSTALLATION_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};

export const updateNacelleInstallation = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_NACELLE_INSTALLATION_REQUEST
        });

        const response = await PutDataApiWTGM(
            `/api/nacelle-installations/${id}/`,
            formData
        );

        dispatch({
            type: UPDATE_NACELLE_INSTALLATION_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_NACELLE_INSTALLATION_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};

export const updateRotorHubInstallation = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_ROTOR_HUB_INSTALLATION_REQUEST
        });

        const response = await PutDataApiWTGM(
            `/api/rotor-hub-installations/${id}/`,
            formData
        );

        dispatch({
            type: UPDATE_ROTOR_HUB_INSTALLATION_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_ROTOR_HUB_INSTALLATION_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};

export const updateBladeInstallation = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_BLADE_INSTALLATION_REQUEST
        });

        const response = await PutDataApiWTGM(
            `/api/blade-installations/${id}/`,
            formData
        );

        dispatch({
            type: UPDATE_BLADE_INSTALLATION_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: UPDATE_BLADE_INSTALLATION_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};


export const PostCommissioningDetails = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_COMMISSIONING_DETAILS_REQUEST
        });

        // ✅ API POST call (multipart/form-data)
        const response = await PostDataApiWTGM('/api/commissioning-details/', formData, true);

        dispatch({
            type: CREATE_COMMISSIONING_DETAILS_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_COMMISSIONING_DETAILS_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};


export const GetCommissioningDetails = (params = {}) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_COMMISSIONING_DETAILS_REQUEST
        });

        const response = await GetDataApiWTGM('/api/commissioning-details/', {
            params
        });

        dispatch({
            type: FETCH_COMMISSIONING_DETAILS_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: FETCH_COMMISSIONING_DETAILS_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};


// all patch action by shyam

export const patchT1Installation = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_T1_INSTALLATION_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/t1-installation/${id}/`,
            formData,
            true,
        );

        dispatch({
            type: PATCH_T1_INSTALLATION_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_T1_INSTALLATION_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

// tower installation

export const patchTowerInstallations = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_TOWER_INSTALLATION_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/tower-installations/${id}/`,
            formData,
            true,
        );

        dispatch({
            type: PATCH_TOWER_INSTALLATION_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_TOWER_INSTALLATION_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

//necelle

export const patchNacelleInstallation = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_NACELLE_INSTALLATION_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/nacelle-installation/${id}/`,
            formData,
            true,
        );

        dispatch({
            type: PATCH_NACELLE_INSTALLATION_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_NACELLE_INSTALLATION_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

//rotor hub installation

export const patchRotorHubInstallations =
    (id, formData) => async (dispatch) => {
        try {
            dispatch({
                type: PATCH_ROTOR_HUB_INSTALLATION_REQUEST
            });

            const response = await PatchDataApiWTGM(
                `/api/rotor-hubs/${id}/`,
                formData,
                true,
            );

            dispatch({
                type: PATCH_ROTOR_HUB_INSTALLATION_SUCCESS,
                payload: response,
            });

            return response;
        } catch (error) {
            const errorMsg = parseErrorMessage(error.response ? .data || error.message);
            dispatch({
                type: PATCH_ROTOR_HUB_INSTALLATION_FAILURE,
                payload: errorMsg,
            });
            throw error;
        }
    };

//bladeinstallation

export const patchBladeInstallations = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_BLADE_INSTALLATIONS_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/blade-installations/${id}/`,
            formData,
            true,
        );

        dispatch({
            type: PATCH_BLADE_INSTALLATIONS_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_BLADE_INSTALLATIONS_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

//commissioning

export const patchCommissioningDetails = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_COMMISSIONING_DETAILS_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/commissioning-details/${id}/`,
            formData,
            true,
        );

        dispatch({
            type: PATCH_COMMISSIONING_DETAILS_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: PATCH_COMMISSIONING_DETAILS_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};