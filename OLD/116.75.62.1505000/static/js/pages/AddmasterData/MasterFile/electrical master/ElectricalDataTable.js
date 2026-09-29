import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Grid,
    Button,
} from "@mui/material";
import DataTableRows from "./DataTableRows";

export default function ElectricalDataTable({
    lineType,
    currentRows,
    tables,
    availableTurbines,
    handleRowChange,
    handleSubmit,
    shortNames,
    isMCOH,
    isSCOHDog,
    isSCOH,
    isDCOH,
    getElectricalMaster,
    filters,
    submitLoading,
    handleAddRow,
    handleRemoveRow,
    errors
}) {
    return ( <
        Card >
        <
        CardContent >
        <
        Typography variant = "h6"
        sx = {
            {
                mb: 2,
                color: "#00416A"
            }
        } > {
            isMCOH ? "⚡ MCOH Circuit Validation" : "Electrical Line Data"
        } <
        /Typography>

        <
        Paper elevation = {
            3
        }
        sx = {
            {
                overflowX: "auto"
            }
        } >
        <
        Table >
        <
        TableHead sx = {
            {
                background: "#00416A"
            }
        } >
        <
        TableRow >
        <
        TableCell sx = {
            {
                color: "white",
                fontWeight: "bold"
            }
        } >
        Line Name <
        /TableCell> <
        TableCell sx = {
            {
                color: "white",
                fontWeight: "bold"
            }
        } >
        Km <
        /TableCell>

        {
            isSCOHDog && ( <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold"
                    }
                } >
                Cluster <
                /TableCell>
            )
        }

        {
            isSCOH && ( <
                >
                <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold"
                    }
                } >
                Cluster <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold"
                    }
                } >
                Turbine <
                /TableCell>

                <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold",
                        minWidth: 300, // ya 350
                        width: 300,
                    }
                } >
                All Used Turbines <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold"
                    }
                } >
                SCOH Dog <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold",
                        minWidth: 300, // ya 350
                        width: 300,
                    }
                } >
                All Used SCOH Dogs <
                /TableCell> <
                />
            )
        }

        {
            !isSCOH && !isDCOH && !isMCOH && ( <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold"
                    }
                } >
                Turbine <
                /TableCell>
            )
        }

        {
            (isSCOHDog || isSCOH) && ( <
                >
                <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold"
                    }
                } >
                Capacity Details <
                /TableCell>

                <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold"
                    }
                } >
                Status <
                /TableCell> <
                />
            )
        }

        {
            isDCOH && ( <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold"
                    }
                } >
                Assign SCOH <
                /TableCell>
            )
        }

        {
            isMCOH && ( <
                >
                <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold"
                    }
                } >
                Total Circuit <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold"
                    }
                } >
                Assign Lines <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold"
                    }
                } >
                Calculated <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "white",
                        fontWeight: "bold"
                    }
                } >
                Status <
                /TableCell> <
                />
            )
        }

        <
        TableCell sx = {
            {
                color: "white",
                fontWeight: "bold"
            }
        } >
        Action <
        /TableCell> <
        /TableRow> <
        /TableHead>

        <
        TableBody >
        <
        DataTableRows lineType = {
            lineType
        }
        currentRows = {
            currentRows
        }
        tables = {
            tables
        }
        availableTurbines = {
            availableTurbines
        }
        handleRowChange = {
            handleRowChange
        }
        isMCOH = {
            isMCOH
        }
        isSCOHDog = {
            isSCOHDog
        }
        isSCOH = {
            isSCOH
        }
        isDCOH = {
            isDCOH
        }
        getElectricalMaster = {
            getElectricalMaster
        }
        filters = {
            filters
        }
        handleRemoveRow = {
            handleRemoveRow
        }
        errors = {
            errors
        }
        />

        { /* ✅ ADD ROW BUTTON INSIDE TABLE */ } <
        TableRow >
        <
        TableCell colSpan = {
            20
        } // 👈 adjust according to your max columns
        sx = {
            {
                textAlign: "center",
                py: 1.5
            }
        } >
        <
        Button variant = "contained"
        onClick = {
            () => handleAddRow(lineType)
        }
        sx = {
            {
                background: "#00416A",
                px: 1,
                borderRadius: 2,
                textTransform: "none",
                //  position: "sticky",
                bottom: 0,
            }
        } >
        +Add Row <
        /Button> <
        /TableCell> <
        /TableRow> <
        /TableBody> <
        /Table> <
        /Paper>

        <
        Grid item xs = {
            12
        }
        textAlign = "center" >
        <
        Button variant = "contained"
        size = "small"
        onClick = {
            () => handleSubmit(lineType)
        }
        disabled = {
            submitLoading
        }
        sx = {
            {
                mt: 2,
                textTransform: "none",
                px: 1.2,
                py: 0.6,
                borderRadius: 2,
                background: "#00416A",
            }
        } >
        {
            submitLoading ? "Submitting..." : `Submit ${shortNames[lineType]}`
        } <
        /Button> <
        /Grid>

        {
            isMCOH && ( <
                Box sx = {
                    {
                        mt: 2,
                        p: 2,
                        bgcolor: "#f5f5f5",
                        borderRadius: 1
                    }
                } >
                <
                Typography variant = "body2"
                color = "textSecondary" >
                <
                strong > Formula: < /strong> (SCOH × 1) + (DCOH × 2) = Total Circuit <
                /Typography> <
                Typography variant = "caption"
                color = "textSecondary" > •Total Circuit can only be 3 or 4• SCOH contributes 1 per unit• DCOH contributes 2 per unit <
                /Typography> <
                /Box>
            )
        } <
        /CardContent> <
        /Card>
    );
}