import {

    CREATE_DOCUMENT_REQUEST,
    CREATE_DOCUMENT_SUCCESS,
    CREATE_DOCUMENT_FAILURE,

    FETCH_DOCUMENTS_REQUEST,
    FETCH_DOCUMENTS_SUCCESS,
    FETCH_DOCUMENTS_FAILURE,

    UPDATE_DOCUMENT_REQUEST,
    UPDATE_DOCUMENT_SUCCESS,
    UPDATE_DOCUMENT_FAILURE,

    // INWARD_DOCUMENT_REQUEST,
    // INWARD_DOCUMENT_SUCCESS,
    // INWARD_DOCUMENT_FAILURE,

    SUBMIT_REVIEW_REQUEST,
    SUBMIT_REVIEW_SUCCESS,
    SUBMIT_REVIEW_FAILURE,

    SUBMIT_FOR_ACTION_REQUEST,
    SUBMIT_FOR_ACTION_SUCCESS,
    SUBMIT_FOR_ACTION_FAILURE,

    CONSULTANT_REVIEW_REQUEST,
    CONSULTANT_REVIEW_SUCCESS,
    CONSULTANT_REVIEW_FAILURE,

    UPLOAD_REVISION_REQUEST,
    UPLOAD_REVISION_SUCCESS,
    UPLOAD_REVISION_FAILURE,

    REJECT_DOCUMENT_REQUEST,
    REJECT_DOCUMENT_SUCCESS,
    REJECT_DOCUMENT_FAILURE,

    GET_REVIEW_COMMENTS_REQUEST,
    GET_REVIEW_COMMENTS_SUCCESS,
    GET_REVIEW_COMMENTS_FAILURE,

    GET_VERSIONS_REQUEST,
    GET_VERSIONS_SUCCESS,
    GET_VERSIONS_FAILURE,

    GET_APPROVAL_FLOW_REQUEST,
    GET_APPROVAL_FLOW_SUCCESS,
    GET_APPROVAL_FLOW_FAILURE,

    GET_ALL_DOCUMENTS_COMMENTS_REQUEST,
    GET_ALL_DOCUMENTS_COMMENTS_SUCCESS,
    GET_ALL_DOCUMENTS_COMMENTS_FAILURE,

} from "../../ActionTypes.js";

import parseErrorMessage from "../../../utils/errorFunction.js";
import axiosInstance from "../../../utils/axiosInstance.js";

import {

    GetDataApiWTGM,
    PostDataApiWTGM,
    PutDataApiWTGM,
} from "../../../utils/api.js";



export const CreateDocumentData = (formData) => async (dispatch) => {
    try {
        dispatch({
            type: CREATE_DOCUMENT_REQUEST
        });

        const response = await PostDataApiWTGM(
            "/api/dms/documents/",
            formData
        );

        dispatch({
            type: CREATE_DOCUMENT_SUCCESS,
            payload: response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: CREATE_DOCUMENT_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};


export const GetDocumentsData = () => async (dispatch) => {
    try {
        dispatch({
            type: FETCH_DOCUMENTS_REQUEST
        });

        const response = await GetDataApiWTGM(
            "/api/dms/documents/"
        );

        dispatch({
            type: FETCH_DOCUMENTS_SUCCESS,
            payload: response.results || response,
        });

        return response;
    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: FETCH_DOCUMENTS_FAILURE,
            payload: errorMsg,
        });

        return null;
    }
};


export const UpdateDocumentData =
    (documentId, formData) => async (dispatch) => {
        try {
            dispatch({
                type: UPDATE_DOCUMENT_REQUEST
            });

            const response = await PutDataApiWTGM(
                `/api/dms/documents/${documentId}/`,
                formData
            );

            dispatch({
                type: UPDATE_DOCUMENT_SUCCESS,
                payload: response,
            });

            return response;
        } catch (error) {
            const errorMsg = parseErrorMessage(
                error.response ? .data || error.message
            );

            dispatch({
                type: UPDATE_DOCUMENT_FAILURE,
                payload: errorMsg,
            });

            // IMPORTANT
            throw error;
        }
    };


// export const InwardDocumentData =
//   (documentId, data) => async (dispatch) => {
//     try {

//       dispatch({
//         type: INWARD_DOCUMENT_REQUEST
//       });

//       const response = await PostDataApiDMS(
//         `/api/dms/documents/${documentId}/inward/`,
//         data
//       );

//       dispatch({
//         type: INWARD_DOCUMENT_SUCCESS,
//         payload: response,
//       });

//       return response;

//     } catch (error) {

//       const errorMsg = parseErrorMessage(
//         error.response?.data || error.message
//       );

//       dispatch({
//         type: INWARD_DOCUMENT_FAILURE,
//         payload: errorMsg,
//       });

//       // IMPORTANT
//       throw error;
//     }
// }; 



export const SubmitReviewData =
    (documentId, data) => async (dispatch) => {

        try {

            dispatch({
                type: SUBMIT_REVIEW_REQUEST,
            });

            const response = await PostDataApiWTGM(
                `/api/dms/documents/${documentId}/submit_review/`,
                data
            );

            dispatch({
                type: SUBMIT_REVIEW_SUCCESS,
                payload: response,
            });

            return response;

        } catch (error) {

            dispatch({
                type: SUBMIT_REVIEW_FAILURE,
                payload: error ? .response ? .data ? .error ||
                    error.message,
            });

            throw error;
        }
    };


export const SubmitForActionData =
    (documentId, data) => async (dispatch) => {

        try {

            dispatch({
                type: SUBMIT_FOR_ACTION_REQUEST,
            });

            const response = await PostDataApiWTGM(
                `/api/dms/documents/${documentId}/submit_for_action/`,
                data
            );

            dispatch({
                type: SUBMIT_FOR_ACTION_SUCCESS,
                payload: response,
            });

            return response;

        } catch (error) {

            dispatch({
                type: SUBMIT_FOR_ACTION_FAILURE,
                payload: error ? .response ? .data ? .error ||
                    error.message,
            });

            throw error;
        }
    };


export const ConsultantReviewData =
    (documentId, data) => async (dispatch) => {

        try {

            dispatch({
                type: CONSULTANT_REVIEW_REQUEST,
            });

            const response = await PostDataApiWTGM(
                `/api/dms/documents/${documentId}/consultant_review/`,
                data
            );

            dispatch({
                type: CONSULTANT_REVIEW_SUCCESS,
                payload: response,
            });

            return response;

        } catch (error) {

            const errorMsg = parseErrorMessage(
                error.response ? .data || error.message
            );

            dispatch({
                type: CONSULTANT_REVIEW_FAILURE,
                payload: errorMsg,
            });

            return null;
        }
    };


export const GetReviewCommentsData =
    (documentId, versionId) => async (dispatch) => {

        try {

            dispatch({
                type: GET_REVIEW_COMMENTS_REQUEST,
            });

            const response = await GetDataApiWTGM(
                `/api/dms/review-comments/?document=${documentId}&version=${versionId}`
            );

            dispatch({
                type: GET_REVIEW_COMMENTS_SUCCESS,
                payload: response,
            });

            return response;

        } catch (error) {

            dispatch({
                type: GET_REVIEW_COMMENTS_FAILURE,
                payload: parseErrorMessage(
                    error.response ? .data || error.message
                ),
            });

            return null;
        }
    };


export const GetAllDocumentsCommentsData = (documentId) => async (dispatch) => {
    try {
        dispatch({
            type: GET_ALL_DOCUMENTS_COMMENTS_REQUEST,
        });

        const response = await GetDataApiWTGM(
            `/api/dms/review-comments/?document=${documentId}`
        );

        const commentsData = response ? .results || response || [];

        dispatch({
            type: GET_ALL_DOCUMENTS_COMMENTS_SUCCESS,
            payload: commentsData,
        });

        return commentsData;

    } catch (error) {
        const errorMsg = parseErrorMessage(
            error.response ? .data || error.message
        );

        dispatch({
            type: GET_ALL_DOCUMENTS_COMMENTS_FAILURE,
            payload: errorMsg,
        });

        throw error;
    }
};


export const RejectDocument =
    (documentId, data) => async (dispatch) => {
        try {
            dispatch({
                type: REJECT_DOCUMENT_REQUEST,
            });

            const response = await PostDataApiWTGM(
                `/api/dms/documents/${documentId}/reject/`,
                data
            );

            const rejectedDocument = response ? .data || response;

            dispatch({
                type: REJECT_DOCUMENT_SUCCESS,
                payload: rejectedDocument,
            });

            return rejectedDocument;

        } catch (error) {
            const errorMsg = parseErrorMessage(
                error.response ? .data || error.message
            );

            dispatch({
                type: REJECT_DOCUMENT_FAILURE,
                payload: errorMsg,
            });

            throw error;
        }
    };


export const UploadRevisionData =
    (documentId, formData) => async (dispatch) => {

        try {

            dispatch({
                type: UPLOAD_REVISION_REQUEST,
            });

            const response = await PostDataApiWTGM(
                `/api/dms/documents/${documentId}/upload_revision/`, formData);

            dispatch({
                type: UPLOAD_REVISION_SUCCESS,
                payload: response,
            });

            return response;

        } catch (error) {

            const errorMsg = parseErrorMessage(
                error.response ? .data || error.message
            );

            dispatch({
                type: UPLOAD_REVISION_FAILURE,
                payload: errorMsg,
            });

            return null;
        }
    };


export const CloseComment = (docId, commentId) => async () => {
    return await PostDataApiWTGM(
        `/api/dms/documents/${docId}/close_comment/`, {
            comment_id: commentId,
        }
    );
};


export const GetVersionsData = (documentId) => async (dispatch) => {
    try {
        dispatch({
            type: GET_VERSIONS_REQUEST
        });

        const {
            data
        } = await axiosInstance.get(
            `/api/dms/document-versions/?document=${documentId}`
        );

        dispatch({
            type: GET_VERSIONS_SUCCESS,
            payload: data,
        });

        return data;
    } catch (error) {
        const errorMsg =
            error.response ? .data ? .message || error.message;

        dispatch({
            type: GET_VERSIONS_FAILURE,
            payload: errorMsg,
        });

        return null;
    }
};


export const GetApprovalFlowData = (documentId) => async (dispatch) => {
    try {
        dispatch({
            type: GET_APPROVAL_FLOW_REQUEST
        });

        const {
            data
        } = await axiosInstance.get(
            `/api/dms/approval-steps/?document=${documentId}`
        );

        dispatch({
            type: GET_APPROVAL_FLOW_SUCCESS,
            payload: data,
        });

        return data;
    } catch (error) {
        const errorMsg =
            error.response ? .data ? .message || error.message;

        dispatch({
            type: GET_APPROVAL_FLOW_FAILURE,
            payload: errorMsg,
        });

        return null;
    }
};