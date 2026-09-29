import {
    useState,
    useEffect
} from "react";
import {
    Tabs,
    Tab,
    Box,
    Paper,
    Typography
} from "@mui/material";
import FoundationBase from "./FoundationBase";
import {
    useDispatch,
    useSelector
} from "react-redux";
import LocationFilterBar from "../../../components/LocationFilterBar"

function FoundationTab({
    filters,
    notificationState
}) {
    const [subTab, setSubTab] = useState(0);
    const dispatch = useDispatch();

    useEffect(() => {
        if (notificationState ? .subTab !== undefined) {
            setSubTab(notificationState.subTab);
        }
    }, [notificationState]);

    const SUB_TABS = [{
            label: "Turbine Progress",
            tableId: "Turbine"
        },
        {
            label: "Soil Report",
            tableId: "soil"
        },
        {
            label: "Excavation Form",
            tableId: "excavation"
        },
        {
            label: "PCC Form",
            tableId: "pcc"
        },
        {
            label: "Conduit Laying",
            tableId: "Conduit laying"
        },
        {
            label: "Anchor Cage",
            tableId: "anchor cage"
        },
        {
            label: "Reinforcement",
            tableId: "reinforcement"
        },
        {
            label: "Foundation Casting",
            tableId: "foundation & casting"
        },
        {
            label: "Pouring Card",
            tableId: "pouring card"
        },
        // { label: "Cube Samples", tableId: "cube sample pre-test" },
        {
            label: "Deshuttering",
            tableId: "deshuttering"
        },
        {
            label: "Watering Schedule",
            tableId: "watering schedule"
        },
        {
            label: "Cube Test Results",
            tableId: "cube test results"
        },
        {
            label: "Backfilling",
            tableId: "backfilling"
        },
        {
            label: "Platform",
            tableId: "platform"
        },
    ];

    const handleTabChange = (event, newValue) => {
        setSubTab(newValue);
    };

    return ( <
        Box > {
            /* <Box sx={{ mb: 2 }}>
                    <LocationFilterBar filters={filters} setFilters={setFilters} />
                  </Box> */
        } <
        Paper elevation = {
            0
        }
        sx = {
            {
                mb: 3,
                p: 1.5,
                borderRadius: 3,
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                display: 'inline-flex',
                width: '100%',
                overflow: 'hidden'
            }
        } >
        <
        Tabs value = {
            subTab
        }
        onChange = {
            handleTabChange
        }
        variant = "scrollable"
        scrollButtons = "auto"
        sx = {
            {
                minHeight: 44,
                '& .MuiTab-root': {
                    fontWeight: 500,
                    textTransform: 'none',
                    minHeight: 36,
                    height: 36,
                    fontSize: '0.8125rem',
                    borderRadius: 18,
                    mx: 0.5,
                    minWidth: 'auto',
                    px: 2.5,
                    color: 'text.secondary',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                        color: 'text.primary',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                },
                '& .Mui-selected': {
                    fontWeight: 600,
                    color: 'primary.main',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    borderColor: 'primary.main',
                    boxShadow: '0 2px 6px rgba(25, 118, 210, 0.2)',
                    '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.15)',
                    }
                },
                '& .MuiTabs-indicator': {
                    display: 'none'
                },
                '& .MuiTabs-scrollButtons': {
                    borderRadius: 18,
                    minHeight: 36,
                    height: 36,
                    color: 'text.secondary',
                    '&.Mui-disabled': {
                        opacity: 0.3
                    }
                }
            }
        } >
        {
            SUB_TABS.map((tab, index) => ( <
                Tab key = {
                    index
                }
                label = {
                    tab.label
                }
                />
            ))
        } <
        /Tabs> <
        /Paper>

        <
        Box sx = {
            {
                minHeight: "60vh"
            }
        } > {
            /* {!filters.project ? (
                      <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3, bgcolor: '#fcfcfc', border: '1px dashed #ccc' }}>
                        <Typography variant="h6" color="textSecondary">
                          Please select a Project from the Filter Bar to view data.
                        </Typography>
                      </Paper>
                    ) : ( */
        } <
        FoundationBase showTurbineSummary = {
            subTab === 0
        }
        tableIds = {
            [SUB_TABS[subTab].tableId]
        }
        appliedFilters = {
            filters
        }
        /> { /* )} */ } <
        /Box> <
        /Box>
    );
}

export default FoundationTab;