import React, {
    useState
} from 'react';
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
    TablePagination, // 1. Import TablePagination
} from '@mui/material';

const UserTable = ({
    Data = []
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // 2. Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter users
    const filteredData = Data.filter((user) =>
        user.full_name ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role ? .toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. Slice the data for the current page
    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    // 4. Handle Page Change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // 5. Handle Rows Per Page Change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page
    };

    return ( <
        Paper sx = {
            {
                p: 3,
                mt: 1,
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderRadius: 2,
                border: "1px solid #00416A",
            }
        } >
        <
        Box sx = {
            {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2
            }
        } >
        <
        Typography variant = "h6"
        gutterBottom fontWeight = "bold"
        color = "#00416A" >
        User List <
        /Typography>

        <
        TextField label = "Search"
        variant = "outlined"
        size = "small"
        value = {
            searchTerm
        }
        onChange = {
            (e) => {
                setSearchTerm(e.target.value);
                setPage(0); // Reset to first page on search
            }
        }
        sx = {
            {
                width: {
                    xs: '100%',
                    sm: '250px'
                }
            }
        }
        /> <
        /Box> <
        TableContainer sx = {
            {
                maxHeight: 500,
                mt: -1.5
            }
        } >
        <
        Table stickyHeader size = "small"
        aria - label = "users table"
        sx = {
            {
                minWidth: 1100
            }
        } >
        <
        TableHead >
        <
        TableRow sx = {
            {
                backgroundColor: 'primary.main'
            }
        } > {
            ['Name', 'Email', 'Mobile', 'Role'].map((header) => ( <
                TableCell key = {
                    header
                }
                sx = {
                    {
                        color: '#ffffff',
                        background: "#0f52ba",
                        fontWeight: 'bold',
                        fontSize: 14,
                        whiteSpace: 'nowrap',
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
        TableBody > { /* 6. Map over paginatedData instead of filteredData */ } {
            paginatedData.length > 0 ? (
                paginatedData.map((user, index) => ( <
                    TableRow key = {
                        user.id || index
                    }
                    sx = {
                        {
                            backgroundColor: index % 2 === 0 ? 'background.paper' : '#DEEBFF',
                            '&:hover': {
                                backgroundColor: '#EBF3FF',
                                cursor: 'pointer',
                            },
                        }
                    } >
                    <
                    TableCell sx = {
                        {
                            whiteSpace: 'nowrap'
                        }
                    } > {
                        user.full_name
                    } < /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: 'nowrap'
                        }
                    } > {
                        user.email
                    } < /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: 'nowrap'
                        }
                    } > {
                        user.mobile || 'N/A'
                    } <
                    /TableCell> <
                    TableCell sx = {
                        {
                            whiteSpace: 'nowrap'
                        }
                    } > {
                        user.role
                    } < /TableCell> <
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
                        py: 3
                    }
                } >
                No users found. <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        { /* 7. Add the TablePagination Component */ } <
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

export default UserTable;