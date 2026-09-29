import React from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";
import singleCircuit from "../../../../assets/singleTower.png";
import MultiCircuit from "../../../../assets/MultiCircuit.png";
import DoubleCircuit from "../../../../assets/double circuit.png";
import SCOHDogIMG from "../../../../assets/SCOH dog.png";

const lineOptions = [{
        label: "SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)",
        img: SCOHDogIMG,
    },
    {
        label: "SCOH (Single Circuit Overhead Line)",
        img: singleCircuit
    },
    {
        label: "DCOH (Double Circuit Overhead Line)",
        img: DoubleCircuit
    },
    {
        label: "MCOH (Multi Circuit Overhead Line)",
        img: MultiCircuit
    },
];

export default function LineTypeSelector({
    lineType,
    setLineType,
    getDisplayName,
}) {
    return ( <
        Card sx = {
            {
                mb: 3,
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }
        } >
        <
        CardContent >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                mb: 3,
                color: "#00416A"
            }
        } >
        Select Line Type <
        /Typography>

        <
        Grid container spacing = {
            2
        } > {
            lineOptions.map((item) => {
                const isActive = lineType === item.label;

                return ( <
                    Grid item xs = {
                        12
                    }
                    sm = {
                        6
                    }
                    md = {
                        3
                    }
                    key = {
                        item.label
                    } >
                    <
                    Card onClick = {
                        () => {
                            setLineType(item.label);
                        }
                    }
                    sx = {
                        {
                            cursor: "pointer",
                            position: "relative",
                            borderRadius: 2,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: isActive ?
                                "2px solid #1976d2" :
                                "1px solid #979797ff",
                            backgroundColor: isActive ?
                                "rgba(25, 118, 210, 0.04)" :
                                "background.paper",
                            boxShadow: isActive ?
                                "0 8px 24px rgba(25, 118, 210, 0.15)" :
                                "0 2px 8px rgba(0,0,0,0.05)",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                                borderColor: isActive ? "#1976d2" : "#a4d2ffff",
                            },
                        }
                    } >
                    {
                        isActive && ( <
                            Box sx = {
                                {
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    backgroundColor: "#1976d2",
                                    color: "white",
                                    borderRadius: "50%",
                                    width: 24,
                                    height: 24,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 14,
                                    zIndex: 1,
                                }
                            } >
                            ✓
                            <
                            /Box>
                        )
                    }

                    <
                    CardContent sx = {
                        {
                            p: 3,
                            textAlign: "center"
                        }
                    } >
                    <
                    Box sx = {
                        {
                            mb: 2,
                            p: 1,
                            backgroundColor: "#FFF",
                            borderRadius: 2,
                            overflow: "hidden",
                        }
                    } >
                    <
                    img src = {
                        item.img
                    }
                    alt = {
                        item.label
                    }
                    style = {
                        {
                            width: "100%",
                            height: 100,
                            objectFit: "contain",
                            filter: isActive ? "none" : "grayscale(0.4)",
                            transition: "0.3s",
                        }
                    }
                    /> <
                    /Box>

                    <
                    Typography variant = "subtitle1"
                    sx = {
                        {
                            color: "#00416a",
                            fontWeight: 600,
                            lineHeight: 1.2,
                        }
                    } >
                    { /* {item.label} */ } {
                        getDisplayName(item.label)
                    } <
                    /Typography> <
                    /CardContent> <
                    /Card> <
                    /Grid>
                );
            })
        } <
        /Grid> <
        /CardContent> <
        /Card>
    );
}