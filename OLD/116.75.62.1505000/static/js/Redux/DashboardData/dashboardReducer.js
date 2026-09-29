import {
    FETCH_TURBINE_ACTIVITY_REPORT_REQUEST,
    FETCH_TURBINE_ACTIVITY_REPORT_SUCCESS,
    FETCH_TURBINE_ACTIVITY_REPORT_FAILURE,
    FETCH_TURBINE_ACTIVITY_AGGREGATION_REQUEST,
    FETCH_TURBINE_ACTIVITY_AGGREGATION_SUCCESS,
    FETCH_TURBINE_ACTIVITY_AGGREGATION_FAILURE,
    FETCH_DPR_DATA_REQUEST,
    FETCH_DPR_DATA_SUCCESS,
    FETCH_DPR_DATA_FAILURE,
    FETCH_TURBINE_FULL_DATA_REQUEST,
    FETCH_TURBINE_FULL_DATA_SUCCESS,
    FETCH_TURBINE_FULL_DATA_FAILURE,
    FETCH_FOUNDATION_SUMMARY_REQUEST,
    FETCH_FOUNDATION_SUMMARY_SUCCESS,
    FETCH_FOUNDATION_SUMMARY_FAILURE,
    FETCH_WTG_SUMMARY_REQUEST,
    FETCH_WTG_SUMMARY_SUCCESS,
    FETCH_WTG_SUMMARY_FAILURE,
    GET_ROAD_SUMMARY_REQUEST,
    GET_ROAD_SUMMARY_SUCCESS,
    GET_ROAD_SUMMARY_FAILURE,
    FETCH_TIMELINE_DATA_REQUEST,
    FETCH_TIMELINE_DATA_SUCCESS,
    FETCH_TIMELINE_DATA_FAILURE,
    GET_DELAY_SUMMARY_REQUEST,
    GET_DELAY_SUMMARY_SUCCESS,
    GET_DELAY_SUMMARY_FAILURE,
    GET_NOTIFICATIONS_REQUEST,
    GET_NOTIFICATIONS_SUCCESS,
    GET_NOTIFICATIONS_FAIL,
    MARK_NOTIFICATION_READ,
    FETCH_WTG_DPR_REQUEST,
    FETCH_WTG_DPR_SUCCESS,
    FETCH_WTG_DPR_FAILURE,
} from "../ActionTypes";

const initialState = {
    loading: false,
    fullData: [],
    dprTotalCount: 0,
    reportData: [],
    data: {},
    dprData: [],
    loadingDPR: false,
    errorDPR: null,

    wtgDprData: [],
    wtgDprTotalCount: 0,
    loadingWtgDPR: false,
    errorWtgDPR: null,

    roadSummary: {},
    statistics: {
        totalTurbines: 0,
        completedStages: {},
        completionRate: 0,
        totalFoundations: 0,
        pendingFoundations: 0,
    },
    progressData: [],
    turbineList: [],
    recentActivities: [],

    wtgData: {
        metrics: [],
        activities: [],
        recentActivities: [],
        turbineList: [],
    },
    timelineData: [],
    delaySummary: {
        summary: {
            total_days: 0,
            total_incidents: 0
        },
        cause_distribution: [],
        turbine_drilldown: [],
        project_delays: [], // Data for Project-wise Bar Chart
        windfarm_delays: [], // Data for Windfarm-wise Bar Chart
        monthly_trend: [],
    },
    notifications: [],
    count: 0,
    needsRefresh: false,
    delayLoading: false,
    summaryLoading: false,
    error: null,
};

export const dashboardDataReducer = (state = initialState, action) => {
    switch (action.type) {

        case FETCH_TURBINE_ACTIVITY_REPORT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_TURBINE_ACTIVITY_REPORT_SUCCESS:
            return {
                ...state,
                loading: false,
                reportData: action.payload,
            };

        case FETCH_TURBINE_ACTIVITY_REPORT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case FETCH_TURBINE_ACTIVITY_AGGREGATION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_TURBINE_ACTIVITY_AGGREGATION_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };

        case FETCH_TURBINE_ACTIVITY_AGGREGATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

            // --- UNIFIED DPR CASES ---
        case FETCH_DPR_DATA_REQUEST:
            return {
                ...state,
                loadingDPR: true,
                errorDPR: null
            };
        case FETCH_DPR_DATA_SUCCESS:

            return {
                ...state,
                loadingDPR: false,
                dprData: action.payload.data || (Array.isArray(action.payload) ? action.payload : []),
                dprTotalCount: action.payload.total_count || 0,
                errorDPR: null
            };
        case FETCH_DPR_DATA_FAILURE:
            return {
                ...state,
                loadingDPR: false,
                errorDPR: action.payload
            };


        case FETCH_TURBINE_FULL_DATA_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };

        case FETCH_TURBINE_FULL_DATA_SUCCESS:
            return {
                ...state,
                locationoading: false,
                fullData: action.payload
            };

        case FETCH_TURBINE_FULL_DATA_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };


        case FETCH_FOUNDATION_SUMMARY_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case FETCH_FOUNDATION_SUMMARY_SUCCESS:
            // console.log("REDUCER CHECK - action.payload:", action.payload);
            return {
                ...state,
                loading: false,
                statistics: action.payload.statistics,
                progressData: action.payload.progressData || [],
                turbineList: action.payload.turbineList || [],
                recentActivities: action.payload.recentActivities || [],
                error: null
            };

        case FETCH_FOUNDATION_SUMMARY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_WTG_SUMMARY_REQUEST:
            return { ...state,
                loading: true,
                error: null
            };
        case FETCH_WTG_SUMMARY_SUCCESS:
            return { ...state,
                loading: false,
                wtgData: action.payload
            };
        case FETCH_WTG_SUMMARY_FAILURE:
            return { ...state,
                loading: false,
                error: action.payload
            };

        case GET_ROAD_SUMMARY_REQUEST:
            return { ...state,
                loading: true
            };

        case GET_ROAD_SUMMARY_SUCCESS:
            return {
                ...state,
                loading: false,
                roadSummary: action.payload, // This holds completed_km, pending_km, etc.
                error: null
            };

        case GET_ROAD_SUMMARY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case FETCH_TIMELINE_DATA_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_TIMELINE_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                timelineData: action.payload,
                error: null,
            };

        case FETCH_TIMELINE_DATA_FAILURE:
            return {
                ...state,
                loading: false,
                timelineData: [],
                error: action.payload,
            };

        case GET_DELAY_SUMMARY_REQUEST:
            return { ...state,
                summaryLoading: true
            };

        case GET_DELAY_SUMMARY_SUCCESS:
            return {
                ...state,
                summaryLoading: false,
                delaySummary: action.payload,
                error: null
            };

        case GET_DELAY_SUMMARY_FAILURE:
            return { ...state,
                summaryLoading: false,
                error: action.payload
            };

            // --------------------
        case GET_NOTIFICATIONS_REQUEST:

            return {

                ...state,

                loading: true,

                error: null,

            };


        case GET_NOTIFICATIONS_SUCCESS:

            return {

                ...state,

                loading: false,

                notifications: action.payload.notifications,

                count: action.payload.count,

                needsRefresh: false,

            };

        case GET_NOTIFICATIONS_FAIL:

            return {

                ...state,

                loading: false,

                error: action.payload,

            };

        case MARK_NOTIFICATION_READ:
            {

                const updatedNotifications = state.notifications.filter(

                    (n) => n.id !== action.payload,

                );

                return {

                    ...state,

                    notifications: updatedNotifications,

                    count: updatedNotifications.length,

                };

            }

        case "NOTIFICATIONS_REFRESH":

            return {

                ...state,

                needsRefresh: true,

            };


        case FETCH_WTG_DPR_REQUEST:
            return {
                ...state,
                loadingWtgDPR: true,
                errorWtgDPR: null
            };
        case FETCH_WTG_DPR_SUCCESS:
            return {
                ...state,
                loadingWtgDPR: false,
                // Automatically extracts the nested array or falls back safely
                wtgDprData: action.payload.data || (Array.isArray(action.payload) ? action.payload : []),
                wtgDprTotalCount: action.payload.total_count || 0,
                errorWtgDPR: null
            };
        case FETCH_WTG_DPR_FAILURE:
            return {
                ...state,
                loadingWtgDPR: false,
                errorWtgDPR: action.payload
            };


        default:
            return state;
    }
};