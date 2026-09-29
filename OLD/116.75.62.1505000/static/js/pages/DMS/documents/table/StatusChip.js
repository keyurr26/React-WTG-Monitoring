import React from "react";
import {
    Chip
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PendingIcon from "@mui/icons-material/Pending";

// ================= STATUS STYLE MAP =================
const STATUS_MAP = {
    approved: {
        bg: "#ecfdf5",
        color: "#065f46",
        icon: < CheckCircleIcon sx = {
            {
                fontSize: 13,
                color: "#10b981"
            }
        }
        />,
    },
    rejected: {
        bg: "#fef2f2",
        color: "#991b1b",
        icon: < CancelIcon sx = {
            {
                fontSize: 13,
                color: "#ef4444"
            }
        }
        />,
    },
    pending: {
        bg: "#fffbeb",
        color: "#92400e",
        icon: < PendingIcon sx = {
            {
                fontSize: 13,
                color: "#f59e0b"
            }
        }
        />,
    },
    "in review": {
        bg: "#eff6ff",
        color: "#1e40af",
        icon: null,
    },
    flagged: {
        bg: "#fff7ed",
        color: "#c2410c",
        icon: null,
    },
};

// ================= COMPONENT =================
const StatusChip = ({
    status
}) => {
    const normalized = status ? .toLowerCase() ? .trim();

    const s = STATUS_MAP[normalized] || {
        bg: "#f3f4f6",
        color: "#374151",
        icon: null,
    };

    return ( <
        Chip size = "small"
        label = {
            status || "pending"
        }
        icon = {
            s.icon
        }
        sx = {
            {
                bgcolor: s.bg,
                color: s.color,
                fontWeight: 500,
                fontSize: "0.7rem",
                height: 22,
                textTransform: "capitalize",

                "& .MuiChip-icon": {
                    ml: "6px",
                },

                "& .MuiChip-label": {
                    px: "7px",
                },
            }
        }
        />
    );
};

export default StatusChip;