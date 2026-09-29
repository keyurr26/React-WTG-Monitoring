import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    IconButton,
    Box,
    Typography,
    Tooltip
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";

const DefectPopup = ({
    open,
    handleClose,
    defects = [],
    addDefect,
    removeDefect, // Re-enabled for dynamic form control
    onDefectChange
}) => {

    return ( <
        Dialog open = {
            open
        }
        onClose = {
            handleClose
        }
        maxWidth = "md"
        fullWidth > {
            /* <DialogTitle sx={{ fontWeight: 600, borderBottom: "1px solid #e2e8f0", pb: 2 }}>
                            Defect Details Matrix
                        </DialogTitle> */
        }

        <
        DialogTitle sx = {
            {
                fontWeight: 600,
                borderBottom: "1px solid #e2e8f0",
                pb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }
        } >
        Defect Details Matrix <
        IconButton aria - label = "close"
        onClick = {
            handleClose
        }
        size = "small"
        sx = {
            {
                color: (theme) => theme.palette.grey[500],
                "&:hover": {
                    backgroundColor: (theme) => theme.palette.action.hover,
                }
            }
        } >
        <
        CloseIcon / >
        <
        /IconButton> <
        /DialogTitle>

        <
        DialogContent sx = {
            {
                pt: 2,
                minHeight: "200px"
            }
        } > {
            defects.length === 0 ? ( <
                Box sx = {
                    {
                        textAlign: "center",
                        py: 4,
                        color: "text.secondary"
                    }
                } >
                <
                Typography variant = "body2" > No defects added yet.Click below to add one. < /Typography> <
                /Box>
            ) : (
                defects.map((defect, index) => {
                    // Dynamically generate image previews for local file objects or persistent server strings
                    const imagePreview = defect ? .def_photo ?
                        typeof defect.def_photo === "string" ?
                        defect.def_photo :
                        URL.createObjectURL(defect.def_photo) :
                        null;

                    return ( <
                        Grid container spacing = {
                            2
                        }
                        key = {
                            index
                        }
                        alignItems = "center"
                        sx = {
                            {
                                mt: index === 0 ? 0 : 1,
                                p: 1.5,
                                borderRadius: 1,
                                backgroundColor: index % 2 === 0 ? "#f8fafc" : "transparent",
                                border: "1px solid #e2e8f0"
                            }
                        } >
                        <
                        Grid item xs = {
                            12
                        }
                        sm = {
                            3
                        } >
                        <
                        TextField label = "Location"
                        fullWidth size = "small"
                        value = {
                            defect ? .defect_location || ""
                        }
                        onChange = {
                            (e) => onDefectChange(index, "defect_location", e.target.value)
                        }
                        /> <
                        /Grid>

                        <
                        Grid item xs = {
                            12
                        }
                        sm = {
                            3
                        } >
                        <
                        TextField label = "Description"
                        fullWidth size = "small"
                        value = {
                            defect ? .defect_description || ""
                        }
                        onChange = {
                            (e) => onDefectChange(index, "defect_description", e.target.value)
                        }
                        /> <
                        /Grid>

                        <
                        Grid item xs = {
                            12
                        }
                        sm = {
                            3
                        } >
                        <
                        TextField label = "Action Taken"
                        fullWidth size = "small"
                        value = {
                            defect ? .action_taken || ""
                        }
                        onChange = {
                            (e) => onDefectChange(index, "action_taken", e.target.value)
                        }
                        /> <
                        /Grid>

                        { /* Cleaned File Input & Visual Image Preview Box */ } <
                        Grid item xs = {
                            8
                        }
                        sm = {
                            2.2
                        }
                        sx = {
                            {
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }
                        } > {!imagePreview ? ( <
                                Button component = "label"
                                variant = "outlined"
                                startIcon = { < PhotoCameraIcon / >
                                }
                                size = "small"
                                fullWidth sx = {
                                    {
                                        textTransform: "none",
                                        height: "40px"
                                    }
                                } >
                                Add Photo <
                                input type = "file"
                                accept = "image/*"
                                hidden onChange = {
                                    (e) => onDefectChange(index, "def_photo", e.target.files[0])
                                }
                                /> <
                                /Button>
                            ) : ( <
                                Box sx = {
                                    {
                                        position: "relative",
                                        width: "55px",
                                        height: "40px"
                                    }
                                } >
                                <
                                img src = {
                                    imagePreview
                                }
                                alt = {
                                    `Defect ${index + 1}`
                                }
                                style = {
                                    {
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: "4px",
                                        border: "1px solid #cbd5e1"
                                    }
                                }
                                /> <
                                IconButton size = "small"
                                onClick = {
                                    () => onDefectChange(index, "def_photo", null)
                                }
                                sx = {
                                    {
                                        position: "absolute",
                                        top: -6,
                                        right: -6,
                                        bgcolor: "error.main",
                                        color: "white",
                                        width: 16,
                                        height: 16,
                                        fontSize: "10px",
                                        "&:hover": {
                                            bgcolor: "error.dark"
                                        }
                                    }
                                } >
                                <
                                CloseIcon fontSize = "inherit" / >
                                <
                                /IconButton> <
                                /Box>
                            )
                        } <
                        /Grid>

                        { /* Row Deletion action button */ } <
                        Grid item xs = {
                            4
                        }
                        sm = {
                            0.8
                        }
                        sx = {
                            {
                                textAlign: "right"
                            }
                        } >
                        <
                        Tooltip title = "Remove Defect Row" >
                        <
                        IconButton color = "error"
                        disabled = {!removeDefect
                        }
                        onClick = {
                            () => removeDefect(index)
                        }
                        size = "small" >
                        <
                        DeleteIcon / >
                        <
                        /IconButton> <
                        /Tooltip> <
                        /Grid> <
                        /Grid>
                    );
                })
            )
        }

        <
        Button variant = "contained"
        startIcon = { < AddIcon / >
        }
        onClick = {
            addDefect
        }
        sx = {
            {
                mt: 3,
                textTransform: "none"
            }
        }
        size = "small" >
        Add Defect Row <
        /Button> <
        /DialogContent>

        <
        DialogActions sx = {
            {
                p: 2.5,
                borderTop: "1px solid #e2e8f0"
            }
        } >
        <
        Button onClick = {
            handleClose
        }
        variant = "outlined"
        color = "secondary"
        sx = {
            {
                textTransform: "none"
            }
        } >
        Save <
        /Button> <
        /DialogActions> <
        /Dialog>
    );
};

export default DefectPopup;