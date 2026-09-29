import {
    GET_PROJECT_NESTED_TEMPLATE_REQUEST,
    GET_PROJECT_NESTED_TEMPLATE_SUCCESS,
    GET_PROJECT_NESTED_TEMPLATE_FAILURE,
} from "../ActionTypes";

const initialState = {
    loading: false,
    TemplateNestedData: [],
    error: null,
};

const projectNestedTemplateReducer = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case GET_PROJECT_NESTED_TEMPLATE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case GET_PROJECT_NESTED_TEMPLATE_SUCCESS:
            return {
                ...state,
                loading: false,
                TemplateNestedData: action.payload,
                error: null,
            };

        case GET_PROJECT_NESTED_TEMPLATE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};

export default projectNestedTemplateReducer;