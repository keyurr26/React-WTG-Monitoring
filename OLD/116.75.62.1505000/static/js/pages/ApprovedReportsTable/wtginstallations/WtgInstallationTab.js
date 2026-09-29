import {
    useState,
    useEffect
} from "react";
import {
    Tabs,
    Tab,
    Box,
    Paper
} from "@mui/material";
import WtgInstallationBase from "./WtgInstallationBase";

const MAIN_TABS = [{
        label: "T1 Installation",
        tableId: "t1 installation"
    },
    {
        label: "Tower Installation",
        tableId: "tower installation"
    },
    {
        label: "Nacelle Installation",
        tableId: "nacelle installation"
    },
    {
        label: "Rotor Hub Installation",
        tableId: "rotor hub installation"
    },
    {
        label: "Blade Installation",
        tableId: "blade installation"
    },
];

function WtgInstallationTab({
    filters,
    notificationState
}) {
    // const [mainTab, setMainTab] = useState(0);
    const [subTab, setSubTab] = useState(0);
    const currentTab = MAIN_TABS[subTab];

    useEffect(() => {
        if (notificationState ? .subTab !== undefined) {
            setSubTab(notificationState.subTab);
        }
    }, [notificationState]);

    return ( <
        Box > { /* ===== MAIN TABS - HORIZONTALLY CENTERED ===== */ } <
        Box sx = {
            {
                mb: 3,
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
            }
        } >
        <
        Paper elevation = {
            0
        }
        sx = {
            {
                p: 1.5,
                borderRadius: 3,
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                display: 'inline-flex',
                maxWidth: 'fit-content',
                overflow: 'hidden'
            }
        } >
        <
        Tabs value = {
            subTab
        }
        onChange = {
            (e, v) => setSubTab(v)
        }
        variant = "standard"
        sx = {
            {
                minHeight: 44,
                '& .MuiTab-root': {
                    fontWeight: 500,
                    textTransform: 'none',
                    minHeight: 36,
                    height: 36,
                    fontSize: '0.875rem',
                    borderRadius: 18,
                    mx: 0.5,
                    minWidth: 'auto',
                    px: 3,
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
                }
            }
        } >
        {
            MAIN_TABS.map((tab) => ( <
                Tab key = {
                    tab.tableId
                }
                label = {
                    tab.label
                }
                />
            ))
        } <
        /Tabs> <
        /Paper> <
        /Box>

        { /* ===== CONTENT AREA ===== */ } {
            currentTab && ( <
                WtgInstallationBase filters = {
                    filters
                }
                key = {
                    currentTab.tableId
                } // Force remount when switching tabs
                tableIds = {
                    [currentTab.tableId]
                }
                />
            )
        } <
        /Box>
    );
}

export default WtgInstallationTab;