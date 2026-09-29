import React, {
    useEffect,
    useState
} from 'react'; // Added useState
import {
    useDispatch,
    useSelector
} from 'react-redux';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
    Box,
    CircularProgress,
    TablePagination
} from '@mui/material';
import {
    GetAttachmentMasterData
} from '../../../Redux/MasterData/masterAction';
import {
    ACTIVITY_CHOICES
} from '../../../constants/choices';

const AdminAttachmentTable = ({
    filteredActivityTypes
}) => {
    const dispatch = useDispatch();
    const {
        attachmentList = [], loading
    } = useSelector((state) => state.masterData);

    /* ================= PAGINATION STATE ================= */
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(GetAttachmentMasterData());
    }, [dispatch]);

    // Handle Page Change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle Rows Per Page Change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to first page when changing limit
    };

    const getActivityLabel = (value) => {
        const activity = filteredActivityTypes.find(a => a.value === value);
        return activity ? activity.label : value;
    };

    if (loading) {
        return ( <
            Box display = "flex"
            justifyContent = "center"
            alignItems = "center"
            minHeight = "200px" >
            <
            CircularProgress / >
            <
            /Box>
        );
    }


    const filteredList = attachmentList.filter(item => item.activity !== 'PERMIT');
    /* ================= DATA SLICING ================= */
    // Slice the data based on current page and limit
    const paginatedData = filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (

        <
        TableContainer component = {
            Paper
        }
        elevation = {
            3
        }
        sx = {
            {
                borderRadius: 2
            }
        } >
        <
        Table sx = {
            {
                minWidth: 700
            }
        }
        aria - label = "admin table" >
        <
        TableHead sx = {
            {
                backgroundColor: '#f8f9fa'
            }
        } >
        <
        TableRow >
        <
        TableCell sx = {
            {
                fontWeight: 'bold'
            }
        } > Activity / Phase < /TableCell> <
        TableCell sx = {
            {
                fontWeight: 'bold'
            }
        } > Requirement Name < /TableCell> <
        TableCell sx = {
            {
                fontWeight: 'bold'
            }
        } > Type < /TableCell> <
        TableCell sx = {
            {
                fontWeight: 'bold'
            }
        }
        align = "center" > Status < /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            paginatedData.map((row) => ( <
                TableRow key = {
                    row.id
                }
                hover >
                <
                TableCell >
                <
                Typography variant = "body2"
                fontWeight = "medium" > {
                    getActivityLabel(row.activity)
                } <
                /Typography> <
                /TableCell> <
                TableCell > {
                    row.file_name
                } < /TableCell> <
                TableCell >
                <
                Chip label = {
                    row.file_type
                }
                size = "small"
                variant = "outlined"
                color = "primary"
                sx = {
                    {
                        fontSize: '0.75rem'
                    }
                }
                /> <
                /TableCell> <
                TableCell align = "center" >
                <
                Chip label = {
                    row.is_active ? "Active" : "Disabled"
                }
                color = {
                    row.is_active ? "success" : "error"
                }
                size = "small" /
                >
                <
                /TableCell> <
                /TableRow>
            ))
        } {
            filteredList.length === 0 && ( <
                TableRow >
                <
                TableCell colSpan = {
                    4
                }
                align = "center"
                sx = {
                    {
                        py: 4
                    }
                } >
                No master data records found. <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table>

        { /* ================= PAGINATION COMPONENT ================= */ } <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25, 50]
        }
        component = "div"
        count = {
            filteredList.length
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
        sx = {
            {
                borderTop: '1px solid #e0e0e0'
            }
        }
        /> <
        /TableContainer>

    );
};

export default AdminAttachmentTable;