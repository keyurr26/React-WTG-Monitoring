import React from "react";
import {
    DataGrid
} from "@mui/x-data-grid";
import {
    Chip,
    Tabs,
    Tab,
    Box,
    Typography,
    Card
} from "@mui/material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetSQRecords,
    UpdateSQRecord,
    ApproveSQRecord
} from "../../Redux/SafetyQualityData/SafetyQualityAction";
import {
    MenuItem,
    Select,
    TextField,
    Button
} from "@mui/material";
import {
    SQ_STATUS_OPTIONS
} from "../../constants/choices";

const severityColorMap = {
    low: {
        bg: "#e8f5e9",
        color: "#2e7d32"
    },
    medium: {
        bg: "#fff8e1",
        color: "#f9a825"
    },
    high: {
        bg: "#ffebee",
        color: "#d32f2f"
    },
    critical: {
        bg: "#4a148c",
        color: "#ffffff"
    },
};

const SQRecordList = ({
    data = [],
    title,
    themeColor
}) => {
    const dispatch = useDispatch();
    const [editedRows, setEditedRows] = React.useState({});
    const [tabValue, setTabValue] = React.useState(0);



    const user = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const role = user.role;

    const isOfficer = ["quality_officer", "safety_officer"].includes(role);
    const isInspector = role === "inspector";
    const isAdmin = role === "admin";

    // Split data into categories
    const electricalData = data.filter(item => item.category === "electrical");
    const roadData = data.filter(item => item.category === "road");
    const ussData = data.filter(item => item.category === "uss");
    const otherData = data.filter(item => item.category !== "electrical" && item.category !== "road" && item.category !== "uss");

    const renderImagePreview = (url) => {
        if (!url) return "-";
        return ( <
            img src = {
                url
            }
            alt = "preview"
            style = {
                {
                    width: 60,
                    height: 40,
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: 4
                }
            }
            onClick = {
                () => window.open(url, "_blank")
            }
            />
        );
    };

    // Create columns for non-electrical, non-road, non-uss records
    const getOtherColumns = () => {
        const columns = [{
                field: "sr_no",
                headerName: "Sr No",
                width: 60,
                renderCell: (params) => params.api.getRowIndex(params.id) + 1,
            },
            {
                field: "turbine_name",
                headerName: "Turbine",
                width: 110
            },
            {
                field: "activity_name",
                headerName: "Activity",
                width: 120
            },
            {
                field: "category",
                headerName: "Category",
                width: 120
            },
            {
                field: "date",
                headerName: "Raised date",
                width: 120
            },
            {
                field: "quality_defect",
                headerName: "Defect",
                width: 130
            },
            {
                field: "severity",
                headerName: "Severity",
                width: 130,
                renderCell: (params) => {
                    const value = params.value ? .toLowerCase();
                    const style = severityColorMap[value] || {
                        bg: "#e0e0e0",
                        color: "#000",
                    };
                    return ( <
                        Chip label = {
                            params.value
                        }
                        size = "small"
                        sx = {
                            {
                                backgroundColor: style.bg,
                                color: style.color,
                                fontWeight: 600,
                                borderRadius: "8px",
                            }
                        }
                        />
                    );
                },
            },
            {
                field: "note_details",
                headerName: "Note",
                width: 150
            },
            {
                field: "nc_photo",
                headerName: "NC Photo",
                width: 160,
                renderCell: (params) => ( <
                    Box display = "flex"
                    gap = {
                        1
                    }
                    alignItems = "center" > {
                        renderImagePreview(params.row.nc_photo)
                    } {
                        !isInspector && !isAdmin && !params.row.isApproved && ( <
                            Button size = "small"
                            component = "label"
                            variant = "outlined" >
                            Upload {
                                " "
                            } <
                            input type = "file"
                            hidden accept = "image/*"
                            onChange = {
                                async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const fd = new FormData();
                                    fd.append("nc_photo", file);
                                    await dispatch(UpdateSQRecord(params.row.id, fd));
                                    dispatch(GetSQRecords());
                                }
                            }
                            /> <
                            /Button>
                        )
                    } <
                    /Box>
                ),
            },
            {
                field: "corrective_action",
                headerName: "Corrective Action",
                width: 220,
                renderCell: (params) => ( <
                    TextField size = "small"
                    multiline fullWidth onKeyDown = {
                        (e) => e.stopPropagation()
                    }
                    disabled = {
                        isOfficer || isAdmin || params.row.isApproved
                    }
                    value = {
                        editedRows[params.row.id] ? .corrective_action ? ? params.value ? ? ""
                    }
                    onChange = {
                        (e) =>
                        updateLocalField(
                            params.row.id,
                            "corrective_action",
                            e.target.value,
                        )
                    }
                    />
                ),
            },
            {
                field: "clearance_photo",
                headerName: "Clearance Photo",
                width: 160,
                renderCell: (params) => ( <
                    Box display = "flex"
                    gap = {
                        1
                    }
                    alignItems = "center" > {
                        renderImagePreview(params.row.clearance_photo)
                    } {
                        !isOfficer && !isAdmin && !params.row.isApproved && ( <
                            Button size = "small"
                            component = "label"
                            variant = "outlined" >
                            Upload {
                                " "
                            } <
                            input type = "file"
                            hidden accept = "image/*"
                            onChange = {
                                async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const fd = new FormData();
                                    fd.append("clearance_photo", file);
                                    await dispatch(UpdateSQRecord(params.row.id, fd));
                                    dispatch(GetSQRecords());
                                }
                            }
                            /> <
                            /Button>
                        )
                    } <
                    /Box>
                ),
            },
            {
                field: "status",
                headerName: "Status",
                width: 150,
                renderCell: (params) => {
                    const currentStatus = params.value ? ? "";
                    const selectedStatus =
                        editedRows[params.row.id] ? .status ? ? currentStatus;

                    return ( <
                        Select size = "small"
                        fullWidth disabled = {
                            isAdmin || params.row.isApproved
                        }
                        value = {
                            selectedStatus
                        }
                        onChange = {
                            (e) =>
                            updateLocalField(params.row.id, "status", e.target.value)
                        } >
                        {
                            SQ_STATUS_OPTIONS.map((opt) => {
                                const isCurrentBackendStatus = opt.value === currentStatus;
                                const isDisabledForInspector =
                                    isInspector &&
                                    opt.value !== "resolved" &&
                                    !isCurrentBackendStatus;

                                return ( <
                                    MenuItem key = {
                                        opt.value
                                    }
                                    value = {
                                        opt.value
                                    }
                                    disabled = {
                                        isDisabledForInspector
                                    } >
                                    {
                                        opt.label
                                    } <
                                    /MenuItem>
                                );
                            })
                        } <
                        /Select>
                    );
                },
            },
        ];

        // Add Save button for non-admin
        if (!isAdmin) {
            columns.push({
                field: "actions",
                headerName: "Save",
                width: 100,
                renderCell: (params) => ( <
                    Button variant = "contained"
                    size = "small"
                    disabled = {
                        params.row.isApproved || !editedRows[params.row.id]
                    }
                    onClick = {
                        () => handleSave(params.row.id)
                    } >
                    Save < /Button>
                ),
            });
        }

        // Add Approve button
        columns.push({
            field: "approve_status",
            headerName: "Approve Status",
            width: 160,
            renderCell: (params) => {
                const approved = params.row.isApproved;
                const isClosed = params.row.status === "closed";

                return ( <
                    Button variant = "contained"
                    size = "small"
                    disabled = {!isOfficer || !isClosed || approved
                    }
                    sx = {
                        {
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            width: "130px",
                            backgroundColor: approved ? "#2e7d32" : "#ed6c02",
                            color: "#fff",
                            "&.Mui-disabled": {
                                backgroundColor: approved ? "#2e7d32" : "#ed6c0280",
                                color: "#fff",
                                opacity: approved ? 1 : 0.6,
                            },
                        }
                    }
                    onClick = {
                        () => {
                            if (window.confirm("Confirm approval for this record?")) {
                                dispatch(ApproveSQRecord(params.row.id));
                            }
                        }
                    } >
                    {
                        approved ? "Approved" : "Approvel Pending"
                    } <
                    /Button>
                );
            },
        });

        return columns;
    };

    // Create columns for electrical records
    const getElectricalColumns = () => {
        const columns = [{
                field: "sr_no",
                headerName: "Sr No",
                width: 60,
                renderCell: (params) => params.api.getRowIndex(params.id) + 1,
            },
            {
                field: "electrical_line_name",
                headerName: "Line Name",
                width: 130,
                renderCell: (params) => params.value || "-",
            },
            {
                field: "pole_number",
                headerName: "Pole No",
                width: 100,
                renderCell: (params) => params.value || "-",
            },
            // { 
            //   field: "pole_type", 
            //   headerName: "Pole Type", 
            //   width: 120,
            //   renderCell: (params) => {
            //     const type = params.value;
            //     if (!type) return "-";
            //     const formattedType = type.replace(/_/g, ' ').toUpperCase();
            //     return (
            //       <Chip
            //         label={formattedType}
            //         size="small"
            //         sx={{
            //           backgroundColor: type === "line_pole" ? "#e3f2fd" : "#fce4ec",
            //           color: type === "line_pole" ? "#1976d2" : "#d32f2f",
            //           fontWeight: 500,
            //           borderRadius: "8px",
            //         }}
            //       />
            //     );
            //   }
            // },


            {
                field: "pole_type",
                headerName: "Pole / Tower Type",
                width: 150,
                renderCell: (params) => {
                    // const isMCOH =
                    //   params.row.electrical_line_type?.toLowerCase() === "mcoh";
                    const isMCOH = params.row.electrical_line_type ? .startsWith("MCOH");

                    const type = isMCOH ? params.row.tower_type : params.row.pole_type;

                    if (!type) return "-";

                    // const formattedType = type.replace(/_/g, " ").toUpperCase();

                    const formattedType = isMCOH ?
                        `TOWER ${type}` :
                        type.replace(/_/g, " ").toUpperCase();

                    return ( <
                        Chip label = {
                            formattedType
                        }
                        size = "small"
                        sx = {
                            {
                                backgroundColor: isMCOH ?
                                    "#ede7f6" :
                                    type === "line_pole" ?
                                    "#e3f2fd" :
                                    "#fce4ec",
                                color: isMCOH ?
                                    "#6a1b9a" :
                                    type === "line_pole" ?
                                    "#1976d2" :
                                    "#d32f2f",
                                fontWeight: 500,
                                borderRadius: "8px",
                            }
                        }
                        />
                    );
                },
            },

            {
                field: "level",
                headerName: "Level",
                width: 100,
                renderCell: (params) => {
                    const level = params.value || "-";

                    const colorMap = {
                        L1: "#1976d2",
                        L2: "#ed6c02",
                        L3: "#2e7d32",
                        FINAL: "#6a1b9a",
                    };

                    return ( <
                        Chip label = {
                            level
                        }
                        size = "small"
                        sx = {
                            {
                                backgroundColor: colorMap[level] || "#e0e0e0",
                                color: "#fff",
                                fontWeight: 600,
                                minWidth: 60,
                            }
                        }
                        />
                    );
                },
            },


            {
                field: "activity_name",
                headerName: "Activity",
                width: 120
            },
            {
                field: "category",
                headerName: "Category",
                width: 120
            },
            {
                field: "date",
                headerName: "Raised date",
                width: 120
            },
            {
                field: "quality_defect",
                headerName: "Defect",
                width: 130
            },
            {
                field: "severity",
                headerName: "Severity",
                width: 130,
                renderCell: (params) => {
                    const value = params.value ? .toLowerCase();
                    const style = severityColorMap[value] || {
                        bg: "#e0e0e0",
                        color: "#000",
                    };
                    return ( <
                        Chip label = {
                            params.value
                        }
                        size = "small"
                        sx = {
                            {
                                backgroundColor: style.bg,
                                color: style.color,
                                fontWeight: 600,
                                borderRadius: "8px",
                            }
                        }
                        />
                    );
                },
            },
            {
                field: "note_details",
                headerName: "Note",
                width: 150
            },
            {
                field: "nc_photo",
                headerName: "NC Photo",
                width: 160,
                renderCell: (params) => ( <
                    Box display = "flex"
                    gap = {
                        1
                    }
                    alignItems = "center" > {
                        renderImagePreview(params.row.nc_photo)
                    } {
                        !isInspector && !isAdmin && !params.row.isApproved && ( <
                            Button size = "small"
                            component = "label"
                            variant = "outlined" >
                            Upload {
                                " "
                            } <
                            input type = "file"
                            hidden accept = "image/*"
                            onChange = {
                                async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const fd = new FormData();
                                    fd.append("nc_photo", file);
                                    await dispatch(UpdateSQRecord(params.row.id, fd));
                                    dispatch(GetSQRecords());
                                }
                            }
                            /> <
                            /Button>
                        )
                    } <
                    /Box>
                ),
            },
            {
                field: "corrective_action",
                headerName: "Corrective Action",
                width: 220,
                renderCell: (params) => ( <
                    TextField size = "small"
                    multiline fullWidth onKeyDown = {
                        (e) => e.stopPropagation()
                    }
                    disabled = {
                        isOfficer || isAdmin || params.row.isApproved
                    }
                    value = {
                        editedRows[params.row.id] ? .corrective_action ? ? params.value ? ? ""
                    }
                    onChange = {
                        (e) =>
                        updateLocalField(
                            params.row.id,
                            "corrective_action",
                            e.target.value,
                        )
                    }
                    />
                ),
            },
            {
                field: "clearance_photo",
                headerName: "Clearance Photo",
                width: 160,
                renderCell: (params) => ( <
                    Box display = "flex"
                    gap = {
                        1
                    }
                    alignItems = "center" > {
                        renderImagePreview(params.row.clearance_photo)
                    } {
                        !isOfficer && !isAdmin && !params.row.isApproved && ( <
                            Button size = "small"
                            component = "label"
                            variant = "outlined" >
                            Upload {
                                " "
                            } <
                            input type = "file"
                            hidden accept = "image/*"
                            onChange = {
                                async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const fd = new FormData();
                                    fd.append("clearance_photo", file);
                                    await dispatch(UpdateSQRecord(params.row.id, fd));
                                    dispatch(GetSQRecords());
                                }
                            }
                            /> <
                            /Button>
                        )
                    } <
                    /Box>
                ),
            },
            {
                field: "status",
                headerName: "Status",
                width: 150,
                renderCell: (params) => ( <
                    Select size = "small"
                    fullWidth disabled = {
                        isAdmin || params.row.isApproved
                    }
                    value = {
                        editedRows[params.row.id] ? .status ? ? params.value ? ? ""
                    }
                    onChange = {
                        (e) =>
                        updateLocalField(params.row.id, "status", e.target.value)
                    } >
                    {
                        SQ_STATUS_OPTIONS.filter(
                            (opt) => !isInspector || opt.value === "resolved",
                        ).map((opt) => ( <
                            MenuItem key = {
                                opt.value
                            }
                            value = {
                                opt.value
                            } > {
                                opt.label
                            } <
                            /MenuItem>
                        ))
                    } <
                    /Select>
                ),
            },
        ];

        if (!isAdmin) {
            columns.push({
                field: "actions",
                headerName: "Save",
                width: 100,
                renderCell: (params) => ( <
                    Button variant = "contained"
                    size = "small"
                    disabled = {
                        params.row.isApproved || !editedRows[params.row.id]
                    }
                    onClick = {
                        () => handleSave(params.row.id)
                    } >
                    Save < /Button>
                ),
            });
        }

        columns.push({
            field: "approve_status",
            headerName: "Approve Status",
            width: 160,
            renderCell: (params) => {
                const approved = params.row.isApproved;
                const isClosed = params.row.status === "closed";

                return ( <
                    Button variant = "contained"
                    size = "small"
                    disabled = {!isOfficer || !isClosed || approved
                    }
                    sx = {
                        {
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            width: "130px",
                            backgroundColor: approved ? "#2e7d32" : "#ed6c02",
                            color: "#fff",
                            "&.Mui-disabled": {
                                backgroundColor: approved ? "#2e7d32" : "#ed6c0280",
                                color: "#fff",
                                opacity: approved ? 1 : 0.6,
                            },
                        }
                    }
                    onClick = {
                        () => {
                            if (window.confirm("Confirm approval for this record?")) {
                                dispatch(ApproveSQRecord(params.row.id));
                            }
                        }
                    } >
                    {
                        approved ? "Approved" : "Approvel Pending"
                    } <
                    /Button>
                );
            },
        });

        return columns;
    };

    // Create columns for road records
    const getRoadColumns = () => {
        const columns = [{
                field: "sr_no",
                headerName: "Sr No",
                width: 60,
                renderCell: (params) => params.api.getRowIndex(params.id) + 1,
            },
            {
                field: "road_name",
                headerName: "Road Name",
                width: 150,
                renderCell: (params) => params.value || "-",
            },
            {
                field: "road_type",
                headerName: "Road Type",
                width: 130,
                renderCell: (params) => {
                    const type = params.value;
                    if (!type) return "-";
                    const formattedType = type.toUpperCase();
                    return ( <
                        Chip label = {
                            formattedType
                        }
                        size = "small"
                        sx = {
                            {
                                backgroundColor: type === "main" ?
                                    "#e3f2fd" :
                                    type === "approach" ?
                                    "#fce4ec" :
                                    "#f3e5f5",
                                color: type === "main" ?
                                    "#1976d2" :
                                    type === "approach" ?
                                    "#d32f2f" :
                                    "#7b1fa2",
                                fontWeight: 500,
                                borderRadius: "8px",
                            }
                        }
                        />
                    );
                },
            },
            {
                field: "activity_name",
                headerName: "Activity",
                width: 120
            },
            {
                field: "category",
                headerName: "Category",
                width: 120
            },
            {
                field: "date",
                headerName: "Raised date",
                width: 120
            },
            {
                field: "quality_defect",
                headerName: "Defect",
                width: 130
            },
            {
                field: "severity",
                headerName: "Severity",
                width: 130,
                renderCell: (params) => {
                    const value = params.value ? .toLowerCase();
                    const style = severityColorMap[value] || {
                        bg: "#e0e0e0",
                        color: "#000",
                    };
                    return ( <
                        Chip label = {
                            params.value
                        }
                        size = "small"
                        sx = {
                            {
                                backgroundColor: style.bg,
                                color: style.color,
                                fontWeight: 600,
                                borderRadius: "8px",
                            }
                        }
                        />
                    );
                },
            },
            {
                field: "note_details",
                headerName: "Note",
                width: 150
            },
            {
                field: "nc_photo",
                headerName: "NC Photo",
                width: 160,
                renderCell: (params) => ( <
                    Box display = "flex"
                    gap = {
                        1
                    }
                    alignItems = "center" > {
                        renderImagePreview(params.row.nc_photo)
                    } {
                        !isInspector && !isAdmin && !params.row.isApproved && ( <
                            Button size = "small"
                            component = "label"
                            variant = "outlined" >
                            Upload {
                                " "
                            } <
                            input type = "file"
                            hidden accept = "image/*"
                            onChange = {
                                async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const fd = new FormData();
                                    fd.append("nc_photo", file);
                                    await dispatch(UpdateSQRecord(params.row.id, fd));
                                    dispatch(GetSQRecords());
                                }
                            }
                            /> <
                            /Button>
                        )
                    } <
                    /Box>
                ),
            },
            {
                field: "corrective_action",
                headerName: "Corrective Action",
                width: 220,
                renderCell: (params) => ( <
                    TextField size = "small"
                    multiline fullWidth onKeyDown = {
                        (e) => e.stopPropagation()
                    }
                    disabled = {
                        isOfficer || isAdmin || params.row.isApproved
                    }
                    value = {
                        editedRows[params.row.id] ? .corrective_action ? ? params.value ? ? ""
                    }
                    onChange = {
                        (e) =>
                        updateLocalField(
                            params.row.id,
                            "corrective_action",
                            e.target.value,
                        )
                    }
                    />
                ),
            },
            {
                field: "clearance_photo",
                headerName: "Clearance Photo",
                width: 160,
                renderCell: (params) => ( <
                    Box display = "flex"
                    gap = {
                        1
                    }
                    alignItems = "center" > {
                        renderImagePreview(params.row.clearance_photo)
                    } {
                        !isOfficer && !isAdmin && !params.row.isApproved && ( <
                            Button size = "small"
                            component = "label"
                            variant = "outlined" >
                            Upload {
                                " "
                            } <
                            input type = "file"
                            hidden accept = "image/*"
                            onChange = {
                                async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const fd = new FormData();
                                    fd.append("clearance_photo", file);
                                    await dispatch(UpdateSQRecord(params.row.id, fd));
                                    dispatch(GetSQRecords());
                                }
                            }
                            /> <
                            /Button>
                        )
                    } <
                    /Box>
                ),
            },
            {
                field: "status",
                headerName: "Status",
                width: 150,
                renderCell: (params) => {
                    const currentStatus = params.value ? ? "";
                    const selectedStatus =
                        editedRows[params.row.id] ? .status ? ? currentStatus;

                    return ( <
                        Select size = "small"
                        fullWidth disabled = {
                            isAdmin || params.row.isApproved
                        }
                        value = {
                            selectedStatus
                        }
                        onChange = {
                            (e) =>
                            updateLocalField(params.row.id, "status", e.target.value)
                        } >
                        {
                            SQ_STATUS_OPTIONS.map((opt) => {
                                const isCurrentBackendStatus = opt.value === currentStatus;
                                const isDisabledForInspector =
                                    isInspector &&
                                    opt.value !== "resolved" &&
                                    !isCurrentBackendStatus;

                                return ( <
                                    MenuItem key = {
                                        opt.value
                                    }
                                    value = {
                                        opt.value
                                    }
                                    disabled = {
                                        isDisabledForInspector
                                    } >
                                    {
                                        opt.label
                                    } <
                                    /MenuItem>
                                );
                            })
                        } <
                        /Select>
                    );
                },
            },
        ];

        if (!isAdmin) {
            columns.push({
                field: "actions",
                headerName: "Save",
                width: 100,
                renderCell: (params) => ( <
                    Button variant = "contained"
                    size = "small"
                    disabled = {
                        params.row.isApproved || !editedRows[params.row.id]
                    }
                    onClick = {
                        () => handleSave(params.row.id)
                    } >
                    Save < /Button>
                ),
            });
        }

        columns.push({
            field: "approve_status",
            headerName: "Approve Status",
            width: 160,
            renderCell: (params) => {
                const approved = params.row.isApproved;
                const isClosed = params.row.status === "closed";

                return ( <
                    Button variant = "contained"
                    size = "small"
                    disabled = {!isOfficer || !isClosed || approved
                    }
                    sx = {
                        {
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            width: "130px",
                            backgroundColor: approved ? "#2e7d32" : "#ed6c02",
                            color: "#fff",
                            "&.Mui-disabled": {
                                backgroundColor: approved ? "#2e7d32" : "#ed6c0280",
                                color: "#fff",
                                opacity: approved ? 1 : 0.6,
                            },
                        }
                    }
                    onClick = {
                        () => {
                            if (window.confirm("Confirm approval for this record?")) {
                                dispatch(ApproveSQRecord(params.row.id));
                            }
                        }
                    } >
                    {
                        approved ? "Approved" : "Approvel Pending"
                    } <
                    /Button>
                );
            },
        });

        return columns;
    };

    // ✅ NEW: Create columns for USS records
    const getUssColumns = () => {
        const columns = [{
                field: "sr_no",
                headerName: "Sr No",
                width: 60,
                renderCell: (params) => params.api.getRowIndex(params.id) + 1,
            },
            {
                field: "uss_name",
                headerName: "USS Name",
                width: 150,
                renderCell: (params) => {
                    const ussName = params.row.uss_name || params.value || "-";
                    return ( <
                        Chip label = {
                            ussName
                        }
                        size = "small"
                        sx = {
                            {
                                backgroundColor: "#e8eaf6",
                                color: "#283593",
                                fontWeight: 600,
                                borderRadius: "8px",
                            }
                        }
                        />
                    );
                },
            },
            {
                field: "turbine_name",
                headerName: "Turbine",
                width: 120,
                renderCell: (params) => params.value || "-",
            },
            {
                field: "activity_name",
                headerName: "Activity",
                width: 130
            },
            {
                field: "category",
                headerName: "Category",
                width: 120
            },
            {
                field: "date",
                headerName: "Raised date",
                width: 120
            },
            {
                field: "quality_defect",
                headerName: "Defect",
                width: 130
            },
            {
                field: "severity",
                headerName: "Severity",
                width: 130,
                renderCell: (params) => {
                    const value = params.value ? .toLowerCase();
                    const style = severityColorMap[value] || {
                        bg: "#e0e0e0",
                        color: "#000",
                    };
                    return ( <
                        Chip label = {
                            params.value
                        }
                        size = "small"
                        sx = {
                            {
                                backgroundColor: style.bg,
                                color: style.color,
                                fontWeight: 600,
                                borderRadius: "8px",
                            }
                        }
                        />
                    );
                },
            },
            {
                field: "note_details",
                headerName: "Note",
                width: 150
            },
            {
                field: "nc_photo",
                headerName: "NC Photo",
                width: 160,
                renderCell: (params) => ( <
                    Box display = "flex"
                    gap = {
                        1
                    }
                    alignItems = "center" > {
                        renderImagePreview(params.row.nc_photo)
                    } {
                        !isInspector && !isAdmin && !params.row.isApproved && ( <
                            Button size = "small"
                            component = "label"
                            variant = "outlined" >
                            Upload {
                                " "
                            } <
                            input type = "file"
                            hidden accept = "image/*"
                            onChange = {
                                async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const fd = new FormData();
                                    fd.append("nc_photo", file);
                                    await dispatch(UpdateSQRecord(params.row.id, fd));
                                    dispatch(GetSQRecords());
                                }
                            }
                            /> <
                            /Button>
                        )
                    } <
                    /Box>
                ),
            },
            {
                field: "corrective_action",
                headerName: "Corrective Action",
                width: 220,
                renderCell: (params) => ( <
                    TextField size = "small"
                    multiline fullWidth onKeyDown = {
                        (e) => e.stopPropagation()
                    }
                    disabled = {
                        isOfficer || isAdmin || params.row.isApproved
                    }
                    value = {
                        editedRows[params.row.id] ? .corrective_action ? ? params.value ? ? ""
                    }
                    onChange = {
                        (e) =>
                        updateLocalField(
                            params.row.id,
                            "corrective_action",
                            e.target.value,
                        )
                    }
                    />
                ),
            },
            {
                field: "clearance_photo",
                headerName: "Clearance Photo",
                width: 160,
                renderCell: (params) => ( <
                    Box display = "flex"
                    gap = {
                        1
                    }
                    alignItems = "center" > {
                        renderImagePreview(params.row.clearance_photo)
                    } {
                        !isOfficer && !isAdmin && !params.row.isApproved && ( <
                            Button size = "small"
                            component = "label"
                            variant = "outlined" >
                            Upload {
                                " "
                            } <
                            input type = "file"
                            hidden accept = "image/*"
                            onChange = {
                                async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    const fd = new FormData();
                                    fd.append("clearance_photo", file);
                                    await dispatch(UpdateSQRecord(params.row.id, fd));
                                    dispatch(GetSQRecords());
                                }
                            }
                            /> <
                            /Button>
                        )
                    } <
                    /Box>
                ),
            },
            {
                field: "status",
                headerName: "Status",
                width: 150,
                renderCell: (params) => {
                    const currentStatus = params.value ? ? "";
                    const selectedStatus =
                        editedRows[params.row.id] ? .status ? ? currentStatus;

                    return ( <
                        Select size = "small"
                        fullWidth disabled = {
                            isAdmin || params.row.isApproved
                        }
                        value = {
                            selectedStatus
                        }
                        onChange = {
                            (e) =>
                            updateLocalField(params.row.id, "status", e.target.value)
                        } >
                        {
                            SQ_STATUS_OPTIONS.map((opt) => {
                                const isCurrentBackendStatus = opt.value === currentStatus;
                                const isDisabledForInspector =
                                    isInspector &&
                                    opt.value !== "resolved" &&
                                    !isCurrentBackendStatus;

                                return ( <
                                    MenuItem key = {
                                        opt.value
                                    }
                                    value = {
                                        opt.value
                                    }
                                    disabled = {
                                        isDisabledForInspector
                                    } >
                                    {
                                        opt.label
                                    } <
                                    /MenuItem>
                                );
                            })
                        } <
                        /Select>
                    );
                },
            },
        ];

        if (!isAdmin) {
            columns.push({
                field: "actions",
                headerName: "Save",
                width: 100,
                renderCell: (params) => ( <
                    Button variant = "contained"
                    size = "small"
                    disabled = {
                        params.row.isApproved || !editedRows[params.row.id]
                    }
                    onClick = {
                        () => handleSave(params.row.id)
                    } >
                    Save < /Button>
                ),
            });
        }

        columns.push({
            field: "approve_status",
            headerName: "Approve Status",
            width: 160,
            renderCell: (params) => {
                const approved = params.row.isApproved;
                const isClosed = params.row.status === "closed";

                return ( <
                    Button variant = "contained"
                    size = "small"
                    disabled = {!isOfficer || !isClosed || approved
                    }
                    sx = {
                        {
                            textTransform: "uppercase",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                            width: "130px",
                            backgroundColor: approved ? "#2e7d32" : "#ed6c02",
                            color: "#fff",
                            "&.Mui-disabled": {
                                backgroundColor: approved ? "#2e7d32" : "#ed6c0280",
                                color: "#fff",
                                opacity: approved ? 1 : 0.6,
                            },
                        }
                    }
                    onClick = {
                        () => {
                            if (window.confirm("Confirm approval for this record?")) {
                                dispatch(ApproveSQRecord(params.row.id));
                            }
                        }
                    } >
                    {
                        approved ? "Approved" : "Approvel Pending"
                    } <
                    /Button>
                );
            },
        });

        return columns;
    };

    // Common function to process rows for any table
    const processRows = (dataArray) => {
        return dataArray.map((r) => ({
            id: r.id,
            turbine_name: r.turbine_name || "-",
            record_type: r.record_type,
            activity_name: r.turbine_activity || "-",
            category: r.category,
            quality_defect: r.quality_defect || "-",
            severity: r.severity || "",
            status: r.status || "",
            corrective_action: r.corrective_action || "",
            date: r.date,
            note_details: r.note_details,
            solved_by: r.solved_by || "",
            raised_by: r.raised_name || "-",
            clearance_photo: r.clearance_photo,
            nc_photo: r.nc_photo,
            closed_at: r.closed_at,
            resolved_at: r.resolved_at,
            approved_by: r.approved_by,
            approve_date: r.approve_date,
            isApproved: Boolean(r.approve_date),
            // Electrical fields
            electrical_line_name: r.electrical_line_name || null,
            electrical_line_type: r.electrical_line_type || null,
            pole_number: r.pole_number || null,
            pole_type: r.pole_type || null,
            level: r.level || "-", // 👈 Add this
            tower_type: r.tower_type || null,
            // Road fields
            road_name: r.road_name || null,
            road_type: r.road_type || null,
            // USS fields
            uss_name: r.uss_name || null,
        }));
    };

    const updateLocalField = (id, field, value) => {
        setEditedRows((prev) => ({
            ...prev,
            [id]: { ...prev[id],
                [field]: value
            },
        }));
    };

    const handleSave = async (id) => {
        const editData = editedRows[id];
        if (!editData) return;

        const fd = new FormData();
        if (editData.severity) fd.append("severity", editData.severity);
        if (editData.status) fd.append("status", editData.status);
        if (editData.corrective_action) fd.append("corrective_action", editData.corrective_action);
        if (editData.solved_by) fd.append("solved_by", editData.solved_by);

        await dispatch(UpdateSQRecord(id, fd));

        setEditedRows(prev => {
            const newState = { ...prev
            };
            delete newState[id];
            return newState;
        });
        dispatch(GetSQRecords());
        alert("Record updated successfully");
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Get current data based on selected tab
    const getCurrentData = () => {
        if (tabValue === 0) {
            return processRows(otherData);
        } else if (tabValue === 1) {
            return processRows(electricalData);
        } else if (tabValue === 2) {
            return processRows(roadData);
        } else {
            return processRows(ussData);
        }
    };

    // Get current columns based on selected tab
    const getCurrentColumns = () => {
        if (tabValue === 0) {
            return getOtherColumns();
        } else if (tabValue === 1) {
            return getElectricalColumns();
        } else if (tabValue === 2) {
            return getRoadColumns();
        } else {
            return getUssColumns();
        }
    };

    // Get tab label with count
    const getTabLabel = (label, count) => {
        return `${label} (${count})`;
    };

    return ( <
        Box sx = {
            {
                width: "100%"
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                mb: 1,
                fontWeight: 700,
                color: themeColor
            }
        } > {
            title
        } <
        /Typography>

        { /* Tabs */ } <
        Box sx = {
            {
                borderBottom: 1,
                borderColor: 'divider',
                mb: 2
            }
        } >
        <
        Tabs value = {
            tabValue
        }
        onChange = {
            handleTabChange
        }
        sx = {
            {
                '& .MuiTab-root': {
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    fontSize: '0.9rem',
                },
                '& .Mui-selected': {
                    color: themeColor || '#1976d2',
                },
                '& .MuiTabs-indicator': {
                    backgroundColor: themeColor || '#1976d2',
                }
            }
        } >
        <
        Tab label = {
            getTabLabel("All Records", otherData.length)
        }
        disabled = {
            otherData.length === 0
        }
        /> <
        Tab label = {
            getTabLabel("Electrical", electricalData.length)
        }
        disabled = {
            electricalData.length === 0
        }
        /> <
        Tab label = {
            getTabLabel("Road", roadData.length)
        }
        disabled = {
            roadData.length === 0
        }
        /> <
        Tab label = {
            getTabLabel("USS", ussData.length)
        }
        disabled = {
            ussData.length === 0
        }
        /> <
        /Tabs> <
        /Box>

        { /* Table */ } <
        Card sx = {
            {
                p: 1,
                height: 600,
                borderRadius: 2
            }
        } >
        <
        DataGrid rows = {
            getCurrentData()
        }
        columns = {
            getCurrentColumns()
        }
        pageSize = {
            10
        }
        rowsPerPageOptions = {
            [10, 25, 50]
        }
        disableSelectionOnClick sx = {
            {
                border: 'none',
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f1f5f9",
                    color: "black",
                    fontSize: "14px",
                },
                "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f1f5f9",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold"
                },
            }
        }
        /> <
        /Card> <
        /Box>
    );
};

export default SQRecordList;