import {
    useEffect,
    useMemo,
    useState
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    getCartRoadDPRView,
    patchCartRoadDPR,
} from "../../Redux/InstallationData/CartRoadData/cartroadAction";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    IconButton,
    Tooltip,
    Box,
    Typography,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Divider,
    Backdrop,
    Alert,
    Snackbar,
    TablePagination
} from "@mui/material";
import {
    Visibility as VisibilityIcon,
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    Close as CloseIcon,
    Image as ImageIcon,
    AttachFile as AttachFileIcon,
    DoneAll as DoneAllIcon,
    Error as ErrorIcon
} from "@mui/icons-material";

import {
    GetSQRecords
} from "../../Redux/SafetyQualityData/SafetyQualityAction";

const COMMON_COLUMNS = [{
        label: "View",
        key: "view",
        type: "view"
    },
    {
        label: "Status",
        key: "status",
        type: "status"
    },
];

const TABLE_CONFIG = {
    id: "road dpr",
    title: "Road Construction Daily Progress Report",
    columns: [{
            label: "Project",
            key: "project_name"
        },
        {
            label: "Windfar",
            key: "windfarm_name"
        },
        {
            label: "Cluster",
            key: "cluster_name"
        },
        {
            label: "Road Type",
            key: "map_object_type"
        },
        {
            label: "Road Name",
            key: "map_object_name"
        },
        {
            label: "Current Level",
            key: "map_plan_level"
        },
        {
            label: "Completed Level",
            key: "updated_level"
        },
        {
            label: "Progress Date",
            key: "date"
        },
        {
            label: "Remarks",
            key: "remarks"
        },
        {
            label: "Road Length (m)",
            key: "road_length"
        },
        {
            label: "Completed Qty",
            key: "completed_qty"
        },
        {
            label: "Inspector",
            key: "inspector_name"
        },
        {
            label: "Approved At",
            key: "approve_date"
        },
        ...COMMON_COLUMNS,
    ],
};

const GROUP_CONFIG = {
    groupByFields: ["project_name", "windfarm_name", "cluster_name", "map_object_name"],
    displayField: "map_object_name",
    separator: "|||"
};

const transformData = (data) => {
    if (!data) return [];
    return data.map((item) => ({
        id: item.dpr_id,
        project_name: item.project_name,
        windfarm_name: item.windfarm_name,
        cluster_name: item.cluster_name,
        map_object_type: item.map_object_type,
        map_object_name: item.map_object_name,
        map_object_id: item.map_object_id,
        map_plan_level: item.map_plan_level,
        layer_id: item.layer_id,
        start_lat: item.start_lat,
        start_lng: item.start_lng,
        end_lat: item.end_lat,
        end_lng: item.end_lng,
        updated_level: item.level,
        date: item.date,
        remarks: item.remarks,
        road_length: item.road_length,
        completed_qty: item.completed_qty,
        inspector_name: item.inspector_name,
        view: true,
        status: item.approve_date ? "Approved" : "Pending",
        submitted_at: item.submitted_at,
        approve_date: item.approve_date,
        photo: item.photo,
        attachment: item.attachment,
        file: [item.attachment, item.photo].filter(Boolean),
        _raw: item
    }));
};

const groupRecords = (rows) => {
    if (!rows ? .length) return rows;

    const groups = {};
    const {
        groupByFields,
        displayField,
        separator
    } = GROUP_CONFIG;

    rows.forEach(row => {
        const key = groupByFields.map(f => row[f] || 'unknown').join(separator);
        if (!groups[key]) {
            groups[key] = {
                records: [],
                displayValue: row[displayField]
            };
        }
        groups[key].records.push(row);
    });

    return Object.values(groups).map(({
        records,
        displayValue
    }) => {
        // Sort all records by date descending
        const sortedRecords = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Single record — still attach _groupedRecords so dialog can show it
        if (records.length === 1) {
            return {
                ...records[0],
                _groupedRecords: sortedRecords,
                _groupCount: 1,
                _displayValue: displayValue,
                _allApproved: records[0].status === 'Approved',
                _pendingCount: records[0].status === 'Pending' ? 1 : 0,
                _pendingIds: records[0].status === 'Pending' ? [records[0].id] : [],
                _allPhotos: records[0].photo ? [records[0].photo] : [],
                _allAttachments: records[0].attachment ? [records[0].attachment] : [],
                _allRemarks: records[0].remarks ?
                    [{
                        date: records[0].date,
                        remark: records[0].remarks,
                        level: records[0].updated_level
                    }] :
                    []
            };
        }

        const finalRecord = records.find(r => r.updated_level === 'Final');
        const approvedRecord = records.find(r => r.status === 'Approved');
        const latestRecord = sortedRecords[0];

        const selected = finalRecord || approvedRecord || latestRecord;

        const allApproved = records.every(r => r.status === 'Approved');
        const pendingRecords = records.filter(r => r.status === 'Pending');

        return {
            ...selected,
            _groupedRecords: sortedRecords,
            _groupCount: records.length,
            _displayValue: displayValue,
            _allApproved: allApproved,
            _pendingCount: pendingRecords.length,
            _pendingIds: pendingRecords.map(r => r.id),
            _allPhotos: sortedRecords
                .map(r => r.photo)
                .filter(photo => photo && photo !== ''),
            _allAttachments: sortedRecords
                .map(r => r.attachment)
                .filter(attachment => attachment && attachment !== ''),
            _allRemarks: sortedRecords
                .map(r => ({
                    date: r.date,
                    remark: r.remarks,
                    level: r.updated_level
                }))
                .filter(r => r.remark)
        };
    });
};

const getSummary = (rows) => {
    const total = rows ? .length || 0;
    const completed = rows ? .filter(r => r.status === "Approved").length || 0;
    const pending = rows ? .filter(r => r.status === "Pending").length || 0;
    return {
        completed,
        pending,
        notStarted: total - completed - pending
    };
};

function RoadTab({
    filters
}) {
    const dispatch = useDispatch();
    const {
        loading,
        cartroadview,
        error
    } = useSelector((state) => state.cardRoad);
    const {
        sqlist = []
    } = useSelector((state) => state.sqData || {});

    const [viewDialog, setViewDialog] = useState({
        open: false,
        data: null,
        title: "",
        issues: []
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [approving, setApproving] = useState(false);
    const [approvingId, setApprovingId] = useState(null);
    const [approvingAll, setApprovingAll] = useState(false);

    useEffect(() => {
        dispatch(getCartRoadDPRView());
        dispatch(GetSQRecords());
    }, [dispatch]);

    // Match SQ issues with roads by road_id/map_object_id
    const getRoadIssues = (mapObjectId) => {
        return sqlist.filter(sq => sq.road === mapObjectId);
    };

    // Filter data based on selected filters
    const filteredData = useMemo(() => {
        if (!cartroadview || !Array.isArray(cartroadview)) {
            return [];
        }

        let data = cartroadview;

        const normalizeValue = (value) => {
            if (value === null || value === undefined) return '';
            return String(value).toLowerCase().trim();
        };

        // Filter to only show records with submitted_at (not null) — KEPT AS-IS
        data = data.filter(item => item.submitted_at !== null && item.submitted_at !== undefined);

        // Filter by project
        if (filters ? .project) {
            const filterProject = normalizeValue(filters.project);
            data = data.filter(item => {
                const projectIdMatch = String(item.project_id) === String(filters.project);
                const projectNameMatch = normalizeValue(item.project_name).includes(filterProject);
                return projectIdMatch || projectNameMatch;
            });
        }

        // Filter by windfarm
        if (filters ? .windfarm) {
            const filterWindfarm = normalizeValue(filters.windfarm);
            data = data.filter(item => {
                const windfarmIdMatch = String(item.windfarm_id) === String(filters.windfarm);
                const windfarmNameMatch = normalizeValue(item.windfarm_name).includes(filterWindfarm);
                return windfarmIdMatch || windfarmNameMatch;
            });
        }

        // Filter by cluster
        if (filters ? .cluster) {
            const filterCluster = normalizeValue(filters.cluster);
            data = data.filter(item => {
                const clusterIdMatch = String(item.cluster_id) === String(filters.cluster);
                const clusterNameMatch = normalizeValue(item.cluster_name).includes(filterCluster);
                return clusterIdMatch || clusterNameMatch;
            });
        }

        return data;
    }, [cartroadview, filters]);

    // Transform and group the filtered data, attach issues
    const rows = useMemo(() => {
        const transformed = transformData(filteredData);
        const withIssues = transformed.map(row => ({
            ...row,
            issues: getRoadIssues(row.map_object_id)
        }));
        const grouped = groupRecords(withIssues);
        return grouped.map(row => ({
            ...row,
            issues: getRoadIssues(row.map_object_id)
        }));
    }, [filteredData, sqlist]);

    // Handle single approve
    const handleApprove = async (rowId) => {
        setApproving(true);
        setApprovingId(rowId);
        try {
            await dispatch(patchCartRoadDPR(rowId, {
                approve_date: new Date().toISOString(),
                status: "approved"
            }));
            await dispatch(getCartRoadDPRView());
            setSnackbar({
                open: true,
                message: 'Record approved successfully!',
                severity: 'success'
            });
        } catch (err) {
            console.error("Approve failed", err);
            setSnackbar({
                open: true,
                message: 'Failed to approve record. Please try again.',
                severity: 'error'
            });
        } finally {
            setApproving(false);
            setApprovingId(null);
        }
    };

    // Handle approve all versions for a road
    const handleApproveAll = async (row) => {
        const issues = row.issues || [];
        const hasOpenIssues = issues.some(i => i.status === 'open');
        if (hasOpenIssues) {
            setSnackbar({
                open: true,
                message: `Cannot approve: ${issues.filter(i => i.status === 'open').length} open issue(s) exist. Close all issues first.`,
                severity: 'warning'
            });
            return;
        }

        if (!row._pendingIds || row._pendingIds.length === 0) {
            setSnackbar({
                open: true,
                message: 'No pending versions to approve.',
                severity: 'warning'
            });
            return;
        }

        setApprovingAll(true);
        const pendingIds = row._pendingIds;
        let successCount = 0;
        let failCount = 0;

        try {
            for (const id of pendingIds) {
                try {
                    await dispatch(patchCartRoadDPR(id, {
                        approve_date: new Date().toISOString(),
                        status: "approved"
                    }));
                    successCount++;
                } catch (err) {
                    console.error(`Failed to approve record ${id}:`, err);
                    failCount++;
                }
            }

            await dispatch(getCartRoadDPRView());

            if (successCount > 0 && failCount === 0) {
                setSnackbar({
                    open: true,
                    message: `All ${successCount} versions approved successfully!`,
                    severity: 'success'
                });
            } else if (successCount > 0 && failCount > 0) {
                setSnackbar({
                    open: true,
                    message: `${successCount} approved, ${failCount} failed. Please try again for failed ones.`,
                    severity: 'warning'
                });
            } else {
                setSnackbar({
                    open: true,
                    message: 'Failed to approve versions. Please try again.',
                    severity: 'error'
                });
            }
        } catch (err) {
            console.error("Approve all failed", err);
            setSnackbar({
                open: true,
                message: 'Failed to approve versions. Please try again.',
                severity: 'error'
            });
        } finally {
            setApprovingAll(false);
        }
    };

    const handleViewClick = (row) => {
        setViewDialog({
            open: true,
            data: row,
            title: `Details: ${row.map_object_name || 'Record'}`,
            issues: row.issues || []
        });
    };

    const handleCloseDialog = () => {
        setViewDialog({
            open: false,
            data: null,
            title: "",
            issues: []
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar,
            open: false
        });
    };

    const getStatusChip = (status) => {
        if (status === "Approved") {
            return <Chip label = "Approved"
            color = "success"
            size = "small"
            icon = { < CheckCircleIcon / >
            }
            />;
        }
        return <Chip label = "Pending"
        color = "warning"
        size = "small"
        icon = { < PendingIcon / >
        }
        />;
    };

    const summary = getSummary(rows);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = useMemo(() => {
        return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [rows, page, rowsPerPage]);

    useEffect(() => {
        setPage(0);
    }, [filters]);

    // Loading state
    if (loading && (!cartroadview || !Array.isArray(cartroadview) || cartroadview.length === 0)) {
        return ( <
            Box display = "flex"
            justifyContent = "center"
            alignItems = "center"
            minHeight = "400px" >
            <
            CircularProgress / >
            <
            /Box>
        );
    }

    // Error state
    if (error) {
        return ( <
            Box display = "flex"
            justifyContent = "center"
            alignItems = "center"
            minHeight = "400px" >
            <
            Typography color = "error" > Error: {
                error
            } < /Typography> <
            /Box>
        );
    }

    // No data state
    if (!cartroadview || !Array.isArray(cartroadview) || cartroadview.length === 0) {
        return ( <
            Box display = "flex"
            justifyContent = "center"
            alignItems = "center"
            minHeight = "400px" >
            <
            Typography > No data available < /Typography> <
            /Box>
        );
    }

    // No filtered data state
    if (!rows ? .length && filteredData.length === 0) {
        return ( <
            Box display = "flex"
            justifyContent = "center"
            alignItems = "center"
            minHeight = "400px" >
            <
            Typography > No records match the selected filters < /Typography> <
            /Box>
        );
    }

    return ( <
            Box sx = {
                {
                    p: 3
                }
            } > { /* Loading Backdrop while approving */ } <
            Backdrop sx = {
                {
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }
            }
            open = {
                approving || approvingAll
            } >
            <
            Box display = "flex"
            flexDirection = "column"
            alignItems = "center" >
            <
            CircularProgress color = "inherit" / >
            <
            Typography sx = {
                {
                    mt: 2
                }
            } > {
                approvingAll ? 'Approving all versions...' : 'Approving...'
            } <
            /Typography> <
            /Box> <
            /Backdrop>

            { /* Snackbar for notifications */ } <
            Snackbar open = {
                snackbar.open
            }
            autoHideDuration = {
                6000
            }
            onClose = {
                handleCloseSnackbar
            }
            anchorOrigin = {
                {
                    vertical: 'top',
                    horizontal: 'center'
                }
            } >
            <
            Alert onClose = {
                handleCloseSnackbar
            }
            severity = {
                snackbar.severity
            }
            sx = {
                {
                    width: '100%'
                }
            } > {
                snackbar.message
            } <
            /Alert> <
            /Snackbar>

            { /* Main Table */ } <
            Box sx = {
                {
                    width: "100%",
                    overflowX: "auto"
                }
            } >
            <
            TableContainer component = {
                Paper
            }
            sx = {
                {
                    borderRadius: "8px 8px 0 0",
                    boxShadow: 1,
                    width: "100%"
                }
            } >
            <
            Table size = "small"
            sx = {
                {
                    minWidth: 1600,
                    tableLayout: "auto"
                }
            } >
            <
            TableHead >
            <
            TableRow sx = {
                {
                    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                    '& .MuiTableCell-root': {
                        color: '#fff',
                        fontWeight: 600,
                        py: 1,
                        borderBottom: "none",
                        whiteSpace: "nowrap"
                    },
                }
            } >
            <
            TableCell width = "70px"
            align = "center" > View < /TableCell> <
            TableCell width = "120px" > Status < /TableCell> <
            TableCell width = "240px" > Actions < /TableCell> <
            TableCell width = "80px" > Issues < /TableCell> <
            TableCell > Project Name < /TableCell> <
            TableCell > Windfarm Name < /TableCell> <
            TableCell > Cluster Name < /TableCell> <
            TableCell > Road Type < /TableCell> <
            TableCell > Road Name < /TableCell> <
            TableCell > Current Level < /TableCell> <
            TableCell > Completed Level < /TableCell> <
            TableCell > Progress Date < /TableCell> <
            TableCell sx = {
                {
                    minWidth: 200
                }
            } > Remarks < /TableCell> <
            TableCell > Road Length(m) < /TableCell> <
            TableCell > Completed Qty < /TableCell> <
            TableCell > Inspector < /TableCell> <
            TableCell > Approved At < /TableCell> <
            /TableRow> <
            /TableHead> <
            TableBody > {
                visibleRows.map((row, rowIdx) => {
                        const hasGrouped = row._groupedRecords ? .length > 1;
                        const isApproving = approving && approvingId === row.id;
                        const hasPending = row._pendingCount > 0;
                        const allApproved = row._allApproved;
                        const roadIssues = row.issues || [];
                        const hasOpenIssues = roadIssues.some(i => i.status === 'open');
                        const hasIssues = roadIssues.length > 0;
                        const openIssuesCount = roadIssues.filter(i => i.status === 'open').length;

                        const isApproveDisabled = approving || approvingAll || hasOpenIssues;

                        return ( <
                            TableRow key = {
                                rowIdx
                            }
                            hover sx = {
                                {
                                    '& .MuiTableCell-root': {
                                        py: 0.75,
                                        px: 2,
                                        whiteSpace: "nowrap"
                                    },
                                    '&:last-child td, &:last-child th': {
                                        border: 0
                                    }
                                }
                            } >
                            <
                            TableCell align = "center" >
                            <
                            Tooltip title = "View Details" >
                            <
                            IconButton size = "small"
                            color = "primary"
                            onClick = {
                                () => handleViewClick(row)
                            }
                            disabled = {
                                approving || approvingAll
                            }
                            sx = {
                                {
                                    p: 0.25
                                }
                            } >
                            <
                            VisibilityIcon fontSize = "small" / >
                            <
                            /IconButton> <
                            /Tooltip> <
                            /TableCell>

                            <
                            TableCell > {
                                getStatusChip(row.status)
                            } <
                            /TableCell>

                            <
                            TableCell >
                            <
                            Box sx = {
                                {
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1
                                }
                            } > { /* Approve All button for grouped records */ } {
                                hasGrouped && hasPending && ( <
                                    Tooltip title = {
                                        hasOpenIssues ?
                                        `Cannot approve: ${openIssuesCount} open issue(s) exist. Close all issues first.` :
                                            `Approve all ${row._pendingCount} pending versions`
                                    } >
                                    <
                                    span >
                                    <
                                    Button variant = "contained"
                                    color = "success"
                                    size = "small"
                                    startIcon = { < DoneAllIcon sx = {
                                            {
                                                fontSize: 12
                                            }
                                        }
                                        />}
                                        onClick = {
                                            () => handleApproveAll(row)
                                        }
                                        disabled = {
                                            isApproveDisabled
                                        }
                                        sx = {
                                            {
                                                py: 0.2,
                                                px: 1,
                                                minHeight: 22,
                                                fontSize: "0.7rem",
                                                textTransform: 'none',
                                                borderRadius: 1,
                                                opacity: isApproveDisabled ? 0.5 : 1
                                            }
                                        } >
                                        Approve({
                                            row._pendingCount
                                        }) <
                                        /Button> <
                                        /span> <
                                        /Tooltip>
                                    )
                                }

                                { /* Single Approve button */ } {
                                    !hasGrouped && row.status === "Pending" && ( <
                                        Tooltip title = {
                                            hasOpenIssues ?
                                            `Cannot approve: ${openIssuesCount} open issue(s) exist. Close all issues first.` :
                                                'Approve this road'
                                        } >
                                        <
                                        span >
                                        <
                                        Button variant = "contained"
                                        color = "primary"
                                        size = "small"
                                        onClick = {
                                            () => handleApprove(row.id)
                                        }
                                        disabled = {
                                            isApproveDisabled
                                        }
                                        sx = {
                                            {
                                                py: 0.2,
                                                px: 1.2,
                                                minHeight: 22,
                                                fontSize: "0.7rem",
                                                textTransform: 'none',
                                                borderRadius: 1,
                                                opacity: isApproveDisabled ? 0.5 : 1
                                            }
                                        } >
                                        {
                                            isApproving ? < CircularProgress size = {
                                                12
                                            }
                                            color = "inherit" / > : 'Approve'
                                        } <
                                        /Button> <
                                        /span> <
                                        /Tooltip>
                                    )
                                }

                                { /* Show open issues warning chip */ } {
                                    hasOpenIssues && ( <
                                        Tooltip title = {
                                            `${openIssuesCount} open issue(s). Close them to enable approval.`
                                        } >
                                        <
                                        Chip icon = { < ErrorIcon sx = {
                                                {
                                                    fontSize: 11
                                                }
                                            }
                                            />}
                                            label = {
                                                `${openIssuesCount} open`
                                            }
                                            size = "small"
                                            color = "error"
                                            variant = "outlined"
                                            sx = {
                                                {
                                                    height: 18,
                                                    fontSize: '0.6rem',
                                                    fontWeight: 600
                                                }
                                            }
                                            /> <
                                            /Tooltip>
                                        )
                                    }

                                    {
                                        allApproved && hasGrouped && ( <
                                            Chip label = "All OK"
                                            size = "small"
                                            color = "success"
                                            icon = { < CheckCircleIcon sx = {
                                                    {
                                                        fontSize: '11px !important'
                                                    }
                                                }
                                                />}
                                                sx = {
                                                    {
                                                        height: 18,
                                                        fontSize: '0.65rem'
                                                    }
                                                }
                                                />
                                            )
                                        }

                                        {
                                            hasGrouped && ( <
                                                Chip label = {
                                                    `${row._groupCount} v`
                                                }
                                                size = "small"
                                                variant = "outlined"
                                                color = "primary"
                                                sx = {
                                                    {
                                                        height: 18,
                                                        fontSize: '0.65rem',
                                                        px: 0.25
                                                    }
                                                }
                                                />
                                            )
                                        }

                                        {
                                            row._allPhotos ? .length > 0 && ( <
                                                Box sx = {
                                                    {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: 'secondary.main',
                                                        gap: 0.1,
                                                        fontSize: '0.7rem',
                                                        fontWeight: 600
                                                    }
                                                } >
                                                <
                                                ImageIcon sx = {
                                                    {
                                                        fontSize: 13
                                                    }
                                                }
                                                /> {
                                                    row._allPhotos.length
                                                } <
                                                /Box>
                                            )
                                        }

                                        {
                                            row._allAttachments ? .length > 0 && ( <
                                                Box sx = {
                                                    {
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        color: 'info.main',
                                                        gap: 0.1,
                                                        fontSize: '0.7rem',
                                                        fontWeight: 600
                                                    }
                                                } >
                                                <
                                                AttachFileIcon sx = {
                                                    {
                                                        fontSize: 13
                                                    }
                                                }
                                                /> {
                                                    row._allAttachments.length
                                                } <
                                                /Box>
                                            )
                                        } <
                                        /Box> <
                                        /TableCell>

                                        { /* Issues Column */ } <
                                        TableCell > {
                                            hasIssues ? ( <
                                                Tooltip title = {
                                                    `${roadIssues.length} issue(s) - Click View for details`
                                                } >
                                                <
                                                Chip icon = { < ErrorIcon sx = {
                                                        {
                                                            fontSize: 14
                                                        }
                                                    }
                                                    />}
                                                    label = {
                                                        roadIssues.length
                                                    }
                                                    size = "small"
                                                    color = {
                                                        hasOpenIssues ? "error" : "success"
                                                    }
                                                    variant = "filled"
                                                    sx = {
                                                        {
                                                            height: 22,
                                                            fontSize: '0.7rem',
                                                            fontWeight: 600
                                                        }
                                                    }
                                                    /> <
                                                    /Tooltip>
                                                ): ( <
                                                    Typography variant = "caption"
                                                    color = "textSecondary" > - < /Typography>
                                                )
                                            } <
                                            /TableCell>

                                            <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.85rem"
                                                }
                                            } > {
                                                row.project_name || '-'
                                            } < /TableCell> <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.85rem"
                                                }
                                            } > {
                                                row.windfarm_name || '-'
                                            } < /TableCell> <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.85rem"
                                                }
                                            } > {
                                                row.cluster_name || '-'
                                            } < /TableCell> <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.85rem"
                                                }
                                            } > {
                                                row.map_object_type || '-'
                                            } < /TableCell> <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.85rem",
                                                    fontWeight: 500
                                                }
                                            } > {
                                                row.map_object_name || '-'
                                            } < /TableCell> <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.85rem"
                                                }
                                            } > {
                                                row.map_plan_level || '-'
                                            } < /TableCell> <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.85rem"
                                                }
                                            } > {
                                                row.updated_level || '-'
                                            } < /TableCell> <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.825rem"
                                                }
                                            } > {
                                                row.date ? new Date(row.date).toLocaleDateString() : '-'
                                            } <
                                            /TableCell>

                                            <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.825rem",
                                                    color: "text.secondary",
                                                    maxWidth: 250,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }
                                            } >
                                            <
                                            Tooltip title = {
                                                row.remarks || ""
                                            } >
                                            <
                                            span > {
                                                row.remarks || '-'
                                            } < /span> <
                                            /Tooltip> <
                                            /TableCell>

                                            <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.85rem"
                                                }
                                            } > {
                                                row.road_length || '-'
                                            } < /TableCell> <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.85rem"
                                                }
                                            } > {
                                                row.completed_qty || '-'
                                            } < /TableCell> <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.85rem"
                                                }
                                            } > {
                                                row.inspector_name || '-'
                                            } < /TableCell> <
                                            TableCell sx = {
                                                {
                                                    fontSize: "0.825rem",
                                                    color: "text.secondary"
                                                }
                                            } > {
                                                row.approve_date ? new Date(row.approve_date).toLocaleDateString() : '-'
                                            } <
                                            /TableCell> <
                                            /TableRow>
                                        );
                                    })
                            } <
                            /TableBody> <
                            /Table> <
                            /TableContainer>

                            <
                            TablePagination rowsPerPageOptions = {
                                [5, 10, 25, 50]
                            }
                            component = {
                                Paper
                            }
                            sx = {
                                {
                                    borderTop: "1px solid rgba(224, 224, 224, 1)",
                                    borderRadius: "0 0 8px 8px"
                                }
                            }
                            count = {
                                rows.length
                            }
                            rowsPerPage = {
                                rowsPerPage
                            }
                            page = {
                                page
                            }
                            onPageChange = {
                                handleChangePage
                            }
                            onRowsPerPageChange = {
                                handleChangeRowsPerPage
                            }
                            /> <
                            /Box>

                            { /* View Dialog */ } <
                            Dialog open = {
                                viewDialog.open
                            }
                            onClose = {
                                handleCloseDialog
                            }
                            maxWidth = "lg"
                            fullWidth scroll = "paper" >
                            <
                            DialogTitle >
                            <
                            Box display = "flex"
                            justifyContent = "space-between"
                            alignItems = "center" >
                            <
                            Typography variant = "h6" > {
                                viewDialog.title
                            } < /Typography> <
                            Box sx = {
                                {
                                    display: 'flex',
                                    gap: 1
                                }
                            } > { /* Approve All button in dialog - disabled if open issues exist */ } {
                                viewDialog.data ? ._pendingCount > 0 && ( <
                                    Tooltip title = {
                                        viewDialog.issues ? .some(i => i.status === 'open') ?
                                        `Cannot approve: ${viewDialog.issues?.filter(i => i.status === 'open').length || 0} open issue(s) exist.` :
                                        `Approve all ${viewDialog.data._pendingCount} pending versions`
                                    } >
                                    <
                                    span >
                                    <
                                    Button variant = "contained"
                                    color = "success"
                                    size = "small"
                                    startIcon = { < DoneAllIcon / >
                                    }
                                    onClick = {
                                        () => {
                                            handleApproveAll(viewDialog.data);
                                            handleCloseDialog();
                                        }
                                    }
                                    disabled = {
                                        approving || approvingAll || viewDialog.issues ? .some(i => i.status === 'open')
                                    } >
                                    Approve All({
                                        viewDialog.data._pendingCount
                                    }) <
                                    /Button> <
                                    /span> <
                                    /Tooltip>
                                )
                            } <
                            IconButton onClick = {
                                handleCloseDialog
                            }
                            size = "small" >
                            <
                            CloseIcon / >
                            <
                            /IconButton> <
                            /Box> <
                            /Box> <
                            /DialogTitle> <
                            Divider / >
                            <
                            DialogContent dividers > {
                                viewDialog.data && ( <
                                    Box sx = {
                                        {
                                            mt: 1
                                        }
                                    } > { /* Basic Info - 4x4 Grid Format */ } <
                                    Paper sx = {
                                        {
                                            p: 2,
                                            mb: 3,
                                            bgcolor: '#f5f5f5'
                                        }
                                    } >
                                    <
                                    Grid container spacing = {
                                        2
                                    } >
                                    <
                                    Grid item xs = {
                                        12
                                    }
                                    sm = {
                                        3
                                    } >
                                    <
                                    Typography variant = "caption"
                                    color = "textSecondary" > Project Name < /Typography> <
                                    Typography variant = "body1"
                                    fontWeight = "medium" > {
                                        viewDialog.data.project_name || '-'
                                    } < /Typography> <
                                    /Grid> <
                                    Grid item xs = {
                                        12
                                    }
                                    sm = {
                                        3
                                    } >
                                    <
                                    Typography variant = "caption"
                                    color = "textSecondary" > Windfarm Name < /Typography> <
                                    Typography variant = "body1"
                                    fontWeight = "medium" > {
                                        viewDialog.data.windfarm_name || '-'
                                    } < /Typography> <
                                    /Grid> <
                                    Grid item xs = {
                                        12
                                    }
                                    sm = {
                                        3
                                    } >
                                    <
                                    Typography variant = "caption"
                                    color = "textSecondary" > Cluster Name < /Typography> <
                                    Typography variant = "body1"
                                    fontWeight = "medium" > {
                                        viewDialog.data.cluster_name || '-'
                                    } < /Typography> <
                                    /Grid> <
                                    Grid item xs = {
                                        12
                                    }
                                    sm = {
                                        3
                                    } >
                                    <
                                    Typography variant = "caption"
                                    color = "textSecondary" > Road Name < /Typography> <
                                    Typography variant = "body1"
                                    fontWeight = "medium" > {
                                        viewDialog.data.map_object_name || '-'
                                    } < /Typography> <
                                    /Grid>

                                    <
                                    Grid item xs = {
                                        12
                                    }
                                    sm = {
                                        3
                                    } >
                                    <
                                    Typography variant = "caption"
                                    color = "textSecondary" > Road Total Length < /Typography> <
                                    Typography variant = "body1"
                                    fontWeight = "medium" > {
                                        viewDialog.data.road_length || '-'
                                    } < /Typography> <
                                    /Grid> <
                                    Grid item xs = {
                                        12
                                    }
                                    sm = {
                                        3
                                    } >
                                    <
                                    Typography variant = "caption"
                                    color = "textSecondary" > Completed Road Length < /Typography> <
                                    Typography variant = "body1"
                                    fontWeight = "medium" > {
                                        viewDialog.data.completed_qty || '-'
                                    } < /Typography> <
                                    /Grid> <
                                    Grid item xs = {
                                        12
                                    }
                                    sm = {
                                        3
                                    } >
                                    <
                                    Typography variant = "caption"
                                    color = "textSecondary" > Road Type < /Typography> <
                                    Typography variant = "body1"
                                    fontWeight = "medium" > {
                                        viewDialog.data.map_object_type || '-'
                                    } < /Typography> <
                                    /Grid> <
                                    Grid item xs = {
                                        12
                                    }
                                    sm = {
                                        3
                                    } >
                                    <
                                    Typography variant = "caption"
                                    color = "textSecondary" > Current Status < /Typography> <
                                    Box > {
                                        getStatusChip(viewDialog.data.status)
                                    } < /Box> <
                                    /Grid>

                                    <
                                    Grid item xs = {
                                        12
                                    }
                                    sm = {
                                        3
                                    } >
                                    <
                                    Typography variant = "caption"
                                    color = "textSecondary" > Last Updated Level < /Typography> <
                                    Typography variant = "body1"
                                    fontWeight = "medium" > {
                                        viewDialog.data.updated_level || '-'
                                    } < /Typography> <
                                    /Grid>

                                    <
                                    Grid item xs = {
                                        0
                                    }
                                    sm = {
                                        3
                                    }
                                    /> <
                                    Grid item xs = {
                                        0
                                    }
                                    sm = {
                                        3
                                    }
                                    /> <
                                    Grid item xs = {
                                        0
                                    }
                                    sm = {
                                        3
                                    }
                                    />

                                    {
                                        viewDialog.data._pendingCount > 0 && ( <
                                            Grid item xs = {
                                                12
                                            } >
                                            <
                                            Alert severity = "info" > {
                                                viewDialog.data._pendingCount
                                            }
                                            version(s) pending approval. {
                                                viewDialog.data._groupCount > 1 && ` This road has ${viewDialog.data._groupCount} total versions.`
                                            } <
                                            /Alert> <
                                            /Grid>
                                        )
                                    } <
                                    /Grid> <
                                    /Paper>

                                    { /* SQ Issues Section */ } <
                                    Typography variant = "h6"
                                    gutterBottom sx = {
                                        {
                                            fontWeight: 'bold',
                                            color: '#d32f2f',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }
                                    } >
                                    <
                                    ErrorIcon / >
                                    Safety & Quality Issues <
                                    Chip label = {
                                        `${viewDialog.issues?.length || 0} issues`
                                    }
                                    size = "small"
                                    color = {
                                        viewDialog.issues ? .some(i => i.status === 'open') ? "error" : "success"
                                    }
                                    /> <
                                    /Typography>

                                    {
                                        viewDialog.issues && viewDialog.issues.length > 0 ? ( <
                                            Box sx = {
                                                {
                                                    mb: 3
                                                }
                                            } > {
                                                viewDialog.issues.map((issue, index) => ( <
                                                    Paper key = {
                                                        index
                                                    }
                                                    elevation = {
                                                        1
                                                    }
                                                    sx = {
                                                        {
                                                            p: 2,
                                                            mb: 1.5,
                                                            borderLeft: `5px solid ${issue.status === 'open' ? '#d32f2f' : '#4caf50'}`,
                                                            bgcolor: issue.status === 'open' ? '#ffebee' : '#e8f5e9',
                                                            transition: 'all 0.3s',
                                                            '&:hover': {
                                                                boxShadow: 2,
                                                            }
                                                        }
                                                    } >
                                                    <
                                                    Grid container spacing = {
                                                        2
                                                    }
                                                    alignItems = "center" >
                                                    <
                                                    Grid item xs = {
                                                        12
                                                    }
                                                    sm = {
                                                        2
                                                    } >
                                                    <
                                                    Typography variant = "caption"
                                                    color = "textSecondary" > Raised At < /Typography> <
                                                    Typography variant = "body2"
                                                    fontWeight = "medium" > {
                                                        issue.raised_at ? new Date(issue.raised_at).toLocaleDateString('en-IN', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        }) : '-'
                                                    } <
                                                    /Typography> <
                                                    /Grid> <
                                                    Grid item xs = {
                                                        6
                                                    }
                                                    sm = {
                                                        2
                                                    } >
                                                    <
                                                    Typography variant = "caption"
                                                    color = "textSecondary" > Severity < /Typography> <
                                                    Chip label = {
                                                        issue.severity || 'N/A'
                                                    }
                                                    size = "small"
                                                    color = {
                                                        issue.severity === 'high' ? 'error' : issue.severity === 'medium' ? 'warning' : 'info'
                                                    }
                                                    sx = {
                                                        {
                                                            height: 22,
                                                            fontSize: '0.7rem',
                                                            textTransform: 'capitalize'
                                                        }
                                                    }
                                                    /> <
                                                    /Grid> <
                                                    Grid item xs = {
                                                        6
                                                    }
                                                    sm = {
                                                        2
                                                    } >
                                                    <
                                                    Typography variant = "caption"
                                                    color = "textSecondary" > Status < /Typography> <
                                                    Chip label = {
                                                        issue.status || 'N/A'
                                                    }
                                                    size = "small"
                                                    sx = {
                                                        {
                                                            height: 22,
                                                            fontSize: '0.7rem',
                                                            textTransform: 'capitalize',
                                                            bgcolor: issue.status === 'open' ? '#d32f2f' : '#4caf50',
                                                            color: '#fff',
                                                            fontWeight: 600
                                                        }
                                                    }
                                                    /> <
                                                    /Grid> <
                                                    Grid item xs = {
                                                        12
                                                    }
                                                    sm = {
                                                        3
                                                    } >
                                                    <
                                                    Typography variant = "caption"
                                                    color = "textSecondary" > Category < /Typography> <
                                                    Typography variant = "body2" > {
                                                        issue.category || '-'
                                                    } - {
                                                        issue.record_type || ''
                                                    } < /Typography> <
                                                    /Grid> <
                                                    Grid item xs = {
                                                        12
                                                    }
                                                    sm = {
                                                        3
                                                    } >
                                                    <
                                                    Typography variant = "caption"
                                                    color = "textSecondary" > Raised By < /Typography> <
                                                    Typography variant = "body2" > {
                                                        issue.raised_name || '-'
                                                    } < /Typography> <
                                                    /Grid> <
                                                    Grid item xs = {
                                                        12
                                                    } >
                                                    <
                                                    Typography variant = "caption"
                                                    color = "textSecondary" > Note Details < /Typography> <
                                                    Typography variant = "body2"
                                                    sx = {
                                                        {
                                                            fontStyle: 'italic',
                                                            mt: 0.5
                                                        }
                                                    } > {
                                                        issue.note_details || '-'
                                                    } <
                                                    /Typography> <
                                                    /Grid> {
                                                        issue.corrective_action && ( <
                                                            Grid item xs = {
                                                                12
                                                            } >
                                                            <
                                                            Typography variant = "caption"
                                                            color = "textSecondary" > Corrective Action < /Typography> <
                                                            Typography variant = "body2" > {
                                                                issue.corrective_action
                                                            } < /Typography> <
                                                            /Grid>
                                                        )
                                                    } {
                                                        issue.solved_name && ( <
                                                            Grid item xs = {
                                                                12
                                                            }
                                                            sm = {
                                                                3
                                                            } >
                                                            <
                                                            Typography variant = "caption"
                                                            color = "textSecondary" > Solved By < /Typography> <
                                                            Typography variant = "body2" > {
                                                                issue.solved_name
                                                            } < /Typography> <
                                                            /Grid>
                                                        )
                                                    } {
                                                        issue.closed_at && ( <
                                                            Grid item xs = {
                                                                12
                                                            }
                                                            sm = {
                                                                3
                                                            } >
                                                            <
                                                            Typography variant = "caption"
                                                            color = "textSecondary" > Closed At < /Typography> <
                                                            Typography variant = "body2" > {
                                                                new Date(issue.closed_at).toLocaleDateString('en-IN')
                                                            } <
                                                            /Typography> <
                                                            /Grid>
                                                        )
                                                    } <
                                                    /Grid> <
                                                    /Paper>
                                                ))
                                            } <
                                            /Box>
                                        ) : ( <
                                            Paper sx = {
                                                {
                                                    p: 2,
                                                    mb: 3,
                                                    bgcolor: '#f5f5f5',
                                                    textAlign: 'center'
                                                }
                                            } >
                                            <
                                            Typography variant = "body2"
                                            color = "textSecondary" >
                                            No Safety & Quality issues reported
                                            for this road <
                                            /Typography> <
                                            /Paper>
                                        )
                                    }

                                    <
                                    Divider sx = {
                                        {
                                            my: 2
                                        }
                                    }
                                    />

                                    { /* All Versions Section — ab HAMESHA show hoga (single ho ya multiple) */ } <
                                    Typography variant = "h6"
                                    gutterBottom sx = {
                                        {
                                            fontWeight: 'bold',
                                            color: '#1e3a8a',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }
                                    } >
                                    All Versions <
                                    Chip label = {
                                        `${viewDialog.data._groupedRecords?.length || 1} versions`
                                    }
                                    size = "small"
                                    color = "primary" /
                                    >
                                    <
                                    /Typography>

                                    {
                                        viewDialog.data._groupedRecords ? .length > 0 ? ( <
                                            Box sx = {
                                                {
                                                    maxHeight: '500px',
                                                    overflow: 'auto',
                                                    mb: 2
                                                }
                                            } > {
                                                viewDialog.data._groupedRecords.map((record, index) => ( <
                                                    Paper key = {
                                                        record.id || index
                                                    }
                                                    elevation = {
                                                        2
                                                    }
                                                    sx = {
                                                        {
                                                            p: 2,
                                                            mb: 2,
                                                            borderLeft: `4px solid ${record.status === 'Approved' ? '#4caf50' : '#ff9800'}`,
                                                            bgcolor: record.status === 'Approved' ? '#f1f8e9' : '#fff8e1',
                                                            transition: 'all 0.3s',
                                                            '&:hover': {
                                                                boxShadow: 4,
                                                            }
                                                        }
                                                    } >
                                                    <
                                                    Grid container spacing = {
                                                        2
                                                    } >
                                                    <
                                                    Grid item xs = {
                                                        12
                                                    }
                                                    md = {
                                                        6
                                                    } >
                                                    <
                                                    Box sx = {
                                                        {
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            mb: 1
                                                        }
                                                    } >
                                                    <
                                                    Typography variant = "subtitle1"
                                                    fontWeight = "bold" >
                                                    Version {
                                                        index + 1
                                                    } <
                                                    /Typography> {
                                                        getStatusChip(record.status)
                                                    } <
                                                    /Box> <
                                                    Typography variant = "body2" >
                                                    <
                                                    strong > Level: < /strong> {record.updated_level || 'N/A
                                                    '} <
                                                    /Typography> <
                                                    Typography variant = "body2" >
                                                    <
                                                    strong > Date: < /strong> {record.date || '-'} <
                                                    /Typography> <
                                                    Typography variant = "body2" >
                                                    <
                                                    strong > Completed Qty: < /strong> {record.completed_qty || '0'} <
                                                    /Typography> <
                                                    Typography variant = "body2" >
                                                    <
                                                    strong > Road Length: < /strong> {record.road_length || '-'} m <
                                                    /Typography> <
                                                    Typography variant = "body2" >
                                                    <
                                                    strong > Inspector: < /strong> {record.inspector_name || '-'} <
                                                    /Typography> {
                                                        record.remarks && ( <
                                                            Typography variant = "body2" >
                                                            <
                                                            strong > Remarks: < /strong> {record.remarks} <
                                                            /Typography>
                                                        )
                                                    } {
                                                        record.submitted_at && ( <
                                                            Typography variant = "body2" >
                                                            <
                                                            strong > Submitted: < /strong> {new Date(record.submitted_at).toLocaleString()} <
                                                            /Typography>
                                                        )
                                                    } {
                                                        record.approve_date && ( <
                                                            Typography variant = "body2" >
                                                            <
                                                            strong > Approved: < /strong> {new Date(record.approve_date).toLocaleString()} <
                                                            /Typography>
                                                        )
                                                    }

                                                    { /* Version Approve Button - disabled if open issues exist */ } {
                                                        record.status === "Pending" && !record.approve_date && ( <
                                                            Tooltip title = {
                                                                viewDialog.issues ? .some(i => i.status === 'open') ?
                                                                `Cannot approve: ${viewDialog.issues?.filter(i => i.status === 'open').length || 0} open issue(s) exist. Close all issues first.` :
                                                                'Approve this version'
                                                            } >
                                                            <
                                                            span >
                                                            <
                                                            Button variant = "outlined"
                                                            color = "primary"
                                                            size = "small"
                                                            onClick = {
                                                                () => {
                                                                    handleApprove(record.id);
                                                                    handleCloseDialog();
                                                                }
                                                            }
                                                            disabled = {
                                                                approving || approvingAll || viewDialog.issues ? .some(i => i.status === 'open')
                                                            }
                                                            sx = {
                                                                {
                                                                    mt: 1
                                                                }
                                                            } >
                                                            Approve This Version <
                                                            /Button> <
                                                            /span> <
                                                            /Tooltip>
                                                        )
                                                    }

                                                    {
                                                        record.approve_date && ( <
                                                            Chip label = "Already Approved"
                                                            size = "small"
                                                            color = "success"
                                                            icon = { < CheckCircleIcon / >
                                                            }
                                                            sx = {
                                                                {
                                                                    mt: 1
                                                                }
                                                            }
                                                            />
                                                        )
                                                    } <
                                                    /Grid> <
                                                    Grid item xs = {
                                                        12
                                                    }
                                                    md = {
                                                        6
                                                    } > {
                                                        record.photo ? ( <
                                                            Box >
                                                            <
                                                            Typography variant = "subtitle2"
                                                            color = "textSecondary"
                                                            gutterBottom >
                                                            Photo <
                                                            /Typography> <
                                                            img src = {
                                                                record.photo
                                                            }
                                                            alt = {
                                                                `Version ${index + 1}`
                                                            }
                                                            style = {
                                                                {
                                                                    maxWidth: '100%',
                                                                    maxHeight: '200px',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid #ddd',
                                                                    cursor: 'pointer',
                                                                    objectFit: 'cover'
                                                                }
                                                            }
                                                            onClick = {
                                                                () => window.open(record.photo, '_blank')
                                                            }
                                                            onError = {
                                                                (e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.parentElement.innerHTML =
                                                                        '<Typography variant="body2" color="error">Failed to load image</Typography>';
                                                                }
                                                            }
                                                            /> <
                                                            /Box>
                                                        ) : ( <
                                                            Typography variant = "body2"
                                                            color = "text.secondary" >
                                                            No photo
                                                            for this version <
                                                            /Typography>
                                                        )
                                                    }

                                                    {
                                                        record.attachment && ( <
                                                            Box sx = {
                                                                {
                                                                    mt: 1
                                                                }
                                                            } >
                                                            <
                                                            Button variant = "outlined"
                                                            size = "small"
                                                            startIcon = { < AttachFileIcon / >
                                                            }
                                                            onClick = {
                                                                () => window.open(record.attachment, '_blank')
                                                            } >
                                                            View Attachment <
                                                            /Button> <
                                                            /Box>
                                                        )
                                                    }

                                                    {
                                                        (record.start_lat || record.start_lng || record.end_lat || record.end_lng) && ( <
                                                            Box sx = {
                                                                {
                                                                    mt: 1
                                                                }
                                                            } >
                                                            <
                                                            Typography variant = "caption"
                                                            color = "textSecondary" > Location < /Typography> <
                                                            Typography variant = "body2" >
                                                            Start: {
                                                                record.start_lat || 'N/A'
                                                            }, {
                                                                record.start_lng || 'N/A'
                                                            } <
                                                            /Typography> <
                                                            Typography variant = "body2" >
                                                            End: {
                                                                record.end_lat || 'N/A'
                                                            }, {
                                                                record.end_lng || 'N/A'
                                                            } <
                                                            /Typography> <
                                                            /Box>
                                                        )
                                                    } <
                                                    /Grid> <
                                                    /Grid> {
                                                        index < viewDialog.data._groupedRecords.length - 1 && ( <
                                                            Divider sx = {
                                                                {
                                                                    mt: 2
                                                                }
                                                            }
                                                            />
                                                        )
                                                    } <
                                                    /Paper>
                                                ))
                                            } <
                                            /Box>
                                        ) : ( <
                                            Paper sx = {
                                                {
                                                    p: 2,
                                                    bgcolor: '#f5f5f5',
                                                    textAlign: 'center'
                                                }
                                            } >
                                            <
                                            Typography variant = "body2"
                                            color = "textSecondary" >
                                            No versions available
                                            for this road <
                                            /Typography> <
                                            /Paper>
                                        )
                                    } <
                                    /Box>
                                )
                            } <
                            /DialogContent> <
                            DialogActions >
                            <
                            Button onClick = {
                                handleCloseDialog
                            }
                            variant = "contained"
                            color = "primary" >
                            Close <
                            /Button> <
                            /DialogActions> <
                            /Dialog> <
                            /Box>
                        );
                    }

                    export default RoadTab;