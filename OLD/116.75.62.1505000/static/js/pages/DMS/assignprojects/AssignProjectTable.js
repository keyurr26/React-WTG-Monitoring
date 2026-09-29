import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from "@mui/material";

const commonHeaderStyle = {
    "& .MuiTableCell-root": {
        color: "#fff",
        fontWeight: 600,
        letterSpacing: "0.5px",
        fontSize: "13px",
        py: 0.9,
    },
};

const rowStyle = {
    transition: "0.2s",
    "&:nth-of-type(odd)": {
        backgroundColor: "#f8fafc",
    },
    "&:hover": {
        backgroundColor: "#e0f2fe",
    },
};

const cellStyle = {
    fontSize: "13px",
    py: 1.2,
};

const AssignedProjectTable = ({
    data = [],
    users
}) => {
    const userMap = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
    }, {});

    return ( <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                borderRadius: 1,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                overflowX: "auto",
                "&::-webkit-scrollbar": {
                    height: "6px",
                    width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                    background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "linear-gradient(135deg, #cbd5e1, #94a3b8)",
                    borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    background: "linear-gradient(135deg, #94a3b8, #64748b)",
                },
                scrollbarWidth: "thin",
                scrollbarColor: "#cbd5e1 transparent",
            }
        } >
        <
        Table sx = {
            {
                minWidth: "100%"
            }
        } >
        <
        TableHead sx = {
            {
                background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
            }
        } >
        <
        TableRow sx = {
            commonHeaderStyle
        } >
        <
        TableCell > User < /TableCell> <
        TableCell > Role < /TableCell> <
        TableCell > Project < /TableCell> <
        TableCell > Windfarm < /TableCell> <
        TableCell > Assigned Date < /TableCell> <
        /TableRow> <
        /TableHead>

        <
        TableBody > {!data || data.length === 0 ? ( <
                TableRow >
                <
                TableCell colSpan = {
                    8
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
                data.map((item) => ( <
                    TableRow key = {
                        item.id
                    }
                    sx = {
                        rowStyle
                    } >
                    <
                    TableCell sx = {
                        cellStyle
                    } > {
                        item.user_name || "-"
                    } < /TableCell>

                    <
                    TableCell sx = {
                        cellStyle
                    } >
                    <
                    Chip label = {
                        userMap[item.user] ? .role || "-"
                    }
                    size = "small"
                    sx = {
                        {
                            fontWeight: 500,
                            backgroundColor: "#e0f2fe",
                            color: "#0369a1",
                            textTransform: "capitalize",
                        }
                    }
                    /> <
                    /TableCell>

                    <
                    TableCell sx = {
                        cellStyle
                    } > {
                        item.project_name || "-"
                    } < /TableCell>

                    <
                    TableCell sx = {
                        cellStyle
                    } > {
                        item.windfarm_name || "-"
                    } <
                    /TableCell>

                    <
                    TableCell sx = {
                        cellStyle
                    } > {
                        item.created_at ?
                        new Date(item.created_at).toLocaleDateString() :
                            "-"
                    } <
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

export default AssignedProjectTable;