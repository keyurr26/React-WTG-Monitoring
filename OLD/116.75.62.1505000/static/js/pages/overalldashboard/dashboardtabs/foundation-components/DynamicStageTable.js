import React, {
    useState
} from "react";

import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import {
    FilterList as FilterIcon,
    Close as CloseIcon,
    DateRange as DateRangeIcon,
} from "@mui/icons-material";

export default function DynamicStageTables({
    sections,
    onAnchorFilter,
    onSoilFilter,
    onExcavationFilter,
    onPCCFilter,
    onConductLayingFilter,
    onReinforcementFilter,
    onFoundationFilter,
    loading,
    activeLoadingTable,
}) {
    const rowsPerPage = 5;

    // Pagination State Per Section
    const [pages, setPages] = useState(sections.map(() => 0));

    // Filter states for each section
    const [filters, setFilters] = useState(
        sections.map(() => ({
            fromDate: "",
            toDate: "",
            applied: false,
        })),
    );

    const handlePageChange = (sectionIndex, direction) => {
        setPages((prev) =>
            prev.map((page, i) => (i === sectionIndex ? page + direction : page)),
        );
    };

    const handleFilterChange = (sectionIndex, field, value) => {
        setFilters((prev) =>
            prev.map((filter, i) =>
                i === sectionIndex ? { ...filter,
                    [field]: value
                } : filter,
            ),
        );
    };

    // const applyFilter = (sectionIndex) => {
    //   const filter = filters[sectionIndex];
    //   if (filter.fromDate && filter.toDate) {
    //     setFilters(prev =>
    //       prev.map((f, i) =>
    //         i === sectionIndex ? { ...f, applied: true } : f
    //       )
    //     );
    //   } else {
    //     alert("Please select both From Date and To Date");
    //   }
    // };

    const applyFilter = (sectionIndex) => {
        const filter = filters[sectionIndex];

        const sectionTitle = sections[sectionIndex] ? .title ? .toLowerCase() || "";

        // ✅ YAHAN PE CONSOLE LOG ADD KARO (line 77 ke around)

        if (!filter.fromDate || !filter.toDate) {
            alert("Please select both From Date and To Date");
            return;
        }

        // ✅ Soil backend filter
        if (sectionTitle.includes("soil")) {
            onSoilFilter ? .(filter.fromDate, filter.toDate);
        }

        // ✅ Only Anchor -> Call parent
        if (sectionTitle.includes("anchor")) {
            onAnchorFilter ? .(filter.fromDate, filter.toDate);
        }

        if (sectionTitle.includes("excavation")) {
            onExcavationFilter ? .(filter.fromDate, filter.toDate);
        }

        if (sectionTitle.includes("pcc")) {
            onPCCFilter ? .(filter.fromDate, filter.toDate);
        }

        if (sectionTitle.includes("conduit data")) {
            onConductLayingFilter ? .(filter.fromDate, filter.toDate);
        } else if (sectionTitle.includes("reinforcement")) {
            onReinforcementFilter ? .(filter.fromDate, filter.toDate);
        } else if (sectionTitle.includes("foundation")) {
            onFoundationFilter ? .(filter.fromDate, filter.toDate);
        }

        setFilters((prev) =>
            prev.map((f, i) => (i === sectionIndex ? { ...f,
                applied: true
            } : f)),
        );
    };

    const clearFilter = (sectionIndex) => {
        const sectionTitle = sections[sectionIndex] ? .title ? .toLowerCase() || "";

        if (sectionTitle.includes("anchor")) {
            onAnchorFilter ? .(null, null); // fetch all
        }

        if (sectionTitle.includes("soil")) {
            onSoilFilter ? .(null, null);
        }

        if (sectionTitle.includes("excavation")) {
            onExcavationFilter ? .(null, null);
        }

        if (sectionTitle.includes("pcc")) {
            onPCCFilter ? .(null, null);
        }

        if (sectionTitle.includes("conduit data")) {
            onConductLayingFilter ? .(null, null);
        } else if (sectionTitle.includes("reinforcement")) {
            onReinforcementFilter ? .(null, null);
        } else if (sectionTitle.includes("foundation")) {
            onFoundationFilter ? .(null, null);
        }

        setFilters((prev) =>
            prev.map((f, i) =>
                i === sectionIndex ? {
                    fromDate: "",
                    toDate: "",
                    applied: false
                } : f,
            ),
        );
    };

    const isDateInRange = (item, sectionIndex) => {
        const filter = filters[sectionIndex];
        if (!filter.applied || !filter.fromDate || !filter.toDate) return true;

        let dateValue = null;
        const sectionTitle = sections[sectionIndex] ? .title ? .toLowerCase() || "";

        if (sectionTitle.includes("soil")) {
            return true;
        } else if (sectionTitle.includes("excavation")) {
            return true;
        } else if (sectionTitle.includes("pcc")) {
            return true;
        } else if (sectionTitle.includes("conduit data")) {
            return true;
        } else if (sectionTitle.includes("anchor")) {
            return true;
        } else if (sectionTitle.includes("reinforcement")) {
            return true;
        } else if (sectionTitle.includes("foundation")) {
            return true;
        } else if (sectionTitle.includes("pouring")) {
            dateValue = item.pouring_start_time;
        }

        if (!dateValue) return false;

        const date = new Date(dateValue);
        const from = new Date(filter.fromDate);
        const to = new Date(filter.toDate);

        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);

        return date >= from && date <= to;
    };

    return ( <
        div style = {
            {
                padding: "20px"
            }
        } > {
            sections.map((section, sectionIndex) => {
                const isLoading = activeLoadingTable === section.title && loading;

                const filter = filters[sectionIndex];

                // Filter data based on date range
                const filteredData = section.data.filter((item) =>
                    isDateInRange(item, sectionIndex),
                );

                const page = pages[sectionIndex];
                const totalPages = Math.ceil(filteredData.length / rowsPerPage);
                const startIndex = page * rowsPerPage;
                const paginatedData = filteredData.slice(
                    startIndex,
                    startIndex + rowsPerPage,
                );

                return ( <
                    div key = {
                        sectionIndex
                    }
                    style = {
                        {
                            marginBottom: "40px"
                        }
                    } >
                    <
                    Box display = "flex"
                    justifyContent = "space-between"
                    alignItems = "center"
                    mb = {
                        2
                    }
                    flexWrap = "wrap"
                    gap = {
                        2
                    } >
                    <
                    h3 style = {
                        {
                            margin: 0
                        }
                    } > {
                        section.title
                    } < /h3>

                    <
                    Box display = "flex"
                    gap = {
                        1
                    }
                    alignItems = "center"
                    flexWrap = "wrap"
                    sx = {
                        {
                            padding: "8px 12px",
                            borderRadius: "6px",
                        }
                    } >
                    <
                    DateRangeIcon color = "action"
                    fontSize = "small" / >
                    <
                    TextField type = "date"
                    size = "small"
                    label = "From"
                    value = {
                        filter.fromDate
                    }
                    onChange = {
                        (e) =>
                        handleFilterChange(sectionIndex, "fromDate", e.target.value)
                    }
                    InputLabelProps = {
                        {
                            shrink: true
                        }
                    }
                    sx = {
                        {
                            width: 140
                        }
                    }
                    /> <
                    TextField type = "date"
                    size = "small"
                    label = "To"
                    value = {
                        filter.toDate
                    }
                    onChange = {
                        (e) =>
                        handleFilterChange(sectionIndex, "toDate", e.target.value)
                    }
                    InputLabelProps = {
                        {
                            shrink: true
                        }
                    }
                    sx = {
                        {
                            width: 140
                        }
                    }
                    /> <
                    Button variant = "contained"
                    color = "primary"
                    size = "small"
                    onClick = {
                        () => applyFilter(sectionIndex)
                    }
                    startIcon = { < FilterIcon / >
                    }
                    disabled = {!filter.fromDate || !filter.toDate
                    } >
                    Apply <
                    /Button> {
                        filter.applied && ( <
                            Button variant = "outlined"
                            color = "secondary"
                            size = "small"
                            onClick = {
                                () => clearFilter(sectionIndex)
                            }
                            startIcon = { < CloseIcon / >
                            } >
                            Clear <
                            /Button>
                        )
                    } <
                    /Box> <
                    /Box>

                    { /* Filter Status */ } {
                        filter.applied && ( <
                            Typography variant = "caption"
                            color = "primary"
                            sx = {
                                {
                                    mb: 1,
                                    display: "block"
                                }
                            } >
                            Showing records from {
                                " "
                            } {
                                new Date(filter.fromDate).toLocaleDateString()
                            }
                            to {
                                " "
                            } {
                                new Date(filter.toDate).toLocaleDateString()
                            } {
                                filteredData.length === 0 && " - No records found"
                            } <
                            /Typography>
                        )
                    }

                    { /* Table */ } <
                    table style = {
                        {
                            width: "100%",
                            borderCollapse: "collapse",
                            tableLayout: "fixed", // 👈 MOST IMPORTANT
                        }
                    } >
                    <
                    thead >
                    <
                    tr > {
                        section.headers.map((header, i) => ( <
                            th key = {
                                i
                            }
                            style = {
                                {
                                    border: "1px solid #ddd",
                                    padding: "10px",
                                    backgroundColor: "#00416A",
                                    color: "#fff",
                                    textAlign: "left",
                                    width: `${100 / section.headers.length}%`, // 👈 Equal width
                                }
                            } >
                            {
                                header.label
                            } <
                            /th>
                        ))
                    } <
                    /tr> <
                    /thead>

                    <
                    tbody > {
                        isLoading ? ( <
                            tr >
                            <
                            td colSpan = {
                                section.headers.length
                            }
                            style = {
                                {
                                    textAlign: "center",
                                    padding: "40px",
                                    border: "1px solid #ddd",
                                }
                            } >
                            <
                            Box display = "flex"
                            flexDirection = "column"
                            alignItems = "center"
                            justifyContent = "center"
                            gap = {
                                2
                            } >
                            <
                            CircularProgress size = {
                                35
                            }
                            /> <
                            Typography variant = "body2"
                            color = "textSecondary" >
                            Loading {
                                section.title
                            }...
                            <
                            /Typography> <
                            /Box> <
                            /td> <
                            /tr>
                        ) : paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIndex) => ( <
                                tr key = {
                                    rowIndex
                                } > {
                                    section.headers.map((header, colIndex) => ( <
                                        td key = {
                                            colIndex
                                        }
                                        style = {
                                            {
                                                border: "1px solid #ddd",
                                                padding: "8px",
                                            }
                                        } >
                                        {
                                            row[header.key] !== undefined &&
                                            row[header.key] !== null ?
                                            row[header.key].toString() :
                                                "-"
                                        } <
                                        /td>
                                    ))
                                } <
                                /tr>
                            ))
                        ) : ( <
                            tr >
                            <
                            td colSpan = {
                                section.headers.length
                            }
                            style = {
                                {
                                    textAlign: "center",
                                    padding: "20px",
                                    border: "1px solid #ddd",
                                    color: "#666",
                                }
                            } >
                            {
                                filter.applied ?
                                "No data available for the selected date range" :
                                    "No data available"
                            } <
                            /td> <
                            /tr>
                        )
                    } <
                    /tbody> <
                    /table>

                    { /* Pagination */ } {
                        filteredData.length > 0 && ( <
                            div style = {
                                {
                                    marginTop: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                }
                            } >
                            <
                            button disabled = {
                                page === 0
                            }
                            onClick = {
                                () => handlePageChange(sectionIndex, -1)
                            }
                            style = {
                                {
                                    padding: "5px 10px",
                                    cursor: page === 0 ? "not-allowed" : "pointer",
                                    backgroundColor: page === 0 ? "#ccc" : "#00416A",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                }
                            } >
                            Prev <
                            /button>

                            <
                            span style = {
                                {
                                    margin: "0 10px"
                                }
                            } >
                            Page {
                                page + 1
                            } of {
                                totalPages
                            } {
                                filteredData.length !== section.data.length &&
                                    ` (Filtered: ${filteredData.length} of ${section.data.length})`
                            } <
                            /span>

                            <
                            button disabled = {
                                page === totalPages - 1
                            }
                            onClick = {
                                () => handlePageChange(sectionIndex, 1)
                            }
                            style = {
                                {
                                    padding: "5px 10px",
                                    cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
                                    backgroundColor: page === totalPages - 1 ? "#ccc" : "#00416A",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                }
                            } >
                            Next <
                            /button> <
                            /div>
                        )
                    } <
                    /div>
                );
            })
        } <
        /div>
    );
}