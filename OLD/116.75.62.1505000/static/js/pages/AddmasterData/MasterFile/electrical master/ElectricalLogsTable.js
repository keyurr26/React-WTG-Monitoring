import React from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Typography,
    Box,
    Chip,
    TableContainer,
} from "@mui/material";

export default function ElectricalLogsTable({
    data,
    lineType,
    getDisplayName,
}) {
    if (!["SCOH-Dog", "SCOH-Panther", "DCOH", "MCOH"].includes(lineType))
        return null;

    const isSCOHDog = lineType === "SCOH-Dog";
    const isSCOH = lineType === "SCOH-Panther";
    const isDCOH = lineType === "DCOH";
    const isMCOH = lineType === "MCOH";

    const columns = [
        "Project",
        "Windfarm",
        "Line Name",
        "Line Type",
        "No Of Line",
        "KM",
        ...(isSCOHDog ? ["Cluster", "Turbines"] : []), // ✅ ADD THIS
        ...(isSCOH ? ["Cluster", "Turbines", "SCOH Dog"] : []),
        ...(isDCOH ? ["Assign SCOH"] : []),
        ...(isMCOH ?
            ["Assign Lines", "Total Circuit", "Calculated", "Status"] :
            []),
    ];

    return ( <
        Paper sx = {
            {
                mt: 4,
                p: 3,
                borderRadius: 2,
                border: "1px solid #00416A",
            }
        } >
        <
        Typography variant = "h6"
        gutterBottom fontWeight = "bold"
        color = "#00416A" > {
            lineType === "SCOH-Panther" ?
            "SCOH-Panther Line Saved Data" :
                lineType === "DCOH" ?
                "DCOH Saved Data" :
                lineType === "MCOH" ?
                "MCOH Saved Data" :
                "SCOH-Dog Line Saved Data"
        } <
        /Typography>

        { /* scrollbar if dont need scrollbar then use BOx  */ } <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                maxHeight: 500, // vertical scroll height
                overflow: "auto",

                "&::-webkit-scrollbar": {
                    width: 8,
                    height: 8,
                },

                "&::-webkit-scrollbar-thumb": {
                    background: "rgba(0,0,0,.25)",
                    borderRadius: 4,
                },
            }
        } >
        { /* Table */ } <
        Table
        // stickyHeader
        size = "small"
        sx = {
            {
                minWidth: 1000
            }
        } >
        <
        TableHead >
        <
        TableRow sx = {
            {
                backgroundColor: "#0f52ba",
            }
        } >
        {
            columns.map((head) => ( <
                TableCell key = {
                    head
                }
                sx = {
                    {
                        color: "primary.contrastText",
                        fontWeight: "bold",
                        fontSize: 14,
                        whiteSpace: "nowrap",
                    }
                } >
                {
                    head
                } <
                /TableCell>
            ))
        } <
        /TableRow> <
        /TableHead>

        <
        TableBody > {
            data && data.length > 0 ? (
                data.map((row, index) => ( <
                    TableRow key = {
                        row.id
                    }
                    sx = {
                        {
                            backgroundColor: index % 2 === 0 ? "background.paper" : "#FFF9F4",
                            "&:hover": {
                                backgroundColor: "action.hover",
                                cursor: "pointer",
                            },
                        }
                    } >
                    <
                    TableCell > {
                        row.project_name || "-"
                    } < /TableCell> <
                    TableCell > {
                        row.windfarm_name || "-"
                    } < /TableCell> <
                    TableCell sx = {
                        {
                            fontWeight: 500
                        }
                    } > {
                        row.line_name
                    } <
                    /TableCell> { /* <TableCell>{row.line_type}</TableCell> */ }

                    <
                    TableCell > {
                        getDisplayName(row.line_type)
                    } < /TableCell> <
                    TableCell > {
                        row.no_of_line
                    } < /TableCell> <
                    TableCell > {
                        row.km || "-"
                    } < /TableCell>

                    { /* ✅ SCOH-Dog columns */ } {
                        isSCOHDog && ( <
                            >
                            <
                            TableCell > {
                                row.cluster_name || "-"
                            } < /TableCell>

                            <
                            TableCell > {
                                row.turbine_locations ? .length > 0 ? ( <
                                    Box sx = {
                                        {
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5
                                        }
                                    } >
                                    {
                                        row.turbine_locations.map((t, i) => ( <
                                            Chip key = {
                                                i
                                            }
                                            label = {
                                                t
                                            }
                                            size = "small" / >
                                        ))
                                    } <
                                    /Box>
                                ) : (
                                    "-"
                                )
                            } <
                            /TableCell> <
                            />
                        )
                    }

                    { /* SCOH columns */ } {
                        isSCOH && ( <
                            >
                            <
                            TableCell > {
                                row.cluster_name || "-"
                            } < /TableCell>

                            <
                            TableCell > {
                                row.turbine_locations ? .length > 0 ? ( <
                                    Box sx = {
                                        {
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5
                                        }
                                    } >
                                    {
                                        row.turbine_locations.map((t, i) => ( <
                                            Chip key = {
                                                i
                                            }
                                            label = {
                                                t
                                            }
                                            size = "small" / >
                                        ))
                                    } <
                                    /Box>
                                ) : (
                                    "-"
                                )
                            } <
                            /TableCell>

                            <
                            TableCell > {
                                row.scoh_dog ? ( <
                                    Chip label = {
                                        row.scoh_dog
                                    }
                                    size = "small" / >
                                ) : (
                                    "-"
                                )
                            } <
                            /TableCell> <
                            />
                        )
                    }

                    { /* ✅ DCOH Assign SCOH */ } {
                        isDCOH && ( <
                            TableCell > {
                                row.assign_scoh ? .length > 0 ? ( <
                                    Box sx = {
                                        {
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5
                                        }
                                    } >
                                    {
                                        row.assign_scoh.map((item, i) => ( <
                                            Chip key = {
                                                i
                                            }
                                            label = {
                                                item
                                            }
                                            size = "small"
                                            sx = {
                                                {
                                                    backgroundColor: "#e8f5e9"
                                                }
                                            }
                                            />
                                        ))
                                    } <
                                    /Box>
                                ) : (
                                    "-"
                                )
                            } <
                            /TableCell>
                        )
                    }

                    { /* ✅ MCOH Columns */ } {
                        isMCOH && ( <
                            > { /* Assign Lines */ } <
                            TableCell > {
                                row.assign_lines ? .length > 0 ? ( <
                                    Box sx = {
                                        {
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5
                                        }
                                    } >
                                    {
                                        row.assign_lines.map((item, i) => ( <
                                            Chip key = {
                                                i
                                            }
                                            label = {
                                                item
                                            }
                                            size = "small"
                                            sx = {
                                                {
                                                    backgroundColor: "#e3f2fd"
                                                }
                                            }
                                            />
                                        ))
                                    } <
                                    /Box>
                                ) : (
                                    "-"
                                )
                            } <
                            /TableCell>

                            { /* Total Circuit */ } <
                            TableCell > {
                                row.total_circuit ? ? "-"
                            } < /TableCell>

                            { /* Calculated */ } <
                            TableCell >
                            <
                            Chip label = {
                                row.calculated === true ?
                                "Valid" :
                                    row.calculated === false ?
                                    "Invalid" :
                                    "-"
                            }
                            size = "small"
                            color = {
                                row.calculated === true ?
                                "success" :
                                    row.calculated === false ?
                                    "error" :
                                    "default"
                            }
                            /> <
                            /TableCell>

                            { /* Status */ } <
                            TableCell >
                            <
                            Chip label = {
                                row.status || "-"
                            }
                            size = "small"
                            color = {
                                row.status ? .includes("VALID") ?
                                "success" :
                                row.status ? .includes("Exceeded") ?
                                "error" :
                                row.status ? .includes("⚠") ?
                                "warning" :
                                "default"
                            }
                            /> <
                            /TableCell> <
                            />
                        )
                    } <
                    /TableRow>
                ))
            ) : ( <
                TableRow >
                <
                TableCell colSpan = {
                    columns.length
                }
                align = "center" >
                No data available <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer> <
        /Paper>
    );
}