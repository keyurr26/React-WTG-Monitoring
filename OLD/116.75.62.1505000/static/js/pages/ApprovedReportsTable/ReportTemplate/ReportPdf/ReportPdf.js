// ReportPdf/ReportPdf.jsx
import React, {
    useState
} from "react";
import {
    Document,
    Page,
    Text,
    View,
    Image,
    PDFDownloadLink,
    PDFViewer,
} from "@react-pdf/renderer";
import {
    CircularProgress,
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogActions,
    Button,
    Box,
    Tabs,
    Tab,
} from "@mui/material";
import PreviewIcon from "@mui/icons-material/Preview";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import LogoUges from "../../../../assets/logo1bg.png";
import RELogo from "../../../../assets/WTG Construction/RE LOGO.png";
import {
    pdfStyles,
    getPhotoStyle
} from "./reportPdfStyles";

// ==================== CONSTANT ====================
const ROWS_PER_PAGE = 5;

// ==================== HELPERS ====================

const getStatusStyle = (status) => {
    const s = status ? .toLowerCase() || "";
    if (s === "completed") return pdfStyles.statusCompleted;
    if (s === "in_progress" || s === "inprogress") return pdfStyles.statusInProgress;
    if (s === "pending") return pdfStyles.statusPending;
    return {};
};

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date
        .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        .toUpperCase();
};

// Small reusable cell wrapper
const Cell = ({
    flex,
    children,
    style
}) => ( <
    View style = {
        [{
                flex,
                paddingVertical: 6,
                paddingHorizontal: 3,
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid",
            },
            style,
        ]
    } >
    {
        children
    } <
    /View>
);

const LastCell = ({
    flex,
    children,
    style
}) => ( <
    View style = {
        [{
                flex,
                paddingVertical: 6,
                paddingHorizontal: 3,
                justifyContent: "center",
                alignItems: "center",
            },
            style,
        ]
    } >
    {
        children
    } <
    /View>
);

// ==================== HEADER / FOOTER / PHOTO ====================

const PdfHeader = () => ( <
    View style = {
        pdfStyles.headerContainer
    } >
    <
    View style = {
        pdfStyles.logoBox
    } >
    <
    Image src = {
        LogoUges
    }
    style = {
        pdfStyles.logo
    }
    /> <
    /View> <
    View style = {
        pdfStyles.titleBox
    } >
    <
    Text style = {
        pdfStyles.titleText
    } > Project Progress Report < /Text> <
    Text style = {
        pdfStyles.subtitleText
    } >
    (An ISO 9001: 2015 and ISO 45001: 2018 Certified Company) <
    /Text> <
    /View> <
    /View>
);

const PdfFooter = ({
    pageNumber,
    totalPages,
    projectData
}) => ( <
    View style = {
        pdfStyles.footer
    } >
    <
    View style = {
        pdfStyles.dividerLine
    }
    /> <
    View style = {
        pdfStyles.footerContent
    } >
    <
    Text style = {
        pdfStyles.pageNumber
    } >
    UGES– 2026 - 2027 / {
        projectData ? .client_name || "N/A"
    } <
    /Text> <
    Text style = {
        pdfStyles.pageNumber
    } >
    Page {
        pageNumber
    } of {
        totalPages
    } <
    /Text> <
    /View> <
    /View>
);


const EvidencePhoto = ({
    photoUrl,
    size = "normal",
    customStyle
}) => {
    if (!photoUrl) {
        return <Text style = {
            pdfStyles.noPhotoText
        } > No Photo < /Text>;
    }
    const style = customStyle || getPhotoStyle(size);
    return ( <
        View style = {
            {
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
            }
        } >
        <
        Image src = {
            photoUrl
        }
        style = {
            style
        }
        /> <
        /View>
    );
};
// ==================== GENERIC TABLE BUILDER ====================
// Ek hi builder se saare tables bana rahe hain — bas columns aur rowRenderer pass karo

const GenericTable = ({
    columns,
    data,
    startIndex,
    renderRow
}) => ( <
    View style = {
        [pdfStyles.table, {
            marginTop: 8
        }]
    } > { /* Header */ } <
    View style = {
        pdfStyles.tableRow
    }
    fixed > {
        columns.map((col, idx) => ( <
            View key = {
                idx
            }
            style = {
                {
                    flex: col.width,
                    paddingVertical: 6,
                    paddingHorizontal: 3,
                    backgroundColor: "#f0f8ff",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: idx < columns.length - 1 ? 1 : 0,
                    borderRightColor: "#777",
                    borderRightStyle: "solid",
                }
            } >
            <
            Text style = {
                [
                    pdfStyles.tableCellText,
                    {
                        fontWeight: "bold",
                        color: "#003366",
                        fontSize: col.fontSize || 7,
                        textAlign: "center",
                    },
                ]
            } >
            {
                col.label
            } <
            /Text> <
            /View>
        ))
    } <
    /View>

    { /* Rows */ } {
        data.map((item, idx) => {
            const srNo = startIndex + idx + 1;
            const isLast = idx === data.length - 1;
            return ( <
                View key = {
                    idx
                }
                style = {
                    [
                        pdfStyles.tableRow,
                        isLast && {
                            borderBottomWidth: 0
                        },
                    ]
                }
                wrap = {
                    false
                } >
                {
                    renderRow(item, srNo, isLast)
                } <
                /View>
            );
        })
    } <
    /View>
);

// ==================== 1. SOIL ====================
const SoilTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine No",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location No",
            width: 0.9
        },
        {
            key: "sampling_date",
            label: "Sampling Date",
            width: 1.0
        },
        {
            key: "approved_date",
            label: "Approved Date",
            width: 1.0
        },
        {
            key: "soil_status",
            label: "Soil Status",
            width: 0.9
        },
        {
            key: "remarks",
            label: "Remarks",
            width: 1.6
        },
        {
            key: "evidence_photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.date_of_sampling)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.approve_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.soil_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.soil_status || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.6
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.remarks || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 2. EXCAVATION ====================
const ExcavationTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "start_date",
            label: "Start Date",
            width: 1.0
        },
        {
            key: "approve_date",
            label: "Approved Date",
            width: 1.1
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.start_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.1
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.approve_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.excavation_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.excavation_status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 3. PCC ====================
const PccTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "start_date",
            label: "Start Date",
            width: 1.0
        },
        {
            key: "work_description",
            label: "Work Description",
            width: 1.6
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "approve_date",
            label: "Approved Date",
            width: 1.1
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.start_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.6
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.work_description || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.pcc_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.pcc_status || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.1
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.approve_date)
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 4. CONDUCT LAYING ====================
const ConductTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "start_date",
            label: "Start Date",
            width: 1.0
        },
        {
            key: "work_description",
            label: "Work Description",
            width: 1.6
        },
        {
            key: "remarks",
            label: "Remarks",
            width: 1.2
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.start_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.6
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.work_description || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.2
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.remarks || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.conduct_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.conduct_status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 5. REINFORCEMENT ====================
const ReinforcementTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "start_date",
            label: "Start Date",
            width: 1.0
        },
        {
            key: "observations",
            label: "Observations",
            width: 1.8
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "approve_date",
            label: "Approved Date",
            width: 1.1
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.start_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.observations || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.reinforcement_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.reinforcement_status || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.1
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.approve_date)
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 6. FOUNDATION ====================
const FoundationTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "foundation_type",
            label: "Type",
            width: 0.9
        },
        {
            key: "start_date",
            label: "Start Date",
            width: 1.0
        },
        {
            key: "batching",
            label: "Batching Plant",
            width: 1.2
        },
        {
            key: "remarks",
            label: "Remarks",
            width: 1.6
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.foundation_type || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.start_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.2
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.batching_plant_location || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.6
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.remarks_observations || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.foundation_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.foundation_status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 7. POURING ====================
const PouringTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "start_time",
            label: "Start",
            width: 1.0
        },
        {
            key: "end_time",
            label: "End",
            width: 1.0
        },
        {
            key: "qty",
            label: "Qty (cum)",
            width: 0.8
        },
        {
            key: "action",
            label: "Action",
            width: 0.8
        },
        {
            key: "remarks",
            label: "Remarks",
            width: 1.6
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.4
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.pouring_start_time)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.pouring_end_time)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.quantity_delivered || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.action_taken || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.6
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.remarks || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.pouring_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.pouring_status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.4
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo || item.batching_slip
                        }
                        size = "normal" /
                        >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.4
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo || item.batching_slip
                        }
                        size = "normal" /
                        >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 8. DESHUTTER ====================
const DeshutterTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "desh_date",
            label: "Deshuttering Date",
            width: 1.2
        },
        {
            key: "defect",
            label: "Defect Found",
            width: 1.0
        },
        {
            key: "remarks",
            label: "Remarks",
            width: 1.8
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.2
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.deshuttering_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.defect_found ? "Yes" : "No"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.remarks || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.desh_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.desh_status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 9. CUBE RESULT ====================
const CubeTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "days",
            label: "Days",
            width: 0.8
        },
        {
            key: "criteria",
            label: "Acceptance",
            width: 0.9
        },
        {
            key: "remark",
            label: "Remark",
            width: 1.8
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "approve_date",
            label: "Approved Date",
            width: 1.1
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.no_of_days_test || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.acceptance_criteria || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.remark || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.cr_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.cr_status || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.1
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.approve_date)
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 10. BACKFILLING ====================
const BackfillTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "date",
            label: "Backfill Date",
            width: 1.1
        },
        {
            key: "compaction",
            label: "Compaction %",
            width: 1.1
        },
        {
            key: "remarks",
            label: "Remarks",
            width: 1.8
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.1
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.backfilling_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.1
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.compaction_percentage ? `${item.compaction_percentage}%` : "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.remarks || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.backfill_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.backfill_status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 11. PLATFORM DPR ====================
const PlatformTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "work_date",
            label: "Work Date",
            width: 1.1
        },
        {
            key: "level",
            label: "Level",
            width: 0.8
        },
        {
            key: "compaction",
            label: "Compaction %",
            width: 1.1
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.1
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.work_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.level || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.1
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.compaction_achieved ? `${item.compaction_achieved}%` : "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.activity_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.activity_status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 12. T1 INSTALLATION ====================
const T1Table = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "lifting_start",
            label: "Lifting Start",
            width: 1.1
        },
        {
            key: "lifting_end",
            label: "Lifting End",
            width: 1.1
        },
        {
            key: "leveling",
            label: "Leveling",
            width: 0.9
        },
        {
            key: "grouting",
            label: "Grouting",
            width: 0.9
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.1
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.lifting_start)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.1
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.lifting_end)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.leveling || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.grouting || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.t1_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.t1_status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 13. TOWER INSTALLATION ====================
const TowerTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "lifting_start",
            label: "Lifting Start",
            width: 1.1
        },
        {
            key: "lifting_end",
            label: "Lifting End",
            width: 1.1
        },
        {
            key: "remarks",
            label: "Remarks",
            width: 1.8
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.1
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.lifting_start)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.1
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.lifting_end)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.remarks || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.tower_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.tower_status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 14. NACELLE INSTALLATION ====================
const NacelleTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "submitted_at",
            label: "Submitted At",
            width: 1.2
        },
        {
            key: "approve_date",
            label: "Approved Date",
            width: 1.2
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.8
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.2
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.submitted_at)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.2
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.approve_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.nacelle_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.nacelle_status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.8
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.8
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 15. ROTOR HUB ====================
const RotorTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.9
        },
        {
            key: "location_no",
            label: "Location",
            width: 1.0
        },
        {
            key: "submitted_at",
            label: "Submitted At",
            width: 1.2
        },
        {
            key: "approve_date",
            label: "Approved Date",
            width: 1.2
        },
        {
            key: "status",
            label: "Status",
            width: 1.0
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.8
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.2
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.submitted_at)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.2
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.approve_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.rotor_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.rotor_status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.8
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.8
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 16. BLADE INSTALLATION ====================
const BladeTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.8
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "blade_no",
            label: "Blade No",
            width: 0.9
        },
        {
            key: "submitted_at",
            label: "Submitted At",
            width: 1.2
        },
        {
            key: "approve_date",
            label: "Approved Date",
            width: 1.2
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.blade_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.2
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.submitted_at)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.2
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.approve_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.blade_status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.blade_status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 17. USS MASTER ====================
const UssTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.9
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "uss_name",
            label: "USS Name",
            width: 1.2
        },
        {
            key: "activities",
            label: "Activities",
            width: 1.8
        },
        {
            key: "start_photo",
            label: "Start Photo",
            width: 1.0
        },
        {
            key: "end_photo",
            label: "End Photo",
            width: 1.0
        },
        {
            key: "submitted_at",
            label: "Submitted At",
            width: 1.0
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => {
                const activities =
                    item.activity_details ? .map((a) => a.name).join(", ") || "N/A";
                return ( <
                    >
                    <
                    Cell flex = {
                        0.3
                    } >
                    <
                    Text style = {
                        [pdfStyles.tableCellText, {
                            textAlign: "center"
                        }]
                    } > {
                        srNo
                    } < /Text> <
                    /Cell> <
                    Cell flex = {
                        0.9
                    } >
                    <
                    Text style = {
                        [pdfStyles.tableCellText, {
                            textAlign: "center"
                        }]
                    } > {
                        item.turbine_code || "N/A"
                    } <
                    /Text> <
                    /Cell> <
                    Cell flex = {
                        0.9
                    } >
                    <
                    Text style = {
                        [pdfStyles.tableCellText, {
                            textAlign: "center"
                        }]
                    } > {
                        item.location_no || "N/A"
                    } <
                    /Text> <
                    /Cell> <
                    Cell flex = {
                        1.2
                    } >
                    <
                    Text style = {
                        [pdfStyles.tableCellText, {
                            fontSize: 6,
                            textAlign: "center"
                        }]
                    } > {
                        item.uss_name || "N/A"
                    } <
                    /Text> <
                    /Cell> <
                    Cell flex = {
                        1.8
                    } >
                    <
                    Text style = {
                        [pdfStyles.tableCellText, {
                            fontSize: 6,
                            textAlign: "center"
                        }]
                    } > {
                        activities
                    } <
                    /Text> <
                    /Cell> <
                    Cell flex = {
                        1.0
                    } >
                    <
                    EvidencePhoto photoUrl = {
                        item.start_photo
                    }
                    size = "small" / >
                    <
                    /Cell> <
                    Cell flex = {
                        1.0
                    } >
                    <
                    EvidencePhoto photoUrl = {
                        item.end_photo
                    }
                    size = "small" / >
                    <
                    /Cell> <
                    Cell flex = {
                        1.0
                    } >
                    <
                    Text style = {
                        [pdfStyles.tableCellText, {
                            fontSize: 6,
                            textAlign: "center"
                        }]
                    } > {
                        formatDate(item.submitted_at)
                    } <
                    /Text> <
                    /Cell> {
                        isLast ? ( <
                            LastCell flex = {
                                0.9
                            } >
                            <
                            Text style = {
                                [
                                    pdfStyles.statusBadge,
                                    item.approved_at ?
                                    pdfStyles.statusCompleted :
                                    pdfStyles.statusPending,
                                    {
                                        textAlign: "center",
                                        fontSize: 6
                                    },
                                ]
                            } >
                            {
                                item.approved_at ? formatDate(item.approved_at) : "Pending"
                            } <
                            /Text> <
                            /LastCell>
                        ) : ( <
                            Cell flex = {
                                0.9
                            } >
                            <
                            Text style = {
                                [
                                    pdfStyles.statusBadge,
                                    item.approved_at ?
                                    pdfStyles.statusCompleted :
                                    pdfStyles.statusPending,
                                    {
                                        textAlign: "center",
                                        fontSize: 6
                                    },
                                ]
                            } >
                            {
                                item.approved_at ? formatDate(item.approved_at) : "Pending"
                            } <
                            /Text> <
                            /Cell>
                        )
                    } <
                    />
                );
            }
        }
        />
    );
};

// ==================== 18. ELECTRICAL LINE ====================
const ElectricalTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "line_name",
            label: "Line Name",
            width: 1.0
        },
        {
            key: "line_type",
            label: "Line Type",
            width: 0.8
        },
        {
            key: "turbine_locations",
            label: "Turbine Locations",
            width: 1.3
        },
        {
            key: "total_poles",
            label: "Poles",
            width: 0.5
        },
        {
            key: "start_date",
            label: "Start Date",
            width: 0.9
        },
        {
            key: "l1_approval",
            label: "L1 Approval",
            width: 0.9
        },
        {
            key: "l1_photo",
            label: "L1 Photo",
            width: 0.9
        },
        {
            key: "l2_approval",
            label: "L2 Approval",
            width: 0.9
        },
        {
            key: "l2_photo",
            label: "L2 Photo",
            width: 0.9
        },
        {
            key: "l3_approval",
            label: "L3 Approval",
            width: 0.9
        },
        {
            key: "l3_photo",
            label: "L3 Photo",
            width: 0.9
        },
        {
            key: "final_approval",
            label: "Final Approval",
            width: 0.9
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    1.0
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.line_name || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.8
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.line_type || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_locations || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.5
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.total_poles || 0
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.start_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.l1_approved_at)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                EvidencePhoto photoUrl = {
                    item.l1_photo
                }
                size = "small" / >
                <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.l2_approved_at)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                EvidencePhoto photoUrl = {
                    item.l2_photo
                }
                size = "small" / >
                <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.l3_approved_at)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                EvidencePhoto photoUrl = {
                    item.l3_photo
                }
                size = "small" / >
                <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            0.9
                        } >
                        <
                        Text style = {
                            [pdfStyles.tableCellText, {
                                fontSize: 6,
                                textAlign: "center"
                            }]
                        } > {
                            formatDate(item.approved_at)
                        } <
                        /Text> <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            0.9
                        } >
                        <
                        Text style = {
                            [pdfStyles.tableCellText, {
                                fontSize: 6,
                                textAlign: "center"
                            }]
                        } > {
                            formatDate(item.approved_at)
                        } <
                        /Text> <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== 19. COMMISSIONING ====================
const CommissionTable = ({
    data,
    startIndex
}) => {
    const columns = [{
            key: "sno",
            label: "S.No",
            width: 0.3
        },
        {
            key: "turbine_code",
            label: "Turbine",
            width: 0.9
        },
        {
            key: "location_no",
            label: "Location",
            width: 0.9
        },
        {
            key: "submitted_at",
            label: "Submitted At",
            width: 1.2
        },
        {
            key: "approve_date",
            label: "Approved Date",
            width: 1.2
        },
        {
            key: "status",
            label: "Status",
            width: 0.9
        },
        {
            key: "photo",
            label: "Evidence Photo",
            width: 1.6
        },
    ];

    return ( <
        GenericTable columns = {
            columns
        }
        data = {
            data
        }
        startIndex = {
            startIndex
        }
        renderRow = {
            (item, srNo, isLast) => ( <
                >
                <
                Cell flex = {
                    0.3
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    srNo
                } < /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.turbine_code || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        textAlign: "center"
                    }]
                } > {
                    item.location_no || "N/A"
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.2
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.submitted_at)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    1.2
                } >
                <
                Text style = {
                    [pdfStyles.tableCellText, {
                        fontSize: 6,
                        textAlign: "center"
                    }]
                } > {
                    formatDate(item.approve_date)
                } <
                /Text> <
                /Cell> <
                Cell flex = {
                    0.9
                } >
                <
                Text style = {
                    [
                        pdfStyles.statusBadge,
                        getStatusStyle(item.status),
                        {
                            textAlign: "center",
                            fontSize: 6
                        },
                    ]
                } >
                {
                    item.status || "N/A"
                } <
                /Text> <
                /Cell> {
                    isLast ? ( <
                        LastCell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /LastCell>
                    ) : ( <
                        Cell flex = {
                            1.6
                        } >
                        <
                        EvidencePhoto photoUrl = {
                            item.evidence_photo
                        }
                        size = "normal" / >
                        <
                        /Cell>
                    )
                } <
                />
            )
        }
        />
    );
};

// ==================== SECTION → TABLE MAP ====================
const TABLE_MAP = {
    soil: SoilTable,
    excavation: ExcavationTable,
    pcc: PccTable,
    conduct: ConductTable,
    rein: ReinforcementTable,
    reinforcement: ReinforcementTable,
    foundation: FoundationTable,
    pouring: PouringTable,
    deshutter: DeshutterTable,
    cube: CubeTable,
    backfill: BackfillTable,
    backfilling: BackfillTable,
    platform: PlatformTable,
    t1: T1Table,
    tower: TowerTable,
    nacelle: NacelleTable,
    rotor: RotorTable,
    blade: BladeTable,
    uss: UssTable,
    electrical: ElectricalTable,
    commission: CommissionTable,
    commissioning: CommissionTable,
};

// ==================== MAIN DOCUMENT ====================

const ReportPdfDocument = ({
    projectData,
    windfarmData,
    clusterData,
    activitySections = [],
    gridImages = [],
}) => {
    const chunkData = (data) => {
        if (!Array.isArray(data) || data.length === 0) return [
            []
        ];
        const chunks = [];
        for (let i = 0; i < data.length; i += ROWS_PER_PAGE) {
            chunks.push(data.slice(i, i + ROWS_PER_PAGE));
        }
        return chunks;
    };

    let calculatedTotalPages = 3;
    activitySections.forEach((section) => {
        const chunks = chunkData(section.data);
        calculatedTotalPages += chunks.length;
    });
    const finalTotalPages = calculatedTotalPages;

    const renderActivityTable = (
        section,
        chunk,
        pageNumber,
        chunkIndex,
        totalChunks,
        globalStartIndex,
    ) => {
        const {
            key,
            title,
            data
        } = section;
        const TableComponent = TABLE_MAP[key] || SoilTable;

        return ( <
            Page key = {
                `${key}-${pageNumber}`
            }
            size = "A4"
            style = {
                pdfStyles.page
            } >
            <
            View style = {
                pdfStyles.pageContent
            } >
            <
            PdfHeader / >
            <
            View >
            <
            Text style = {
                pdfStyles.sectionTitle
            } > {
                title
            } < /Text> <
            Text style = {
                pdfStyles.sectionNote
            } >
            Total: {
                data.length
            }
            records | Page {
                chunkIndex + 1
            } of {
                totalChunks
            } <
            /Text> <
            TableComponent data = {
                chunk
            }
            startIndex = {
                globalStartIndex
            }
            sectionKey = {
                key
            }
            /> <
            /View> <
            /View> <
            PdfFooter pageNumber = {
                pageNumber
            }
            totalPages = {
                finalTotalPages
            }
            projectData = {
                projectData
            }
            /> <
            /Page>
        );
    };

    const activityPages = (() => {
        const pages = [];
        let nextPage = 4;
        let globalStart = 0;

        activitySections.forEach((section) => {
            const chunks = chunkData(section.data);
            const startPage = nextPage;
            const startIdx = globalStart;

            chunks.forEach((chunk, idx) => {
                pages.push({
                    section,
                    chunk,
                    pageNumber: startPage + idx,
                    chunkIndex: idx,
                    totalChunks: chunks.length,
                    globalStartIndex: startIdx + idx * ROWS_PER_PAGE,
                });
            });

            nextPage += chunks.length;
            globalStart += section.data.length;
        });

        return pages;
    })();

    return ( <
        Document > { /* ========== COVER PAGE ========== */ } <
        Page size = "A4"
        style = {
            pdfStyles.page
        } >
        <
        View style = {
            pdfStyles.pageContent
        } >
        <
        PdfHeader / >
        <
        View style = {
            pdfStyles.imageGrid
        } > {
            gridImages.map((img, index) => ( <
                Image key = {
                    index
                }
                src = {
                    img.src
                }
                style = {
                    pdfStyles.gridImage
                }
                />
            ))
        } <
        /View> <
        Image src = {
            RELogo
        }
        style = {
            pdfStyles.reLogo
        }
        /> <
        View style = {
            pdfStyles.detailsTable
        } >
        <
        View style = {
            pdfStyles.detailRow
        } >
        <
        Text style = {
            pdfStyles.detailLabel
        } > Project: < /Text> <
        Text style = {
            pdfStyles.detailValue
        } > {
            projectData ? .project_name || "N/A"
        } <
        /Text> <
        /View> <
        View style = {
            pdfStyles.detailRow
        } >
        <
        Text style = {
            pdfStyles.detailLabel
        } > Windfarm: < /Text> <
        Text style = {
            pdfStyles.detailValue
        } > {
            windfarmData ? .windfarm_name || "N/A"
        } <
        /Text> <
        /View> <
        View style = {
            pdfStyles.detailRow
        } >
        <
        Text style = {
            pdfStyles.detailLabel
        } > Cluster: < /Text> <
        Text style = {
            pdfStyles.detailValue
        } > {
            clusterData ? .cluster_name || "N/A"
        } <
        /Text> <
        /View> <
        View style = {
            pdfStyles.detailRow
        } >
        <
        Text style = {
            pdfStyles.detailLabel
        } > Client: < /Text> <
        Text style = {
            pdfStyles.detailValue
        } > {
            projectData ? .client_name || "N/A"
        } <
        /Text> <
        /View> <
        View style = {
            pdfStyles.detailRow
        } >
        <
        Text style = {
            pdfStyles.detailLabel
        } > Report Date: < /Text> <
        Text style = {
            pdfStyles.detailValue
        } > {
            formatDate(projectData ? .created_at)
        } <
        /Text> <
        /View> <
        /View>

        <
        View style = {
            pdfStyles.table
        } >
        <
        View style = {
            pdfStyles.tableRow
        } >
        <
        View style = {
            {
                flex: 1,
                padding: 3,
                backgroundColor: "#f0f8ff",
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                textAlign: "center",
                fontWeight: "bold"
            }]
        } > Revision < /Text> <
        /View> <
        View style = {
            {
                flex: 1,
                padding: 3,
                backgroundColor: "#f0f8ff",
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                textAlign: "center",
                fontWeight: "bold"
            }]
        } > Date < /Text> <
        /View> <
        View style = {
            {
                flex: 1,
                padding: 3,
                backgroundColor: "#f0f8ff",
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                textAlign: "center",
                fontWeight: "bold"
            }]
        } > Page < /Text> <
        /View> <
        View style = {
            {
                flex: 2,
                padding: 3,
                backgroundColor: "#f0f8ff",
                justifyContent: "center",
                alignItems: "center"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                textAlign: "center",
                fontWeight: "bold"
            }]
        } > Short Description < /Text> <
        /View> <
        /View> <
        View style = {
            [pdfStyles.tableRow, {
                borderBottomWidth: 0
            }]
        } >
        <
        View style = {
            {
                flex: 1,
                padding: 3,
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                textAlign: "center"
            }]
        } > A < /Text> <
        /View> <
        View style = {
            {
                flex: 1,
                padding: 3,
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                textAlign: "center"
            }]
        } > 18 < /Text> <
        /View> <
        View style = {
            {
                flex: 1,
                padding: 3,
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                textAlign: "center"
            }]
        } > ALL < /Text> <
        /View> <
        View style = {
            {
                flex: 2,
                padding: 3,
                justifyContent: "center",
                alignItems: "center"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                textAlign: "center"
            }]
        } > Project2018 < /Text> <
        /View> <
        /View> <
        /View> <
        /View> <
        PdfFooter pageNumber = {
            1
        }
        totalPages = {
            finalTotalPages
        }
        projectData = {
            projectData
        }
        /> <
        /Page>

        { /* ========== PROJECT DETAILS PAGE ========== */ } <
        Page size = "A4"
        style = {
            pdfStyles.page
        } >
        <
        View style = {
            pdfStyles.pageContent
        } >
        <
        PdfHeader / >
        <
        View >
        <
        Text style = {
            pdfStyles.sectionTitle
        } > Project Details < /Text> <
        Text style = {
            pdfStyles.sectionNote
        } >
        Summary of our Understanding of The Project <
        /Text>

        <
        Text style = {
            pdfStyles.sectionTitle
        } >
        Table 1: Project Details & Proposed Scope Summary <
        /Text> <
        View style = {
            pdfStyles.table
        } >
        <
        View style = {
            pdfStyles.tableRow
        } >
        <
        View style = {
            {
                flex: 0.4,
                padding: 3,
                backgroundColor: "#f0f8ff",
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                fontWeight: "bold",
                textAlign: "center"
            }]
        } > Item < /Text> <
        /View> <
        View style = {
            {
                flex: 0.6,
                padding: 3,
                backgroundColor: "#f0f8ff",
                justifyContent: "center",
                alignItems: "center"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                fontWeight: "bold",
                textAlign: "center"
            }]
        } > Description < /Text> <
        /View> <
        /View> <
        View style = {
            pdfStyles.tableRow
        } >
        <
        View style = {
            {
                flex: 0.4,
                padding: 3,
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > Project Name < /Text> <
        /View> <
        View style = {
            {
                flex: 0.6,
                padding: 3
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > {
            projectData ? .project_name || "N/A"
        } < /Text> <
        /View> <
        /View> <
        View style = {
            pdfStyles.tableRow
        } >
        <
        View style = {
            {
                flex: 0.4,
                padding: 3,
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > Location Coordinates < /Text> <
        /View> <
        View style = {
            {
                flex: 0.6,
                padding: 3
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > {
            windfarmData ? .coordinates || "N/A"
        } < /Text> <
        /View> <
        /View> <
        View style = {
            pdfStyles.tableRow
        } >
        <
        View style = {
            {
                flex: 0.4,
                padding: 3,
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > Proposed WTG < /Text> <
        /View> <
        View style = {
            {
                flex: 0.6,
                padding: 3
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > {
            windfarmData ? .no_of_locations ? `${windfarmData.no_of_locations} WTG Units` : "N/A"
        } <
        /Text> <
        /View> <
        /View> <
        View style = {
            [pdfStyles.tableRow, {
                borderBottomWidth: 0
            }]
        } >
        <
        View style = {
            {
                flex: 0.4,
                padding: 3,
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > Total Rated Power < /Text> <
        /View> <
        View style = {
            {
                flex: 0.6,
                padding: 3
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > {
            windfarmData ? .capacity_mw ? `${windfarmData.capacity_mw} MW` : "N/A"
        } <
        /Text> <
        /View> <
        /View> <
        /View>

        <
        Text style = {
            pdfStyles.sectionTitle
        } >
        Table 2: Project Contact Details <
        /Text> <
        View style = {
            pdfStyles.table
        } >
        <
        View style = {
            pdfStyles.tableRow
        } >
        <
        View style = {
            {
                flex: 0.4,
                padding: 3,
                backgroundColor: "#f0f8ff",
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                fontWeight: "bold",
                textAlign: "center"
            }]
        } > Item < /Text> <
        /View> <
        View style = {
            {
                flex: 0.6,
                padding: 3,
                backgroundColor: "#f0f8ff",
                justifyContent: "center",
                alignItems: "center"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                fontWeight: "bold",
                textAlign: "center"
            }]
        } > Description < /Text> <
        /View> <
        /View> <
        View style = {
            pdfStyles.tableRow
        } >
        <
        View style = {
            {
                flex: 0.4,
                padding: 3,
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > UGES Client < /Text> <
        /View> <
        View style = {
            {
                flex: 0.6,
                padding: 3
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > {
            projectData ? .client_name || "N/A"
        } < /Text> <
        /View> <
        /View> <
        View style = {
            pdfStyles.tableRow
        } >
        <
        View style = {
            {
                flex: 0.4,
                padding: 3,
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > Address < /Text> <
        /View> <
        View style = {
            {
                flex: 0.6,
                padding: 3
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > {
            projectData ? .address || "N/A"
        } < /Text> <
        /View> <
        /View> <
        View style = {
            pdfStyles.tableRow
        } >
        <
        View style = {
            {
                flex: 0.4,
                padding: 3,
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > Contact Person < /Text> <
        /View> <
        View style = {
            {
                flex: 0.6,
                padding: 3
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > {
            projectData ? .contact_person || "N/A"
        } < /Text> <
        /View> <
        /View> <
        View style = {
            [pdfStyles.tableRow, {
                borderBottomWidth: 0
            }]
        } >
        <
        View style = {
            {
                flex: 0.4,
                padding: 3,
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > Contact Phone < /Text> <
        /View> <
        View style = {
            {
                flex: 0.6,
                padding: 3
            }
        } >
        <
        Text style = {
            pdfStyles.tableCellText
        } > {
            projectData ? .contact_phone || "N/A"
        } < /Text> <
        /View> <
        /View> <
        /View> <
        /View> <
        /View> <
        PdfFooter pageNumber = {
            2
        }
        totalPages = {
            finalTotalPages
        }
        projectData = {
            projectData
        }
        /> <
        /Page>

        { /* ========== WTG SUMMARY PAGE ========== */ } <
        Page size = "A4"
        style = {
            pdfStyles.page
        } >
        <
        View style = {
            pdfStyles.pageContent
        } >
        <
        PdfHeader / >
        <
        View >
        <
        Text style = {
            pdfStyles.sectionTitle
        } >
        A.WTG Location Specific Activities Summary <
        /Text> <
        View style = {
            pdfStyles.table
        } >
        <
        View style = {
            pdfStyles.tableRow
        } >
        <
        View style = {
            {
                flex: 2,
                padding: 3,
                backgroundColor: "#f0f8ff",
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                fontWeight: "bold",
                textAlign: "center"
            }]
        } > Activity / Milestone < /Text> <
        /View> <
        View style = {
            {
                flex: 1,
                padding: 3,
                backgroundColor: "#f0f8ff",
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                fontWeight: "bold",
                textAlign: "center"
            }]
        } > Total Location(Nos) < /Text> <
        /View> <
        View style = {
            {
                flex: 1,
                padding: 3,
                backgroundColor: "#f0f8ff",
                justifyContent: "center",
                alignItems: "center",
                borderRightWidth: 1,
                borderRightColor: "#777",
                borderRightStyle: "solid"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                fontWeight: "bold",
                textAlign: "center"
            }]
        } > Completed < /Text> <
        /View> <
        View style = {
            {
                flex: 1,
                padding: 3,
                backgroundColor: "#f0f8ff",
                justifyContent: "center",
                alignItems: "center"
            }
        } >
        <
        Text style = {
            [pdfStyles.tableCellText, {
                fontWeight: "bold",
                textAlign: "center"
            }]
        } > Percentage < /Text> <
        /View> <
        /View>

        {
            activitySections.map((section, index) => {
                const total = section.data.length;
                let completed = 0;

                if (section.key === "electrical") {
                    completed = section.data.filter(
                        (item) =>
                        item.l1_approved_at &&
                        item.l2_approved_at &&
                        item.l3_approved_at,
                    ).length;
                } else {
                    completed = section.data.filter((item) => {
                        const status =
                            item.status ? .toLowerCase() ||
                            item.soil_status ? .toLowerCase() ||
                            item.excavation_status ? .toLowerCase() ||
                            item.pcc_status ? .toLowerCase() ||
                            item.conduct_status ? .toLowerCase() ||
                            item.reinforcement_status ? .toLowerCase() ||
                            item.foundation_status ? .toLowerCase() ||
                            item.pouring_status ? .toLowerCase() ||
                            item.desh_status ? .toLowerCase() ||
                            item.cr_status ? .toLowerCase() ||
                            item.backfill_status ? .toLowerCase() ||
                            item.activity_status ? .toLowerCase() ||
                            item.t1_status ? .toLowerCase() ||
                            item.tower_status ? .toLowerCase() ||
                            item.nacelle_status ? .toLowerCase() ||
                            item.rotor_status ? .toLowerCase() ||
                            item.blade_status ? .toLowerCase();
                        return status === "completed";
                    }).length;
                }

                const percentage =
                    total > 0 ? Math.round((completed / total) * 100) : 0;
                const isLastRow = index === activitySections.length - 1;

                return ( <
                    View key = {
                        index
                    }
                    style = {
                        [pdfStyles.tableRow, isLastRow && {
                            borderBottomWidth: 0
                        }]
                    }
                    wrap = {
                        false
                    } >
                    <
                    View style = {
                        {
                            flex: 2,
                            padding: 3,
                            borderRightWidth: 1,
                            borderRightColor: "#777",
                            borderRightStyle: "solid"
                        }
                    } >
                    <
                    Text style = {
                        pdfStyles.tableCellText
                    } > {
                        section.title
                    } < /Text> <
                    /View> <
                    View style = {
                        {
                            flex: 1,
                            padding: 3,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRightWidth: 1,
                            borderRightColor: "#777",
                            borderRightStyle: "solid"
                        }
                    } >
                    <
                    Text style = {
                        [pdfStyles.tableCellText, {
                            textAlign: "center"
                        }]
                    } > {
                        total
                    } < /Text> <
                    /View> <
                    View style = {
                        {
                            flex: 1,
                            padding: 3,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRightWidth: 1,
                            borderRightColor: "#777",
                            borderRightStyle: "solid"
                        }
                    } >
                    <
                    Text style = {
                        [pdfStyles.tableCellText, {
                            textAlign: "center",
                            color: "#145824"
                        }]
                    } > {
                        completed
                    } < /Text> <
                    /View> <
                    View style = {
                        {
                            flex: 1,
                            padding: 3,
                            justifyContent: "center",
                            alignItems: "center"
                        }
                    } >
                    <
                    Text style = {
                        [pdfStyles.tableCellText, {
                            textAlign: "center",
                            color: "#00308a"
                        }]
                    } > {
                        percentage
                    } % < /Text> <
                    /View> <
                    /View>
                );
            })
        } <
        /View> <
        /View> <
        /View> <
        PdfFooter pageNumber = {
            3
        }
        totalPages = {
            finalTotalPages
        }
        projectData = {
            projectData
        }
        /> <
        /Page>

        { /* ========== ACTIVITY SECTIONS ========== */ } {
            activityPages.map((p) =>
                renderActivityTable(
                    p.section,
                    p.chunk,
                    p.pageNumber,
                    p.chunkIndex,
                    p.totalChunks,
                    p.globalStartIndex,
                ),
            )
        } <
        /Document>
    );
};

// ==================== EXPORT COMPONENT ====================

const ReportPdf = ({
    projectData,
    windfarmData,
    clusterData,
    activitySections,
    gridImages,
    fileName = "Project_Report.pdf",
}) => {
    const [openPreview, setOpenPreview] = useState(false);
    const [previewTab, setPreviewTab] = useState(0);

    const handleOpenPreview = () => setOpenPreview(true);
    const handleClosePreview = () => setOpenPreview(false);

    const documentComponent = ( <
        ReportPdfDocument projectData = {
            projectData
        }
        windfarmData = {
            windfarmData
        }
        clusterData = {
            clusterData
        }
        activitySections = {
            activitySections
        }
        gridImages = {
            gridImages
        }
        />
    );

    return ( <
        >
        <
        div style = {
            {
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end"
            }
        } >
        <
        Tooltip title = "Live Preview PDF" >
        <
        span onClick = {
            handleOpenPreview
        }
        style = {
            {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                backgroundColor: "#17a2b8",
                color: "#fff",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
            }
        } >
        <
        PreviewIcon style = {
            {
                fontSize: "20px"
            }
        }
        />
        Live Preview <
        /span> <
        /Tooltip>

        <
        PDFDownloadLink document = {
            documentComponent
        }
        fileName = {
            fileName
        }
        style = {
            {
                textDecoration: "none"
            }
        } >
        {
            ({
                loading
            }) =>
            loading ? ( <
                Tooltip title = "Generating PDF..." >
                <
                span style = {
                    {
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 24px",
                        backgroundColor: "#6c757d",
                        color: "#fff",
                        borderRadius: "4px",
                        cursor: "wait",
                        fontSize: "14px",
                        fontWeight: "bold",
                    }
                } >
                <
                CircularProgress size = {
                    20
                }
                style = {
                    {
                        color: "#fff"
                    }
                }
                />
                Generating...
                <
                /span> <
                /Tooltip>
            ) : ( <
                Tooltip title = "Download PDF Report" >
                <
                span style = {
                    {
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 24px",
                        backgroundColor: "#00308a",
                        color: "#fff",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold",
                    }
                } >
                <
                DownloadIcon style = {
                    {
                        fontSize: "20px"
                    }
                }
                />
                Download PDF <
                /span> <
                /Tooltip>
            )
        } <
        /PDFDownloadLink> <
        /div>

        <
        Dialog open = {
            openPreview
        }
        onClose = {
            handleClosePreview
        }
        maxWidth = "xl"
        fullWidth PaperProps = {
            {
                style: {
                    height: "90vh",
                    display: "flex",
                    flexDirection: "column",
                },
            }
        } >
        <
        DialogTitle style = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 20px",
                backgroundColor: "#f5f5f5",
                borderBottom: "1px solid #ddd",
            }
        } >
        <
        span style = {
            {
                fontWeight: "bold",
                fontSize: "18px"
            }
        } >
        PDF Preview <
        /span> <
        IconButton onClick = {
            handleClosePreview
        }
        size = "small" >
        <
        CloseIcon / >
        <
        /IconButton> <
        /DialogTitle>

        <
        Box style = {
            {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }
        } >
        <
        Tabs value = {
            previewTab
        }
        onChange = {
            (e, newValue) => setPreviewTab(newValue)
        }
        style = {
            {
                borderBottom: "1px solid #ddd",
                backgroundColor: "#fafafa",
            }
        } >
        <
        Tab label = "Preview" / >
        <
        /Tabs>

        <
        Box style = {
            {
                flex: 1,
                overflow: "hidden"
            }
        } >
        <
        PDFViewer style = {
            {
                width: "100%",
                height: "100%",
                border: "none",
            }
        }
        showToolbar = {
            true
        } >
        {
            documentComponent
        } <
        /PDFViewer> <
        /Box> <
        /Box>

        <
        DialogActions style = {
            {
                padding: "10px 20px",
                borderTop: "1px solid #ddd",
                backgroundColor: "#f5f5f5",
            }
        } >
        <
        Button onClick = {
            handleClosePreview
        }
        variant = "contained"
        color = "primary"
        startIcon = { < CloseIcon / >
        } >
        Close Preview <
        /Button> <
        /DialogActions> <
        /Dialog> <
        />
    );
};

export default ReportPdf;