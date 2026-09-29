import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Box,
    Divider,
    IconButton,
    Chip,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";

import WindfarmTable from "./WindfarmTable";

const ProjectDetailsDialog = ({
    open,
    onClose,
    project,
    onViewDocuments
}) => {
    return ( <
        Dialog open = {
            open
        }
        onClose = {
            onClose
        }
        maxWidth = "lg"
        fullWidth PaperProps = {
            {
                sx: {
                    borderRadius: 1.5,
                },
            }
        } >
        { /* HEADER */ } <
        DialogTitle sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e5e7eb",
                pb: 1,
                mt: -1,
            }
        } >
        <
        Box >
        <
        Typography variant = "h6"
        fontWeight = {
            700
        }
        mb = {-1
        } >
        Project Details <
        /Typography> <
        Typography variant = "caption"
        color = "text.secondary" >
        View complete project and windfarm information <
        /Typography> <
        /Box>

        <
        IconButton onClick = {
            onClose
        } >
        <
        CloseIcon / >
        <
        /IconButton> <
        /DialogTitle>

        <
        DialogContent sx = {
            {
                mt: 2
            }
        } > {
            project && ( <
                >
                <
                Box sx = {
                    {
                        px: 2.5,
                        py: 2,
                        borderRadius: 2,
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    }
                } >
                { /* TOP ROW */ } <
                Box display = "flex"
                justifyContent = "space-between"
                alignItems = "center"
                mb = {
                    1.2
                } >
                <
                Typography variant = "h6"
                fontWeight = {
                    600
                } > {
                    project.name
                } <
                /Typography>

                <
                Chip label = {
                    project.status
                }
                size = "small"
                sx = {
                    {
                        height: 22,
                        fontSize: "11px",
                        fontWeight: 500,
                        bgcolor: project.status === "Active" ?
                            "#dcfce7" :
                            project.status === "Pending" ?
                            "#fef3c7" :
                            "#e2e8f0",
                        color: project.status === "Active" ? "#166534" : "#92400e",
                    }
                }
                /> <
                /Box>

                { /* INLINE DETAILS (COMPACT) */ } <
                Box display = "flex"
                alignItems = "center"
                flexWrap = "wrap"
                gap = {
                    2
                } >
                <
                Box display = "flex"
                alignItems = "center"
                gap = {
                    0.5
                } >
                <
                PersonIcon sx = {
                    {
                        fontSize: 16
                    }
                }
                color = "action" / >
                <
                Typography variant = "body2" >
                <
                b > {
                    project.client
                } < /b> <
                /Typography> <
                /Box>

                <
                Box display = "flex"
                alignItems = "center"
                gap = {
                    0.5
                } >
                <
                LocationOnIcon sx = {
                    {
                        fontSize: 16
                    }
                }
                color = "action" / >
                <
                Typography variant = "body2" > {
                    project.location
                } < /Typography> <
                /Box>

                <
                Box display = "flex"
                alignItems = "center"
                gap = {
                    0.5
                } >
                <
                BusinessIcon sx = {
                    {
                        fontSize: 16
                    }
                }
                color = "action" / >
                <
                Typography variant = "body2" > {
                    project.windfarms ? .length || 0
                }
                Windfarms <
                /Typography> <
                /Box> <
                /Box> <
                /Box>

                { /* WIND FARM SECTION */ } <
                Box mt = {
                    3
                } >
                <
                Box display = "flex"
                justifyContent = "space-between"
                alignItems = "center"
                mb = {
                    1
                } >
                <
                Typography variant = "h6"
                fontWeight = {
                    600
                } >
                Windfarms <
                /Typography>

                <
                Typography variant = "caption"
                color = "text.secondary" >
                Click "View Docs"
                to open documents <
                /Typography> <
                /Box>

                <
                Divider sx = {
                    {
                        mb: 2
                    }
                }
                />

                { /* TABLE */ } <
                WindfarmTable data = {
                    project.windfarms
                }
                onViewDocuments = {
                    (wf) => onViewDocuments(project.id, wf.id)
                }
                /> <
                /Box> <
                />
            )
        } <
        /DialogContent>

        { /* FOOTER */ } <
        DialogActions sx = {
            {
                borderTop: "1px solid #e5e7eb",
                px: 3,
                py: 1,
            }
        } >
        <
        Button onClick = {
            onClose
        } >
        Close <
        /Button> <
        /DialogActions> <
        /Dialog>
    );
};

export default ProjectDetailsDialog;