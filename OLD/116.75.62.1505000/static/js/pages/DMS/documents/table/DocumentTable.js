import React, {
    useState,
    useCallback
} from "react";
import {
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
    Chip,
    // Stack,
    IconButton,
    Tooltip,
    Box,
    Typography,
    Collapse,
    Dialog,

    DialogTitle,
    DialogContent,
    Button,
} from "@mui/material";

import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import CustomSnackbar from "../../../../components/comman/CustomSnackbar";
import {
    useDispatch
} from "react-redux";
import WorkflowActions from "../../workflow/WorkflowActions";

import DrilldownPanel from "./DrilldownPanel";
import StatusChip from "./StatusChip";
// import InwardDialog from "../../workflow/InwardDialog";
import SubmitReviewDialog from "../../workflow/SubmitReviewDialog";
import CommentTable from "../../workflow/ConsultantReviewDialog";
import RevisionUploadDialog from "../../workflow/UploadRevisionDialog";
import CircularProgress from "@mui/material/CircularProgress";

import {
    // InwardDocumentData,
    UploadRevisionData,
    GetVersionsData,
    GetApprovalFlowData,
    GetDocumentsData,
    SubmitReviewData,
    SubmitForActionData,
    ConsultantReviewData,
} from "../../../../Redux/DmsData/Document/DocumentAction";

const DocumentTable = ({
    data = [],
    fetchVersions,
    fetchApprovalFlow,
    fetchActivities,
    onView,
    onEdit,
    onDelete,
}) => {

    const {
        documentsLoading,
        reviewComments = []
    } = useSelector((state) => state.document, );


    // const user = useSelector((state) => state.auth.user);
    const [expandedId, setExpandedId] = useState(null);
    const [openSubmitReviewDialog, setOpenSubmitReviewDialog] = useState(false);
    const [openRevisionDialog, setOpenRevisionDialog] = useState(false);
    const [selectedWorkflowDoc, setSelectedWorkflowDoc] = useState(null);
    const [openView, setOpenView] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [deletedIds, setDeletedIds] = useState([]);
    const [openCommentTable, setOpenCommentTable] = useState(false);
    const dispatch = useDispatch();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const showSnackbar = useCallback((message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    }, []);

    const handleView = (doc) => {
        const url = doc.file || doc.current_file || doc.document_file || null;

        if (!url) {
            showSnackbar("No file available", "error");
            return;
        }
        const cleanUrl = url.split("?")[0];
        // extension
        const extension = cleanUrl.split(".").pop() ? .toLowerCase();
        // Files supported in dialog preview
        const previewableFiles = ["png", "jpg", "jpeg", "webp", "pdf"];
        // OPEN INSIDE DIALOG
        if (previewableFiles.includes(extension)) {
            setFileUrl(url);
            setOpenView(true);
            return;
        }
        // ALL OTHER FILES
        // word, excel, ppt, zip, csv, txt etc
        window.open(url, "_blank", "noopener,noreferrer");
    };

    // const handleDeleteClick = (doc) => {
    //   setSelectedDoc(doc);
    //   setOpenDelete(true);
    // };

    const handleDeleteConfirm = () => {
        if (!selectedDoc) return;
        setDeletedIds((prev) => [...prev, selectedDoc.id]);
        showSnackbar("Document marked as deleted", "success");
        setOpenDelete(false);
        setSelectedDoc(null);
    };


    // const handleOpenInwardDialog = (doc) => {
    //   setSelectedWorkflowDoc(doc);
    //   setOpenSubmitDialog(true);
    // };


    // const handleInwardSubmit = async (payload) => {
    //   try {
    //     const response = await dispatch(
    //       InwardDocumentData(selectedWorkflowDoc.id, payload),
    //     );
    //     if (!response) {
    //       throw new Error("No response received");
    //     }
    //     setOpenSubmitDialog(false);
    //     setSelectedWorkflowDoc(null);
    //     setExpandedId(null);
    //     showSnackbar("Document inwarded successfully", "success");

    //     await Promise.all([
    //       dispatch(GetDocumentsData()),
    //       dispatch(GetMyDocumentsData()),
    //     ]);
    //   } catch (error) {
    //     showSnackbar(
    //       error?.response?.data?.error || error?.message || "Inward failed",
    //       "error",
    //     );
    //   }
    // };


    const handleOpenSubmitReview = (doc) => {
        setSelectedWorkflowDoc(doc);
        setOpenSubmitReviewDialog(true);
    };

    const handleSubmitReview = async (payload) => {
        try {
            if (!selectedWorkflowDoc) return;
            const documentId = selectedWorkflowDoc.id;
            let response;

            // IMPORTANT
            // CONDITIONAL API SWITCH
            if (
                selectedWorkflowDoc ? .status === "action_required" ||
                selectedWorkflowDoc ? .status === "rejected"
            ) {
                response = await dispatch(SubmitForActionData(documentId, payload));
            } else {
                response = await dispatch(SubmitReviewData(documentId, payload));
            }
            if (!response) {
                throw new Error("Submit failed");
            }

            showSnackbar(
                selectedWorkflowDoc ? .status === "action_required" ?
                "Document submitted for Supplier Action" :
                "Document submitted for consultant review",
                "success",
            );

            setOpenSubmitReviewDialog(false);
            setSelectedWorkflowDoc(null);
            setExpandedId(null);
            await Promise.all([
                dispatch(GetDocumentsData()),
            ]);
        } catch (error) {
            showSnackbar(
                error ? .response ? .data ? .error || error ? .message || "Submit failed",
                "error",
            );
        }
    };

    const handleCommentDialog = (doc) => {
        setSelectedWorkflowDoc(doc);
        setOpenCommentTable(true);
    };

    const handleSubmitComment = async (payload) => {
        try {
            if (!selectedWorkflowDoc) return;

            const response = await dispatch(
                ConsultantReviewData(selectedWorkflowDoc.id, payload),
            );

            if (!response) {
                throw new Error("Consultant review failed");
            }
            showSnackbar("Consultant review submitted successfully", "success");
            setOpenCommentTable(false);
            setSelectedWorkflowDoc(null);
            setExpandedId(null);
            await Promise.all([
                dispatch(GetDocumentsData()),
            ]);
        } catch (error) {
            showSnackbar(
                error ? .response ? .data ? .error ||
                error ? .message ||
                "Consultant review failed",
                "error",
            );
        }
    };

    const handleOpenRevisionDialog = (doc) => {
        setSelectedWorkflowDoc(doc);
        setOpenRevisionDialog(true);
    };

    const handleRevisionUploadSubmit = async (documentId, formData) => {
        try {
            const response = await dispatch(UploadRevisionData(documentId, formData));
            if (!response) {
                throw new Error("Revision upload failed");
            }
            showSnackbar("Revision uploaded successfully", "success");
            setOpenRevisionDialog(false);
            setSelectedWorkflowDoc(null);
            await Promise.all([
                dispatch(GetDocumentsData()),
            ]);
        } catch (error) {
            console.error(error);
            showSnackbar(
                error ? .response ? .data ? .error ||
                error ? .message ||
                "Revision upload failed",
                "error",
            );
        }
    };

    const toggleRow = (doc) => {
        setExpandedId((prev) =>
            prev === doc.id ? null : doc.id
        );
    };


    const COL_WIDTHS = {
        expand: "40px",
        project: "160px",
        type: "120px",
        title: "180px",
        documentVersion: "70px",
        status: "140px",
        updatedBy: "180px",
        created: "130px",
        view: "60px",
        workflow: "180px",
        actions: "100px",
    };

    const headCells = [{
            id: "expand",
            label: "",
            width: COL_WIDTHS.expand,
            align: "center"
        },
        {
            id: "project",
            label: "Project",
            width: COL_WIDTHS.project
        },
        {
            id: "type",
            label: "Type",
            width: COL_WIDTHS.type
        },
        {
            id: "title",
            label: "Title",
            width: COL_WIDTHS.title
        },
        {
            id: "document_version_number",
            label: "Doc Ver",
            width: COL_WIDTHS.documentVersion,
            align: "center",
        },
        {
            id: "status",
            label: "Status",
            width: COL_WIDTHS.status
        },
        {
            id: "updatedBy",
            label: "Updated By",
            width: COL_WIDTHS.updatedBy
        },
        // { id: "created", label: "Created", width: COL_WIDTHS.created },
        {
            id: "view",
            label: "View",
            width: COL_WIDTHS.view,
            align: "center"
        },
        {
            id: "workflow",
            label: "Actions",
            width: COL_WIDTHS.workflow,
            align: "center",
        },
    ];

    return ( <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                border: "0.5px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                maxHeight: "700px", // vertical scroll
                overflow: "auto", // vertical + horizontal scroll
                "&::-webkit-scrollbar": {
                    height: 8,
                    width: 8,
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "#cbd5e1",
                    borderRadius: 10,
                },
            }
        } >
        <
        Table stickyHeader sx = {
            {
                width: "1181px",
                minWidth: "1181px",
                maxWidth: "1181px",
                tableLayout: "fixed",
            }
        } >
        <
        colgroup > {
            headCells.map((column) => ( <
                col key = {
                    column.id
                }
                style = {
                    {
                        width: column.width,
                        minWidth: column.width,
                        maxWidth: column.width,
                    }
                }
                />
            ))
        } <
        /colgroup>

        <
        TableHead >
        <
        TableRow > {
            headCells.map((column) => ( <
                TableCell key = {
                    column.id
                }
                align = {
                    column.align || "left"
                }
                sx = {
                    {
                        backgroundColor: "#667eea",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.68rem",
                        py: 1,
                        px: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        whiteSpace: "nowrap",
                        zIndex: 2,
                        width: column.width,
                        minWidth: column.width,
                        maxWidth: column.width,
                        boxSizing: "border-box",
                    }
                } >
                {
                    column.label
                } <
                /TableCell>
            ))
        } <
        /TableRow> <
        /TableHead>

        <
        TableBody > {
            data.map((doc) => {
                const isExpanded = expandedId === doc.id;
                const isDeleted = deletedIds.includes(doc.id);

                return ( <
                    React.Fragment key = {
                        doc.id
                    } > { /* MAIN ROW */ } <
                    TableRow onClick = {
                        () => {
                            if (isDeleted) return;
                            toggleRow(doc);
                        }
                    }
                    sx = {
                        {
                            cursor: "pointer",

                            bgcolor: isDeleted ?
                                "#f9fafb" :
                                isExpanded ?
                                "#faf9ff" :
                                "background.paper",

                            opacity: isDeleted ? 0.6 : 1,

                            borderLeft: isDeleted ?
                                "2px solid #ef4444" :
                                isExpanded ?
                                "2px solid" :
                                "2px solid transparent",

                            borderLeftColor: isDeleted ?
                                "#ef4444" :
                                isExpanded ?
                                "primary.main" :
                                "transparent",

                            textDecoration: isDeleted ?
                                "line-through" :
                                "none",

                            pointerEvents: isDeleted ?
                                "none" :
                                "auto",

                            "&:hover": {
                                bgcolor: isDeleted ?
                                    "#f9fafb" :
                                    "#faf9ff",
                            },
                        }
                    } >
                    { /* Expand */ } <
                    TableCell align = "center"
                    sx = {
                        {
                            py: 0.8,
                            px: "10px"
                        }
                    } > {
                        isExpanded ? ( <
                            KeyboardArrowDownIcon sx = {
                                {
                                    fontSize: 17,
                                    color: "primary.main",
                                }
                            }
                            />
                        ) : ( <
                            KeyboardArrowRightIcon sx = {
                                {
                                    fontSize: 17,
                                    color: "text.disabled",
                                }
                            }
                            />
                        )
                    } <
                    /TableCell>

                    { /* Project */ } <
                    TableCell sx = {
                        {
                            py: 0.8,
                            px: "10px"
                        }
                    } >
                    <
                    Typography sx = {
                        {
                            fontSize: "0.8rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }
                    }
                    title = {
                        doc.project_name
                    } >
                    {
                        doc.project ? .project_name || doc.project_name || "—"
                    } <
                    /Typography> <
                    /TableCell>

                    { /* Type */ } <
                    TableCell sx = {
                        {
                            py: 0.8,
                            px: "10px"
                        }
                    } >
                    <
                    Chip label = {
                        doc.document_type || "—"
                    }
                    size = "small"
                    sx = {
                        {
                            bgcolor: "#eff6ff",
                            color: "#1d4ed8",
                            fontSize: "0.68rem",
                            height: 20,
                            fontWeight: 500,
                        }
                    }
                    /> <
                    /TableCell>

                    { /* Title */ } <
                    TableCell sx = {
                        {
                            py: 0.8,
                            px: "10px"
                        }
                    } >
                    <
                    Typography title = {
                        doc.title
                    }
                    sx = {
                        {
                            fontSize: "0.8rem",
                            fontWeight: isExpanded ? 500 : 400,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }
                    } >
                    {
                        doc.title
                    } <
                    /Typography> <
                    /TableCell>

                    { /* Document Version */ } <
                    TableCell sx = {
                        {
                            py: 0.8,
                            px: "10px"
                        }
                    } >
                    <
                    Chip label = {
                        doc.document_version_number || "—"
                    }
                    size = "small"
                    sx = {
                        {
                            bgcolor: "#dcfce7",
                            color: "#166534",
                            fontSize: "0.68rem",
                            height: 20,
                        }
                    }
                    /> <
                    /TableCell>

                    { /* Status */ } <
                    TableCell sx = {
                        {
                            py: 0.8,
                            px: "10px"
                        }
                    } >
                    <
                    StatusChip status = {
                        doc.status
                    }
                    /> <
                    /TableCell>

                    { /* Updated By */ } <
                    TableCell sx = {
                        {
                            py: 0.8,
                            px: "10px"
                        }
                    } >
                    <
                    Typography sx = {
                        {
                            fontSize: "0.78rem",
                            color: "text.secondary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }
                    } >
                    {
                        doc.updated_by ? .full_name ||
                        doc.updated_by ? .username ||
                        doc.updated_by_name ||
                        "—"
                    } <
                    /Typography> <
                    /TableCell>

                    { /* Created */ } {
                        /* <TableCell sx={{ py: 0.8, px: "10px" }}>
                                              <Typography
                                                sx={{
                                                  fontSize: "0.78rem",
                                                  color: "text.secondary",
                                                  overflow: "hidden",
                                                  textOverflow: "ellipsis",
                                                }}
                                              >
                                                {doc.created_at
                                                  ? new Date(doc.created_at).toISOString().split("T")[0]
                                                  : "—"}
                                              </Typography>
                                            </TableCell> */
                    }

                    { /* VIEW COLUMN */ } <
                    TableCell align = "center"
                    sx = {
                        {
                            py: 0.8,
                            px: "10px"
                        }
                    } >
                    <
                    Tooltip title = "View Document" >
                    <
                    IconButton size = "small"
                    onClick = {
                        (e) => {
                            e.stopPropagation();
                            if (isDeleted) return;
                            handleView(doc);
                        }
                    }
                    sx = {
                        {
                            p: "4px",
                            borderRadius: 1,
                            border: "0.5px solid",
                            borderColor: "divider",
                        }
                    } >
                    <
                    VisibilityIcon sx = {
                        {
                            fontSize: 15
                        }
                    }
                    /> <
                    /IconButton> <
                    /Tooltip> <
                    /TableCell>

                    <
                    TableCell align = "center"
                    onClick = {
                        (e) => e.stopPropagation()
                    } >
                    <
                    WorkflowActions doc = {
                        doc
                    }
                    // onSubmit={handleOpenInwardDialog}
                    onSubmitReview = {
                        handleOpenSubmitReview
                    }
                    onApprove = {
                        handleCommentDialog
                    }
                    onUpload = {
                        handleOpenRevisionDialog
                    }
                    /> <
                    /TableCell>

                    { /* Actions */ } {
                        /* <TableCell
                                              align="center"
                                              sx={{ py: 0.8, px: "6px" }}
                                              onClick={(e) => e.stopPropagation()}
                                            >
                                              <Stack
                                                direction="row"
                                                spacing={0.5}
                                                justifyContent="center"
                                              >
                                                <Tooltip title="Edit">
                                                  <IconButton
                                                    size="small"
                                                    disabled={!isInspectorPending}
                                                    onClick={() => onEdit?.(doc)}
                                                    sx={{
                                                      p: "4px",
                                                      borderRadius: 1,
                                                      border: "0.5px solid",
                                                      borderColor: "#bfdbfe",
                                                      color: "#2563eb",
                         
                                                      "&.Mui-disabled": {
                                                        opacity: 0.4,
                                                        cursor: "not-allowed",
                                                      },
                                                    }}
                                                  >
                                                    <EditIcon sx={{ fontSize: 14 }} />
                                                  </IconButton>
                                                </Tooltip>
                         
                                                <Tooltip title="Delete">
                                                  <IconButton
                                                    size="small"
                                                    disabled={!isInspectorPending}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleDeleteClick(doc);
                                                    }}
                                                    sx={{
                                                      p: "4px",
                                                      borderRadius: 1,
                                                      border: "0.5px solid",
                                                      borderColor: "#fecaca",
                                                      color: "#dc2626",
                         
                                                      "&.Mui-disabled": {
                                                        opacity: 0.4,
                                                        cursor: "not-allowed",
                                                      },
                                                    }}
                                                  >
                                                    <DeleteIcon sx={{ fontSize: 14 }} />
                                                  </IconButton>
                                                </Tooltip>
                                              </Stack>
                                            </TableCell> */
                    } <
                    /TableRow>

                    { /* EXPANDED DRILLDOWN ROW */ } <
                    TableRow >
                    <
                    TableCell colSpan = {
                        headCells.length
                    }
                    sx = {
                        {
                            p: 0,
                            maxWidth: 0,
                            overflow: "hidden",
                            borderBottom: isExpanded ? "0.5px solid" : "none",
                            borderColor: "divider",
                            borderLeft: isExpanded ?
                                "2px solid" :
                                "2px solid transparent",
                            borderLeftColor: isExpanded ?
                                "primary.main" :
                                "transparent",
                        }
                    } >
                    <
                    Collapse in = {
                        isExpanded
                    }
                    unmountOnExit >
                    <
                    DrilldownPanel doc = {
                        doc
                    }
                    fetchVersions = {
                        GetVersionsData
                    }
                    fetchApprovalFlow = {
                        GetApprovalFlowData
                    }
                    /> <
                    /Collapse> <
                    /TableCell> <
                    /TableRow> <
                    /React.Fragment>
                );
            })
        }

        {
            documentsLoading && ( <
                TableRow >
                <
                TableCell colSpan = {
                    headCells.length
                }
                align = "center" >
                <
                Box display = "flex"
                justifyContent = "center"
                alignItems = "center"
                py = {
                    3
                } >
                <
                CircularProgress size = {
                    28
                }
                /> <
                /Box> <
                /TableCell> <
                /TableRow>
            )
        }

        {
            !documentsLoading && data.length === 0 && ( <
                TableRow >
                <
                TableCell colSpan = {
                    headCells.length
                }
                align = "center" >
                No Documents Found <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table>

        <
        Dialog open = {
            openView
        }
        onClose = {
            () => {
                setOpenView(false);
                setFileUrl(null);
            }
        }
        maxWidth = "lg"
        fullWidth >
        <
        DialogTitle sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
            }
        } >
        Document Preview <
        IconButton onClick = {
            () => {
                setOpenView(false);
                setFileUrl(null);
            }
        } >
        <
        CloseIcon / >
        <
        /IconButton> <
        /DialogTitle>

        <
        DialogContent sx = {
            {
                height: "75vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
            }
        } >
        {
            fileUrl ? (
                fileUrl.match(/\.(png|jpg|jpeg|webp)$/i) ? ( <
                    img src = {
                        fileUrl
                    }
                    alt = "preview"
                    style = {
                        {
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                        }
                    }
                    />
                ) : fileUrl.endsWith(".pdf") ? ( <
                    iframe src = {
                        fileUrl
                    }
                    title = "pdf"
                    width = "100%"
                    height = "100%"
                    style = {
                        {
                            border: "none"
                        }
                    }
                    />
                ) : ( <
                    Typography > Preview not supported < /Typography>
                )
            ) : ( <
                Typography > No File Available < /Typography>
            )
        } <
        /DialogContent> <
        /Dialog>

        <
        Dialog open = {
            openDelete
        }
        onClose = {
            () => setOpenDelete(false)
        } >
        <
        DialogTitle sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }
        } >
        Delete Document <
        IconButton onClick = {
            () => setOpenDelete(false)
        } >
        <
        CloseIcon / >
        <
        /IconButton> <
        /DialogTitle>

        <
        DialogContent >
        <
        Typography >
        Are you sure you want to delete < b > {
            selectedDoc ? .title
        } < /b>? <
        /Typography> <
        /DialogContent>

        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                p: 2,
            }
        } >
        <
        Button onClick = {
            () => setOpenDelete(false)
        } > Cancel < /Button>

        <
        Button color = "error"
        variant = "contained"
        onClick = {
            handleDeleteConfirm
        } >
        Delete <
        /Button> <
        /Box> <
        /Dialog>

        {
            /* <InwardDialog
                    open={openSubmitDialog}
                    onClose={() => {
                      setOpenSubmitDialog(false);
                      setSelectedWorkflowDoc(null);
                    }}
                    doc={selectedWorkflowDoc}
                    onSubmit={handleInwardSubmit}
                  /> */
        }

        <
        SubmitReviewDialog open = {
            openSubmitReviewDialog
        }
        doc = {
            selectedWorkflowDoc
        }
        onClose = {
            () => {
                setOpenSubmitReviewDialog(false);
                setSelectedWorkflowDoc(null);
            }
        }
        type = "submit_review"
        onSubmit = {
            handleSubmitReview
        }
        />

        <
        CommentTable open = {
            openCommentTable
        }
        doc = {
            selectedWorkflowDoc
        }
        onClose = {
            () => {
                setOpenCommentTable(false);
                setSelectedWorkflowDoc(null);
            }
        }
        onSubmit = {
            handleSubmitComment
        }
        />

        <
        RevisionUploadDialog open = {
            openRevisionDialog
        }
        onClose = {
            () => {
                setOpenRevisionDialog(false);
                setSelectedWorkflowDoc(null);
            }
        }
        doc = {
            selectedWorkflowDoc
        }
        comments = {
            reviewComments
        }
        onSubmit = {
            handleRevisionUploadSubmit
        }
        /> <
        CustomSnackbar open = {
            snackbar.open
        }
        message = {
            snackbar.message
        }
        severity = {
            snackbar.severity
        }
        onClose = {
            () => setSnackbar((prev) => ({ ...prev,
                open: false
            }))
        }
        /> <
        /TableContainer>

    );
};

export default DocumentTable;