import {
    useEffect,
    useMemo,
    useState
} from "react";
import {
    Tabs,
    Tab,
    Box,
    Paper,
    Typography
} from "@mui/material";
import ElectricalBase from "./ElectricalBase";
import {
    GetElectricalLinesNestedData
} from "../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";
import {
    GetSQRecords
} from "../../../Redux/SafetyQualityData/SafetyQualityAction";
import {
    refreshNotifications
} from "../../../Redux/DashboardData/dashboardAction";
import {
    useDispatch,
    useSelector
} from "react-redux";

const ElectricalTab = ({
    filters,
    setElectricalMainTab,
    notificationState,
}) => {
    const dispatch = useDispatch();
    const [refreshKey, setRefreshKey] = useState(0);

    // MAIN TAB
    const [mainTab, setMainTab] = useState(0);

    // LEVEL TAB
    const [levelTab, setLevelTab] = useState(0);

    const {
        getElectricalLinesNested = [], loading = false
    } = useSelector(
        (state) => state.electricalData,
    );

    const {
        sqlist = []
    } = useSelector((state) => state.sqData || {});


    useEffect(() => {
        dispatch(GetSQRecords())
    }, [dispatch]);

    console.log("electricalRecordList", sqlist)





    useEffect(() => {
        if (setElectricalMainTab) {
            setElectricalMainTab(mainTab);
        }
    }, [mainTab, setElectricalMainTab]);

    // ================= MAIN TABS WITH LINE TYPE MAPPING =================
    const MAIN_TABS = [{
            label: "SCOH Dog",
            tableId: "scoh-dog",
            lineTypeIdentifier: "SCOH-Dog"
        },
        {
            label: "SCOH PANTHER",
            tableId: "scoh",
            lineTypeIdentifier: "SCOH"
        },
        {
            label: "DCOH",
            tableId: "dcoh",
            lineTypeIdentifier: "DCOH"
        },
        {
            label: "MCOH",
            tableId: "mcoh",
            lineTypeIdentifier: "MCOH"
        },
    ];

    // ================= LEVEL TABS =================
    const LEVEL_TABS = [{
            label: "L1",
            level: "L1",
            submittedKey: "submitted_l1_at"
        },
        {
            label: "L2",
            level: "L2",
            submittedKey: "submitted_l2_at"
        },
        {
            label: "L3",
            level: "L3",
            submittedKey: "submitted_l3_at"
        },
        {
            label: "Final",
            level: "FINAL",
            submittedKey: "submitted_at"
        },
    ];

    // ================= NOTIFICATION AUTO NAVIGATION =================

    useEffect(() => {
        if (notificationState ? .tableId !== "electrical") return;

        const lineType = (notificationState.line_type || "").toLowerCase();

        let mainIndex = 0;

        if (lineType.includes("dog")) {
            mainIndex = 0;
        } else if (lineType.includes("scoh")) {
            mainIndex = 1;
        } else if (lineType.includes("dcoh")) {
            mainIndex = 2;
        } else if (lineType.includes("mcoh")) {
            mainIndex = 3;
        }

        setMainTab(mainIndex);

        const levelIndex = LEVEL_TABS.findIndex(
            (tab) => tab.level === notificationState.level,
        );

        setLevelTab(levelIndex);
    }, [notificationState]);

    const currentTable = MAIN_TABS[mainTab].tableId;
    const currentLineTypeIdentifier = MAIN_TABS[mainTab].lineTypeIdentifier;
    const currentLevel = LEVEL_TABS[levelTab].level;
    const currentSubmittedKey = LEVEL_TABS[levelTab].submittedKey;

    // ================= API CALL =================
    useEffect(() => {
        if (filters.project && filters.windfarm) {
            const apiFilters = {
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: filters.cluster,
                turbine: filters.turbine,
                line_type: currentTable,
            };

            dispatch(GetElectricalLinesNestedData(apiFilters));
        }
    }, [
        dispatch,
        filters.project,
        filters.windfarm,
        filters.cluster,
        filters.turbine,
        currentTable,
    ]);

    // ================= FILTER DATA =================
    const filteredData = useMemo(() => {
        const data = Array.isArray(getElectricalLinesNested) ?
            getElectricalLinesNested :
            [getElectricalLinesNested];

        return data.filter((item) => {
            // Match filters
            const matchProject = !filters.project || item.project === Number(filters.project);
            const matchWindfarm = !filters.windfarm || item.windfarm === Number(filters.windfarm);
            const matchCluster = !filters.cluster || item.cluster === Number(filters.cluster);

            // Match line type
            let matchLineType = false;

            if (currentLineTypeIdentifier === "SCOH-Dog") {
                matchLineType =
                    item.line_type &&
                    (item.line_type.toLowerCase().includes("scoh-dog") ||
                        item.line_type.toLowerCase().includes("sc-dog"));
            } else if (currentLineTypeIdentifier === "SCOH") {
                matchLineType =
                    item.line_type &&
                    item.line_type.toLowerCase().includes("scoh") &&
                    !item.line_type.toLowerCase().includes("dog");
            } else if (currentLineTypeIdentifier === "DCOH") {
                matchLineType =
                    item.line_type && item.line_type.toLowerCase().includes("dcoh");
            } else if (currentLineTypeIdentifier === "MCOH") {
                matchLineType =
                    item.line_type && item.line_type.toLowerCase().includes("mcoh");
            }

            if (!matchLineType && currentTable) {
                matchLineType =
                    item.line_type === currentTable ||
                    item.line_type ? .toLowerCase() === currentTable.toLowerCase();
            }

            // ✅ DIFFERENT SUBMISSION CHECKS FOR DIFFERENT LEVELS
            let matchSubmission = false;

            switch (currentLevel) {
                case "L1":
                    // ✅ L1: Check if ANY pole has submitted_l1_at
                    matchSubmission =
                        item.pole_details ? .some((pole) => !!pole.submitted_l1_at) || false;
                    break;
                case "L2":
                    // ✅ L2: Check if ANY pole has submitted_l2_at
                    matchSubmission =
                        item.pole_details ? .some((pole) => !!pole.submitted_l2_at) || false;
                    break;
                case "L3":
                    // ✅ L3: Check if ANY pole has submitted_l3_at
                    matchSubmission =
                        item.pole_details ? .some((pole) => !!pole.submitted_l3_at) || false;
                    break;
                case "FINAL":
                    // ✅ FINAL: Check line level submitted_at
                    matchSubmission = !!item.submitted_at;
                    break;

                    // ✅ YAHAN

                default:
                    matchSubmission = true;
            }

            return (
                matchProject &&
                matchWindfarm &&
                matchCluster &&
                matchLineType &&
                matchSubmission
            );
        });
    }, [
        getElectricalLinesNested,
        filters.project,
        filters.windfarm,
        filters.cluster,
        currentTable,
        currentLineTypeIdentifier,
        currentLevel,
    ]);

    const handleApproveSuccess = async () => {
        if (filters.project && filters.windfarm) {
            const apiFilters = {
                project: filters.project,
                windfarm: filters.windfarm,
                cluster: filters.cluster,
                turbine: filters.turbine,
                line_type: currentTable,
            };

            const result = await dispatch(GetElectricalLinesNestedData(apiFilters));

            dispatch(refreshNotifications());
        }

        setRefreshKey((prev) => prev + 1);
    };

    return ( <
        Box > { /* MAIN TAB */ } <
        Paper elevation = {
            0
        }
        sx = {
            {
                mb: 2,
                p: 1.5,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
            }
        } >
        <
        Tabs value = {
            mainTab
        }
        onChange = {
            (e, newValue) => {
                setMainTab(newValue);
                setLevelTab(0);
                if (setElectricalMainTab) {
                    setElectricalMainTab(newValue);
                }
            }
        }
        centered sx = {
            {
                backgroundColor: "#00584eb7",
                borderRadius: 1,
                "& .MuiTabs-indicator": {
                    backgroundColor: "#ffbe5cff",
                    height: 4,
                },
            }
        } >
        {
            MAIN_TABS.map((tab, index) => ( <
                Tab key = {
                    index
                }
                label = {
                    tab.label
                }
                sx = {
                    {
                        color: "white",
                        fontWeight: "bold",
                        "&.Mui-selected": {
                            color: "#ffbe5cff",
                        },
                        "&:hover": {
                            backgroundColor: "#004d40",
                            borderRadius: 1,
                        },
                    }
                }
                />
            ))
        } <
        /Tabs> <
        /Paper>

        { /* LEVEL TAB */ } <
        Paper elevation = {
            0
        }
        sx = {
            {
                mb: 3,
                p: 1,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
            }
        } >
        <
        Tabs value = {
            levelTab
        }
        onChange = {
            (e, newValue) => setLevelTab(newValue)
        }
        centered sx = {
            {
                borderRadius: 1,
                "& .MuiTabs-indicator": {
                    backgroundColor: "#004d40",
                    height: 4,
                },
            }
        } >
        {
            LEVEL_TABS.map((tab, index) => ( <
                Tab key = {
                    index
                }
                label = {
                    tab.label
                }
                sx = {
                    {
                        color: "#000",
                        fontWeight: "bold",
                        "&.Mui-selected": {
                            color: "#004d40",
                        },
                        "&:hover": {
                            borderRadius: 1,
                        },
                    }
                }
                />
            ))
        } <
        /Tabs> <
        /Paper>

        { /* CONTENT */ } <
        Box sx = {
            {
                minHeight: "60vh"
            }
        } > {
            loading ? ( <
                Paper sx = {
                    {
                        p: 4,
                        textAlign: "center",
                        borderRadius: 3
                    }
                } >
                <
                Typography > Loading... < /Typography> <
                /Paper>
            ) : filteredData.length > 0 ? (
                filteredData.map((item) => ( <
                    Box key = {
                        item.id
                    }
                    mb = {
                        3
                    } >
                    <
                    ElectricalBase nestedData = {
                        item
                    }
                    level = {
                        currentLevel
                    }
                    loading = {
                        loading
                    }
                    onApproveSuccess = {
                        handleApproveSuccess
                    }
                    sqlist = {
                        sqlist
                    }
                    /> <
                    /Box>
                ))
            ) : ( <
                Paper sx = {
                    {
                        p: 4,
                        textAlign: "center",
                        borderRadius: 3,
                    }
                } >
                <
                Typography variant = "h6"
                color = "text.secondary" >
                No {
                    currentLevel
                }
                submitted data found
                for {
                    " "
                } {
                    MAIN_TABS[mainTab].label
                } <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary"
                sx = {
                    {
                        mt: 1
                    }
                } > {
                    currentLevel === "FINAL" ?
                    "Only lines with final submission are shown here." :
                        `Only lines with ${currentLevel} pole submissions are shown here.`
                } <
                /Typography> <
                /Paper>
            )
        } <
        /Box> <
        /Box>
    );
};

export default ElectricalTab;