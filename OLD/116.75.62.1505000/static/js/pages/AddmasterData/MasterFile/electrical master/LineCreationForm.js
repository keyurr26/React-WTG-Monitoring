import React from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    TextField,
    Button,
} from "@mui/material";
import ElectricalFilterBar from "./ElectricalFilterBar";

export default function LineCreationForm({
    createLine,
    setCreateLine,
    lineType,
    noOfLine,
    setNoOfLine,
    handleCreateTable,
    isSCOHDog,
    isSCOH,
    isDCOH,
    isMCOH,
    filters,
    setFilters,
    onTurbinesChange,
    isLineTypeSelected,
    getDisplayName,
}) {
    if (!isLineTypeSelected) return null;

    return ( <
        Card sx = {
            {
                mb: 3
            }
        } > { /* ✅ DISCLAIMER */ } <
        Box sx = {
            {
                mt: 2
            }
        } >
        <
        Box sx = {
            {
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                background: "#fff4e5",
                border: "1px solid #ffb74d",
                borderLeft: "4px solid #fb8c00",
                borderRadius: 2,
                p: 2,
            }
        } >
        { /* Icon */ } <
        Typography sx = {
            {
                fontSize: 20
            }
        } > ⚠️ < /Typography>

        { /* Text */ } <
        Box >
        <
        Typography variant = "subtitle2"
        sx = {
            {
                fontWeight: 600,
                color: "#e65100",
                mb: 0.5
            }
        } >
        Important Instruction <
        /Typography>

        <
        Typography variant = "body2"
        sx = {
            {
                color: "#5d4037",
                lineHeight: 1.6
            }
        } >
        Refer 33 KV network diagram and select the number of corresponding lines as per the drawings. <
        /Typography> <
        /Box> <
        /Box> <
        /Box>

        <
        CardContent sx = {
            {
                opacity: isLineTypeSelected ? 1 : 0.5,
                pointerEvents: isLineTypeSelected ? "auto" : "none",
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                mb: 2
            }
        } >
        Create Electrical Line <
        /Typography>

        <
        Grid container spacing = {
            2
        }
        alignItems = "center" > {
            (isSCOHDog || isSCOH || isDCOH || isMCOH) && ( <
                Grid item xs = {
                    12
                }
                md = {
                    8
                } >
                <
                ElectricalFilterBar filters = {
                    filters
                }
                setFilters = {
                    setFilters
                }
                onTurbinesChange = {
                    onTurbinesChange
                }
                showCluster = {
                    false
                }
                showTurbine = {
                    false
                }
                compact = {
                    true
                } // 🔥 only here
                /> <
                /Grid>
            )
        }

        <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        TextField fullWidth label = "Selected Type"
        // value={lineType}
        value = {
            getDisplayName(lineType)
        }
        disabled /
        >
        <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            2
        } >
        <
        TextField fullWidth label = "No Of Line"
        type = "number"
        value = {
            noOfLine
        }
        onChange = {
            (e) => setNoOfLine(e.target.value)
        }
        inputProps = {
            {
                min: 1
            }
        }
        disabled = {!(filters.project && filters.windfarm)
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        Button fullWidth variant = "contained"
        size = "large"
        onClick = {
            handleCreateTable
        }
        disabled = {!lineType || !noOfLine
        }
        sx = {
            {
                backgroundColor: "#00416A",
                color: "#fff",
                "&:hover": {
                    backgroundColor: "#003354",
                },
            }
        } >
        Create Table <
        /Button> <
        /Grid> <
        /Grid> <
        /CardContent> <
        /Card>
    );
}