import React from "react";
import {
    Box,
    Typography
} from "@mui/material";

const InfoGrid = ({
    fields = [],
    cols = 4,
    sx = {},
}) => {
    return ( <
        Box sx = {
            {
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                border: "0.5px solid",
                borderColor: "divider",
                borderRadius: 1,
                overflow: "hidden",
                ...sx,
            }
        } >
        {
            fields.map((item, index) => {
                const isLastColumn = (index + 1) % cols === 0;
                const isLastRow =
                    index >= fields.length - (fields.length % cols || cols);

                return ( <
                    Box key = {
                        index
                    }
                    sx = {
                        {
                            px: 0.8,
                            py: 0.6,
                            lineHeight: 1.2,
                            borderRight: isLastColumn ? "none" : "0.5px solid",
                            borderBottom: isLastRow ? "none" : "0.5px solid",
                            borderColor: "divider",
                        }
                    } >
                    { /* LABEL */ } <
                    Typography sx = {
                        {
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            color: "text.secondary",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            mb: 0.4,
                        }
                    } >
                    {
                        item.label
                    } <
                    /Typography>

                    { /* VALUE or CUSTOM NODE */ } {
                        item.node ? (
                            item.node
                        ) : ( <
                            Typography sx = {
                                {
                                    fontSize: "0.8rem",
                                    color: "text.primary",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }
                            }
                            title = {
                                item.value
                            } >
                            {
                                item.value || "—"
                            } <
                            /Typography>
                        )
                    } <
                    /Box>
                );
            })
        } <
        /Box>
    );
};

export default InfoGrid;