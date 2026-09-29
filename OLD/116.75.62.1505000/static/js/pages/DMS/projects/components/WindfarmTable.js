import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Button,
    Chip,
} from "@mui/material";

const WindfarmTable = ({
    data = [],
    onViewDocuments
}) => {
    // STYLES
    const headerStyle = {
        color: "#fff",
        whiteSpace: "nowrap",
        fontSize: "0.72rem",
        py: 0.9, // smaller height
        fontWeight: 600,
        letterSpacing: "0.4px",
    };

    const cellStyle = {
        fontSize: "0.72rem",
        whiteSpace: "nowrap",
        py: 0.9,
    };

    return ( <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                borderRadius: 1,
                overflowX: "auto", // horizontal scroll
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }
        } >
        <
        Table size = "small"
        sx = {
            {
                maxWidth: "100%"
            }
        } >
        <
        TableHead sx = {
            {
                background: "linear-gradient(90deg, #1e3c72, #2a5298)"
            }
        } >
        <
        TableRow >
        <
        TableCell sx = {
            headerStyle
        } > Windfarm < /TableCell> <
        TableCell sx = {
            headerStyle
        } > Village < /TableCell> <
        TableCell sx = {
            headerStyle
        } > District < /TableCell> <
        TableCell sx = {
            headerStyle
        } > Taluka < /TableCell> <
        TableCell sx = {
            headerStyle
        } > State < /TableCell> <
        TableCell sx = {
            headerStyle
        } > Country < /TableCell> <
        TableCell sx = {
            headerStyle
        } > Coordinates < /TableCell> <
        TableCell sx = {
            headerStyle
        } > Survey No < /TableCell> <
        TableCell sx = {
            headerStyle
        } > Capacity < /TableCell> <
        TableCell sx = {
            headerStyle
        } > Land Type < /TableCell> <
        TableCell sx = {
            headerStyle
        } > Status < /TableCell> <
        TableCell sx = {
            headerStyle
        }
        align = "center" >
        Action <
        /TableCell> <
        /TableRow> <
        /TableHead>

        { /* BODY */ } <
        TableBody > {
            data.length === 0 ? ( <
                TableRow >
                <
                TableCell colSpan = {
                    10
                }
                align = "center"
                sx = {
                    {
                        py: 3,
                        color: "#94a3b8",
                        fontSize: "14px",
                    }
                } >
                No records available <
                /TableCell> <
                /TableRow>
            ) : (
                data.map((wf, index) => ( <
                    TableRow key = {
                        wf.id
                    }
                    sx = {
                        {
                            backgroundColor: index % 2 === 0 ? "#fff" : "#f8fafc",
                            "&:hover": {
                                backgroundColor: "#e0f2fe",
                            },
                        }
                    } >
                    <
                    TableCell sx = {
                        cellStyle
                    } > {
                        wf.name
                    } < /TableCell> <
                    TableCell sx = {
                        cellStyle
                    } > {
                        wf.village
                    } < /TableCell> <
                    TableCell sx = {
                        cellStyle
                    } > {
                        wf.district
                    } < /TableCell> <
                    TableCell sx = {
                        cellStyle
                    } > {
                        wf.taluka
                    } < /TableCell> <
                    TableCell sx = {
                        cellStyle
                    } > {
                        wf.state
                    } < /TableCell> <
                    TableCell sx = {
                        cellStyle
                    } > {
                        wf.country
                    } < /TableCell> <
                    TableCell sx = {
                        cellStyle
                    } > {
                        wf.coordinates
                    } < /TableCell> <
                    TableCell sx = {
                        cellStyle
                    } > {
                        wf.survey_no
                    } < /TableCell> <
                    TableCell sx = {
                        cellStyle
                    } > {
                        wf.capacity
                    } < /TableCell> <
                    TableCell sx = {
                        cellStyle
                    } > {
                        wf.land_type
                    } < /TableCell>

                    { /* STATUS CHIP */ } <
                    TableCell sx = {
                        cellStyle
                    } >
                    <
                    Chip label = {
                        wf.status || "Active"
                    }
                    size = "small"
                    sx = {
                        {
                            bgcolor: wf.status === "Active" ? "#dcfce7" : "#fef3c7",
                            color: wf.status === "Active" ? "#166534" : "#92400e",
                            fontWeight: 500,
                            fontSize: "0.72rem",
                        }
                    }
                    /> <
                    /TableCell>

                    { /* ACTION */ } <
                    TableCell >
                    <
                    Button size = "small"
                    variant = "contained"
                    onClick = {
                        () => onViewDocuments(wf)
                    }
                    sx = {
                        {
                            textTransform: "none",
                            fontSize: "0.7rem",
                            padding: "4px 8px",
                            minWidth: "auto",
                            whiteSpace: "nowrap", // STOP line break
                            overflow: "hidden", // hide extra text
                            textOverflow: "ellipsis",
                        }
                    } >
                    View Docs <
                    /Button> <
                    /TableCell> <
                    /TableRow>
                ))
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer>
    );
};

export default WindfarmTable;