import React, {
    useEffect,
    useState
} from "react";
import {
    Stack,
    Box,
    Paper,
    Typography,
    TextField,
    MenuItem,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination
} from "@mui/material";
import {
    Edit,
    Delete
} from "@mui/icons-material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    fetchContractors,
    deleteContractor
} from "../../../Redux/MasterData/masterAction";

const ContractorTable = ({
    onEdit
}) => { // 🔥 Accept onEdit from parent form
    const dispatch = useDispatch();
    const {
        ContractorData = []
    } = useSelector((state) => state.masterData || "");

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");

    // Pagination State
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        dispatch(fetchContractors());
    }, [dispatch]);

    const filteredData = ContractorData.filter((item) => {
        return (
            (item.firm_name ? .toLowerCase() || "").includes(search.toLowerCase()) &&
            (filterType ? item.contractor_type === filterType : true)
        );
    });

    const handleChangePage = (event, newPage) => setPage(newPage);

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    //   const handleDelete = (id) => {
    //     if (window.confirm("Are you sure you want to delete this contractor?")) {
    //       dispatch(deleteContractor(id));
    //     }
    //   };

    return ( <
        Paper sx = {
            {
                mt: 2,
                p: 3,
                borderRadius: 2,
                border: "1px solid #00416A"
            }
        } >
        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A"
            }
        } >
        Contractor List <
        /Typography>

        <
        Stack direction = "row"
        spacing = {
            2
        } >
        <
        TextField label = "Filter Type"
        select size = "small"
        value = {
            filterType
        }
        onChange = {
            (e) => {
                setFilterType(e.target.value);
                setPage(0);
            }
        }
        sx = {
            {
                minWidth: 150
            }
        } >
        <
        MenuItem value = "" > All < /MenuItem> <
        MenuItem value = "civil" > Civil < /MenuItem> <
        MenuItem value = "electrical" > Electrical < /MenuItem> <
        MenuItem value = "mechanical" > Mechanical < /MenuItem> <
        MenuItem value = "other" > Other < /MenuItem> <
        /TextField> <
        TextField label = "Search Firm Name"
        size = "small"
        value = {
            search
        }
        onChange = {
            (e) => {
                setSearch(e.target.value);
                setPage(0);
            }
        }
        />

        <
        /Stack> <
        /Box>

        <
        TableContainer sx = {
            {
                maxHeight: 450
            }
        } >
        <
        Table stickyHeader size = "small" >
        <
        TableHead >
        <
        TableRow >
        <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        Firm Name <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        Contact Person <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        GST No <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        Agreement No <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        Phone <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        Email <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        } >
        Type <
        /TableCell> <
        TableCell sx = {
            {
                bgcolor: "#0f52ba",
                color: "#fff",
                fontWeight: 600
            }
        }
        align = "center" >
        Actions <
        /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => ( <
                TableRow key = {
                    row.id
                }
                hover >
                <
                TableCell > {
                    row.firm_name
                } < /TableCell> <
                TableCell > {
                    row.contact_person
                } < /TableCell> <
                TableCell > {
                    row.gst_number_con || "N/A"
                } < /TableCell> <
                TableCell > {
                    row.agreement_number || "N/A"
                } < /TableCell> <
                TableCell > {
                    row.phone
                } < /TableCell> <
                TableCell > {
                    row.email
                } < /TableCell> <
                TableCell sx = {
                    {
                        textTransform: "capitalize"
                    }
                } > {
                    row.contractor_type
                } <
                /TableCell> <
                TableCell align = "center" >
                <
                Stack direction = "row"
                spacing = {
                    1
                }
                justifyContent = "center" > { /* 🔥 Click redirects fields upward instead of using a Dialog */ } <
                IconButton color = "primary"
                size = "small"
                onClick = {
                    () => onEdit(row)
                } >
                <
                Edit fontSize = "small" / >
                <
                /IconButton> {
                    /* <IconButton color="error" size="small" onClick={() => handleDelete(row.id)}>
                                            <Delete fontSize="small" />
                                          </IconButton> */
                } <
                /Stack> <
                /TableCell> <
                /TableRow>
            ))
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        <
        TablePagination rowsPerPageOptions = {
            [5, 10, 25, 50]
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

export default ContractorTable;