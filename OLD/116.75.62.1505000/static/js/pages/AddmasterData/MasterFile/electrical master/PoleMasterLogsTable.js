import React, {
    useMemo
} from "react";
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Box,
} from "@mui/material";

export default function PoleMasterLogsTable({
    rows = [],
    poleLabel,
    masterLookup = [],
}) {
    const groupedData = useMemo(() => {
        const map = {};

        rows.forEach((item) => {
            const master = masterLookup.find(
                (m) =>
                m.project_id === item.project_id &&
                m.windfarm_id === item.windfarm_id &&
                m.cluster_id === item.cluster_id
            );

            const key = `${item.project_id}-${item.windfarm_id}-${item.cluster_id}`;

            if (!map[key]) {
                map[key] = {
                    project_name: master ? .project_name || "-",
                    windfarm_name: master ? .windfarm_name || "-",
                    cluster_name: master ? .cluster_name || "-",
                    materials: [],
                };
            }

            map[key].materials.push({
                component_name: item.component_name,
                code: item.code,
                quantity: item.quantity,
                unit: item.unit,
                type: item.type,
            });
        });

        return Object.values(map);
    }, [rows, masterLookup]);

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
        sx = {
            {
                mb: 2,
                fontWeight: "bold",
                color: "#00416A",
            }
        } >
        {
            poleLabel
        }
        Configuration Logs <
        /Typography>

        <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                maxHeight: 550,
                borderRadius: 2,
                border: "1px solid #d9d9d9",
                boxShadow: 2,
            }
        } >
        <
        Table stickyHeader size = "small" >
        <
        TableHead >
        <
        TableRow sx = {
            {
                "& .MuiTableCell-root": {
                    bgcolor: "#00416A",
                    color: "#fff",
                    fontWeight: 700,
                    textAlign: "center",
                    fontSize: 14,
                    borderBottom: "none",
                },
            }
        } >
        <
        TableCell width = "15%" > Project < /TableCell> <
        TableCell width = "18%" > Windfarm < /TableCell> <
        TableCell width = "15%" > Cluster < /TableCell> <
        TableCell width = "10%"
        align = "center" >
        Total Materials <
        /TableCell> <
        TableCell width = "42%" >
        Material Details <
        /TableCell> <
        /TableRow> <
        /TableHead>

        <
        TableBody > {
            groupedData.length > 0 ? (
                groupedData.map((row, index) => ( <
                    TableRow key = {
                        index
                    }
                    hover sx = {
                        {
                            bgcolor: index % 2 === 0 ? "#fafafa" : "#fff",
                            "&:hover": {
                                bgcolor: "#f1f7ff",
                            },
                        }
                    } >
                    <
                    TableCell > {
                        row.project_name
                    } < /TableCell>

                    <
                    TableCell > {
                        row.windfarm_name
                    } < /TableCell>

                    <
                    TableCell > {
                        row.cluster_name
                    } < /TableCell>

                    <
                    TableCell align = "center" >
                    <
                    Chip label = {
                        row.materials.length
                    }
                    size = "small"
                    color = "success"
                    sx = {
                        {
                            fontWeight: 700,
                            minWidth: 40,
                        }
                    }
                    /> <
                    /TableCell>

                    <
                    TableCell >
                    <
                    Box sx = {
                        {
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                        }
                    } >
                    {
                        row.materials.map((m, i) => ( <
                            Chip key = {
                                i
                            }
                            size = "small"
                            color = "primary"
                            variant = "filled"
                            sx = {
                                {
                                    fontWeight: 500,
                                    borderRadius: "8px",
                                }
                            }
                            label = {
                                `${m.component_name} (${m.code}) • Qty : ${m.quantity} ${m.unit}`
                            }
                            />
                        ))
                    } <
                    /Box> <
                    /TableCell> <
                    /TableRow>
                ))
            ) : ( <
                TableRow >
                <
                TableCell colSpan = {
                    5
                }
                align = "center"
                sx = {
                    {
                        py: 5,
                        color: "text.secondary",
                        fontWeight: 600,
                    }
                } >
                No Configuration Found <
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