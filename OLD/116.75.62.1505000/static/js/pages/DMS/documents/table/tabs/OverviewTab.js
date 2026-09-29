import React from "react";
import {
    Box,
    Stack
} from "@mui/material";

import InfoGrid from "../InfoGrid";
import SectionLabel from "../SectionLabel";
import StatusChip from "../StatusChip";

const OverviewTab = ({
    doc
}) => {
    return ( <
        Stack spacing = {
            1.5
        } > { /* Document Information */ } <
        Box >
        <
        SectionLabel > Document Information < /SectionLabel> <
        InfoGrid cols = {
            4
        }
        fields = {
            [{
                    label: "Title",
                    value: doc.title,
                },
                {
                    label: "Type",
                    value: doc.document_type,
                },
                {
                    label: "Version",
                    value: doc.version || "v1",
                },
                {
                    label: "Status",
                    node: < StatusChip status = {
                        doc.status
                    }
                    />,
                },
                {
                    label: "Created By",
                    value: doc.created_by_name || doc.createdBy,
                },
                {
                    label: "Created",
                    value: doc.created_at ?
                        new Date(doc.created_at).toLocaleString() :
                        "—",
                },
                {
                    label: "Updated By",
                    value: doc.updated_by_name || doc.updatedBy,
                },
                {
                    label: "Updated",
                    value: doc.updated_at ?
                        new Date(doc.updated_at).toLocaleString() :
                        "—",
                },
            ]
        }
        /> <
        /Box>

        { /* Project & Vendor Information */ } <
        Box >
        <
        SectionLabel > Project & Vendor < /SectionLabel> <
        InfoGrid cols = {
            4
        }
        fields = {
            [{
                    label: "Project Name",
                    value: doc.project_name || doc.projectName || doc.projectId,
                },
                {
                    label: "Project ID",
                    value: doc.project || doc.projectId,
                },
                {
                    label: "Windfarm",
                    value: doc.windfarm_name || doc.windfarm || "—",
                },
                {
                    label: "Vendor",
                    value: doc.vendor || "—",
                },
                {
                    label: "File",
                    node: (() => {
                        const fileUrl = doc.current_file || doc.file ? .url;

                        // Extract only original filename from path/url
                        const fileName =
                            doc.current_file_name ||
                            doc.file ? .name ||
                            (fileUrl ?
                                decodeURIComponent(fileUrl.split("/").pop()) :
                                "—");

                        return fileUrl ? ( <
                            a href = {
                                fileUrl
                            }
                            target = "_blank"
                            rel = "noopener noreferrer"
                            style = {
                                {
                                    color: "#1976d2",
                                    textDecoration: "none",
                                    fontWeight: 500,
                                    wordBreak: "break-word",
                                }
                            } >
                            {
                                fileName
                            } <
                            /a>
                        ) : (
                            "—"
                        );
                    })(),
                },
            ]
        }
        /> <
        /Box> <
        /Stack>
    );
};

export default OverviewTab;