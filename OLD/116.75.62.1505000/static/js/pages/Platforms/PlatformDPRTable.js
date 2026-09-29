import React, {
    useState,
    useMemo
} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Stack,
    MenuItem,
    Typography,
    Box,
    Divider,
    IconButton,
    TablePagination,
} from "@mui/material";
import {
    AddCircle,
    History,
    CloudUpload,
    Image as ImageIcon,
} from "@mui/icons-material";
import {
    STATUS_OPTIONS
} from "../../constants/choices";
const PlatformDPRTable = ({
    MasterData = [],
    platformDPRData = [],
    filters,
    plateformDPRData,
    onPlateformDPRChange,
    onSubmitPlateformDPR,
    editingRow,
    setEditId,
    handleEditplateformDPRClick,
}) => {
    // 1. Table Internal Filtering Engine State
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    // ⚡ NEW: Pagination State Controllers for the History Table
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const filteredLogs = useMemo(() => {
        return platformDPRData.filter(
            (log) =>
            !filters.cluster || Number(log.cluster) === Number(filters.cluster),
        );
    }, [platformDPRData, filters.cluster]);
    // ⚡ NEW: Pagination Page Switch Handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset page layout to index zero upon resizing boundaries
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onPlateformDPRChange("evidence_photo", file);
        }
    };
    const availableMasterData = useMemo(() => {
        return MasterData.filter((master) => {
            const isCompletedLF = platformDPRData.some(
                (log) =>
                Number(log.platform) === Number(master.id) &&
                log.level === "LF" &&
                log.activity_status ? .toLowerCase() === "completed",
            );
            return !isCompletedLF;
        });
    }, [MasterData, platformDPRData]);
    return ( <
        Box sx = {
            {
                display: "flex",
                flexDirection: "column",
                gap: 4
            }
        } > { /* ================= SECTION 1: ADD NEW ENTRY ================= */ } <
        Box >
        <
        Typography variant = "h6"
        fontWeight = {
            600
        }
        color = "primary.main" >
        Update Daily Progress <
        /Typography> <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                borderRadius: 2,
                mt: 1
            }
        } >
        <
        Table size = "small" >
        <
        TableHead >
        <
        TableRow sx = {
            {
                bgcolor: "#f5f5f5"
            }
        } >
        <
        TableCell >
        <
        b > Turbine / Platform < /b> <
        /TableCell> <
        TableCell >
        <
        b > Work Date < /b> <
        /TableCell> <
        TableCell >
        <
        b > Level < /b> <
        /TableCell> <
        TableCell >
        <
        b > Compaction < /b> <
        /TableCell> <
        TableCell >
        <
        b > Status < /b> <
        /TableCell> <
        TableCell >
        <
        b > Evidence Photo < /b> <
        /TableCell> <
        TableCell align = "center" >
        <
        b > Action < /b> <
        /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            availableMasterData.map((row) => {
                const isAdding = editingRow === row.id;
                return ( <
                    TableRow key = {
                        row.id
                    } >
                    <
                    TableCell >
                    <
                    Typography variant = "body2"
                    fontWeight = "bold" > {
                        row.turbine_name
                    } <
                    /Typography> <
                    Typography variant = "caption" > {
                        row.platform_name
                    } <
                    /Typography> <
                    /TableCell> {
                        isAdding ? ( <
                            >
                            <
                            TableCell >
                            <
                            TextField type = "date"
                            size = "small"
                            variant = "standard"
                            InputLabelProps = {
                                {
                                    shrink: true
                                }
                            }
                            value = {
                                plateformDPRData.work_date
                            }
                            inputProps = {
                                {
                                    max: new Date().toISOString().split("T")[0],
                                }
                            }
                            onChange = {
                                (e) =>
                                onPlateformDPRChange("work_date", e.target.value)
                            }
                            /> <
                            /TableCell> <
                            TableCell >
                            <
                            TextField select size = "small"
                            variant = "standard"
                            sx = {
                                {
                                    minWidth: 60
                                }
                            }
                            value = {
                                plateformDPRData.level
                            }
                            error = {!plateformDPRData.level
                            }
                            onChange = {
                                (e) =>
                                onPlateformDPRChange("level", e.target.value)
                            } >
                            {
                                ["L1", "L2", "L3", "LF"].map((l) => ( <
                                    MenuItem key = {
                                        l
                                    }
                                    value = {
                                        l
                                    } > {
                                        l
                                    } <
                                    /MenuItem>
                                ))
                            } <
                            /TextField> <
                            /TableCell> <
                            TableCell >
                            <
                            TextField type = "text"
                            size = "small"
                            variant = "standard"
                            value = {
                                plateformDPRData.compaction_achieved
                            }
                            onChange = {
                                (e) =>
                                onPlateformDPRChange(
                                    "compaction_achieved",
                                    e.target.value,
                                )
                            }
                            /> <
                            /TableCell> <
                            TableCell >
                            <
                            TextField select size = "small"
                            variant = "standard"
                            sx = {
                                {
                                    minWidth: 100
                                }
                            }
                            value = {
                                plateformDPRData.activity_status
                            }
                            onChange = {
                                (e) =>
                                onPlateformDPRChange(
                                    "activity_status",
                                    e.target.value,
                                )
                            } >
                            {
                                STATUS_OPTIONS.map((option) => ( <
                                    MenuItem key = {
                                        option.value
                                    }
                                    value = {
                                        option.value
                                    } > {
                                        option.label
                                    } <
                                    /MenuItem>
                                ))
                            } <
                            /TextField> <
                            /TableCell> <
                            TableCell >
                            <
                            Button variant = "outlined"
                            component = "label"
                            size = "small"
                            startIcon = { < CloudUpload / >
                            }
                            color = {
                                plateformDPRData.evidence_photo ?
                                "success" :
                                    "error"
                            } >
                            {
                                plateformDPRData.evidence_photo ?
                                "Selected" :
                                    "Upload"
                            } <
                            input type = "file"
                            hidden accept = "image/*"
                            onChange = {
                                handleFileChange
                            }
                            /> <
                            /Button> {
                                plateformDPRData.evidence_photo && ( <
                                    Typography variant = "caption"
                                    display = "block"
                                    sx = {
                                        {
                                            mt: 0.5,
                                            maxWidth: 100,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }
                                    } >
                                    {
                                        plateformDPRData.evidence_photo.name
                                    } <
                                    /Typography>
                                )
                            } <
                            /TableCell> <
                            TableCell align = "center" >
                            <
                            Stack direction = "row"
                            spacing = {
                                1
                            }
                            justifyContent = "center" >
                            <
                            Button variant = "contained"
                            color = "success"
                            size = "small"
                            onClick = {
                                onSubmitPlateformDPR
                            } >
                            Save <
                            /Button> <
                            Button variant = "text"
                            color = "error"
                            size = "small"
                            onClick = {
                                () => setEditId(null)
                            } >
                            Cancel <
                            /Button> <
                            /Stack> <
                            /TableCell> <
                            />
                        ) : ( <
                            >
                            <
                            TableCell colSpan = {
                                5
                            }
                            color = "textSecondary" >
                            <
                            i > Click Add to enter details < /i> <
                            /TableCell> <
                            TableCell align = "center" >
                            <
                            Button variant = "outlined"
                            size = "small"
                            startIcon = { < AddCircle / >
                            }
                            onClick = {
                                () => handleEditplateformDPRClick(row)
                            } >
                            Add DPR <
                            /Button> <
                            /TableCell> <
                            />
                        )
                    } <
                    /TableRow>
                );
            })
        } <
        /TableBody> <
        /Table> <
        /TableContainer> <
        /Box> <
        Divider / > { /* ================= SECTION 2: DPR LOGS (HISTORY) ================= */ } <
        Box >
        <
        Typography variant = "h6"
        sx = {
            {
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#555",
            }
        } >
        <
        History / > Progress Logs <
        /Typography> <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                borderRadius: 2,
                maxHeight: 400
            }
        } >
        <
        Table size = "small"
        stickyHeader >
        <
        TableHead >
        <
        TableRow sx = {
            {
                "& th": {
                    bgcolor: "primary.main",
                    color: "white"
                }
            }
        } >
        <
        TableCell > Work Date < /TableCell> <
        TableCell > Turbine / Platform < /TableCell> <
        TableCell > Level < /TableCell> <
        TableCell > Compaction < /TableCell> <
        TableCell > Status < /TableCell> <
        TableCell align = "center" > Evidence < /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            filteredLogs.length === 0 ? ( <
                TableRow >
                <
                TableCell colSpan = {
                    6
                }
                align = "center"
                sx = {
                    {
                        py: 3
                    }
                } >
                No logs found
                for this cluster. <
                /TableCell> <
                /TableRow>
            ) : (
                // ⚡ SLICED MATRIX: Only display rows bounded inside our page limitations index
                filteredLogs
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((log, index) => ( <
                    TableRow key = {
                        index
                    }
                    hover >
                    <
                    TableCell > {
                        log.work_date
                    } < /TableCell> <
                    TableCell >
                    <
                    b > {
                        log.turbine_name
                    } < /b> <br / >
                    <
                    Typography variant = "caption" > {
                        log.platform_name
                    } <
                    /Typography> <
                    /TableCell> <
                    TableCell > {
                        log.level
                    } < /TableCell> <
                    TableCell > {
                        log.compaction_achieved
                    } < /TableCell> <
                    TableCell > {
                        log.activity_status
                    } < /TableCell> <
                    TableCell align = "center" > {
                        log.evidence_photo ? ( <
                            IconButton href = {
                                log.evidence_photo
                            }
                            target = "_blank"
                            color = "primary"
                            size = "small" >
                            <
                            ImageIcon / >
                            <
                            /IconButton>
                        ) : (
                            "-"
                        )
                    } <
                    /TableCell> <
                    /TableRow>
                ))
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer> { /* ================= ⚡ NEW PAGINATION FOOTER BLOCK ================= */ } <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25, 50]
        }
        component = "div"
        count = {
            filteredLogs.length
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
        /Box> <
        /Box>
    );
};
export default PlatformDPRTable;