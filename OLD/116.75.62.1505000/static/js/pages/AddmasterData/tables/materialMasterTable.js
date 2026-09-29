import React, {
    useState
} from 'react';
import {
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Box,
    TablePagination,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Search
} from 'lucide-react'; // Or use @mui/icons-material/Search

const MaterialMasterTable = ({
    materials
}) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState(""); // 1. Search state

    // 2. Filter logic: Checks name, category, and material code
    const filteredMaterials = materials.filter((item) =>
        item.name ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.material_code ? .toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(0); // Reset to first page on search
    };

    // 3. Slice the FILTERED array based on current page
    const displayedMaterials = filteredMaterials.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return ( <
        Paper sx = {
            {
                mt: 4,
                p: 3,
                borderRadius: 2,
                border: "1px solid #00416A",
            }
        } >
        { /* Header with Search Bar */ } <
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
        Material List <
        /Typography>

        <
        TextField size = "small"
        placeholder = "Search materials..."
        value = {
            searchTerm
        }
        onChange = {
            handleSearchChange
        }
        sx = {
            {
                width: {
                    xs: "100%",
                    sm: "300px"
                }
            }
        }
        InputProps = {
            {
                startAdornment: ( <
                    InputAdornment position = "start" >
                    <
                    Search size = {
                        18
                    }
                    color = "#00416A" / >
                    <
                    /InputAdornment>
                ),
            }
        }
        /> <
        /Box>

        { /* Horizontal Scroll Wrapper */ } <
        Box sx = {
            {
                overflowX: "auto",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                    height: 8
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: 4,
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "rgba(0,0,0,0.05)"
                },
            }
        } >
        <
        Table size = "small"
        sx = {
            {
                minWidth: 1000
            }
        } >
        <
        TableHead >
        <
        TableRow sx = {
            {
                backgroundColor: "#0f52ba"
            }
        } > {
            [
                "Name",
                "Category",
                "Type",
                "Material Cost",
                "Make",
                "Model As Per OEM",
                "Assembly",
                "Unit",
                "Material Code",
                "Warranty",
                "Shelf Life",
            ].map((header) => ( <
                TableCell key = {
                    header
                }
                sx = {
                    {
                        color: "#fff",
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
            displayedMaterials.length > 0 ? (
                displayedMaterials.map((item, index) => ( <
                    TableRow key = {
                        item.id || index
                    }
                    sx = {
                        {
                            backgroundColor: index % 2 === 0 ? "background.paper" : "#EBF3FF",
                            "&:hover": {
                                backgroundColor: "action.hover",
                                cursor: "pointer",
                            },
                        }
                    } >
                    <
                    TableCell sx = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.name
                    } <
                    /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.category
                    } <
                    /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.material_type
                    } <
                    /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.budget_cost
                    } <
                    /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.manufacturer
                    } <
                    /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.model_per_oem
                    } <
                    /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.component_type
                    } <
                    /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.unit_of_measure
                    } <
                    /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.material_code
                    } <
                    /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.warranty_applicable ? "Yes" : "No"
                    } <
                    /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: "nowrap"
                        }
                    } > {
                        item.shelf_life_applicable ? "Yes" : "No"
                    } <
                    /TableCell> <
                    /TableRow>
                ))
            ) : ( <
                TableRow >
                <
                TableCell colSpan = {
                    11
                }
                align = "center"
                sx = {
                    {
                        py: 3,
                        color: "text.secondary"
                    }
                } >
                No materials found matching your search. <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /Box>

        <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25, 50]
        }
        component = "div"
        count = {
            filteredMaterials.length
        } // Use filtered length for accurate pagination
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

export default MaterialMasterTable;