import {
    Tabs,
    Tab,
    Box
} from "@mui/material";
import {
    useState,
    useMemo,
    memo,
    useEffect
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import RoadOverview from "../pages/Road/RoadOverview";
import DailyRoadTable from "../pages/Road/DailyLogRoad";
import {
    GetInspectors
} from "../Redux/MasterData/masterAction";
import {
    getNestedProjects
} from "../Redux/InstallationData/CartRoadData/cartroadAction";

const ROAD_TABS = [{
        label: "Update Road Progress",
        Component: RoadOverview
    },
    {
        label: "Daily Road Reports",
        Component: DailyRoadTable
    },
];

const RoadTabs = memo(function RoadTabs({
    dailyProgress,
    onChange,
    onPhotoUpload,
    onSubmit,
    selectedRoad,
    dprData = [],
    dprLoading = false,
    setSelectedRoad,
    filters,
    setFilters,
}) {
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);

    const {
        inspectors = []
    } = useSelector((state) => state.masterData || {});
    const {
        loading,
        nestedprojects = [],
        error,
    } = useSelector((state) => state.cardRoad);

    // Fetch inspectors once
    useEffect(() => {
        dispatch(GetInspectors());
    }, [dispatch]);

    // Fetch nested projects once (parent)
    useEffect(() => {
        dispatch(getNestedProjects({}));
    }, [dispatch]);

    // Memoize common props for RoadOverview
    const commonProps = useMemo(
        () => ({
            dailyProgress,
            onChange,
            onPhotoUpload,
            onSubmit,
            selectedRoad,
            selectedRoadId: selectedRoad ? .id,
            onRoadSelect: setSelectedRoad,
            dprData,
            dprLoading,
            inspectors,
            filters,
            setFilters,
            nestedprojects,
            nestedLoading: loading,
            nestedError: error,
        }), [
            dailyProgress,
            onChange,
            onPhotoUpload,
            onSubmit,
            selectedRoad,
            setSelectedRoad,
            dprData,
            dprLoading,
            inspectors,
            filters,
            setFilters,
            nestedprojects,
            loading,
            error,
        ]
    );

    return ( <
        Box sx = {
            {
                mt: -4
            }
        } >
        <
        Tabs value = {
            tabIndex
        }
        onChange = {
            (e, newValue) => setTabIndex(newValue)
        }
        centered >
        {
            ROAD_TABS.map((tab) => ( <
                Tab key = {
                    tab.label
                }
                label = {
                    tab.label
                }
                disableRipple / >
            ))
        } <
        /Tabs>

        <
        Box sx = {
            {
                pt: 3
            }
        } > { /* ✅ Dono components hamesha mounted rahenge — display:none se hide */ } { /* Isse dono ka SAARA state (expandedRows, page, attachmentStatus, rowProgress, etc.) preserve rahega */ }

        <
        Box sx = {
            {
                display: tabIndex === 0 ? "block" : "none"
            }
        } >
        <
        RoadOverview { ...commonProps
        }
        /> <
        /Box>

        <
        Box sx = {
            {
                display: tabIndex === 1 ? "block" : "none"
            }
        } >
        <
        DailyRoadTable filters = {
            filters
        }
        /> <
        /Box> <
        /Box> <
        /Box>
    );
});

export default RoadTabs;