import {
    useState,
    useCallback
} from "react";
import {
    Button,
    Chip
} from "@mui/material";

export const useTableViewer = () => {
    const [viewer, setViewer] = useState({
        open: false,
        items: [],
        title: "",
        type: "",
    });
    const openViewer = useCallback((items, title, type) => {
        const list = Array.isArray(items) ? items : [items];
        setViewer({
            open: true,
            items: list,
            title,
            type
        });
    }, []);
    const closeViewer = useCallback(() => {
        setViewer((prev) => ({ ...prev,
            open: false
        }));
    }, []);
    const detectViewerType = (key, value) => {
        if (!value) return null;
        if (key === "defects") return "rows";
        if (key === "attachments_list" || key === "selected_items") {
            return "docs";
        }
        if (
            key.toLowerCase().includes("document") ||
            key.toLowerCase().includes("attachment")
        )
            return "docs";
        if (
            key.toLowerCase().includes("photo") ||
            key.toLowerCase().includes("image") ||
            key.toLowerCase().includes("slip")
        )
            return "images";
        if (Array.isArray(value) && typeof value[0] === "string") return "images";
        return null;
    };
    const buildColumns = (headerMap, includeStatus = false) => {
        const cols = Object.keys(headerMap).map((key) => ({
            id: key,
            label: headerMap[key],
            render: (row) => {
                const value = row[key];
                if (!value || (Array.isArray(value) && value.length === 0)) return "—";
                const viewerType = detectViewerType(key, value);
                if (viewerType) {
                    const count = Array.isArray(value) ? value.length : 1;
                    return ( <
                        Button size = "small"
                        onClick = {
                            () => openViewer(value, headerMap[key], viewerType)
                        }
                        sx = {
                            {
                                textTransform: "none",
                                borderBottom: "1px solid",
                                borderRadius: 0,
                            }
                        } >
                        {
                            `View (${count})`
                        } <
                        /Button>
                    );
                }
                return value;
            },
        }));
        if (includeStatus) {
            cols.push({
                id: "approved_status",
                label: "Status",
                align: "center",
                render: (row) => ( <
                    Chip size = "small"
                    label = {
                        row.approve_date ? "Approved" : "Pending"
                    }
                    color = {
                        row.approve_date ? "success" : "warning"
                    }
                    variant = "outlined" /
                    >
                ),
            });
        }
        return cols;
    };
    return {
        viewer,
        openViewer,
        closeViewer,
        buildColumns
    };
};