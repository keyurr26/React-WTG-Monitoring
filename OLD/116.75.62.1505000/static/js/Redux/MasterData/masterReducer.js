import {
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
    GET_MATERIAL_MASTER_REQUEST,
    GET_MATERIAL_MASTER_SUCCESS,
    GET_MATERIAL_MASTER_FAILURE,
    CREATE_USER_MASTER_REQUEST,
    CREATE_USER_MASTER_SUCCESS,
    CREATE_USER_MASTER_FAILURE,
    FETCH_USER_MASTER_REQUEST,
    FETCH_USER_MASTER_SUCCESS,
    FETCH_USER_MASTER_FAILURE,
    CREATE_USER_ACCESS_REQUEST,
    CREATE_USER_ACCESS_SUCCESS,
    CREATE_USER_ACCESS_FAILURE,
    FETCH_USER_ACCESS_REQUEST,
    FETCH_USER_ACCESS_SUCCESS,
    FETCH_USER_ACCESS_FAILURE,
    FETCH_CONTRACTORS_REQUEST,
    FETCH_CONTRACTORS_SUCCESS,
    FETCH_CONTRACTORS_FAILURE,
    POST_CONTRACTOR_REQUEST,
    POST_CONTRACTOR_SUCCESS,
    POST_CONTRACTOR_FAILURE,
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
    FETCH_INSPECTORS_REQUEST,
    FETCH_INSPECTORS_SUCCESS,
    FETCH_INSPECTORS_FAILURE,
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
    UPDATE_SPARE_PROVISION_PLAN_REQUEST,
    UPDATE_SPARE_PROVISION_PLAN_SUCCESS,
    UPDATE_SPARE_PROVISION_PLAN_FAILURE,
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
    CREATE_PROJECT_TRANSFER_REQUEST,
    CREATE_PROJECT_TRANSFER_SUCCESS,
    CREATE_PROJECT_TRANSFER_FAIL,
    GET_PROJECT_TRANSFER_REQUEST,
    GET_PROJECT_TRANSFER_SUCCESS,
    GET_PROJECT_TRANSFER_FAIL,
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
    CREATE_ELECTRICAL_MASTER_REQUEST,
    CREATE_ELECTRICAL_MASTER_SUCCESS,
    CREATE_ELECTRICAL_MASTER_FAILURE,
    GET_ELECTRICAL_MASTER_REQUEST,
    GET_ELECTRICAL_MASTER_SUCCESS,
    GET_ELECTRICAL_MASTER_FAILURE,
    CREATE_TURBINE_PLAN_REQUEST,
    CREATE_TURBINE_PLAN_SUCCESS,
    CREATE_TURBINE_PLAN_FAILURE,
    GET_TURBINE_PLANS_REQUEST,
    GET_TURBINE_PLANS_SUCCESS,
    GET_TURBINE_PLANS_FAILURE,
    GET_COMPONENT_TYPES_REQUEST,
    GET_COMPONENT_TYPES_SUCCESS,
    GET_COMPONENT_TYPES_FAILURE,
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

} from "../ActionTypes";

const initialState = {
    loading: false,
    patchLoading: false,
    success: false,
    accesses: [], // list of user accesses
    createSuccess: false,
    createdAccess: null,
    project: null, // for a single created project
    projects: [],
    WindfarmData: [],
    componentTypesList: [],
    GETmaterialMaster: [],
    GETTurbineData: [],
    FetchUsermasterData: [],
    FetchMaterialRecivedData: [],
    MaterialIssueData: [],
    ContractorData: [],
    inspectors: [],
    getUssMaster: [],
    materialIssue: null,
    materialMaster: null,
    materialRecived: null,
    stockSummary: [],
    inventoryPlans: [],
    spareProvisionPlans: [],
    createSuccess: false,
    UsermasterData: null,
    windfarmcreate: null,
    downloadSuccess: false,
    vendorData: [],
    WTGMakeModelData: [],
    projectTransfers: [],
    newTransfer: null,
    materialReturnNotes: [],
    MaterialRejectList: [],
    activitySchedule: [],
    attachmentList: [],
    documentList: [],
    loadingList: false,
    loadingCreate: false,
    loadingTemplate: false,
    loadingBulkUpload: false,
    kpiList: [],
    activityFields: [],
    ElectricalMasterdata: null,
    getElectricalMaster: [],
    turbinePlansList: [],
    polemasterData: null,
    getpoleMasterData: [],
    activityPlannedDates: [],
    USSMasterdata: null,
    getUssMaster: [],
    error: null,
};

export const MasterDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_PROJECT_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_PROJECT_SUCCESS:
            return {
                ...state,

                loading: false,

                // success: true,

                projects: [action.payload, ...state.projects],

                // project: action.payload,

                error: null,
            };

        case CREATE_PROJECT_FAILURE:
            return {
                ...state,

                loading: false,

                // success: false,

                error: action.payload,
            };

        case FETCH_PROJECTS_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_PROJECTS_SUCCESS:
            return {
                ...state,

                loading: false,

                projects: action.payload,

                error: null,
            };

        case FETCH_PROJECTS_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_WINDFAM_MASTER_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_WINDFAM_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                WindfarmData: action.payload,

                error: null,
            };

        case FETCH_WINDFAM_MASTER_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case CREATE_WINFFARM_MASTER_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_WINFFARM_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                windfarmcreate: action.payload,

                error: null,
            };

        case CREATE_WINFFARM_MASTER_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case CREATE_MATERIAL_MASTER_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_MATERIAL_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                materialMaster: action.payload,

                error: null,
            };

        case CREATE_MATERIAL_MASTER_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case GET_MATERIAL_MASTER_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case GET_MATERIAL_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                GETmaterialMaster: action.payload,

                error: null,
            };

        case GET_MATERIAL_MASTER_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case CREATE_USER_MASTER_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_USER_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                UsermasterData: action.payload,

                error: null,
            };

        case CREATE_USER_MASTER_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_USER_MASTER_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_USER_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                FetchUsermasterData: action.payload,

                error: null,
            };

        case FETCH_USER_MASTER_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case CREATE_USER_ACCESS_REQUEST:
            return {
                ...state,

                loading: true,

                createSuccess: false,

                error: null,
            };

        case CREATE_USER_ACCESS_SUCCESS:
            return {
                ...state,

                loading: false,

                createSuccess: true,

                createdAccess: action.payload, // array (keep it)

                accesses: [
                    ...state.accesses,

                    ...action.payload, // ✅ spread array
                ],
            };

        case CREATE_USER_ACCESS_FAILURE:
            return {
                ...state,

                loading: false,

                createSuccess: false,

                error: action.payload,
            };

            // ------------------ FETCH ------------------

        case FETCH_USER_ACCESS_REQUEST:
            return {
                ...state,

                loading: true,

                error: null,
            };

        case FETCH_USER_ACCESS_SUCCESS:
            return {
                ...state,

                loading: false,

                accesses: action.payload,

                error: null,
            };

        case FETCH_USER_ACCESS_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

        case FETCH_CONTRACTORS_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_CONTRACTORS_SUCCESS:
            return { ...state,
                loading: false,
                ContractorData: action.payload
            };

        case FETCH_CONTRACTORS_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case POST_CONTRACTOR_REQUEST:
            return {
                ...state,

                postLoading: true,

                postError: null,

                postSuccess: false,
            };

        case POST_CONTRACTOR_SUCCESS:
            return { ...state,
                postLoading: false,
                postSuccess: true
            };

        case POST_CONTRACTOR_FAILURE:
            return {
                ...state,

                postLoading: false,

                postError: action.payload,

                postSuccess: false,
            };

        case FETCH_INSPECTORS_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_INSPECTORS_SUCCESS:
            return { ...state,
                loading: false,
                inspectors: action.payload
            };

        case FETCH_INSPECTORS_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_VENDOR_REQUEST:
            return { ...state,
                loading: true
            };

        case FETCH_VENDOR_SUCCESS:
            return { ...state,
                loading: false,
                vendorData: action.payload
            };

        case FETCH_VENDOR_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case CREATE_VENDOR_REQUEST:
            return { ...state,
                loading: true
            };

        case CREATE_VENDOR_SUCCESS:
            return {
                ...state,

                loading: false,

                vendorData: [action.payload, ...state.vendorData], // add new at top
            };

        case CREATE_VENDOR_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

            // UPDATE CONTRACTOR

        case UPDATE_CONTRACTOR_REQUEST:
            return {
                ...state,

                updateLoading: true,

                updateError: null,

                updateSuccess: false,
            };

        case UPDATE_CONTRACTOR_SUCCESS:
            return { ...state,
                updateLoading: false,
                updateSuccess: true
            };

        case UPDATE_CONTRACTOR_FAILURE:
            return {
                ...state,

                updateLoading: false,

                updateError: action.payload,

                updateSuccess: false,
            };

            // DELETE CONTRACTOR

        case DELETE_CONTRACTOR_REQUEST:
            return {
                ...state,

                deleteLoading: true,

                deleteError: null,

                deleteSuccess: false,
            };

        case DELETE_CONTRACTOR_SUCCESS:
            return { ...state,
                deleteLoading: false,
                deleteSuccess: true
            };

        case DELETE_CONTRACTOR_FAILURE:
            return {
                ...state,

                deleteLoading: false,

                deleteError: action.payload,

                deleteSuccess: false,
            };

            //  download template for material master

        case "DOWNLOAD_TEMPLATE_REQUEST":
            return { ...state,
                loading: true
            };

        case "DOWNLOAD_TEMPLATE_SUCCESS":
            return { ...state,
                loading: false,
                downloadSuccess: true
            };

        case "DOWNLOAD_TEMPLATE_FAILURE":
            return { ...state,
                loading: false,
                error: action.payload
            };

            // ✅ DOWNLOAD TEMPLATE

        case "DOWNLOAD_VENDOR_TEMPLATE_REQUEST":
            return { ...state,
                loading: true,
                error: null
            };

        case "DOWNLOAD_VENDOR_TEMPLATE_SUCCESS":
            return { ...state,
                loading: false,
                success: true
            };

        case "DOWNLOAD_VENDOR_TEMPLATE_FAILURE":
            return { ...state,
                loading: false,
                error: action.payload
            };

            // ✅ BULK UPLOAD

        case "BULK_VENDOR_UPLOAD_REQUEST":
            return { ...state,
                loading: true,
                success: false,
                error: null
            };

        case "BULK_VENDOR_UPLOAD_SUCCESS":
            return {
                ...state,

                loading: false,

                success: true,

                uploadedData: action.payload,
            };

        case "BULK_VENDOR_UPLOAD_FAILURE":
            return { ...state,
                loading: false,
                error: action.payload
            };

        case GET_WTG_MAKE_MODEL_REQUEST:
            return {
                ...state,

                loadingList: true,

                error: null,
            };

        case GET_WTG_MAKE_MODEL_SUCCESS:
            return {
                ...state,

                loadingList: false,

                WTGMakeModelData: action.payload,
            };

        case GET_WTG_MAKE_MODEL_FAILURE:
            return {
                ...state,

                loadingList: false,

                error: action.payload,
            };

            /* ================= CREATE ================= */

        case CREATE_WTG_MAKE_MODEL_REQUEST:
            return {
                ...state,

                loadingCreate: true,

                error: null,
            };

        case CREATE_WTG_MAKE_MODEL_SUCCESS:
            return {
                ...state,

                loadingCreate: false,
            };

        case CREATE_WTG_MAKE_MODEL_FAILURE:
            return {
                ...state,

                loadingCreate: false,

                error: action.payload,
            };

            /* ================= TEMPLATE DOWNLOAD ================= */

        case DOWNLOAD_WTG_TEMPLATE_REQUEST:
            return {
                ...state,

                loadingTemplate: true,

                error: null,
            };

        case DOWNLOAD_WTG_TEMPLATE_SUCCESS:
            return {
                ...state,

                loadingTemplate: false,
            };

        case DOWNLOAD_WTG_TEMPLATE_FAILURE:
            return {
                ...state,

                loadingTemplate: false,

                error: action.payload,
            };

            /* ================= BULK UPLOAD ================= */

        case BULK_UPLOAD_WTG_REQUEST:
            return {
                ...state,

                loadingBulkUpload: true,

                error: null,
            };

        case BULK_UPLOAD_WTG_SUCCESS:
            return {
                ...state,

                loadingBulkUpload: false,
            };

        case BULK_UPLOAD_WTG_FAILURE:
            return {
                ...state,

                loadingBulkUpload: false,

                error: action.payload,
            };

        case CREATE_MATERIAL_RECIVED_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_MATERIAL_RECIVED_SUCCESS:
            return {
                ...state,

                loading: false,

                materialRecived: action.payload,

                error: null,
            };

        case CREATE_MATERIAL_RECIVED_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_MATERIAL_RECEVIED_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_MATERIAL_RECEVIED_SUCCESS:
            return {
                ...state,

                loading: false,

                FetchMaterialRecivedData: action.payload,

                error: null,
            };

        case FETCH_MATERIAL_RECEVIED_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_MATERIAL_ISSUE_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_MATERIAL_ISSUE_SUCCESS:
            return {
                ...state,

                loading: false,

                MaterialIssueData: action.payload,

                error: null,
            };

        case FETCH_MATERIAL_ISSUE_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case CREATE_MATERIAL_ISSUE_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_MATERIAL_ISSUE_SUCCESS:
            return {
                ...state,

                loading: false,

                materialIssue: action.payload,

                error: null,
            };

        case CREATE_MATERIAL_ISSUE_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_MATERIAL_STOCK_SUMMARY_REQUEST:
            return {
                ...state,

                loading: true,

                error: null,
            };

        case FETCH_MATERIAL_STOCK_SUMMARY_SUCCESS:
            return {
                ...state,

                loading: false,

                stockSummary: action.payload,
            };

        case FETCH_MATERIAL_STOCK_SUMMARY_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

        case CREATE_INVENTORY_PLAN_REQUEST:
            return {
                ...state,

                loading: true,

                createSuccess: false,

                error: null,
            };

        case CREATE_INVENTORY_PLAN_SUCCESS:
            return {
                ...state,

                loading: false,

                createSuccess: true,

                inventoryPlans: [...state.inventoryPlans, action.payload], // append new
            };

        case CREATE_INVENTORY_PLAN_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

            // 🔵 GET All Inventory Plans

        case FETCH_INVENTORY_PLAN_REQUEST:
            return {
                ...state,

                loading: true,

                error: null,
            };

        case FETCH_INVENTORY_PLAN_SUCCESS:
            return {
                ...state,

                loading: false,

                inventoryPlans: action.payload, // full list update
            };

        case FETCH_INVENTORY_PLAN_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

        case CREATE_SPARE_PROVISION_PLAN_REQUEST:
            return {
                ...state,

                loading: true,

                error: null,
            };

        case CREATE_SPARE_PROVISION_PLAN_SUCCESS:
            return {
                ...state,

                loading: false,

                spareProvisionPlans: [...state.spareProvisionPlans, action.payload],
            };

        case CREATE_SPARE_PROVISION_PLAN_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

        case FETCH_SPARE_PROVISION_PLAN_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_SPARE_PROVISION_PLAN_SUCCESS:
            return {
                ...state,

                loading: false,

                spareProvisionPlans: action.payload,

                error: null,
            };

        case FETCH_SPARE_PROVISION_PLAN_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

            //        UPDATE RECORD

        case UPDATE_SPARE_PROVISION_PLAN_REQUEST:
            return {
                ...state,

                loading: true,

                error: null,
            };

        case UPDATE_SPARE_PROVISION_PLAN_SUCCESS:
            return {
                ...state,

                loading: false,

                spareProvisionPlans: state.spareProvisionPlans.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                ),
            };

        case UPDATE_SPARE_PROVISION_PLAN_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

        case CREATE_PROJECT_TRANSFER_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_PROJECT_TRANSFER_SUCCESS:
            return {
                ...state,

                loading: false,

                newTransfer: action.payload,

                projectTransfers: [action.payload, ...state.projectTransfers], // add to list
            };

        case CREATE_PROJECT_TRANSFER_FAIL:
            return { ...state,
                loading: false,
                error: action.payload
            };

            // 🟢 GET TRANSFERS LIST

        case GET_PROJECT_TRANSFER_REQUEST:
            return {
                ...state,

                loading: true,

                error: null,
            };

        case GET_PROJECT_TRANSFER_SUCCESS:
            return {
                ...state,

                loading: false,

                projectTransfers: action.payload,
            };

        case GET_PROJECT_TRANSFER_FAIL:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

        case CREATE_MATERIAL_RETURN_REQUEST:
            return { ...state,
                loading: true
            };

        case CREATE_MATERIAL_RETURN_SUCCESS:
            return {
                ...state,

                loading: false,

                materialReturnNotes: [action.payload, ...state.materialReturnNotes],
            };

        case CREATE_MATERIAL_RETURN_FAIL:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case GET_MATERIAL_RETURN_REQUEST:
            return { ...state,
                loading: true
            };

        case GET_MATERIAL_RETURN_SUCCESS:
            return {
                ...state,

                loading: false,

                materialReturnNotes: action.payload,
            };

        case GET_MATERIAL_RETURN_FAIL:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case CREATE_MATERIAL_REJECT_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_MATERIAL_REJECT_SUCCESS:
            return {
                ...state,

                creating: false,

                MaterialRejectList: [...state.MaterialRejectList, action.payload],
            };

        case CREATE_MATERIAL_REJECT_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

            // GET LIST

        case GET_MATERIAL_REJECT_REQUEST:
            return { ...state,
                loading: true
            };

        case GET_MATERIAL_REJECT_SUCCESS:
            return {
                ...state,

                loading: false,

                MaterialRejectList: action.payload,
            };

        case GET_MATERIAL_REJECT_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

        case CREATE_ACTIVITY_SCHEDULE_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case CREATE_ACTIVITY_SCHEDULE_SUCCESS:
            return {
                ...state,

                loading: false,

                activitySchedule: [...state.activitySchedule, action.payload],
            };

        case CREATE_ACTIVITY_SCHEDULE_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case GET_ACTIVITY_SCHEDULE_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case GET_ACTIVITY_SCHEDULE_SUCCESS:
            return {
                ...state,

                loading: false,

                activitySchedule: action.payload,
            };

        case GET_ACTIVITY_SCHEDULE_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case CREATE_ATTACHMENT_MASTER_REQUEST:
            return {
                ...state,

                loading: true,

                success: false,

                error: null,
            };

        case CREATE_ATTACHMENT_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                success: true,

                // Optional: Append the newly created item to the list immediately

                attachmentList: [...state.attachmentList, action.payload],

                error: null,
            };

        case CREATE_ATTACHMENT_MASTER_FAILURE:
            return {
                ...state,

                loading: false,

                success: false,

                error: action.payload,
            };

            // --- GET LIST ACTIONS ---

        case GET_ATTACHMENT_MASTER_REQUEST:
            return {
                ...state,

                loading: true,

                error: null,
            };

        case GET_ATTACHMENT_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                attachmentList: action.payload,

                error: null,
            };

        case GET_ATTACHMENT_MASTER_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

        case CREATE_DOCUMENT_UPLOAD_REQUEST:
            return {
                ...state,

                loading: true,

                success: false,

                error: null,
            };

        case CREATE_DOCUMENT_UPLOAD_SUCCESS:
            return {
                ...state,

                loading: false,

                success: true,

                documentList: [action.payload, ...state.documentList],

                error: null,
            };

        case CREATE_DOCUMENT_UPLOAD_FAILURE:
            return {
                ...state,

                loading: false,

                success: false,

                error: action.payload,
            };

            // --- Added GET cases below ---

        case GET_DOCUMENT_UPLOAD_REQUEST:
            return { ...state,
                loading: true
            };

        case GET_DOCUMENT_UPLOAD_SUCCESS:
            return { ...state,
                loading: false,
                documentList: action.payload
            };

        case GET_DOCUMENT_UPLOAD_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case GET_ACTIVITY_FIELDS_REQUEST:
            return { ...state,
                loading: true,
                activityFields: []
            };

        case GET_ACTIVITY_FIELDS_SUCCESS:
            return {
                ...state,

                loading: false,

                activityFields: action.payload, // [{value: '...', label: '...'}]
            };

        case GET_ACTIVITY_FIELDS_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

            // --- 2. CREATING A NEW KPI RULE ---

        case CREATE_KPI_MASTER_REQUEST:
            return { ...state,
                loading: true
            };

        case CREATE_KPI_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                success: true,

                kpiList: [...state.kpiList, action.payload],
            };

        case CREATE_KPI_MASTER_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,

                success: false,
            };

            // --- 3. FETCHING THE LIST OF ALL RULES ---

        case GET_KPI_MASTER_REQUEST:
            return { ...state,
                loading: true
            };

        case GET_KPI_MASTER_SUCCESS:
            return { ...state,
                loading: false,
                kpiList: action.payload
            };

        case GET_KPI_MASTER_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

            // --- 4. UPDATING A KPI RULE

        case UPDATE_KPI_MASTER_REQUEST:
            return { ...state,
                loading: true,
                success: false
            };

        case UPDATE_KPI_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                success: true,

                // We find the old record in the list and replace it with the NEW version

                // This ensures the table ID and data refresh immediately

                kpiList: state.kpiList.map((item) =>
                    item.id === action.oldId ? action.payload : item,
                ),
            };

        case UPDATE_KPI_MASTER_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,

                success: false,
            };

            // --- 5. DELETING A KPI RULE (Soft Delete) ---

        case DELETE_KPI_MASTER_REQUEST:
            return { ...state,
                loading: true
            };

        case DELETE_KPI_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                success: true,

                // Simply remove the record from the current UI list

                kpiList: state.kpiList.filter((item) => item.id !== action.payload),
            };

        case DELETE_KPI_MASTER_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

            // create electrical master Data

        case CREATE_ELECTRICAL_MASTER_REQUEST:
            return {
                ...state,

                loading: true,

                success: false,

                error: null,
            };

        case CREATE_ELECTRICAL_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                success: true,

                ElectricalMasterdata: action.payload,
            };

        case CREATE_ELECTRICAL_MASTER_FAILURE:
            return {
                ...state,

                loading: false,

                success: false,

                error: action.payload,
            };

        case GET_ELECTRICAL_MASTER_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case GET_ELECTRICAL_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                getElectricalMaster: action.payload,
            };

        case GET_ELECTRICAL_MASTER_FAILURE:
            return { ...state,
                loading: false,
                error: action.Payload
            };

            // aarti 10-04-2026

        case CREATE_TURBINE_PLAN_REQUEST:
            return { ...state,
                loading: true
            };

        case CREATE_TURBINE_PLAN_SUCCESS:
            return {
                ...state,

                loading: false,

                success: true,

                turbinePlansList: [...state.turbinePlansList, action.payload],

                error: null,
            };

        case CREATE_TURBINE_PLAN_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,

                success: false,
            };

            // --- 2. FETCHING THE LIST OF ALL PLANS ---

        case GET_TURBINE_PLANS_REQUEST:
            return { ...state,
                loading: true
            };

        case GET_TURBINE_PLANS_SUCCESS:
            return {
                ...state,

                loading: false,

                turbinePlansList: action.payload,

                error: null,
            };

        case GET_TURBINE_PLANS_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

        case GET_COMPONENT_TYPES_REQUEST:
            return { ...state,
                loading: true
            };

        case GET_COMPONENT_TYPES_SUCCESS:
            return {
                ...state,

                loading: false,

                componentTypesList: action.payload,
            };

        case GET_COMPONENT_TYPES_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

            //  rushi 13-04-2026

        case CREATE_LINE_CUT_POLE_REQUEST:
            return {
                ...state,

                loading: true,

                success: false,

                error: null,
            };

        case CREATE_LINE_CUT_POLE_SUCCESS:
            return {
                ...state,

                loading: false,

                success: true,

                polemasterData: action.payload,
            };

        case CREATE_LINE_CUT_POLE_FAILURE:
            return {
                ...state,

                loading: false,

                success: false,

                error: action.payload,
            };

            //rushi 13-04-2026

        case GET_POLE_LINE_MASTER_DATA_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case GET_POLE_LINE_MASTER_DATA_SUCCESS:
            return {
                ...state,

                loading: false,

                getpoleMasterData: action.payload,
            };

        case GET_POLE_LINE_MASTER_DATA_FAILURE:
            return { ...state,
                loading: false,
                error: action.Payload
            };

        case PATCH_ELECTRICAL_MASTER_REQUEST:
            return {
                ...state,

                // loading: true,

                patchLoading: true,
            };

        case PATCH_ELECTRICAL_MASTER_SUCCESS:
            return {
                ...state,

                // loading: false,

                patchLoading: false,

                getElectricalMaster: Array.isArray(state.getElectricalMaster) ?
                    state.getElectricalMaster.map((item) =>
                        item.id === action.payload ? .id ?
                        { ...item,
                            ...action.payload
                        } :
                        item,
                    ) :
                    [],
            };

        case PATCH_ELECTRICAL_MASTER_FAILURE:
            return {
                ...state,

                // loading: false,

                patchLoading: false,

                error: action.payload,
            };

        case GET_PLANNED_DATES_REQUEST:
            return { ...state,
                loading: true
            };

        case GET_PLANNED_DATES_SUCCESS:
            return { ...state,
                loading: false,
                activityPlannedDates: action.payload
            };

        case GET_PLANNED_DATES_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

            // uss master Shyam

        case CREATE_USS_MASTER_REQUEST:
            return {
                ...state,

                loading: true,

                success: false,

                error: null,
            };

        case CREATE_USS_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                success: true,

                USSMasterdata: action.payload,
            };

        case CREATE_USS_MASTER_FAILURE:
            return {
                ...state,

                loading: false,

                success: false,

                error: action.payload,
            };

        case GET_USS_MASTER_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case GET_USS_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                getUssMaster: action.payload,
            };

        case GET_USS_MASTER_FAILURE:
            return { ...state,
                loading: false,
                error: action.Payload
            };

        case UPDATE_PROJECT_REQUEST:
            return {
                ...state,

                loading: true,

                error: null,
            };

        case UPDATE_PROJECT_SUCCESS:
            return {
                ...state,

                loading: false,

                error: null,

                // 🔥 update list instantly (no refresh needed)

                projects: state.projects.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                ),
            };

        case UPDATE_PROJECT_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

        case UPDATE_WINDFARM_MASTER_REQUEST:
            return {
                ...state,

                loading: true,

                error: null,
            };

        case UPDATE_WINDFARM_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                error: null,

                WindfarmData: state.WindfarmData.map((item) =>
                    item.id === action.payload.id ? action.payload : item,
                ),
            };

        case UPDATE_WINDFARM_MASTER_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };

        case PATCH_USS_MASTER_REQUEST:
            return {
                ...state,

                loading: true,
            };

        case PATCH_USS_MASTER_SUCCESS:
            return {
                ...state,

                loading: false,

                getUssMaster: Array.isArray(state.getUssMaster) ?
                    state.getUssMaster.map((item) =>
                        item.id === action.payload ? .id ?
                        { ...item,
                            ...action.payload
                        } :
                        item,
                    ) :
                    [],
            };

        case PATCH_USS_MASTER_FAILURE:
            return {
                ...state,

                loading: false,

                error: action.payload,
            };


        default:
            return state;
    }
};