import React from "react";
import {
    Typography
} from "@mui/material";

const SectionLabel = ({
    children
}) => {
    return ( <
        Typography sx = {
            {
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                mb: 0.75,
                mt: 0.25,
                display: "inline-block",
            }
        } >
        {
            children
        } <
        /Typography>
    );
};

export default SectionLabel;