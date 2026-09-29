import React, {
    useState,
    useEffect
} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Typography,
    Chip,
    Box,
} from "@mui/material";
const DelayPopup = ({
    open,
    onClose,
    onSubmit,
    delayCauses,
    delayData
}) => {
    const [cause, setCause] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        cause: false,
        description: false,
    });
    useEffect(() => {
        if (open && delayData) {
            setCause(delayData.delay_cause || "");
            setDescription(delayData.description || "");
            setErrors({
                cause: false,
                description: false
            });
        }
    }, [delayData, open]);
    const hasExistingRecord = Boolean(delayData ? .id);
    const isStartingDelay = (delayData ? .starting_delay_days || 0) > 0;
    const handleSubmit = async () => {
        const newErrors = {
            cause: !cause,
            description: !description.trim(),
        };
        setErrors(newErrors);
        if (newErrors.cause || newErrors.description) return;
        setIsSubmitting(true);
        const success = await onSubmit({
            ...delayData,
            delay_cause: cause,
            description,
        });
        setIsSubmitting(false);
        if (success) {
            setCause("");
            setDescription("");
            onClose();
        }
    };
    return ( <
        Dialog open = {
            open
        }
        onClose = {
            onClose
        }
        fullWidth maxWidth = "xs" >
        <
        DialogTitle sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }
        } >
        <
        span > {
            hasExistingRecord ? "View Delay Details" : "Delay Analysis"
        } <
        /span> { /* Dynamic Badge showing Starting vs Working Delay */ } <
        Chip label = {
            isStartingDelay ? "Starting Delay" : "Working Delay"
        }
        color = {
            isStartingDelay ? "error" : "warning"
        }
        size = "small" /
        >
        <
        /DialogTitle> <
        DialogContent >
        <
        Box sx = {
            {
                my: 1,
                p: 1.5,
                bgcolor: "background.default",
                borderRadius: 1
            }
        } >
        <
        Typography variant = "body2"
        color = "text.secondary" > {
            isStartingDelay ? "Starting Delay Days:" : "Working Delay Days:"
        } <
        /Typography> <
        Typography variant = "h6"
        color = "error.main"
        fontWeight = "bold" > {
            isStartingDelay ?
            delayData ? .starting_delay_days :
            delayData ? .working_delay_days
        } {
            " "
        }
        Days <
        /Typography> <
        /Box> {
            hasExistingRecord && ( <
                Typography variant = "caption"
                color = "warning.main"
                sx = {
                    {
                        display: "block",
                        mb: 1
                    }
                } >
                *
                This delay log has already been registered in the system. <
                /Typography>
            )
        } <
        TextField select fullWidth required label = "Delay Cause"
        value = {
            cause
        }
        disabled = {
            hasExistingRecord || isSubmitting
        }
        onChange = {
            (e) => {
                setCause(e.target.value);
                setErrors((prev) => ({ ...prev,
                    cause: false
                }));
            }
        }
        error = {
            errors.cause
        }
        helperText = {
            errors.cause ? "Delay cause is required" : ""
        }
        sx = {
            {
                mt: 2
            }
        } >
        {
            delayCauses ?
            .filter((c) => c.type === "Delay Cause")
            .map((c) => ( <
                MenuItem key = {
                    c.id
                }
                value = {
                    c.id
                } > {
                    c.name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        TextField fullWidth required label = "Description"
        multiline minRows = {
            3
        }
        value = {
            description
        }
        disabled = {
            hasExistingRecord || isSubmitting
        }
        onChange = {
            (e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev,
                    description: false
                }));
            }
        }
        error = {
            errors.description
        }
        helperText = {
            errors.description ? "Description is required" : ""
        }
        sx = {
            {
                mt: 2
            }
        }
        /> <
        /DialogContent> <
        DialogActions >
        <
        Button onClick = {
            onClose
        }
        disabled = {
            isSubmitting
        } >
        Cancel <
        /Button> <
        Button onClick = {
            handleSubmit
        }
        variant = "contained"
        disabled = {
            hasExistingRecord || isSubmitting
        } >
        {
            isSubmitting ? "Saving..." : "Save Delay"
        } <
        /Button> <
        /DialogActions> <
        /Dialog>
    );
};
export default DelayPopup;