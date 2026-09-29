import React, {
    useEffect,
    useState,
    useMemo,
    useCallback
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Chip,
    Avatar,
    Tooltip,
    Button,
    IconButton,
    TablePagination,
    Collapse,
    Snackbar,
    Alert
} from "@mui/material";
import {
    getCartRoadDPRView,
    GETPWCFilterData,
    PatchDPRAttachment,
    GetMapObjectTurbineData,
    PatchDPRSubmit
} from "../../Redux/InstallationData/CartRoadData/cartroadAction";
import {
    LiaFileUploadSolid
} from "react-icons/lia";
import {
    IoCloudDoneSharp
} from "react-icons/io5";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const LEVEL_CONFIG = {
    L1: {
        color: "info"
    },
    L2: {
        color: "warning"
    },
    L3: {
        sx: {
            bgcolor: "red",
            color: "#fff"
        }
    },
    Final: {
        sx: {
            bgcolor: "green",
            color: "#fff"
        }
    }
};

const getLevelChip = (level) => {
    const config = LEVEL_CONFIG[level] || {};
    return <Chip label = {
        level || "-"
    }
    size = "small" { ...config
    }
    />;
};

const DailyRoadTable = ({
        filters
    }) => {
        const dispatch = useDispatch();
        const [snack, setSnack] = useState({
            open: false,
            message: "",
            severity: "success"
        });
        const [submitting, setSubmitting] = useState(false);
        const [uploading, setUploading] = useState({});
        const [expandedRows, setExpandedRows] = useState({});
        const [attachmentStatus, setAttachmentStatus] = useState({});
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(10);

        const {
            loading = false, cartroadview = [], error = null
        } = useSelector((state) => state.cardRoad || {});

        // console.log("cartroadview",cartroadview)

        const fetchData = useCallback(() => {
            const cleanFilters = {};
            if (filters ? .project) cleanFilters.projectId = filters.project;
            if (filters ? .windfarm) cleanFilters.windfarmId = filters.windfarm;
            if (filters ? .cluster) cleanFilters.clusterId = filters.cluster;

            dispatch(GetMapObjectTurbineData(cleanFilters));
            dispatch(getCartRoadDPRView(cleanFilters));
            dispatch(GETPWCFilterData(cleanFilters));
        }, [dispatch, filters ? .project, filters ? .windfarm, filters ? .cluster]);

        useEffect(() => {
            fetchData();
        }, [fetchData]);
        useEffect(() => {
            setPage(0);
        }, [filters]);

        const filteredData = useMemo(() => {
            return cartroadview.filter(item =>
                (!filters.project || item.project_id === Number(filters.project)) &&
                (!filters.windfarm || item.windfarm_id === Number(filters.windfarm)) &&
                (!filters.cluster || item.cluster_id === Number(filters.cluster))
            );
        }, [cartroadview, filters]);

        const groupedByRoad = useMemo(() => {
            const roadMap = new Map();
            filteredData.forEach((item) => {
                const roadKey = item.map_object_name || "Unnamed Road";
                if (!roadMap.has(roadKey)) {
                    roadMap.set(roadKey, {
                        roadName: roadKey,
                        levels: {
                            L1: [],
                            L2: [],
                            L3: [],
                            Final: []
                        }, // Initialize as arrays
                        projectName: item.project_name || "-",
                        windfarmName: item.windfarm_name || "-",
                        clusterName: item.cluster_name || "-"
                    });
                }
                if (item.level && roadMap.get(roadKey).levels[item.level]) {
                    // Push every historical record into the array for that level
                    roadMap.get(roadKey).levels[item.level].push(item);
                }
            });
            return Array.from(roadMap.values()).sort((a, b) => a.roadName.localeCompare(b.roadName));
        }, [filteredData]);

        const paginatedData = useMemo(() => {
            return groupedByRoad.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage);
        }, [groupedByRoad, page, rowsPerPage]);

        const getCompletionStyle = (comp, len) => {
            const completed = parseFloat(comp) || 0;
            const length = parseFloat(len) || 0;
            if (completed === 0) return {
                color: "#d32f2f",
                fontWeight: 600
            };
            if (completed >= length && length > 0) return {
                color: "#2e7d32",
                fontWeight: 700
            };
            return {
                color: "#ed6c02",
                fontWeight: 600
            };
        };

        const handleFileUpload = async (row, file) => {
            if (!file || !row) return;
            setUploading(prev => ({ ...prev,
                [row.dpr_id]: true
            }));
            try {
                const formData = new FormData();
                formData.append("attachment", file);
                const res = await dispatch(PatchDPRAttachment(row.dpr_id, formData));
                if (res ? .success) {
                    setAttachmentStatus(prev => ({ ...prev,
                        [row.dpr_id]: true
                    }));
                    setSnack({
                        open: true,
                        message: "Certificate uploaded successfully 🎉",
                        severity: "success"
                    });
                    await fetchData();
                } else {
                    setSnack({
                        open: true,
                        message: "Upload failed. Please try again.",
                        severity: "error"
                    });
                }
            } catch {
                setSnack({
                    open: true,
                    message: "Error uploading file.",
                    severity: "error"
                });
            } finally {
                setUploading(prev => ({ ...prev,
                    [row.dpr_id]: false
                }));
            }
        };

        const handleSubmit = async (row) => {
            if (!row) return;
            if (!(row.attachment || attachmentStatus[row.dpr_id])) {
                setSnack({
                    open: true,
                    message: "Please upload attachment first before submitting!",
                    severity: "warning"
                });
                return;
            }
            try {
                setSubmitting(true);
                const formData = new FormData();
                formData.append("submitted_at", new Date().toISOString().split('T')[0]);
                const res = await dispatch(PatchDPRSubmit(row.dpr_id, formData));
                if (res ? .success) {
                    setSnack({
                        open: true,
                        message: "DPR submitted successfully! ✅",
                        severity: "success"
                    });
                    await fetchData();
                } else {
                    setSnack({
                        open: true,
                        message: res ? .error ? .message || "Submission failed.",
                        severity: "error"
                    });
                }
            } catch {
                setSnack({
                    open: true,
                    message: "An error occurred during submission.",
                    severity: "error"
                });
            } finally {
                setSubmitting(false);
            }
        };
        const renderLevelDetails = (levelRows, levelName) => {
                if (!levelRows || levelRows.length === 0) {
                    return ( <
                        TableRow key = {
                            levelName
                        } >
                        <
                        TableCell align = "center"
                        colSpan = {
                            9
                        } >
                        <
                        Typography variant = "body2"
                        color = "textSecondary" > No {
                            levelName
                        }
                        data available < /Typography> <
                        /TableCell> <
                        /TableRow>
                    );
                }

                // Map through ALL historical records for this level
                return levelRows.map((row, index) => {
                            const isApproved = !!row.approve_date;
                            const isSubmitted = !!row.submitted_at;
                            const hasUpload = !!(row.attachment || attachmentStatus[row.dpr_id]);
                            const isUploading = uploading[row.dpr_id] || false;
                            const imgUrl = row.photo ? .startsWith("http") ? row.photo : `${process.env.REACT_APP_API_URL || ""}${row.photo}`;

                            return ( <
                                TableRow hover key = {
                                    row.dpr_id || index
                                } >
                                <
                                TableCell align = "center" > {
                                    index === 0 ? getLevelChip(levelName) : < Typography variant = "caption"
                                    color = "textSecondary" > ↳History < /Typography>} <
                                    /TableCell> <
                                    TableCell align = "center"
                                    sx = {
                                        {
                                            color: "green",
                                            fontWeight: 700
                                        }
                                    } > {
                                        row.road_length ? ? "-"
                                    } < /TableCell> <
                                    TableCell align = "center" >
                                    <
                                    span style = {
                                        getCompletionStyle(row.completed_qty, row.road_length)
                                    } > {
                                        row.completed_qty ? ? "0"
                                    } < /span> <
                                    /TableCell> <
                                    TableCell align = "center"
                                    sx = {
                                        {
                                            color: "red",
                                            fontWeight: 700
                                        }
                                    } > {
                                        row.remaining_qty ? row.remaining_qty.toFixed(2) : "0.00"
                                    } <
                                    /TableCell> <
                                    TableCell > {
                                        row.updated_by_name || "-"
                                    } < /TableCell> <
                                    TableCell > < Chip label = {
                                        isApproved ? "Approved" : "Pending"
                                    }
                                    size = "small"
                                    color = {
                                        isApproved ? "success" : "warning"
                                    }
                                    /></TableCell >
                                    <
                                    TableCell > {
                                        row.photo && < Avatar src = {
                                            imgUrl
                                        }
                                        variant = "rounded"
                                        sx = {
                                            {
                                                width: 60,
                                                height: 40,
                                                cursor: "pointer"
                                            }
                                        }
                                        onClick = {
                                            () => window.open(imgUrl, "_blank")
                                        }
                                        />} <
                                        /TableCell> <
                                        TableCell sx = {
                                            {
                                                minWidth: 140
                                            }
                                        } > {
                                            hasUpload ? ( <
                                                Chip icon = { < CheckCircleIcon sx = {
                                                        {
                                                            color: "#fff !important"
                                                        }
                                                    }
                                                    />} label="Uploaded" size="small" sx={{ bgcolor: "#2e7d32", color: "#fff", fontWeight: 600 }} / >
                                                ): ( <
                                                    Button variant = "contained"
                                                    component = "label"
                                                    size = "small"
                                                    startIcon = { < LiaFileUploadSolid / >
                                                    }
                                                    disabled = {
                                                        isUploading
                                                    }
                                                    sx = {
                                                        {
                                                            bgcolor: "#00416A",
                                                            color: "#fff"
                                                        }
                                                    } > {
                                                        isUploading ? "Uploading..." : "Upload"
                                                    } <
                                                    input type = "file"
                                                    hidden onChange = {
                                                        (e) => e.target.files[0] && handleFileUpload(row, e.target.files[0])
                                                    }
                                                    /> <
                                                    /Button>
                                                )
                                            } <
                                            /TableCell> <
                                            TableCell >
                                            <
                                            Button
                                            variant = "contained"
                                            size = "small"
                                            startIcon = { < IoCloudDoneSharp / >
                                            }
                                            disabled = {!hasUpload || isSubmitted || isApproved || submitting
                                            }
                                            onClick = {
                                                () => handleSubmit(row)
                                            }
                                            sx = {
                                                {
                                                    bgcolor: (!hasUpload || isSubmitted || isApproved) ? "#bdbdbd" : "#3C95D6",
                                                    color: "#fff"
                                                }
                                            } >
                                            {
                                                isSubmitted ? "Submitted" : isApproved ? "Approved" : "Submit"
                                            } <
                                            /Button> <
                                            /TableCell> <
                                            /TableRow>
                                        );
                                    });
                            };

                            const renderMainRow = (roadGroup) => {
                                    const isExpanded = !!expandedRows[roadGroup.roadName];
                                    const levelsList = ["L1", "L2", "L3", "Final"];
                                    const completedCount = levelsList.filter(l => roadGroup.levels[l]).length;

                                    return ( <
                                        React.Fragment key = {
                                            roadGroup.roadName
                                        } >
                                        <
                                        TableRow sx = {
                                            {
                                                bgcolor: "#f5f5f5",
                                                cursor: "pointer",
                                                "&:hover": {
                                                    bgcolor: "#e8f4f8"
                                                }
                                            }
                                        }
                                        onClick = {
                                            () => setExpandedRows(p => ({ ...p,
                                                [roadGroup.roadName]: !p[roadGroup.roadName]
                                            }))
                                        } >
                                        <
                                        TableCell > < IconButton size = "small" > {
                                            isExpanded ? < KeyboardArrowUpIcon / > : < KeyboardArrowDownIcon / >
                                        } < /IconButton></TableCell >
                                        <
                                        TableCell sx = {
                                            {
                                                color: "#2A57BF",
                                                fontWeight: 700
                                            }
                                        } > {
                                            roadGroup.projectName
                                        } < /TableCell> <
                                        TableCell sx = {
                                            {
                                                color: "green",
                                                fontWeight: 700
                                            }
                                        } > {
                                            roadGroup.windfarmName
                                        } < /TableCell> <
                                        TableCell sx = {
                                            {
                                                color: "#6B3FA0",
                                                fontWeight: 600
                                            }
                                        } > {
                                            roadGroup.clusterName
                                        } < /TableCell> <
                                        TableCell sx = {
                                            {
                                                fontWeight: "bold",
                                                color: "#00416A"
                                            }
                                        } > {
                                            roadGroup.roadName
                                        } < /TableCell> <
                                        TableCell >
                                        <
                                        Box sx = {
                                            {
                                                display: "flex",
                                                gap: 0.5
                                            }
                                        } > {
                                            levelsList.map(l => roadGroup.levels[l] ? getLevelChip(l) : < Chip key = {
                                                    l
                                                }
                                                label = {
                                                    l
                                                }
                                                size = "small"
                                                sx = {
                                                    {
                                                        opacity: 0.4,
                                                        fontStyle: "italic"
                                                    }
                                                }
                                                />)} <
                                                /Box> <
                                                /TableCell> <
                                                TableCell align = "center" > < Chip label = {
                                                    `${completedCount}/4`
                                                }
                                                size = "small"
                                                color = {
                                                    completedCount === 4 ? "success" : "primary"
                                                }
                                                /></TableCell >
                                                <
                                                /TableRow> <
                                                TableRow >
                                                <
                                                TableCell colSpan = {
                                                    7
                                                }
                                                sx = {
                                                    {
                                                        p: 0
                                                    }
                                                } >
                                                <
                                                Collapse in = {
                                                    isExpanded
                                                }
                                                timeout = "auto"
                                                unmountOnExit >
                                                <
                                                Box sx = {
                                                    {
                                                        p: 2,
                                                        bgcolor: "#fafafa"
                                                    }
                                                } >
                                                <
                                                Typography variant = "subtitle2"
                                                sx = {
                                                    {
                                                        mb: 1.5,
                                                        fontWeight: "bold",
                                                        color: "#00416A"
                                                    }
                                                } > 📋Level Logs: {
                                                    roadGroup.roadName
                                                } < /Typography> <
                                                Table size = "small"
                                                sx = {
                                                    {
                                                        bgcolor: "#fff",
                                                        borderRadius: 1
                                                    }
                                                } >
                                                <
                                                TableHead >
                                                <
                                                TableRow sx = {
                                                    {
                                                        "& th": {
                                                            bgcolor: "#e3f2fd",
                                                            fontWeight: "bold"
                                                        }
                                                    }
                                                } >
                                                <
                                                TableCell align = "center" > Level < /TableCell> <
                                                TableCell align = "center" > Length < /TableCell> <
                                                TableCell align = "center" > Completed < /TableCell> <
                                                TableCell align = "center" > Remaining < /TableCell> <
                                                TableCell > Inspector < /TableCell> <
                                                TableCell > Status < /TableCell> <
                                                TableCell > Photo < /TableCell> <
                                                TableCell > Upload < /TableCell> <
                                                TableCell > Action < /TableCell> <
                                                /TableRow> <
                                                /TableHead> <
                                                TableBody > {
                                                    levelsList.map(l => renderLevelDetails(roadGroup.levels[l], l))
                                                } < /TableBody> <
                                                /Table> <
                                                /Box> <
                                                /Collapse> <
                                                /TableCell> <
                                                /TableRow> <
                                                /React.Fragment>
                                            );
                                        };

                                        if (loading) return <Box textAlign = "center"
                                        py = {
                                            4
                                        } > < CircularProgress / > < /Box>;
                                        if (error) return <Typography color = "error"
                                        align = "center"
                                        py = {
                                            2
                                        } > {
                                            error
                                        } < /Typography>;

                                        return ( <
                                            Box sx = {
                                                {
                                                    mt: 1
                                                }
                                            } >
                                            <
                                            TableContainer component = {
                                                Paper
                                            }
                                            elevation = {
                                                2
                                            }
                                            sx = {
                                                {
                                                    maxHeight: 600
                                                }
                                            } >
                                            <
                                            Table size = "small"
                                            stickyHeader sx = {
                                                {
                                                    minWidth: 1000
                                                }
                                            } >
                                            <
                                            TableHead >
                                            <
                                            TableRow sx = {
                                                {
                                                    "& th": {
                                                        bgcolor: "#00416A",
                                                        color: "#fff",
                                                        fontWeight: "bold"
                                                    }
                                                }
                                            } >
                                            <
                                            TableCell sx = {
                                                {
                                                    width: 50
                                                }
                                            } > < /TableCell> <
                                            TableCell > Project < /TableCell> <
                                            TableCell > Windfarm < /TableCell> <
                                            TableCell > Cluster < /TableCell> <
                                            TableCell > Road < /TableCell> <
                                            TableCell > Level Status < /TableCell> <
                                            TableCell align = "center" > Progress < /TableCell> <
                                            /TableRow> <
                                            /TableHead> <
                                            TableBody > {
                                                paginatedData.length === 0 ? ( <
                                                    TableRow > < TableCell colSpan = {
                                                        7
                                                    }
                                                    align = "center" > No data found < /TableCell></TableRow >
                                                ) : paginatedData.map(renderMainRow)
                                            } <
                                            /TableBody> <
                                            /Table> <
                                            /TableContainer>

                                            <
                                            TablePagination rowsPerPageOptions = {
                                                [10, 25, 50]
                                            }
                                            component = "div"
                                            count = {
                                                groupedByRoad.length
                                            }
                                            rowsPerPage = {
                                                rowsPerPage
                                            }
                                            page = {
                                                page
                                            }
                                            onPageChange = {
                                                (_, p) => setPage(p)
                                            }
                                            onRowsPerPageChange = {
                                                (e) => {
                                                    setRowsPerPage(parseInt(e.target.value, 10));
                                                    setPage(0);
                                                }
                                            }
                                            labelRowsPerPage = "Rows:" /
                                            >

                                            <
                                            Snackbar open = {
                                                snack.open
                                            }
                                            autoHideDuration = {
                                                3000
                                            }
                                            onClose = {
                                                () => setSnack(p => ({ ...p,
                                                    open: false
                                                }))
                                            }
                                            anchorOrigin = {
                                                {
                                                    vertical: "bottom",
                                                    horizontal: "right"
                                                }
                                            } >
                                            <
                                            Alert severity = {
                                                snack.severity
                                            }
                                            variant = "filled" > {
                                                snack.message
                                            } < /Alert> <
                                            /Snackbar> <
                                            /Box>
                                        );
                                    };

                                    export default DailyRoadTable;