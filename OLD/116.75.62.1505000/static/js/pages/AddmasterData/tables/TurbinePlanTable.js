import React, {
    useState
} from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Typography,
    TablePagination,
    Collapse,
    IconButton,
    MenuItem,
} from "@mui/material";
import {
    KeyboardArrowDown as ArrowDownIcon,
    KeyboardArrowUp as ArrowUpIcon,
} from "@mui/icons-material";

// Define category choices consistently
const CATEGORY_CHOICES = [{
        value: "FOUNDATION",
        label: "Foundation"
    },
    {
        value: "WTG_INSTALLATION",
        label: "WTG Installation"
    },
];

// =========================================================================
// ⚙️ SUB-COMPONENT: COLLAPSIBLE ROW CONTROLLER
// =========================================================================
const CollapsibleRow = ({
    plan,
    index,
    allActivityData = []
}) => {
    const [open, setOpen] = useState(false);

    // 🔥 FILTER DRILL DOWN DATA: Find all activity schedule dates assigned to this specific turbine id
    const matchedActivities = allActivityData.filter(
        (act) => Number(act.planned_master) === Number(plan.id),
    );

    return ( <
        >
        <
        TableRow onClick = {
            () => setOpen(!open)
        }
        sx = {
            {
                backgroundColor: index % 2 === 0 ? "background.paper" : "#DEEBFF",
                "&:hover": {
                    backgroundColor: "#EBF3FF",
                    cursor: "pointer",
                },
            }
        } >
        <
        TableCell size = "small"
        sx = {
            {
                width: "50px"
            }
        } >
        <
        IconButton size = "small"
        onClick = {
            (e) => {
                e.stopPropagation();
                setOpen(!open);
            }
        } >
        {
            open ? < ArrowUpIcon / > : < ArrowDownIcon / >
        } <
        /IconButton> <
        /TableCell> <
        TableCell sx = {
            {
                whiteSpace: "nowrap"
            }
        } > {
            plan.project_name
        } < /TableCell> <
        TableCell sx = {
            {
                whiteSpace: "nowrap"
            }
        } > {
            plan.windfarm_name
        } <
        /TableCell> <
        TableCell sx = {
            {
                whiteSpace: "nowrap",
                fontWeight: "bold"
            }
        } > {
            plan.turbine_name ||
            plan.location_no ||
            `WTG Location (ID: ${plan.turbine})`
        } <
        /TableCell> <
        TableCell sx = {
            {
                whiteSpace: "nowrap"
            }
        } > {
            plan.category ? plan.category.replace("_", " ") : "-"
        } <
        /TableCell> <
        TableCell sx = {
            {
                whiteSpace: "nowrap"
            }
        } > {
            plan.planned_start_date
        } <
        /TableCell> <
        TableCell sx = {
            {
                whiteSpace: "nowrap",
                color: "#d32f2f",
                fontWeight: "bold"
            }
        } >
        {
            plan.planned_end_date
        } <
        /TableCell> <
        TableCell sx = {
            {
                whiteSpace: "nowrap"
            }
        } >
        <
        Box sx = {
            {
                px: 1,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: "#4caf50",
                color: "#fff",
                display: "inline-block",
                fontSize: "12px",
                fontWeight: 600,
            }
        } >
        Scheduled <
        /Box> <
        /TableCell> <
        /TableRow>

        {
            /* =========================================================================
                      📅 DRILL-DOWN PANEL: Renders the nested chronological layout data sheet
                      ========================================================================= */
        } <
        TableRow sx = {
            {
                backgroundColor: "#f8fafc"
            }
        } >
        <
        TableCell style = {
            {
                paddingBottom: 0,
                paddingTop: 0
            }
        }
        colSpan = {
            8
        } >
        <
        Collapse in = {
            open
        }
        timeout = "auto"
        unmountOnExit >
        <
        Box sx = {
            {
                margin: 2,
                p: 2,
                border: "1px dashed #00416A",
                borderRadius: 1,
                bgcolor: "#fff",
            }
        } >
        <
        Typography variant = "subtitle2"
        gutterBottom component = "div"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A",
                mb: 1.5
            }
        } >
        📋Baseline Activity Schedule
        for Location Block: {
            " "
        } {
            plan.turbine_name || plan.location_no
        } <
        /Typography>

        <
        Table size = "small"
        aria - label = "nested activity dates tracker" >
        <
        TableHead >
        <
        TableRow sx = {
            {
                bgcolor: "#eff6ff"
            }
        } >
        <
        TableCell sx = {
            {
                fontWeight: 700,
                color: "#1e40af",
                width: "10%"
            }
        } >
        Seq <
        /TableCell> <
        TableCell sx = {
            {
                fontWeight: 700,
                color: "#1e40af"
            }
        } >
        Activity Workflow Milestone <
        /TableCell> <
        TableCell sx = {
            {
                fontWeight: 700,
                color: "#1e40af"
            }
        } >
        Planned Start Date <
        /TableCell> <
        TableCell sx = {
            {
                fontWeight: 700,
                color: "#1e40af"
            }
        } >
        Planned Completion Date <
        /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            matchedActivities.length > 0 ? (
                matchedActivities.map((act) => ( <
                    TableRow key = {
                        act.id
                    }
                    sx = {
                        {
                            "&:last-child td, &:last-child th": {
                                border: 0
                            },
                        }
                    } >
                    <
                    TableCell sx = {
                        {
                            fontWeight: 600
                        }
                    } > {
                        act.activity_sequence || "-"
                    } <
                    /TableCell> <
                    TableCell sx = {
                        {
                            fontWeight: 600,
                            color: "#334155"
                        }
                    } > {
                        act.activity_name
                    } <
                    /TableCell> <
                    TableCell > {
                        act.act_planned_start_date
                    } < /TableCell> <
                    TableCell sx = {
                        {
                            color: "#b91c1c",
                            fontWeight: 600
                        }
                    } > {
                        act.act_planned_end_date
                    } <
                    /TableCell> <
                    /TableRow>
                ))
            ) : ( <
                TableRow >
                <
                TableCell colSpan = {
                    4
                }
                align = "center"
                sx = {
                    {
                        color: "text.disabled",
                        py: 2
                    }
                } >
                No underlying baseline activities computed
                for this selection node. <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /Box> <
        /Collapse> <
        /TableCell> <
        /TableRow> <
        />
    );
};

// =========================================================================
// 🏢 MAIN PARENT TABLE VIEW COMPONENT
// =========================================================================
const TurbinePlanTable = ({
    Data = [],
    activityData = []
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredData = Data.filter((plan) => {
        // 1. Category Filter Check
        const matchesCategory = !categoryFilter ||
            String(plan.category || "").toUpperCase() ===
            String(categoryFilter).toUpperCase();

        // 2. Search Term Filter Check
        const matchesSearch =
            plan.turbine_name ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.location_no ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.project_name ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.windfarm_name ? .toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    // Pagination Logic: Slice the filtered data
    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return ( <
        Paper sx = {
            {
                p: 3,
                mt: 1,
                backgroundColor: "transparent",
                boxShadow: "none",
                borderRadius: 2,
                border: "1px solid #00416A",
            }
        } >
        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: "wrap",
                gap: 2,
            }
        } >
        <
        Typography variant = "h6"
        fontWeight = "bold"
        color = "#00416A" >
        Turbine Planned Schedules <
        /Typography>

        <
        Box sx = {
            {
                display: "flex",
                gap: 2,
                width: {
                    xs: "100%",
                    sm: "auto"
                }
            }
        } >
        { /* Category Filter Dropdown */ } <
        TextField label = "Filter Category"
        select variant = "outlined"
        size = "small"
        value = {
            categoryFilter
        }
        onChange = {
            (e) => {
                setCategoryFilter(e.target.value);
                setPage(0);
            }
        }
        sx = {
            {
                minWidth: "180px"
            }
        } >
        <
        MenuItem value = "" > All Categories < /MenuItem> {
            CATEGORY_CHOICES.map((cat) => ( <
                MenuItem key = {
                    cat.value
                }
                value = {
                    cat.value
                } > {
                    cat.label
                } <
                /MenuItem>
            ))
        } <
        /TextField>

        { /* Search Field */ } <
        TextField label = "Search Plans"
        variant = "outlined"
        size = "small"
        value = {
            searchTerm
        }
        onChange = {
            (e) => {
                setSearchTerm(e.target.value);
                setPage(0);
            }
        }
        sx = {
            {
                width: {
                    xs: "100%",
                    sm: "220px"
                }
            }
        }
        /> <
        /Box> <
        /Box>

        <
        TableContainer sx = {
            {
                maxHeight: 600,
                mt: -1.5
            }
        } >
        <
        Table stickyHeader size = "small"
        aria - label = "turbine master plans tracking table"
        sx = {
            {
                minWidth: 1100
            }
        } >
        <
        TableHead >
        <
        TableRow >
        <
        TableCell sx = {
            {
                background: "#0f52ba",
                width: "50px"
            }
        }
        /> {
            [
                "Project",
                "Windfarm",
                "Turbine Location",
                "Category",
                "Planned Start Date",
                "Planned End Date",
                "Status",
            ].map((header) => ( <
                TableCell key = {
                    header
                }
                sx = {
                    {
                        color: "#ffffff",
                        background: "#0f52ba",
                        fontWeight: "bold",
                        fontSize: 14,
                        whiteSpace: "nowrap",
                    }
                } >
                {
                    header
                } <
                /TableCell>
            ))
        } <
        /TableRow> <
        /TableHead>

        <
        TableBody > {
            paginatedData.length > 0 ? (
                paginatedData.map((plan, index) => ( <
                    CollapsibleRow key = {
                        plan.id || index
                    }
                    plan = {
                        plan
                    }
                    index = {
                        index
                    }
                    allActivityData = {
                        activityData
                    }
                    />
                ))
            ) : ( <
                TableRow >
                <
                TableCell colSpan = {
                    8
                }
                align = "center"
                sx = {
                    {
                        py: 3
                    }
                } >
                No installation plans found
                for this category scope. <
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
            filteredData.length
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
        /Paper>
    );
};

export default TurbinePlanTable;