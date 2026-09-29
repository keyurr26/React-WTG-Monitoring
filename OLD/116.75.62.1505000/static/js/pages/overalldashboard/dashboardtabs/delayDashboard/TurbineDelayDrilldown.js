import React, {
    useState
} from "react";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stack,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const TurbineDelayDrilldown = ({
    data = []
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    if (!data.length)
        return ( <
            Typography color = "textSecondary" > No delay records found. < /Typography>
        );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Slice the data array for pagination based on current page and rowsPerPage
    const paginatedData = data.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    return ( <
        Box sx = {
            {
                mt: 3
            }
        } >
        <
        Typography variant = "h6"
        fontWeight = {
            700
        }
        sx = {
            {
                mb: 2
            }
        } >
        Turbine - Wise Drill - down Analysis <
        /Typography>

        {
            paginatedData.map((turbine) => ( <
                Accordion key = {
                    turbine.turbine_name
                }
                elevation = {
                    0
                }
                sx = {
                    {
                        border: "1px solid #eee",
                        mb: 1.5,
                        borderRadius: "8px !important",
                    }
                } >
                <
                AccordionSummary expandIcon = { < ExpandMoreIcon / >
                } >
                <
                Stack direction = "row"
                justifyContent = "space-between"
                alignItems = "center"
                sx = {
                    {
                        width: "100%",
                        pr: 2
                    }
                } >
                <
                Typography fontWeight = {
                    700
                } > {
                    turbine.turbine_name
                } < /Typography> <
                Chip label = {
                    `${turbine.total_days} Days Lost`
                }
                color = {
                    turbine.total_days > 100 ? "error" : "warning"
                }
                size = "small"
                sx = {
                    {
                        fontWeight: 700
                    }
                }
                /> <
                /Stack> <
                /AccordionSummary> <
                AccordionDetails sx = {
                    {
                        bgcolor: "#fcfcfc",
                        p: 2,
                    }
                } >
                {
                    turbine.activities.map((act, index) => ( <
                        Box key = {
                            index
                        }
                        sx = {
                            {
                                mb: 3
                            }
                        } >
                        <
                        Typography variant = "subtitle2"
                        color = "primary"
                        sx = {
                            {
                                fontWeight: 800,
                                mb: 1,
                            }
                        } >
                        {
                            act.activity
                        }: (Total Delay: {
                                act.total_days
                            }
                            d) <
                        /Typography>

                        <
                        TableContainer component = {
                            Paper
                        }
                        variant = "outlined" >
                        <
                        Table size = "small" >
                        <
                        TableHead sx = {
                            {
                                bgcolor: "#f8f9fa"
                            }
                        } >
                        <
                        TableRow >
                        <
                        TableCell > CAUSE < /TableCell> <
                        TableCell > STARTING DELAY < /TableCell> <
                        TableCell > WORKING DELAY < /TableCell> <
                        TableCell > TOTAL < /TableCell> <
                        TableCell > DATE < /TableCell> <
                        /TableRow> <
                        /TableHead> <
                        TableBody > {
                            act.delays.map((c, cIdx) => ( <
                                TableRow key = {
                                    cIdx
                                } >
                                <
                                TableCell > {
                                    c.cause
                                } < /TableCell>

                                <
                                TableCell sx = {
                                    {
                                        color: "orange",
                                        fontWeight: 700
                                    }
                                } > {
                                    c.starting_days
                                }
                                d <
                                /TableCell>

                                <
                                TableCell sx = {
                                    {
                                        color: "red",
                                        fontWeight: 700
                                    }
                                } > {
                                    c.working_days
                                }
                                d <
                                /TableCell>

                                <
                                TableCell sx = {
                                    {
                                        fontWeight: 800
                                    }
                                } > {
                                    c.total_days
                                }
                                d <
                                /TableCell>

                                <
                                TableCell > {
                                    c.date
                                } < /TableCell> <
                                /TableRow>
                            ))
                        } <
                        /TableBody> <
                        /Table> <
                        /TableContainer> <
                        /Box>
                    ))
                } <
                /AccordionDetails> <
                /Accordion>
            ))
        }

        { /* Pagination Controls */ } <
        TablePagination component = "div"
        count = {
            data.length
        }
        page = {
            page
        }
        onPageChange = {
            handleChangePage
        }
        rowsPerPage = {
            rowsPerPage
        }
        onRowsPerPageChange = {
            handleChangeRowsPerPage
        }
        rowsPerPageOptions = {
            [5, 10, 25, 50]
        }
        /> <
        /Box>
    );
};
export default TurbineDelayDrilldown;