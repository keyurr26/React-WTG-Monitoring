import {
    CREATE_USER_MASTER_REQUEST,
    CREATE_USER_MASTER_SUCCESS,
    CREATE_USER_MASTER_FAILURE,

    CREATE_PROJECT_REQUEST,
    CREATE_PROJECT_SUCCESS,
    CREATE_PROJECT_FAILURE,

    FETCH_PROJECTS_REQUEST,
    FETCH_PROJECTS_SUCCESS,
    FETCH_PROJECTS_FAILURE,

    FETCH_WINDFAM_MASTER_REQUEST,
    FETCH_WINDFAM_MASTER_SUCCESS,
    FETCH_WINDFAM_MASTER_FAILURE,

    CREATE_WINFFARM_MASTER_REQUEST,
    CREATE_WINFFARM_MASTER_SUCCESS,
    CREATE_WINFFARM_MASTER_FAILURE,

    CREATE_MATERIAL_MASTER_REQUEST,
    CREATE_MATERIAL_MASTER_SUCCESS,
    CREATE_MATERIAL_MASTER_FAILURE,

    FETCH_USER_MASTER_REQUEST,
    FETCH_USER_MASTER_SUCCESS,
    FETCH_USER_MASTER_FAILURE,

    CREATE_USER_ACCESS_REQUEST,
    CREATE_USER_ACCESS_SUCCESS,
    CREATE_USER_ACCESS_FAILURE,
    FETCH_USER_ACCESS_REQUEST,
    FETCH_USER_ACCESS_SUCCESS,
    FETCH_USER_ACCESS_FAILURE,

    GET_MATERIAL_MASTER_REQUEST,
    GET_MATERIAL_MASTER_SUCCESS,
    GET_MATERIAL_MASTER_FAILURE,

    FETCH_CONTRACTORS_REQUEST,
    FETCH_CONTRACTORS_SUCCESS,
    FETCH_CONTRACTORS_FAILURE,

    POST_CONTRACTOR_REQUEST,
    POST_CONTRACTOR_SUCCESS,
    POST_CONTRACTOR_FAILURE,

    FETCH_INSPECTORS_REQUEST,
    FETCH_INSPECTORS_SUCCESS,
    FETCH_INSPECTORS_FAILURE,

    FETCH_VENDOR_REQUEST,
    FETCH_VENDOR_SUCCESS,
    FETCH_VENDOR_FAILURE,
    CREATE_VENDOR_REQUEST,
    CREATE_VENDOR_SUCCESS,
    CREATE_VENDOR_FAILURE,

    UPDATE_CONTRACTOR_REQUEST,
    UPDATE_CONTRACTOR_SUCCESS,
    UPDATE_CONTRACTOR_FAILURE,

    DELETE_CONTRACTOR_REQUEST,
    DELETE_CONTRACTOR_SUCCESS,
    DELETE_CONTRACTOR_FAILURE,

    GET_WTG_MAKE_MODEL_REQUEST,
    GET_WTG_MAKE_MODEL_SUCCESS,
    GET_WTG_MAKE_MODEL_FAILURE,
    CREATE_WTG_MAKE_MODEL_REQUEST,
    CREATE_WTG_MAKE_MODEL_SUCCESS,
    CREATE_WTG_MAKE_MODEL_FAILURE,

    CREATE_MATERIAL_RECIVED_REQUEST,
    CREATE_MATERIAL_RECIVED_SUCCESS,
    CREATE_MATERIAL_RECIVED_FAILURE,

    FETCH_MATERIAL_RECEVIED_REQUEST,
    FETCH_MATERIAL_RECEVIED_SUCCESS,
    FETCH_MATERIAL_RECEVIED_FAILURE,

    FETCH_MATERIAL_ISSUE_REQUEST,
    FETCH_MATERIAL_ISSUE_SUCCESS,
    FETCH_MATERIAL_ISSUE_FAILURE,

    CREATE_MATERIAL_ISSUE_REQUEST,
    CREATE_MATERIAL_ISSUE_SUCCESS,
    CREATE_MATERIAL_ISSUE_FAILURE,

    FETCH_MATERIAL_STOCK_SUMMARY_REQUEST,
    FETCH_MATERIAL_STOCK_SUMMARY_SUCCESS,
    FETCH_MATERIAL_STOCK_SUMMARY_FAILURE,

    CREATE_INVENTORY_PLAN_REQUEST,
    CREATE_INVENTORY_PLAN_SUCCESS,
    CREATE_INVENTORY_PLAN_FAILURE,

    FETCH_INVENTORY_PLAN_REQUEST,
    FETCH_INVENTORY_PLAN_SUCCESS,
    FETCH_INVENTORY_PLAN_FAILURE,

    CREATE_SPARE_PROVISION_PLAN_REQUEST,
    CREATE_SPARE_PROVISION_PLAN_SUCCESS,
    CREATE_SPARE_PROVISION_PLAN_FAILURE,

    FETCH_SPARE_PROVISION_PLAN_REQUEST,
    FETCH_SPARE_PROVISION_PLAN_SUCCESS,
    FETCH_SPARE_PROVISION_PLAN_FAILURE,


    CREATE_PROJECT_TRANSFER_REQUEST,
    CREATE_PROJECT_TRANSFER_SUCCESS,
    CREATE_PROJECT_TRANSFER_FAIL,

    GET_PROJECT_TRANSFER_REQUEST,
    GET_PROJECT_TRANSFER_SUCCESS,
    GET_PROJECT_TRANSFER_FAIL,

    CREATE_MATERIAL_RETURN_REQUEST,
    CREATE_MATERIAL_RETURN_SUCCESS,
    CREATE_MATERIAL_RETURN_FAIL,

    GET_MATERIAL_RETURN_REQUEST,
    GET_MATERIAL_RETURN_SUCCESS,
    GET_MATERIAL_RETURN_FAIL,

    CREATE_MATERIAL_REJECT_REQUEST,
    CREATE_MATERIAL_REJECT_SUCCESS,
    CREATE_MATERIAL_REJECT_FAILURE,
    GET_MATERIAL_REJECT_REQUEST,
    GET_MATERIAL_REJECT_SUCCESS,
    GET_MATERIAL_REJECT_FAILURE,

    DOWNLOAD_WTG_TEMPLATE_REQUEST,
    DOWNLOAD_WTG_TEMPLATE_SUCCESS,
    DOWNLOAD_WTG_TEMPLATE_FAILURE,
    BULK_UPLOAD_WTG_REQUEST,
    BULK_UPLOAD_WTG_SUCCESS,
    BULK_UPLOAD_WTG_FAILURE,

    CREATE_ACTIVITY_SCHEDULE_REQUEST,
    CREATE_ACTIVITY_SCHEDULE_SUCCESS,
    CREATE_ACTIVITY_SCHEDULE_FAILURE,
    GET_ACTIVITY_SCHEDULE_REQUEST,
    GET_ACTIVITY_SCHEDULE_SUCCESS,
    GET_ACTIVITY_SCHEDULE_FAILURE,

    CREATE_ATTACHMENT_MASTER_REQUEST,
    CREATE_ATTACHMENT_MASTER_SUCCESS,
    CREATE_ATTACHMENT_MASTER_FAILURE,
    GET_ATTACHMENT_MASTER_REQUEST,
    GET_ATTACHMENT_MASTER_SUCCESS,
    GET_ATTACHMENT_MASTER_FAILURE,

    CREATE_DOCUMENT_UPLOAD_REQUEST,
    CREATE_DOCUMENT_UPLOAD_SUCCESS,
    CREATE_DOCUMENT_UPLOAD_FAILURE,

    GET_DOCUMENT_UPLOAD_REQUEST,
    GET_DOCUMENT_UPLOAD_SUCCESS,
    GET_DOCUMENT_UPLOAD_FAILURE,

    GET_ACTIVITY_FIELDS_REQUEST,
    GET_ACTIVITY_FIELDS_SUCCESS,
    GET_ACTIVITY_FIELDS_FAILURE,

    CREATE_KPI_MASTER_REQUEST,
    CREATE_KPI_MASTER_SUCCESS,
    CREATE_KPI_MASTER_FAILURE,

    GET_KPI_MASTER_REQUEST,
    GET_KPI_MASTER_SUCCESS,
    GET_KPI_MASTER_FAILURE,

    UPDATE_KPI_MASTER_REQUEST,
    UPDATE_KPI_MASTER_SUCCESS,
    UPDATE_KPI_MASTER_FAILURE,

    DELETE_KPI_MASTER_REQUEST,
    DELETE_KPI_MASTER_SUCCESS,
    DELETE_KPI_MASTER_FAILURE,

    CREATE_TURBINE_PLAN_REQUEST,
    CREATE_TURBINE_PLAN_SUCCESS,
    CREATE_TURBINE_PLAN_FAILURE,
    GET_TURBINE_PLANS_REQUEST,
    GET_TURBINE_PLANS_SUCCESS,
    GET_TURBINE_PLANS_FAILURE,

    GET_COMPONENT_TYPES_REQUEST,
    GET_COMPONENT_TYPES_SUCCESS,
    GET_COMPONENT_TYPES_FAILURE,

    CREATE_ELECTRICAL_MASTER_REQUEST,
    CREATE_ELECTRICAL_MASTER_SUCCESS,
    CREATE_ELECTRICAL_MASTER_FAILURE,


    GET_ELECTRICAL_MASTER_REQUEST,
    GET_ELECTRICAL_MASTER_SUCCESS,
    GET_ELECTRICAL_MASTER_FAILURE,

    CREATE_LINE_CUT_POLE_REQUEST,
    CREATE_LINE_CUT_POLE_SUCCESS,
    CREATE_LINE_CUT_POLE_FAILURE,

    GET_POLE_LINE_MASTER_DATA_REQUEST,
    GET_POLE_LINE_MASTER_DATA_SUCCESS,
    GET_POLE_LINE_MASTER_DATA_FAILURE,

    PATCH_ELECTRICAL_MASTER_REQUEST,
    PATCH_ELECTRICAL_MASTER_SUCCESS,
    PATCH_ELECTRICAL_MASTER_FAILURE,

    GET_PLANNED_DATES_REQUEST,
    GET_PLANNED_DATES_SUCCESS,
    GET_PLANNED_DATES_FAILURE,

    CREATE_USS_MASTER_REQUEST,
    CREATE_USS_MASTER_SUCCESS,
    CREATE_USS_MASTER_FAILURE,
    GET_USS_MASTER_REQUEST,
    GET_USS_MASTER_SUCCESS,
    GET_USS_MASTER_FAILURE,
    UPDATE_PROJECT_REQUEST,
    UPDATE_PROJECT_SUCCESS,
    UPDATE_PROJECT_FAILURE,

    UPDATE_WINDFARM_MASTER_REQUEST,
    UPDATE_WINDFARM_MASTER_SUCCESS,
    UPDATE_WINDFARM_MASTER_FAILURE,
    PATCH_USS_MASTER_REQUEST,
    PATCH_USS_MASTER_SUCCESS,
    PATCH_USS_MASTER_FAILURE,

} from "../ActionTypes"; // import your action types // import your action types
import parseErrorMessage from "../../utils/errorFunction";
import {
    PostDataApiWTGM,
    GetDataApiWTGM,
    DeleteDataApiWTGM,
    PatchDataApiWTGM,
} from "../../utils/api"; // your util file path

// create UserMaster Data

export const createUserMasterData = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_USER_MASTER_REQUEST
        });

        const response = await PostDataApiWTGM("/api/user/register/", data);

        dispatch({
            type: CREATE_USER_MASTER_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        // console.log("errorMsg", errorMsg);
        dispatch({
            type: CREATE_USER_MASTER_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

export const GetUserMasterData = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_USER_MASTER_REQUEST
        });

        const response = await GetDataApiWTGM("/api/user/");

        dispatch({
            type: FETCH_USER_MASTER_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_USER_MASTER_FAILURE,
            payload: error.response ? .data || "Failed to fetch user Data",
        });
    }
};

// user project accessmanager 
export const createUserAccess = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_USER_ACCESS_REQUEST
        });

        const response = await PostDataApiWTGM("/api/user-access/", data);

        dispatch({
            type: CREATE_USER_ACCESS_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: CREATE_USER_ACCESS_FAILURE,
            payload: errorMsg,
        });

        throw errorMsg;
    }
};

// Fetch all user accesses
export const getUserAccessData = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_USER_ACCESS_REQUEST
        });

        const response = await GetDataApiWTGM("/api/user-access/");

        dispatch({
            type: FETCH_USER_ACCESS_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_USER_ACCESS_FAILURE,
            payload: error.response ? .data || "Failed to fetch user access data",
        });
    }
};

export const createProjectData = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_PROJECT_REQUEST
        });

        const response = await PostDataApiWTGM("/api/projects/", data);

        dispatch({
            type: CREATE_PROJECT_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: CREATE_PROJECT_FAILURE,
            payload: errorMsg,
        });

        throw errorMsg;
    }
};

export const GetProjectsData = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_PROJECTS_REQUEST
        });

        const response = await GetDataApiWTGM("/api/projects/");

        dispatch({
            type: FETCH_PROJECTS_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_PROJECTS_FAILURE,
            payload: error.response ? .data || "Failed to fetch projects",
        });
    }
};

export const GetWindFarmMasterData = (projectId) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_WINDFAM_MASTER_REQUEST
        });

        const url = projectId ?
            `/api/windfarm-master/?project=${projectId}` :
            `/api/windfarm-master/`;

        const response = await GetDataApiWTGM(url);

        dispatch({
            type: FETCH_WINDFAM_MASTER_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_WINDFAM_MASTER_FAILURE,
            payload: error.response ? .data || "Failed to fetch windfarm master",
        });
    }
};

export const CreateWindFarmData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_WINFFARM_MASTER_REQUEST
        });

        const response = await PostDataApiWTGM("/api/windfarm-master/", formData);

        dispatch({
            type: CREATE_WINFFARM_MASTER_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_WINFFARM_MASTER_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

export const CreateMaterialMasterData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_MATERIAL_MASTER_REQUEST
        });

        const data = await PostDataApiWTGM(
            "/api/materials-master/",
            formData,
            true,
        );

        dispatch({
            type: CREATE_MATERIAL_MASTER_SUCCESS,
            payload: data,
        });
        return data;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_MATERIAL_MASTER_FAILURE,
            payload: errorMsg,
        });

        throw errorMsg;
    }
};

export const GetMaterialMasterData = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_MATERIAL_MASTER_REQUEST
        });

        const response = await GetDataApiWTGM("/api/materials-master/");

        dispatch({
            type: GET_MATERIAL_MASTER_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: GET_MATERIAL_MASTER_FAILURE,
            payload: error.response ? .data || "Failed to Material Master Data",
        });
    }
};


// export const GetTurbineTableData = () => async (dispatch) => {
//   try {
//     dispatch({ type: FETCH_TURBINE_REQUEST });

//     const response = await GetDataApiWTGM('/api/turbine-locations/');

//     dispatch({
//       type: FETCH_TURBINE_SUCCESS,
//       payload: response,
//     });
//   } catch (error) {
//     dispatch({
//       type: FETCH_TURBINE_FAILURE,
//       payload: error.response?.data || 'Failed to Turbine Data',
//     });
//   }
// };


// Fetch contractors (GET)
export const fetchContractors = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_CONTRACTORS_REQUEST
        });

        const response = await GetDataApiWTGM("/api/contractors/");

        dispatch({
            type: FETCH_CONTRACTORS_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_CONTRACTORS_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};

// Add new contractor (POST)
export const postContractor = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: POST_CONTRACTOR_REQUEST
        });

        const response = await PostDataApiWTGM("/api/contractors/", formData);

        dispatch({
            type: POST_CONTRACTOR_SUCCESS,
            payload: response,
        });

        // Optional: refetch contractors list after successful POST
        dispatch(fetchContractors());
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: POST_CONTRACTOR_FAILURE,
            payload: errorMsg,
        });

        throw errorMsg;
    }
};

export const GetInspectors = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_INSPECTORS_REQUEST
        });

        const response = await GetDataApiWTGM("/api/user/inspectors/");

        dispatch({
            type: FETCH_INSPECTORS_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_INSPECTORS_FAILURE,
            payload: error.response ? .data || "Failed to fetch inspectors",
        });
    }
};

// Get Vendor List
export const GetVendorData = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_VENDOR_REQUEST
        });

        const response = await GetDataApiWTGM("/api/vendors/");

        dispatch({
            type: FETCH_VENDOR_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_VENDOR_FAILURE,
            payload: error.response ? .data || "Failed to fetch Vendor Data",
        });
    }
};

// Create Vendor
export const CreateVendorData = (vendorPayload) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_VENDOR_REQUEST
        });

        const response = await PostDataApiWTGM("/api/vendors/", vendorPayload);

        dispatch({
            type: CREATE_VENDOR_SUCCESS,
            payload: response,
        });

    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_VENDOR_FAILURE,
            payload: error.response ? .data || "Failed to Create Vendor",
        });
        throw error;
    }
};

// Update contractor (PATCH)
export const updateContractor = (id, updatedData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_CONTRACTOR_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/contractors/${id}/`,
            updatedData,
        );

        dispatch({
            type: UPDATE_CONTRACTOR_SUCCESS,
            payload: response,
        });

        dispatch(fetchContractors()); // refresh table list
    } catch (error) {
        dispatch({
            type: UPDATE_CONTRACTOR_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};

// Delete contractor (DELETE)
export const deleteContractor = (id) => async (dispatch) => {
    try {
        dispatch({
            type: DELETE_CONTRACTOR_REQUEST
        });

        await DeleteDataApiWTGM(`/api/contractors/${id}/`);

        dispatch({
            type: DELETE_CONTRACTOR_SUCCESS,
            payload: id,
        });

        dispatch(fetchContractors()); // refresh table
    } catch (error) {
        dispatch({
            type: DELETE_CONTRACTOR_FAILURE,
            payload: error.response ? .data || error.message,
        });
    }
};


// 🔹 Get all WTG Make & Models
export const GetWTGMakeModelData = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_WTG_MAKE_MODEL_REQUEST
        });
        const response = await GetDataApiWTGM("/api/wtg-make-model/");
        dispatch({
            type: GET_WTG_MAKE_MODEL_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: GET_WTG_MAKE_MODEL_FAILURE,
            payload: error.response ? .data || "Failed to fetch WTG data",
        });
    }
};


export const CreateWTGMakeModelData = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_WTG_MAKE_MODEL_REQUEST
        });

        const response = await PostDataApiWTGM("/api/wtg-make-model/", data);

        dispatch({
            type: CREATE_WTG_MAKE_MODEL_SUCCESS,
            payload: response
        });
        return {
            success: true,
            message: "WTG Make & Model added successfully!"
        };

    } catch (error) {
        const errMsg =
            error.response ? .data ? .detail ||
            error.response ? .data ? .non_field_errors ? .[0] ||
            "Failed to create WTG Make & Model.";

        dispatch({
            type: CREATE_WTG_MAKE_MODEL_FAILURE,
            payload: errMsg
        });
        return {
            success: false,
            message: errMsg
        }; // 👈 return message to component
    }
};


// materail Reciveed create Data 
export const CreateMaterialRecivedData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_MATERIAL_RECIVED_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/materials-received/",
            formData,
        );

        dispatch({
            type: CREATE_MATERIAL_RECIVED_SUCCESS,
            payload: response,
        });
        return {
            success: true,
            data: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_MATERIAL_RECIVED_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};


// get material Recived Data

// export const GetMaterialRecivedData = () => async (dispatch) => {
//   try {
//     dispatch({ type: FETCH_MATERIAL_RECEVIED_REQUEST });

//     const response = await GetDataApiWTGM('/api/materials-received/');

//     dispatch({
//       type: FETCH_MATERIAL_RECEVIED_SUCCESS,
//       payload: response,
//     });
//   } catch (error) {
//     dispatch({
//       type: FETCH_MATERIAL_RECEVIED_FAILURE,
//       payload: error.response?.data || 'Failed to Material Recived Data',
//     });
//   }
// };



// export const GetMaterialIssueData = () => async (dispatch) => {
//   try {
//     dispatch({ type: FETCH_MATERIAL_ISSUE_REQUEST });

//     const response = await GetDataApiWTGM('/api/materials-issued/');

//     dispatch({
//       type: FETCH_MATERIAL_ISSUE_SUCCESS,
//       payload: response,
//     });
//   } catch (error) {
//     dispatch({
//       type: FETCH_MATERIAL_ISSUE_FAILURE,
//       payload: error.response?.data || 'Failed to Material Issue Data',
//     });
//   }
// };

const buildQueryString = (filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, value);
        }
    });

    return params.toString();
};


export const GetMaterialRecivedData =
    (filters = {}) =>
    async (dispatch) => {
        try {
            dispatch({
                type: FETCH_MATERIAL_RECEVIED_REQUEST
            });

            const queryString = buildQueryString(filters);

            const url = queryString ?
                `/api/materials-received/?${queryString}` :
                `/api/materials-received/`;

            const response = await GetDataApiWTGM(url);

            dispatch({
                type: FETCH_MATERIAL_RECEVIED_SUCCESS,
                payload: response,
            });
        } catch (error) {
            dispatch({
                type: FETCH_MATERIAL_RECEVIED_FAILURE,
                payload: error.response ? .data || "Failed to Material Received Data",
            });
        }
    };



// export const GetMaterialIssueData =
//   (filters = {}) =>
//   async (dispatch) => {
//     try {
//       dispatch({ type: FETCH_MATERIAL_ISSUE_REQUEST });

//       const queryString = buildQueryString(filters);

//       const url = queryString
//         ? `/api/materials-issued/?${queryString}`
//         : `/api/materials-issued/`;

//       const response = await GetDataApiWTGM(url);

//       dispatch({
//         type: FETCH_MATERIAL_ISSUE_SUCCESS,
//         payload: response,
//       });
//     } catch (error) {
//       dispatch({
//         type: FETCH_MATERIAL_ISSUE_FAILURE,
//         payload: error.response?.data || "Failed to Material Issue Data",
//       });
//     }
//   };


export const GetMaterialIssueData =
    (filters = {}) =>
    async (dispatch) => {
        try {
            dispatch({
                type: FETCH_MATERIAL_ISSUE_REQUEST,
            });

            const query = new URLSearchParams(filters).toString();

            const response = await GetDataApiWTGM(`/api/materials-issued/?${query}`);

            dispatch({
                type: FETCH_MATERIAL_ISSUE_SUCCESS,
                payload: response,
            });
        } catch (error) {
            dispatch({
                type: FETCH_MATERIAL_ISSUE_FAILURE,
                payload: error.response ? .data || "Failed to Material Issue Data",
            });
        }
    };


export const CreateMaterialIssueData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_MATERIAL_ISSUE_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/materials-issued/create-issue/",
            formData,
        );

        dispatch({
            type: CREATE_MATERIAL_ISSUE_SUCCESS,
            payload: response,
        });
        dispatch(GetMaterialRecivedData());
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_MATERIAL_ISSUE_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

export const GetMaterialStockSummary =
    (filters = {}) =>
    async (dispatch) => {
        try {
            dispatch({
                type: FETCH_MATERIAL_STOCK_SUMMARY_REQUEST
            });

            const response = await GetDataApiWTGM("/api/material-stock-summary/", {
                params: filters,
            });

            dispatch({
                type: FETCH_MATERIAL_STOCK_SUMMARY_SUCCESS,
                payload: response,
            });
        } catch (error) {
            dispatch({
                type: FETCH_MATERIAL_STOCK_SUMMARY_FAILURE,
                payload: error.response ? .data || "Failed to fetch Material Stock Summary",
            });
        }
    };



export const CreateInventoryPlan = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_INVENTORY_PLAN_REQUEST
        });

        const response = await PostDataApiWTGM("/api/inventory-plan/", formData);

        dispatch({
            type: CREATE_INVENTORY_PLAN_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_INVENTORY_PLAN_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

export const GetInventoryPlans = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_INVENTORY_PLAN_REQUEST
        });

        const response = await GetDataApiWTGM("/api/inventory-plan/");

        dispatch({
            type: FETCH_INVENTORY_PLAN_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_INVENTORY_PLAN_FAILURE,
            payload: error.response ? .data || "Failed to fetch Inventory Plans",
        });
    }
};

export const CreateSpareProvisionPlan = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_SPARE_PROVISION_PLAN_REQUEST
        });

        // ✅ Correct endpoint spelling
        const response = await PostDataApiWTGM(
            "/api/spare-provision-plan/",
            formData,
        );

        dispatch({
            type: CREATE_SPARE_PROVISION_PLAN_SUCCESS,
            payload: response,
        });

    } catch (error) {
        dispatch({
            type: CREATE_SPARE_PROVISION_PLAN_FAILURE,
            payload: error.response ? .data || "Failed to fetch Spare Provision Plans",
        });
    }
};

// Fetch Spare Provision Plan with project & windfarm filter
export const GetSpareProvisionPlan = (params) => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_SPARE_PROVISION_PLAN_REQUEST
        });

        // Convert params to query string
        const query = new URLSearchParams(params).toString();

        const response = await GetDataApiWTGM(
            `/api/spare-provision-plan/?${query}`,
        );

        dispatch({
            type: FETCH_SPARE_PROVISION_PLAN_SUCCESS,
            payload: response,
        });
    } catch (error) {
        dispatch({
            type: FETCH_SPARE_PROVISION_PLAN_FAILURE,
            payload: error.response ? .data || "Failed to fetch Spare Provision Plans",
        });
    }
};
// export const UpdateSpareProvisionPlan = (id, formData) => async (dispatch) => {
//   try {
//     dispatch({ type: UPDATE_SPARE_PROVISION_PLAN_REQUEST });

//     const response = await PatchDataApiWTGM(
//       `/api/spare-provision-plan/${id}/`,
//       formData
//     );

//     dispatch({
//       type: UPDATE_SPARE_PROVISION_PLAN_SUCCESS,
//       payload: response,
//     });

//     // Refresh list after update
//     dispatch(PostDataApiWTGM());

//   } catch (error) {
//     dispatch({
//       type: UPDATE_SPARE_PROVISION_PLAN_FAILURE,
//       payload: error.response?.data || "Failed to update Spare Provision Plan",
//     });
//   }
// };

export const createProjectTransfer = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_PROJECT_TRANSFER_REQUEST
        });

        const response = await PostDataApiWTGM("/api/material-transfer/", formData);

        dispatch({
            type: CREATE_PROJECT_TRANSFER_SUCCESS,
            payload: response,
        });
        return response;
    } catch (error) {
        dispatch({
            type: CREATE_PROJECT_TRANSFER_FAIL,
            payload: error ? .response ? .data || "Something went wrong",
        });
    }
};

export const getProjectTransfers = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_PROJECT_TRANSFER_REQUEST
        });

        const response = await GetDataApiWTGM("/api/material-transfer/");

        dispatch({
            type: GET_PROJECT_TRANSFER_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        dispatch({
            type: GET_PROJECT_TRANSFER_FAIL,
            payload: error ? .response ? .data || "Something went wrong",
        });
    }
};

// ✅ Create Return Note
export const CreateMaterialReturnNote = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_MATERIAL_RETURN_REQUEST
        });

        const res = await PostDataApiWTGM("/api/material-return-notes/", formData);

        dispatch({
            type: CREATE_MATERIAL_RETURN_SUCCESS,
            payload: res,
        });

        return res;
    } catch (error) {
        dispatch({
            type: CREATE_MATERIAL_RETURN_FAIL,
            payload: error ? .response ? .data || "Something went wrong",
        });
    }
};

// ✅ Get Return Note list
export const GetMaterialReturnNotes = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_MATERIAL_RETURN_REQUEST
        });

        const res = await GetDataApiWTGM("/api/material-return-notes/");

        dispatch({
            type: GET_MATERIAL_RETURN_SUCCESS,
            payload: res,
        });
    } catch (error) {
        dispatch({
            type: GET_MATERIAL_RETURN_FAIL,
            payload: error ? .response ? .data || "Something went wrong",
        });
    }
};

// 📌 Create Material Reject Note
export const CreateMaterialRejectNoteData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_MATERIAL_REJECT_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/material-reject-notes/",
            formData,
        );

        dispatch({
            type: CREATE_MATERIAL_REJECT_SUCCESS,
            payload: response,
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: CREATE_MATERIAL_REJECT_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

export const GetMaterialRejectNoteData = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_MATERIAL_REJECT_REQUEST
        });

        const response = await GetDataApiWTGM("/api/material-reject-notes/");

        dispatch({
            type: GET_MATERIAL_REJECT_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: GET_MATERIAL_REJECT_FAILURE,
            payload: errorMsg,
        });
    }
};





//material master bulk download template
export const DownloadMaterialTemplate = () => async (dispatch) => {
    try {
        dispatch({
            type: "DOWNLOAD_TEMPLATE_REQUEST"
        });

        // ✅ Use your existing GET wrapper but force blob response
        const response = await GetDataApiWTGM("/api/download-material-template/", {
            responseType: "blob",
        });

        // ✅ Create a download link
        const fileURL = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", "Material_Template.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();

        dispatch({
            type: "DOWNLOAD_TEMPLATE_SUCCESS"
        });

    } catch (error) {
        dispatch({
            type: "DOWNLOAD_TEMPLATE_FAILURE",
            payload: "Failed to download template",
        });
    }
};

export const BulkUploadMaterial = (file) => async (dispatch) => {
    try {
        dispatch({
            type: "BULK_UPLOAD_MATERIAL_REQUEST"
        });
        const formData = new FormData();
        formData.append("file", file);

        const response = await PostDataApiWTGM(
            "/api/material/bulk-upload/",
            formData,
            true,
        );

        dispatch({
            type: "BULK_UPLOAD_MATERIAL_SUCCESS",
            payload: response
        });
    } catch (error) {
        dispatch({
            type: "BULK_UPLOAD_MATERIAL_FAILURE",
            payload: error.response ? .data || "Upload Failed",
        });
    }
};

// ✅ Download Vendor Template
export const DownloadVendorTemplate = () => async (dispatch) => {
    try {
        dispatch({
            type: "DOWNLOAD_VENDOR_TEMPLATE_REQUEST"
        });

        const response = await GetDataApiWTGM("/api/vendors/template/", {
            responseType: "blob",
        });

        const fileURL = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", "Vendor_Template.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();

        dispatch({
            type: "DOWNLOAD_VENDOR_TEMPLATE_SUCCESS"
        });
    } catch (error) {
        dispatch({
            type: "DOWNLOAD_VENDOR_TEMPLATE_FAILURE",
            payload: "Failed to download vendor template",
        });
    }
};

// ✅ Bulk Upload Vendors
export const BulkUploadVendors = (file) => async (dispatch) => {
    try {
        dispatch({
            type: "BULK_VENDOR_UPLOAD_REQUEST"
        });

        const formData = new FormData();
        formData.append("file", file);

        const response = await PostDataApiWTGM(
            "/api/vendors/bulk-upload/",
            formData,
            true,
        );

        dispatch({
            type: "BULK_VENDOR_UPLOAD_SUCCESS",
            payload: response,
        });

        alert("Vendor bulk upload successful!");
    } catch (error) {
        dispatch({
            type: "BULK_VENDOR_UPLOAD_FAILURE",
            payload: error.response ? .data || "Upload failed",
        });
        alert("Vendor bulk upload failed.");
    }
};

// 🔹 Download Excel Template
export const DownloadWTGTemplate = () => async (dispatch) => {
    try {
        dispatch({
            type: DOWNLOAD_WTG_TEMPLATE_REQUEST
        });

        const response = await GetDataApiWTGM(
            "/api/wtg-make-model/download-template/", {
                responseType: "blob",
            },
        );

        const fileURL = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = fileURL;
        link.setAttribute("download", "WTG_Make_Model_Template.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();

        dispatch({
            type: DOWNLOAD_WTG_TEMPLATE_SUCCESS
        });
    } catch (error) {
        dispatch({
            type: DOWNLOAD_WTG_TEMPLATE_FAILURE,
            payload: "Failed to download WTG template",
        });
    }
};


// 🔹 Bulk Upload Excel File
export const BulkUploadWTG = (file) => async (dispatch) => {
    dispatch({
        type: BULK_UPLOAD_WTG_REQUEST
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await PostDataApiWTGM(
            "/api/wtg-make-model/upload-file/",
            formData,
            true,
        );
        dispatch({
            type: BULK_UPLOAD_WTG_SUCCESS,
            payload: response,
        });
        alert("WTG Bulk Upload Successful!");
    } catch (error) {
        dispatch({
            type: BULK_UPLOAD_WTG_FAILURE,
            payload: error.response ? .data || "WTG Bulk Upload Failed",
        });
    }
};

//  Create Activity Schedule
export const CreateActivityScheduleData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_ACTIVITY_SCHEDULE_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/activity-schedule-master/",
            formData,
        );

        dispatch({
            type: CREATE_ACTIVITY_SCHEDULE_SUCCESS,
            payload: response,
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: CREATE_ACTIVITY_SCHEDULE_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

//  Get Activity Schedule List
export const GetActivityScheduleData = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_ACTIVITY_SCHEDULE_REQUEST
        });

        const response = await GetDataApiWTGM("/api/activity-schedule-master/");

        dispatch({
            type: GET_ACTIVITY_SCHEDULE_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: GET_ACTIVITY_SCHEDULE_FAILURE,
            payload: errorMsg,
        });
    }
};

//  Create Attachment Master
export const CreateAttachmentMasterData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_ATTACHMENT_MASTER_REQUEST
        });

        // Note: Using the URL from your router register
        const response = await PostDataApiWTGM("/api/attachment-master/", formData);

        dispatch({
            type: CREATE_ATTACHMENT_MASTER_SUCCESS,
            payload: response,
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: CREATE_ATTACHMENT_MASTER_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

// Get Attachment Master List with Filters
export const GetAttachmentMasterData = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_ATTACHMENT_MASTER_REQUEST
        });

        const queryParams = {};
        const allowedFilters = ["activity", "is_mandatory"];

        allowedFilters.forEach((key) => {
            const value = filters[key];
            if (value !== undefined && value !== null && value !== "") {
                queryParams[key] = value;
            }
        });

        const response = await GetDataApiWTGM("/api/attachment-master/", {
            params: queryParams,
        });

        dispatch({
            type: GET_ATTACHMENT_MASTER_SUCCESS,
            payload: response,
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: GET_ATTACHMENT_MASTER_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

export const CreateDocumentUpload = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_DOCUMENT_UPLOAD_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/activity-attachments/",
            formData,
        );

        dispatch({
            type: CREATE_DOCUMENT_UPLOAD_SUCCESS,
            payload: response
        });
        return {
            success: true,
            data: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: CREATE_DOCUMENT_UPLOAD_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

// Get All Uploaded Documents
export const GetDocumentUploadList = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_DOCUMENT_UPLOAD_REQUEST
        });

        const queryParams = {};
        const allowedFilters = [
            "project",
            "windfarm",
            "cluster",
            "turbine",
            "attachment_master",
            "activity",
            "file_type"
        ];

        allowedFilters.forEach((key) => {
            const value = filters[key];
            if (value !== undefined && value !== null && value !== "") {
                queryParams[key] = value;
            }
        });

        const response = await GetDataApiWTGM("/api/activity-attachments/", {
            params: queryParams,
        });

        dispatch({
            type: GET_DOCUMENT_UPLOAD_SUCCESS,
            payload: response,
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: GET_DOCUMENT_UPLOAD_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};
// 1. Fetch Fields for a specific Activity (for the dropdown)
export const GetActivityFieldList = (activityCode) => async (dispatch) => {
    try {
        dispatch({
            type: GET_ACTIVITY_FIELDS_REQUEST
        });

        // This calls the helper API we created in Django: /api/activity-fields/EXC/
        const response = await GetDataApiWTGM(
            `/api/activity-fields/${activityCode}/`,
        );

        dispatch({
            type: GET_ACTIVITY_FIELDS_SUCCESS,
            payload: response,
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: GET_ACTIVITY_FIELDS_FAILURE,
            payload: errorMsg
        });
        throw error;
    }
};

// 2. Create a new KPI Rule
export const CreateKPIMaster = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_KPI_MASTER_REQUEST
        });

        const response = await PostDataApiWTGM("/api/kpi-master/", formData);

        dispatch({
            type: CREATE_KPI_MASTER_SUCCESS,
            payload: response,
        });
        return {
            success: true,
            data: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_KPI_MASTER_FAILURE,
            payload: errorMsg
        });

        throw errorMsg;
    }
};

// 3. Get All KPI Rules (List)
export const GetKPIMasterList =
    (params = "") =>
    async (dispatch) => {
        try {
            dispatch({
                type: GET_KPI_MASTER_REQUEST
            });

            // Optional: add params like ?activity_code=EXC
            const response = await GetDataApiWTGM(`/api/kpi-master/${params}`);

            dispatch({
                type: GET_KPI_MASTER_SUCCESS,
                payload: response,
            });

            return {
                success: true,
                data: response
            };
        } catch (error) {
            const errorMsg = parseErrorMessage(error.response ? .data || error.message);
            dispatch({
                type: GET_KPI_MASTER_FAILURE,
                payload: errorMsg
            });
            throw error;
        }
    };

// 4. Update KPI Master (Creates new version, deactivates old)
export const UpdateKPIMaster = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_KPI_MASTER_REQUEST
        });

        // Note: This triggers the custom 'update' logic in your Django ViewSet
        const response = await PatchDataApiWTGM(`/api/kpi-master/${id}/`, formData);

        dispatch({
            type: UPDATE_KPI_MASTER_SUCCESS,
            payload: response,
            oldId: id,
        });

        // Refresh the list to remove the old version and show the new one
        dispatch(GetKPIMasterList());

        return {
            success: true,
            data: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: UPDATE_KPI_MASTER_FAILURE,
            payload: errorMsg
        });
        throw error;
    }
};


// 5. Delete KPI Master (Soft Delete)
export const DeleteKPIMaster = (id) => async (dispatch) => {
    try {
        dispatch({
            type: DELETE_KPI_MASTER_REQUEST
        });

        // Calls the 'destroy' method in Django
        await DeleteDataApiWTGM(`/api/kpi-master/${id}/`);

        dispatch({
            type: DELETE_KPI_MASTER_SUCCESS,
            payload: id, // Pass ID to reducer to filter it out of the state
        });

        // Refresh the list to ensure the UI is perfectly synced
        dispatch(GetKPIMasterList());

        return {
            success: true
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: DELETE_KPI_MASTER_FAILURE,
            payload: errorMsg
        });
        throw error;
    }
};


// 07-04-2026 Rushi & shyam code compare
// 25-03-2026 electrtical master

export const CreateElectricalMasterData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_ELECTRICAL_MASTER_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/electrical-lines-master/",
            formData,
        );

        dispatch({
            type: CREATE_ELECTRICAL_MASTER_SUCCESS,
            payload: response.data, // ✅ usually API returns data inside .data
        });

        return response.data; // ✅ useful for component handling
    } catch (error) {
        const errorMsg =
            error.response ? .data ? .message || error.response ? .data || error.message;

        dispatch({
            type: CREATE_ELECTRICAL_MASTER_FAILURE,
            payload: errorMsg,
        });

        throw error; // ✅ optional: lets UI handle it
    }
};




// electrical Master Data GET API
export const GetElectricalMasterData = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_ELECTRICAL_MASTER_REQUEST
        });

        const response = await GetDataApiWTGM("/api/electrical-lines-master/");

        dispatch({
            type: GET_ELECTRICAL_MASTER_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: GET_ELECTRICAL_MASTER_FAILURE,
            payload: errorMsg,
        });
    }
};

//aarti 10-04-2026
export const CreateTurbinePlan = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_TURBINE_PLAN_REQUEST
        });

        // Matches your Django URL: /api/turbine-plans/
        const response = await PostDataApiWTGM("/api/turbine-plans/", formData);

        dispatch({
            type: CREATE_TURBINE_PLAN_SUCCESS,
            payload: response,
        });

        return {
            success: true,
            data: response
        };

    } catch (error) {
        // Uses your existing error parser
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_TURBINE_PLAN_FAILURE,
            payload: errorMsg
        });
        throw error;
    }
};

// 2. Fetch all Turbine Plans (To show in a list or table)
export const GetTurbinePlanList = (filters = {}) => async (dispatch) => {
    try {
        dispatch({
            type: GET_TURBINE_PLANS_REQUEST
        });

        // Build URL search parameters dynamically from filters object (e.g., project, windfarm, cluster, category)
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                queryParams.append(key, value);
            }
        });

        const queryString = queryParams.toString();
        const endpoint = queryString ? `/api/turbine-plans/?${queryString}` : "/api/turbine-plans/";

        const response = await GetDataApiWTGM(endpoint);

        dispatch({
            type: GET_TURBINE_PLANS_SUCCESS,
            payload: response,
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: GET_TURBINE_PLANS_FAILURE,
            payload: errorMsg
        });
        throw error;
    }
};

// Fetch all Component Types (To show in the Consumption Assembly dropdown)
export const GetComponentTypesList =
    (params = "") =>
    async (dispatch) => {
        try {
            dispatch({
                type: GET_COMPONENT_TYPES_REQUEST
            });

            // This hits the endpoint we created in Django
            const response = await GetDataApiWTGM(`/api/component-types/${params}`);

            dispatch({
                type: GET_COMPONENT_TYPES_SUCCESS,
                payload: response,
            });

            return {
                success: true,
                data: response
            };
        } catch (error) {
            const errorMsg = parseErrorMessage(error.response ? .data || error.message);
            dispatch({
                type: GET_COMPONENT_TYPES_FAILURE,
                payload: errorMsg,
            });
            throw error;
        }
    };


// create pole line master data APi Rushi 13-04-2026

export const CREATEPOLELINEMASTER = (data) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_LINE_CUT_POLE_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/pole-master-electrical/",
            data,
        );

        dispatch({
            type: CREATE_LINE_CUT_POLE_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: CREATE_LINE_CUT_POLE_FAILURE,
            payload: errorMsg,
        });
    }
};


// get Create pole line Master Data

// pole-master-electrical

// GET pole line master data APi Rushi 13-04-2026

export const GetPoleLineMasterData = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_POLE_LINE_MASTER_DATA_REQUEST
        });

        // This hits the endpoint we created in Django
        const response = await GetDataApiWTGM("/api/pole-master-electrical/");

        dispatch({
            type: GET_POLE_LINE_MASTER_DATA_SUCCESS,
            payload: response,
        });

        return {
            success: true,
            data: response
        };
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);
        dispatch({
            type: GET_POLE_LINE_MASTER_DATA_FAILURE,
            payload: errorMsg,
        });
        throw error;
    }
};

export const PatchElectricalMasterData = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: PATCH_ELECTRICAL_MASTER_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/electrical-lines-master/${id}/`,
            formData,
        );



        dispatch({
            type: PATCH_ELECTRICAL_MASTER_SUCCESS,
            payload: response.data,
        });

        return response.data;
    } catch (error) {
        const errorMsg =
            error.response ? .data ? .message || error.response ? .data || error.message;

        dispatch({
            type: PATCH_ELECTRICAL_MASTER_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};

export const getTurbinePlannedDates =
    (params = {}) =>
    async (dispatch) => {
        try {
            dispatch({
                type: GET_PLANNED_DATES_REQUEST
            });

            // Example call: /api/turbine-planned-dates/?project=1
            const response = await GetDataApiWTGM("/api/turbine-planned-dates/", {
                params,
            });

            dispatch({
                type: GET_PLANNED_DATES_SUCCESS,
                payload: response,
            });
        } catch (error) {
            const errorMsg = parseErrorMessage(error.response ? .data || error.message);
            dispatch({
                type: GET_PLANNED_DATES_FAILURE,
                payload: errorMsg,
            });
        }
    };

//  uss master Data 





export const CreateUSSMasterData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_USS_MASTER_REQUEST
        });

        const response = await PostDataApiWTGM("/api/uss-master/", formData);

        dispatch({
            type: CREATE_USS_MASTER_SUCCESS,
            payload: response.data, // ✅ usually API returns data inside .data
        });

        return response.data; // ✅ useful for component handling
    } catch (error) {
        const errorMsg =
            error.response ? .data ? .message || error.response ? .data || error.message;

        dispatch({
            type: CREATE_USS_MASTER_FAILURE,
            payload: errorMsg,
        });

        throw error; // ✅ optional: lets UI handle it
    }
};





// electrical Master Data GET API
export const GetUSSMasterData = () => async (dispatch) => {
    try {
        dispatch({
            type: GET_USS_MASTER_REQUEST
        });

        const response = await GetDataApiWTGM("/api/uss-master/");

        dispatch({
            type: GET_USS_MASTER_SUCCESS,
            payload: response,
        });
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: GET_USS_MASTER_FAILURE,
            payload: errorMsg,
        });
    }
};




export const PatchUssMasterData = (id, formData) => async (dispatch) => {

    try {
        dispatch({
            type: PATCH_USS_MASTER_REQUEST
        })

        const response = await PatchDataApiWTGM(
            `/api/uss-master/${id}/`,
            formData
        );

        //  console.log("PATCH RESPONSE USS:", response);

        dispatch({
            type: PATCH_USS_MASTER_SUCCESS,
            payload: response.data,
        });

        return response.data;


    } catch (error) {
        const errorMsg =
            error.response ? .data ? .message ||
            error.response ? .data ||
            error.message;

        dispatch({
            type: PATCH_USS_MASTER_FAILURE,
            payload: errorMsg,
        });

        throw error;


    }

}



export const updateProjectData = (id, data) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_PROJECT_REQUEST
        });

        const response = await PatchDataApiWTGM(`/api/projects/${id}/`, data);

        dispatch({
            type: UPDATE_PROJECT_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: UPDATE_PROJECT_FAILURE,
            payload: errorMsg,
        });

        throw new Error(errorMsg);
    }
};

export const UpdateWindFarmData = (id, formData) => async (dispatch) => {
    try {
        dispatch({
            type: UPDATE_WINDFARM_MASTER_REQUEST
        });

        const response = await PatchDataApiWTGM(
            `/api/windfarm-master/${id}/`,
            formData,
        );

        dispatch({
            type: UPDATE_WINDFARM_MASTER_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(error.response ? .data || error.message);

        dispatch({
            type: UPDATE_WINDFARM_MASTER_FAILURE,
            payload: errorMsg,
        });

        throw new Error(errorMsg);
    }
};