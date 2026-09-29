import React from "react";
import {
    Dialog,
    Typography,
    Box,
    IconButton,
    Grid,
    Paper,
    Stack,
    Divider,
    Tab,
    Tabs,
    Button,
    Chip,
    DialogActions
} from "@mui/material";
import {
    Close as CloseIcon
} from "@mui/icons-material";
import {
    styled
} from '@mui/material/styles';
import DynamicStageTables from "../foundation-components/DynamicStageTable";

// Styles
const ModalHeader = styled(Box)(({
    theme
}) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2, 3),
    background: 'linear-gradient(135deg, #1A237E 0%, #283593 100%)',
    color: '#fff',
}));

const ModalContent = styled(Box)(({
    theme
}) => ({
    padding: theme.spacing(3),
    backgroundColor: '#f4f6f8',
    minHeight: '400px',
    overflowY: 'auto' // Added to handle table height
}));

const WTGInstallationModal = ({
    open,
    onClose,
    selectedTurbine,
    activeTab,
    onTabChange,
    sections = [],
    loading,
    activeLoadingTable,
    // Add these props to handle filters from the dynamic table
    onT1Filter,
    onTowerFilter,
    onNacelleFilter,
    onRotorFilter,
    onBladeFilter
}) => {
    if (!selectedTurbine) return null;

    // Stages logic
    const stages = [{
            name: "T1 Base",
            status: selectedTurbine.t1_status === 1
        },
        {
            name: "Tower Parts",
            status: selectedTurbine.tw_status === 1
        },
        {
            name: "Nacelle",
            status: selectedTurbine.nc_status === 1
        },
        {
            name: "Rotor",
            status: selectedTurbine.rt_status === 1
        },
        {
            name: "Blades (3/3)",
            status: (selectedTurbine.bl_count || 0) === 3
        }
    ];

    const completedCount = stages.filter(s => s.status).length;
    const totalStages = stages.length;
    const progressPercent = Math.round((completedCount / totalStages) * 100);

    return ( <
        Dialog open = {
            open
        }
        onClose = {
            onClose
        }
        maxWidth = "xl"
        fullWidth >
        <
        ModalHeader >
        <
        Box >
        <
        Typography variant = "h6"
        fontWeight = "700" >
        WTG Installation: {
            selectedTurbine.location_no
        } <
        /Typography> <
        Typography variant = "body2"
        sx = {
            {
                opacity: 0.8
            }
        } > {
            selectedTurbine.cluster_name
        } | {
            selectedTurbine.windfarm_name
        } <
        /Typography> <
        /Box> <
        IconButton onClick = {
            onClose
        }
        size = "small"
        sx = {
            {
                color: '#fff'
            }
        } >
        <
        CloseIcon / >
        <
        /IconButton> <
        /ModalHeader>

        <
        ModalContent > { /* Summary Cards */ } <
        Grid container spacing = {
            2
        }
        sx = {
            {
                mb: 3
            }
        } > {
            [{
                    label: "Total Stages",
                    value: totalStages,
                    color: "text.primary"
                },
                {
                    label: "Completed",
                    value: completedCount,
                    color: "success.main"
                },
                {
                    label: "Pending",
                    value: totalStages - completedCount,
                    color: "warning.main"
                },
                {
                    label: "Overall Progress",
                    value: `${progressPercent}%`,
                    color: "primary.main"
                }
            ].map((card, i) => ( <
                Grid item xs = {
                    6
                }
                sm = {
                    3
                }
                key = {
                    i
                } >
                <
                Paper sx = {
                    {
                        p: 2,
                        textAlign: 'center',
                        borderRadius: 2,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }
                } >
                <
                Typography variant = "caption"
                color = "textSecondary"
                fontWeight = "600"
                sx = {
                    {
                        textTransform: 'uppercase'
                    }
                } > {
                    card.label
                } <
                /Typography> <
                Typography variant = "h5"
                fontWeight = "bold"
                sx = {
                    {
                        color: card.color
                    }
                } > {
                    card.value
                } <
                /Typography> <
                /Paper> <
                /Grid>
            ))
        } <
        /Grid>

        <
        Box sx = {
            {
                borderBottom: 1,
                borderColor: 'divider',
                mb: 2
            }
        } >
        <
        Tabs value = {
            activeTab
        }
        onChange = {
            onTabChange
        }
        textColor = "primary"
        indicatorColor = "primary" >
        <
        Tab label = "Installation Details"
        sx = {
            {
                textTransform: 'none',
                fontWeight: 600
            }
        }
        /> <
        Tab label = "Component Summary"
        sx = {
            {
                textTransform: 'none',
                fontWeight: 600
            }
        }
        /> <
        /Tabs> <
        /Box>

        { /* --- TAB 0: DETAILED TABLES (INTEGRATED) --- */ } {
            activeTab === 0 && ( <
                Box >
                <
                DynamicStageTables sections = {
                    sections
                }
                loading = {
                    loading
                }
                activeLoadingTable = {
                    activeLoadingTable
                }
                // Mapping the WTG-specific filters
                // onT1Filter={onT1Filter}
                // onTowerFilter={onTowerFilter}
                // onNacelleFilter={onNacelleFilter}
                // onRotorFilter={onRotorFilter}
                // onBladeFilter={onBladeFilter}
                /> <
                /Box>
            )
        }

        { /* --- TAB 1: SUMMARY LIST --- */ } {
            activeTab === 1 && ( <
                Grid container spacing = {
                    3
                } >
                <
                Grid item xs = {
                    12
                }
                md = {
                    5
                } >
                <
                Paper sx = {
                    {
                        p: 3,
                        borderRadius: 3
                    }
                } >
                <
                Typography variant = "subtitle1"
                fontWeight = "700"
                gutterBottom > Site Information < /Typography> <
                Divider sx = {
                    {
                        mb: 2
                    }
                }
                /> <
                Stack spacing = {
                    2
                } >
                <
                InfoRow label = "Location ID"
                value = {
                    selectedTurbine.location_no
                }
                /> <
                InfoRow label = "Cluster"
                value = {
                    selectedTurbine.cluster_name
                }
                /> <
                InfoRow label = "Project"
                value = {
                    selectedTurbine.project_name
                }
                /> <
                InfoRow label = "Installation Status"
                value = {
                    progressPercent === 100 ? "Fully Installed" : "In-Progress"
                }
                /> <
                InfoRow label = "Blades Installed"
                value = {
                    `${selectedTurbine.bl_count || 0} / 3`
                }
                /> <
                /Stack> <
                /Paper> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    7
                } >
                <
                Paper sx = {
                    {
                        p: 3,
                        borderRadius: 3
                    }
                } >
                <
                Typography variant = "subtitle1"
                fontWeight = "700"
                gutterBottom > Component Checklist < /Typography> <
                Divider sx = {
                    {
                        mb: 2
                    }
                }
                /> <
                Stack spacing = {
                    1.5
                } > {
                    stages.map((stage) => ( <
                        Box key = {
                            stage.name
                        }
                        display = "flex"
                        justifyContent = "space-between"
                        alignItems = "center" >
                        <
                        Typography variant = "body1"
                        fontWeight = "500" > {
                            stage.name
                        } < /Typography> <
                        Chip size = "small"
                        label = {
                            stage.status ? "Complete" : "Pending"
                        }
                        color = {
                            stage.status ? "success" : "warning"
                        }
                        sx = {
                            {
                                fontWeight: 700,
                                px: 1
                            }
                        }
                        /> <
                        /Box>
                    ))
                } <
                /Stack> <
                /Paper> <
                /Grid> <
                /Grid>
            )
        } <
        /ModalContent>

        <
        DialogActions sx = {
            {
                p: 2,
                bgcolor: '#fff'
            }
        } >
        <
        Button onClick = {
            onClose
        }
        variant = "outlined"
        sx = {
            {
                borderRadius: 2
            }
        } > Cancel < /Button> <
        Button onClick = {
            onClose
        }
        variant = "contained"
        sx = {
            {
                borderRadius: 2,
                px: 4
            }
        } > Close < /Button> <
        /DialogActions> <
        /Dialog>
    );
};

const InfoRow = ({
    label,
    value
}) => ( <
    Box display = "flex"
    justifyContent = "space-between" >
    <
    Typography variant = "body2"
    color = "textSecondary" > {
        label
    } < /Typography> <
    Typography variant = "body2"
    fontWeight = "600" > {
        value || 'N/A'
    } < /Typography> <
    /Box>
);

export default WTGInstallationModal;