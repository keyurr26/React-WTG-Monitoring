import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    IconButton,
    Grid,
    Paper,
    Stack,
    Divider,
    Tab,
    Tabs,
    Button,
    Chip
} from "@mui/material";
import {
    Close as CloseIcon
} from "@mui/icons-material";
import {
    ModalPaper,
    ModalHeader,
    ModalContent
} from "./FoundationStyles";
import DynamicStageTables from "./DynamicStageTable";

const FoundationModal = ({
    open,
    onClose,
    selectedTurbine,
    activeTab,
    onTabChange,
    sections,
    onSoilFilter,
    onAnchorFilter,
    onExcavationFilter,
    onPCCFilter,
    onConductLayingFilter,
    onReinforcementFilter,
    onFoundationFilter,
    loading,
    activeLoadingTable,

}) => {
    if (!selectedTurbine) return null;

    const completedStages = [
        selectedTurbine.soil_status === "completed",
        selectedTurbine.ex_status === 1,
        selectedTurbine.pcc_status === 1,
        selectedTurbine.anc_status === 1,
        selectedTurbine.re_status === 1,
        selectedTurbine.pr_status === 1,
        selectedTurbine.cnd_status === 1,
        selectedTurbine.f_status === 1,
        selectedTurbine.cube_status === 1,
        selectedTurbine.backf_status === 1
    ];

    const completedCount = completedStages.filter(Boolean).length;

    return ( <
        Dialog open = {
            open
        }
        onClose = {
            onClose
        }
        maxWidth = "xl"
        fullWidth PaperComponent = {
            ModalPaper
        } >
        <
        ModalHeader >
        <
        Box >
        <
        Typography variant = "h6"
        fontWeight = "bold" >
        Turbine {
            selectedTurbine.location_no || 'N/A'
        } - Detailed View <
        /Typography> <
        Typography variant = "body2"
        color = "textSecondary" > {
            selectedTurbine.cluster_name
        } | {
            selectedTurbine.windfarm_name
        } | {
            selectedTurbine.project_name
        } <
        /Typography> <
        /Box> <
        IconButton onClick = {
            onClose
        }
        size = "small" >
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
        } >
        <
        Grid item xs = {
            6
        }
        sm = {
            3
        } >
        <
        Paper sx = {
            {
                p: 2,
                textAlign: 'center',
                bgcolor: '#f8f9fa'
            }
        } >
        <
        Typography variant = "caption"
        color = "textSecondary" > Total Stages < /Typography> <
        Typography variant = "h6"
        fontWeight = "bold" > 8 < /Typography> <
        /Paper> <
        /Grid> <
        Grid item xs = {
            6
        }
        sm = {
            3
        } >
        <
        Paper sx = {
            {
                p: 2,
                textAlign: 'center',
                bgcolor: '#f8f9fa'
            }
        } >
        <
        Typography variant = "caption"
        color = "textSecondary" > Completed < /Typography> <
        Typography variant = "h6"
        fontWeight = "bold"
        color = "success.main" > {
            completedCount
        } < /Typography> <
        /Paper> <
        /Grid> <
        Grid item xs = {
            6
        }
        sm = {
            3
        } >
        <
        Paper sx = {
            {
                p: 2,
                textAlign: 'center',
                bgcolor: '#f8f9fa'
            }
        } >
        <
        Typography variant = "caption"
        color = "textSecondary" > Pending < /Typography> <
        Typography variant = "h6"
        fontWeight = "bold"
        color = "warning.main" > {
            8 - completedCount
        } < /Typography> <
        /Paper> <
        /Grid> <
        Grid item xs = {
            6
        }
        sm = {
            3
        } >
        <
        Paper sx = {
            {
                p: 2,
                textAlign: 'center',
                bgcolor: '#f8f9fa'
            }
        } >
        <
        Typography variant = "caption"
        color = "textSecondary" > Progress < /Typography> <
        Typography variant = "h6"
        fontWeight = "bold"
        color = "primary.main" > {
            Math.round(completedCount / 10 * 100)
        } %
        <
        /Typography> <
        /Paper> <
        /Grid> <
        /Grid>

        { /* Tabs */ } <
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
        } >
        <
        Tab label = "Stage-wise Tables" / >
        <
        Tab label = "Summary" / >
        <
        /Tabs> <
        /Box>

        { /* Tab Panels */ } {
            activeTab === 0 && ( <
                Box > {
                    sections.length > 0 ? ( <
                        DynamicStageTables sections = {
                            sections
                        }
                        onAnchorFilter = {
                            onAnchorFilter
                        }
                        onSoilFilter = {
                            onSoilFilter
                        }
                        onExcavationFilter = {
                            onExcavationFilter
                        }
                        onPCCFilter = {
                            onPCCFilter
                        }
                        onConductLayingFilter = {
                            onConductLayingFilter
                        }
                        onReinforcementFilter = {
                            onReinforcementFilter
                        }
                        onFoundationFilter = {
                            onFoundationFilter
                        }
                        loading = {
                            loading
                        }
                        activeLoadingTable = {
                            activeLoadingTable
                        }
                        />
                    ) : ( <
                        Paper sx = {
                            {
                                p: 4,
                                textAlign: 'center'
                            }
                        } >
                        <
                        Typography variant = "body1"
                        color = "textSecondary" >
                        No stage data available
                        for this turbine <
                        /Typography> <
                        /Paper>
                    )
                } <
                /Box>
            )
        }



        {
            activeTab === 1 && ( <
                Box >
                <
                Grid container spacing = {
                    2
                } >
                <
                Grid item xs = {
                    12
                }
                md = {
                    6
                } >
                <
                Paper sx = {
                    {
                        p: 2
                    }
                } >
                <
                Typography variant = "subtitle2"
                fontWeight = "600"
                gutterBottom > Turbine Information < /Typography> <
                Divider sx = {
                    {
                        my: 1
                    }
                }
                /> <
                Stack spacing = {
                    1
                } >
                <
                Box display = "flex"
                justifyContent = "space-between" > < Typography variant = "body2"
                color = "textSecondary" > Location < /Typography><Typography variant="body2" fontWeight="500">{selectedTurbine.location_no}</Typography > < /Box> <
                Box display = "flex"
                justifyContent = "space-between" > < Typography variant = "body2"
                color = "textSecondary" > Cluster < /Typography><Typography variant="body2" fontWeight="500">{selectedTurbine.cluster_name}</Typography > < /Box> <
                Box display = "flex"
                justifyContent = "space-between" > < Typography variant = "body2"
                color = "textSecondary" > Wind Farm < /Typography><Typography variant="body2" fontWeight="500">{selectedTurbine.windfarm_name}</Typography > < /Box> <
                Box display = "flex"
                justifyContent = "space-between" > < Typography variant = "body2"
                color = "textSecondary" > Project < /Typography><Typography variant="body2" fontWeight="500">{selectedTurbine.project_name}</Typography > < /Box> <
                /Stack> <
                /Paper> <
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    6
                } >
                <
                Paper sx = {
                    {
                        p: 2
                    }
                } >
                <
                Typography variant = "subtitle2"
                fontWeight = "600"
                gutterBottom > Stage Completion Status < /Typography> <
                Divider sx = {
                    {
                        my: 1
                    }
                }
                /> <
                Stack spacing = {
                    1
                } > {
                    [{
                            name: "Soil Test",
                            status: selectedTurbine.soil_status === "completed"
                        },
                        {
                            name: "Excavation",
                            status: selectedTurbine.ex_status === 1
                        },
                        {
                            name: "PCC Layer",
                            status: selectedTurbine.pcc_status === 1
                        },
                        {
                            name: "Conduit",
                            status: selectedTurbine.cnd_status === 1
                        },
                        {
                            name: "Anchor Cage",
                            status: selectedTurbine.anc_status === 1
                        },
                        {
                            name: "Reinforcement",
                            status: selectedTurbine.re_status === 1
                        },
                        {
                            name: "Foundation",
                            status: selectedTurbine.f_status === 1
                        },
                        {
                            name: "Pouring",
                            status: selectedTurbine.pr_status === 1
                        },
                        {
                            name: "Cube result",
                            status: selectedTurbine.cube_status === 1
                        },
                        {
                            name: "Backfilling",
                            status: selectedTurbine.backf_status === 1
                        }
                    ].map((stage) => ( <
                        Box key = {
                            stage.name
                        }
                        display = "flex"
                        justifyContent = "space-between" >
                        <
                        Typography variant = "body2" > {
                            stage.name
                        } < /Typography> <
                        Chip size = "small"
                        label = {
                            stage.status ? "Completed" : "Pending"
                        }
                        color = {
                            stage.status ? "success" : "warning"
                        }
                        sx = {
                            {
                                height: 20
                            }
                        }
                        /> <
                        /Box>
                    ))
                } <
                /Stack> <
                /Paper> <
                /Grid> <
                /Grid> <
                /Box>
            )
        } <
        /ModalContent>

        <
        DialogActions sx = {
            {
                p: 2,
                borderTop: '1px solid #e0e0e0'
            }
        } >
        <
        Button onClick = {
            onClose
        }
        variant = "contained" > Close < /Button> <
        /DialogActions> <
        /Dialog>
    );
};

export default FoundationModal;