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

    CONSULTANT_REVIEW_REQUEST,
    CONSULTANT_REVIEW_SUCCESS,
    CONSULTANT_REVIEW_FAILURE,

    CLEAR_REVIEW_COMMENTS,

    SUBMIT_FOR_ACTION_REQUEST,
    SUBMIT_FOR_ACTION_SUCCESS,
    SUBMIT_FOR_ACTION_FAILURE,

    UPLOAD_REVISION_REQUEST,
    UPLOAD_REVISION_SUCCESS,
    UPLOAD_REVISION_FAILURE,

    CLEAR_REVISION_STATE,

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

} from "../../ActionTypes"

const initialState = {
    loading: false,

    documentsLoading: false,
    reviewCommentsLoading: false,
    versionsLoading: false,
    approvalFlowLoading: false,
    revisionUploadLoading: false,

    // Document Lists
    documents: [],
    myDocuments: [],

    // Single Action Responses
    createDocumentResponse: null,
    updateDocumentResponse: null,
    deleteDocumentResponse: null,

    // Workflow Data
    revisions: [],
    timeline: [],
    comments: [],
    reviewComments: [],

    revisionUploadResponse: null,
    revisionUploadSuccess: false,

    // Approval Responses
    submitResponse: null,
    approveResponse: null,
    rejectResponse: null,

    // createResponse: null,
    // updateResponse: null,
    versionResponse: null,
    error: null,

    versions: [],
    approvalFlow: [],
    activities: [],

    allDocumentsCommentsLoading: false,
    allDocumentsComments: [],

};

const documentReducer = (state = initialState, action) => {
    switch (action.type) {

        case CREATE_DOCUMENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case CREATE_DOCUMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                createDocumentResponse: action.payload,
                documents: [...state.documents, action.payload],
                error: null,
            };

        case CREATE_DOCUMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        case FETCH_DOCUMENTS_REQUEST:
            return {
                ...state,
                documentsLoading: true,
                error: null,
            };

        case FETCH_DOCUMENTS_SUCCESS:
            return {
                ...state,
                documentsLoading: false,
                documents: action.payload,
                error: null,
            };

        case FETCH_DOCUMENTS_FAILURE:
            return {
                ...state,
                documentsLoading: false,
                error: action.payload,
            };

        case UPDATE_DOCUMENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case UPDATE_DOCUMENT_SUCCESS:
            return {
                ...state,
                loading: false,
                updateDocumentResponse: action.payload,
                documents: state.documents.map((doc) =>
                    doc.id === action.payload.id ? action.payload : doc,
                ),
                myDocuments: state.myDocuments.map((doc) =>
                    doc.id === action.payload.id ? action.payload : doc,
                ),
                error: null,
            };

        case UPDATE_DOCUMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case SUBMIT_REVIEW_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case SUBMIT_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
            };

        case SUBMIT_REVIEW_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        case SUBMIT_FOR_ACTION_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case SUBMIT_FOR_ACTION_SUCCESS:
            return {
                ...state,
                loading: false,
            };

        case SUBMIT_FOR_ACTION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        case CONSULTANT_REVIEW_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case CONSULTANT_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
            };

        case CONSULTANT_REVIEW_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_REVIEW_COMMENTS:
            return {
                ...state,
                reviewComments: [],
            };

        case REJECT_DOCUMENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case REJECT_DOCUMENT_SUCCESS:
            {
                const rejectedDocument = action.payload;

                return {
                    ...state,
                    loading: false,

                    selectedDocument: rejectedDocument,

                    documents: Array.isArray(state.documents) ?
                        state.documents.map((doc) =>
                            doc.id === rejectedDocument.id ?
                            rejectedDocument :
                            doc
                        ) :
                        [],

                    myDocuments: Array.isArray(state.myDocuments) ?
                        state.myDocuments.map((doc) =>
                            doc.id === rejectedDocument.id ?
                            rejectedDocument :
                            doc
                        ) :
                        [],

                    error: null,
                };
            }

        case REJECT_DOCUMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };


        case UPLOAD_REVISION_REQUEST:
            return {
                ...state,
                revisionUploadLoading: true,
                revisionUploadSuccess: false,
                error: null,
            };

        case UPLOAD_REVISION_SUCCESS:
            return {
                ...state,
                revisionUploadLoading: false,
                revisionUploadSuccess: true,
                revisionUploadResponse: action.payload,
                error: null,
            };

        case UPLOAD_REVISION_FAILURE:
            return {
                ...state,
                revisionUploadLoading: false,
                revisionUploadSuccess: false,
                error: action.payload,
            };

        case CLEAR_REVISION_STATE:
            return {
                ...state,
                revisionUploadResponse: null,
                revisionUploadSuccess: false,
                error: null,
            };

        case GET_REVIEW_COMMENTS_REQUEST:
            return {
                ...state,
                reviewCommentsLoading: true,
                error: null,
            };

        case GET_REVIEW_COMMENTS_SUCCESS:
            return {
                ...state,
                reviewCommentsLoading: false,
                reviewComments: action.payload,
                error: null,
            };

        case GET_REVIEW_COMMENTS_FAILURE:
            return {
                ...state,
                reviewCommentsLoading: false,
                error: action.payload,
            };


        case GET_ALL_DOCUMENTS_COMMENTS_REQUEST:
            return {
                ...state,
                allDocumentsCommentsLoading: true,
                error: null,
            };

        case GET_ALL_DOCUMENTS_COMMENTS_SUCCESS:
            return {
                ...state,
                allDocumentsCommentsLoading: false,
                allDocumentsComments: action.payload,
                error: null,
            };

        case GET_ALL_DOCUMENTS_COMMENTS_FAILURE:
            return {
                ...state,
                allDocumentsCommentsLoading: false,
                error: action.payload,
            };


        case GET_VERSIONS_REQUEST:
            return {
                ...state,
                versionsLoading: true,
                error: null,
            };

        case GET_VERSIONS_SUCCESS:
            return {
                ...state,
                versionsLoading: false,
                versions: action.payload ? .results || action.payload,
            };

        case GET_VERSIONS_FAILURE:
            return {
                ...state,
                versionsLoading: false,
                error: action.payload,
            };


        case GET_APPROVAL_FLOW_REQUEST:
            return {
                ...state,
                approvalFlowLoading: true,
                error: null,
            };

        case GET_APPROVAL_FLOW_SUCCESS:
            return {
                ...state,
                approvalFlowLoading: false,
                approvalFlow: action.payload
            };

        case GET_APPROVAL_FLOW_FAILURE:
            return {
                ...state,
                approvalFlowLoading: false,
                error: action.payload
            };

            // case INWARD_DOCUMENT_SUCCESS:
            //   return {
            //     ...state,
            //     loading: false,
            //     submitResponse: action.payload,
            //     documents: state.documents.map((doc) =>
            //       doc.id === action.payload.id ? action.payload : doc,
            //     ),
            //     myDocuments: state.myDocuments.map((doc) =>
            //       doc.id === action.payload.id ? action.payload : doc,
            //     ),
            //     error: null,
            //   };

            // case INWARD_DOCUMENT_FAILURE:
            //   return {
            //     ...state,
            //     loading: false,
            //     error: action.payload,
            //   };


        default:
            return state;
    }
};

export default documentReducer;