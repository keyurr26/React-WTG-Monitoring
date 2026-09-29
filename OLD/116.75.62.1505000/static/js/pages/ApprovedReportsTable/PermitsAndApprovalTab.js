import React, {
    useState,
    useEffect,
    useMemo
} from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Alert,
    TableContainer,
    TablePagination,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetDocumentUploadList
} from "../../Redux/MasterData/masterAction";

function PermitsAndApprovalTab({
    filters,
    setFilters
}) {
    const dispatch = useDispatch();
    const {
        documentList = []
    } = useSelector((state) => state.masterData);
    const activity = "PERMIT";
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const isFilterSelected = useMemo(() => {
        return !!(filters ? .project && filters ? .windfarm);
    }, [filters ? .project, filters ? .windfarm]);

    useEffect(() => {
        if (isFilterSelected) {
            dispatch(
                GetDocumentUploadList({
                    project: filters.project,
                    windfarm: filters.windfarm,
                    activity: activity,
                }),
            );
        }
    }, [dispatch, isFilterSelected, filters ? .project, filters ? .windfarm]);

    const filteredHistory = useMemo(() => {
        if (!isFilterSelected) return [];

        return documentList.filter((doc) => {
            const matchesProject = doc.project === Number(filters.project);
            const matchesWindfarm = doc.windfarm === Number(filters.windfarm);
            const matchesActivity =
                doc.activity === activity || doc.activity_name === activity;
            return matchesProject && matchesWindfarm && matchesActivity;
        });
    }, [documentList, filters ? .project, filters ? .windfarm, isFilterSelected]);

    const paginatedDocs = filteredHistory.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    return ( <
        Box p = {
            2
        } > {!isFilterSelected && ( <
                Alert severity = "info"
                sx = {
                    {
                        borderRadius: 2,
                        mb: 3
                    }
                } >
                Please select a Project and Windfarm to view document logs. <
                /Alert>
            )
        }

        <
        Paper elevation = {
            3
        }
        sx = {
            {
                p: 3,
                border: "1px solid #e0e0e0",
                borderRadius: 2
            }
        } >
        <
        TableContainer >
        <
        Box sx = {
            {
                p: 2,
                bgcolor: "#f8fafd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }
        } >
        <
        Typography variant = "subtitle1"
        fontWeight = "700"
        color = "primary.main" >
        Document Upload Logs <
        /Typography> <
        Typography variant = "caption"
        color = "textSecondary" >
        Found {
            filteredHistory.length
        }
        records <
        /Typography> <
        /Box> <
        Table size = "small" >
        <
        TableHead >
        <
        TableRow sx = {
            {
                bgcolor: "primary.main"
            }
        } >
        <
        TableCell sx = {
            {
                color: "#fff",
                fontWeight: "bold"
            }
        } > #
        <
        /TableCell> <
        TableCell sx = {
            {
                color: "#fff",
                fontWeight: "bold"
            }
        } >
        Project <
        /TableCell> <
        TableCell sx = {
            {
                color: "#fff",
                fontWeight: "bold"
            }
        } >
        Windfarm <
        /TableCell> <
        TableCell sx = {
            {
                color: "#fff",
                fontWeight: "bold"
            }
        } >
        Document Section <
        /TableCell> <
        TableCell sx = {
            {
                color: "#fff",
                fontWeight: "bold"
            }
        } >
        File Name <
        /TableCell> <
        TableCell sx = {
            {
                color: "#fff",
                fontWeight: "bold"
            }
        }
        align = "center" >
        Action <
        /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            paginatedDocs.length > 0 ? (
                paginatedDocs.map((doc, index) => ( <
                    TableRow key = {
                        doc.id
                    }
                    hover >
                    <
                    TableCell > {
                        page * rowsPerPage + index + 1
                    } < /TableCell> <
                    TableCell > {
                        doc.project_name
                    } < /TableCell> <
                    TableCell > {
                        doc.windfarm_name
                    } < /TableCell> <
                    TableCell > {
                        doc.file_type
                    } < /TableCell> <
                    TableCell > {
                        doc.name
                    } < /TableCell> <
                    TableCell align = "center" >
                    <
                    Button size = "small"
                    startIcon = { < VisibilityIcon / >
                    }
                    href = {
                        doc.file
                    }
                    target = "_blank"
                    sx = {
                        {
                            textTransform: "none",
                            fontWeight: "600"
                        }
                    } >
                    View <
                    /Button> <
                    /TableCell> <
                    /TableRow>
                ))
            ) : ( <
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
                } > {!isFilterSelected ?
                    "Select Project and Windfarm to fetch upload history." :
                        "No document logs found for this selection."
                } <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25]
        }
        component = "div"
        count = {
            filteredHistory.length
        }
        rowsPerPage = {
            rowsPerPage
        }
        page = {
            page
        }
        onPageChange = {
            (e, newPage) => setPage(newPage)
        }
        onRowsPerPageChange = {
            (e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
            }
        }
        /> <
        /Paper> <
        /Box>
    );
}

export default PermitsAndApprovalTab;