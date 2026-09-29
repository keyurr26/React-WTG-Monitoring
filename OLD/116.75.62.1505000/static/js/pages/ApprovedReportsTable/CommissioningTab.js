import React, {
    useState,
    useEffect,
    useRef
} from "react";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {

    Box,

    Container,

    Table,

    TableBody,

    TableCell,

    TableContainer,

    TableHead,

    TableRow,

    Paper,

    Typography,

    Button,

    IconButton,

    Chip,

    Tooltip,

    CircularProgress,

} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import CancelIcon from "@mui/icons-material/Cancel";

import {

    GetCommissioningDetails,

    patchCommissioningDetails,

} from "../../Redux/InstallationData/WtgInstallationData/wtgInstallationAction";

// Helper function to calculate duration days exactly like your other tables

const calculateDays = (startDate, endDate) => {

    if (!startDate) return "-";

    const start = new Date(startDate);

    const end = endDate ? new Date(endDate) : new Date();

    const diffTime = Math.abs(end - start);

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;

};

const CommissioningTab = ({
        filters
    }) => {

        const dispatch = useDispatch();

        const fetchedRef = useRef({});

        // 🔹 Redux State

        const {

            loading,

            commissioning = [],

            error,

        } = useSelector((state) => state.wtgInstallationData);

        // 🔹 Local UI Rows State

        const [rows, setRows] = useState([]);

        // 🔹 Map incoming API records into local layout state fields

        useEffect(() => {

            if (!commissioning) return;

            const formattedRows = commissioning.map((item) => ({

                id: item.id,

                turbine_sr_no: item.turbine_name || "N/A",

                mechanical_inspection_date: item.mechanical_inspection_date

                    ?
                    new Date(item.mechanical_inspection_date).toLocaleDateString()

                    :
                    "-",

                electrical_inspection_date: item.electrical_inspection_date

                    ?
                    new Date(item.electrical_inspection_date).toLocaleDateString()

                    :
                    "-",

                test_run_date: item.test_run_date

                    ?
                    new Date(item.test_run_date).toLocaleDateString()

                    :
                    "-",

                commissioning_date: item.commissioning_date

                    ?
                    new Date(item.commissioning_date).toLocaleDateString()

                    :
                    "-",

                final_signoff_date: item.sign_off_date

                    ?
                    new Date(item.sign_off_date).toLocaleDateString()

                    :
                    "-",

                grid_synchronization_date: item.grid_synchronization_date

                    ?
                    new Date(item.grid_synchronization_date).toLocaleDateString()

                    :
                    "-",

                scada_verified: item.scada_connectivity_verified || "N/A",

                commissioning_engineer: item.commissioning_engineer || "N/A",

                witnessed_by: item.witnessed_by || "N/A",

                open_points: item.open_points_punch_list || "None",

                // Mandatory operational state trackers

                status: item.approve_date ? "Approved" : "Pending",

                submitted_at: item.submitted_at || new Date().toISOString(),

                approve_date: item.approve_date,

                document: item.document,

                performance_reports: item.performance_reports,

            }));

            setRows(formattedRows);

        }, [commissioning]);

        // 🔹 API Query Triggers protected by local cache matching key definitions

        useEffect(() => {

            if (!filters ? .project) return;

            const cacheKey = `${filters.project}-${filters.windfarm}-${filters.cluster}`;

            if (fetchedRef.current[cacheKey]) return;

            dispatch(GetCommissioningDetails(filters));

            fetchedRef.current[cacheKey] = true;

        }, [dispatch, filters]);

        // 🔹 Self-contained Approval Action handler (Optimistic Frontend Update)

        const handleApproveRow = async (rowId) => {

            const currentTimestamp = new Date().toISOString();

            const payload = {

                approve_date: currentTimestamp,

            };

            try {

                // 1. Optimistic Update: Switch status column state to "Approved" instantly in UI

                setRows((prevRows) =>

                    prevRows.map((row) =>

                        row.id === rowId

                        ?
                        { ...row,
                            status: "Approved",
                            approve_date: currentTimestamp
                        }

                        :
                        row,

                    ),

                );

                // 2. Dispatch payload parameters back to the existing server architecture

                await dispatch(patchCommissioningDetails(rowId, payload));

                // 3. Clear fetch parameter registers to pull fresh updates

                dispatch(GetCommissioningDetails(filters));

            } catch (err) {

                console.error("Workflow update rejected:", err);

                dispatch(GetCommissioningDetails(filters));

            }

        };

        const handleOpenAttachment = (url) => {

            if (url) window.open(url, "_blank");

        };

        /* ---------------- CONDITIONAL UI RENDER CHECKS ---------------- */

        if (loading && rows.length === 0) {

            return ( <
                Box

                display = "flex"

                justifyContent = "center"

                alignItems = "center"

                minHeight = "200px" >
                <
                CircularProgress size = {
                    40
                }
                /> <
                /Box>

            );

        }

        if (error) {

            return ( <
                Box p = {
                    3
                }
                bgcolor = "#ffebee"
                borderRadius = {
                    2
                }
                border = "1px solid #f44336" >
                <
                Typography color = "error"
                fontWeight = {
                    700
                } >

                Error Loading Commissioning Logs <
                /Typography> <
                Typography color = "text.secondary"
                variant = "body2" >

                {
                    error
                } <
                /Typography> <
                /Box>

            );

        }

        return ( <
                Container maxWidth = {
                    false
                }
                sx = {
                    {
                        px: 3
                    }
                } >
                <
                Paper

                sx = {
                    {

                        mb: 2,

                        p: 0,

                        borderRadius: 3,

                        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",

                        border: "1px solid #e5e7eb",

                        backgroundColor: "white",

                        overflow: "hidden",

                    }
                } >

                { /* Sleek Custom Top Banner Header */ } <
                Box

                sx = {
                    {

                        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",

                        px: 3,

                        py: 2.5,

                        display: "flex",

                        justifyContent: "space-between",

                        alignItems: "center",

                    }
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        alignItems: "center",
                        gap: 2
                    }
                } >
                <
                Box

                sx = {
                    {
                        width: 4,
                        height: 32,
                        bgcolor: "#39f300",
                        borderRadius: 2
                    }
                }

                /> <
                Box >
                <
                Typography variant = "h6"
                sx = {
                    {
                        fontWeight: 700,
                        color: "white"
                    }
                } >

                Commissioning Details Logs <
                /Typography> <
                Typography

                variant = "caption"

                sx = {
                    {
                        color: "rgba(255,255,255,0.8)"
                    }
                } >

                {
                    rows.length
                }
                records active <
                /Typography> <
                /Box> <
                /Box> <
                /Box>

                { /* Isolated Table Section */ } <
                Box sx = {
                    {
                        overflowX: "auto"
                    }
                } >
                <
                Table sx = {
                    {
                        minWidth: 1200
                    }
                } >
                <
                TableHead sx = {
                    {
                        backgroundColor: "#f8fafc"
                    }
                } >
                <
                TableRow >
                <
                TableCell sx = {
                    {
                        fontWeight: 700,
                        py: 2.5
                    }
                } >

                Turbine Sr No <
                /TableCell> <
                TableCell sx = {
                    {
                        fontWeight: 700
                    }
                } > Mechanical Insp. < /TableCell> <
                TableCell sx = {
                    {
                        fontWeight: 700
                    }
                } > Electrical Insp. < /TableCell> <
                TableCell sx = {
                    {
                        fontWeight: 700
                    }
                } > Test Run Date < /TableCell> <
                TableCell sx = {
                    {
                        fontWeight: 700
                    }
                } >

                Commissioning Date <
                /TableCell> <
                TableCell sx = {
                    {
                        fontWeight: 700
                    }
                } > Grid Sync Date < /TableCell> <
                TableCell sx = {
                    {
                        fontWeight: 700
                    }
                } > SCADA Verified < /TableCell> <
                TableCell sx = {
                    {
                        fontWeight: 700
                    }
                } > Engineer < /TableCell> <
                TableCell sx = {
                    {
                        fontWeight: 700
                    }
                } > View Files < /TableCell> <
                TableCell sx = {
                    {
                        fontWeight: 700
                    }
                }
                align = "center" >

                Approval Status <
                /TableCell> <
                TableCell sx = {
                    {
                        fontWeight: 700
                    }
                }
                align = "center" >

                Actions <
                /TableCell> <
                /TableRow> <
                /TableHead> <
                TableBody >

                {
                    rows.length === 0 ? ( <
                        TableRow >
                        <
                        TableCell

                        colSpan = {
                            11
                        }

                        align = "center"

                        sx = {
                            {
                                py: 5,
                                color: "text.secondary"
                            }
                        } >

                        No commissioning records matched the active tracking

                        parameters. <
                        /TableCell> <
                        /TableRow>

                    ) : (

                        rows.map((row, index) => {

                                const isApproved = row.status === "Approved";

                                const days = calculateDays(

                                    row.submitted_at,

                                    row.approve_date,

                                );

                                return ( <
                                    TableRow

                                    key = {
                                        row.id
                                    }

                                    sx = {
                                        {

                                            backgroundColor: index % 2 === 0 ? "white" : "#fafbfc",

                                            "&:hover": {
                                                backgroundColor: "#f0f9ff"
                                            },

                                        }
                                    } >
                                    <
                                    TableCell sx = {
                                        {
                                            fontWeight: 600
                                        }
                                    } >

                                    {
                                        row.turbine_sr_no
                                    } <
                                    /TableCell> <
                                    TableCell > {
                                        row.mechanical_inspection_date
                                    } < /TableCell> <
                                    TableCell > {
                                        row.electrical_inspection_date
                                    } < /TableCell> <
                                    TableCell > {
                                        row.test_run_date
                                    } < /TableCell> <
                                    TableCell > {
                                        row.commissioning_date
                                    } < /TableCell> <
                                    TableCell > {
                                        row.grid_synchronization_date
                                    } < /TableCell> <
                                    TableCell > {
                                        row.scada_verified
                                    } < /TableCell> <
                                    TableCell > {
                                        row.commissioning_engineer
                                    } < /TableCell>

                                    { /* Document Attachments Viewing Cell */ } <
                                    TableCell >
                                    <
                                    Box display = "flex"
                                    gap = {
                                        0.5
                                    } >

                                    {
                                        row.document && ( <
                                            Tooltip title = "Certificate File" >
                                            <
                                            IconButton

                                            size = "small"

                                            color = "primary"

                                            onClick = {
                                                () =>

                                                handleOpenAttachment(row.document)

                                            } >
                                            <
                                            VisibilityIcon fontSize = "small" / >
                                            <
                                            /IconButton> <
                                            /Tooltip>

                                        )
                                    }

                                    {
                                        row.performance_reports && ( <
                                            Tooltip title = "Performance Telemetry" >
                                            <
                                            IconButton

                                            size = "small"

                                            color = "secondary"

                                            onClick = {
                                                () =>

                                                handleOpenAttachment(row.performance_reports)

                                            } >
                                            <
                                            VisibilityIcon fontSize = "small" / >
                                            <
                                            /IconButton> <
                                            /Tooltip>

                                        )
                                    }

                                    {
                                        !row.document && !row.performance_reports && "-"
                                    } <
                                    /Box> <
                                    /TableCell>

                                    { /* Status badge matching your dynamic metrics dashboard configuration */ } <
                                    TableCell align = "center" >
                                    <
                                    Box

                                    sx = {
                                        {

                                            display: "flex",

                                            flexDirection: "column",

                                            alignItems: "center",

                                            gap: 0.5,

                                        }
                                    } >

                                    {
                                        isApproved ? ( <
                                            >
                                            <
                                            Chip

                                            icon = { < CheckCircleIcon sx = {
                                                    {
                                                        fontSize: 14
                                                    }
                                                }
                                                />}

                                                label = "Approved"

                                                color = "success"

                                                size = "small"

                                                sx = {
                                                    {

                                                        fontWeight: 700,

                                                        minWidth: 95,

                                                        height: 22,

                                                    }
                                                }

                                                /> <
                                                Typography

                                                variant = "caption"

                                                sx = {
                                                    {

                                                        fontSize: "10px",

                                                        color: "text.secondary",

                                                        fontWeight: 600,

                                                    }
                                                } >

                                                Approved in {
                                                    days
                                                }
                                                days <
                                                /Typography> <
                                                />

                                            ): ( <
                                                >
                                                <
                                                Chip

                                                icon = { < CancelIcon sx = {
                                                        {
                                                            fontSize: 14
                                                        }
                                                    }
                                                    />}

                                                    label = "Pending"

                                                    color = "warning"

                                                    size = "small"

                                                    sx = {
                                                        {

                                                            fontWeight: 700,

                                                            minWidth: 95,

                                                            height: 22,

                                                        }
                                                    }

                                                    /> <
                                                    Typography

                                                    variant = "caption"

                                                    sx = {
                                                        {

                                                            fontSize: "10px",

                                                            color:

                                                                days > 5 ? "error.main" : "warning.main",

                                                            fontWeight: 700,

                                                        }
                                                    } >

                                                    Pending
                                                    for {
                                                        days
                                                    }
                                                    days <
                                                    /Typography> <
                                                    />

                                                )
                                            } <
                                            /Box> <
                                            /TableCell>

                                            { /* Explicit Action Processing Trigger Cell */ } <
                                            TableCell align = "center" >

                                            {!isApproved ? ( <
                                                    Button

                                                    variant = "contained"

                                                    size = "small"

                                                    color = "success"

                                                    onClick = {
                                                        () => handleApproveRow(row.id)
                                                    }

                                                    sx = {
                                                        {

                                                            textTransform: "none",

                                                            fontSize: "0.75rem",

                                                            fontWeight: 600,

                                                            borderRadius: 2,

                                                        }
                                                    } >

                                                    Approve <
                                                    /Button>

                                                ) : ( <
                                                    Typography

                                                    variant = "caption"

                                                    color = "text.secondary"

                                                    sx = {
                                                        {
                                                            fontStyle: "italic",
                                                            fontWeight: 500
                                                        }
                                                    } >

                                                    Verified By Admin <
                                                    /Typography>

                                                )
                                            } <
                                            /TableCell> <
                                            /TableRow>

                                        );

                                    })

                            )
                        } <
                        /TableBody> <
                        /Table> <
                        /Box> <
                        /Paper> <
                        /Container>

                    );

                };

                export default CommissioningTab;