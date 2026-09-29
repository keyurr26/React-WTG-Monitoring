import React, {
    useState,
    useEffect,
    useCallback
} from "react";
import {
    Box,
    Grid,
    Paper,
    TextField,
    Button,
    Typography,
    TableCell,
    TableRow,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TablePagination,
    InputAdornment,
    MenuItem,
} from "@mui/material";
import {
    Search,
    CloudUpload as UploadIcon
} from "lucide-react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetVendorData,
    CreateVendorData,
    BulkUploadVendors,
    DownloadVendorTemplate,
} from "../../../Redux/MasterData/masterAction";
import CustomSnackbar from "../../../components/comman/CustomSnackbar";
import parseErrorMessage from "../../../utils/errorFunction";

const VendorMasterForm = () => {
        const dispatch = useDispatch();
        const {
            vendorData = [], loading
        } = useSelector(
            (state) => state.masterData || {},
        );

        // --- State Hooks ---
        const [page, setPage] = useState(0);
        const [rowsPerPage, setRowsPerPage] = useState(5);
        const [searchTerm, setSearchTerm] = useState("");
        const [errors, setErrors] = useState({});

        const initialState = {
            name: "",
            code: "",
            phone: "",
            email: "",
            address: "",
            gst_no: "",
            vendor_type: "Supplier",
            document: null,
        };
        const [formData, setFormData] = useState(initialState);

        // --- Snackbar Feedback State ---
        const [snackbar, setSnackbar] = useState({
            open: false,
            message: "",
            severity: "success",
        });

        const showSnackbar = useCallback((message, severity = "success") => {
            setSnackbar({
                open: true,
                message,
                severity
            });
        }, []);

        const vendorTypes = [{
                label: "Supplier",
                value: "Supplier"
            },
            {
                label: "Contractor",
                value: "Contractor"
            },
            {
                label: "Service Provider",
                value: "Service Provider"
            },
        ];

        // --- Search & Pagination Filtering ---
        const filteredVendors = vendorData.filter(
            (vendor) =>
            vendor.name ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.code ? .toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.email ? .toLowerCase().includes(searchTerm.toLowerCase()),
        );

        const visibleVendors = filteredVendors.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        );

        const handleChangePage = (event, newPage) => setPage(newPage);
        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };

        const handleSearchChange = (e) => {
            setSearchTerm(e.target.value);
            setPage(0);
        };

        const handleChange = (e) => {
            const {
                name,
                value
            } = e.target;

            if (errors[name]) setErrors((prev) => ({ ...prev,
                [name]: ""
            }));

            // Phone Validation: Strips non-numeric inputs immediately
            if (name === "phone") {
                const cleanNumericValue = value.replace(/[^0-9]/g, "");
                let phoneError = "";
                if (cleanNumericValue.length > 20) {
                    phoneError = "Phone number cannot exceed 20 characters.";
                }
                setErrors((prev) => ({ ...prev,
                    phone: phoneError
                }));
                setFormData((prev) => ({ ...prev,
                    [name]: cleanNumericValue
                }));
                return;
            }

            setFormData((prev) => ({ ...prev,
                [name]: value
            }));
        };

        const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (file) setFormData((prev) => ({ ...prev,
                document: file
            }));
        };

        useEffect(() => {
            dispatch(GetVendorData());
        }, [dispatch]);

        // --- Async Submit Handler ---
        const handleSubmit = async (e) => {
            e.preventDefault();
            setErrors({});

            let hasValidationErrors = false;
            let currentErrors = {};

            // Client-side Mandatory Field Validations
            if (!formData.name.trim()) {
                currentErrors.name = "Vendor Name is mandatory.";
                hasValidationErrors = true;
            }
            if (!formData.code.trim()) {
                currentErrors.code = "Vendor Code is mandatory.";
                hasValidationErrors = true;
            }
            if (!formData.email.trim()) {
                currentErrors.email = "Email address is mandatory.";
                hasValidationErrors = true;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                currentErrors.email =
                    "Please enter a valid email format (e.g., name@domain.com).";
                hasValidationErrors = true;
            }
            if (!formData.phone.trim()) {
                currentErrors.phone = "Phone number is mandatory.";
                hasValidationErrors = true;
            }
            if (!formData.gst_no.trim()) {
                currentErrors.gst_no = "GST Number is mandatory.";
                hasValidationErrors = true;
            }

            if (hasValidationErrors) {
                setErrors(currentErrors);

                // Dynamic client message helper mapping
                const firstErrorMessage = Object.values(currentErrors)[0];
                showSnackbar(firstErrorMessage, "error");
                return;
            }

            const payload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== "") {
                    payload.append(key, value);
                }
            });

            try {
                await dispatch(CreateVendorData(payload));

                showSnackbar("Vendor created successfully!", "success");
                setFormData(initialState);
                dispatch(GetVendorData());
            } catch (err) {
                console.error("Submission rejected:", err);

                // 🔥 FIX: Run the catch block through your parsing engine utility cleanly
                const parsedMessage = parseErrorMessage(
                    err.response ? .data || err.message,
                );
                showSnackbar(parsedMessage, "error");

                // Map inline field highlights under the corresponding text field boxes
                if (err.response && typeof err.response.data === "object") {
                    setErrors(err.response.data);
                }
            }
        };

        const handleBulkUpload = (e) => {
            const file = e.target.files[0];
            if (file) {
                dispatch(BulkUploadVendors(file));
                e.target.value = "";
            }
        };

        return ( <
            > { /* Form Section */ } <
            Paper elevation = {
                1
            }
            sx = {
                {
                    p: 3,
                    borderRadius: 2,
                    mt: -2,
                    border: "1px solid #00416A"
                }
            } >
            <
            Grid container sx = {
                {
                    mb: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }
            } >
            <
            Box >
            <
            Typography variant = "h6"
            sx = {
                {
                    fontWeight: 700,
                    color: "#00416A"
                }
            } >
            Supplier Master Form <
            /Typography> <
            Typography sx = {
                {
                    color: "text.secondary"
                }
            } >
            Manage vendor master data
            for turbine installation progress. <
            /Typography> <
            /Box>

            <
            Box sx = {
                {
                    display: "flex",
                    gap: 2
                }
            } >
            <
            Button variant = "outlined"
            onClick = {
                () => dispatch(DownloadVendorTemplate())
            }
            sx = {
                {
                    borderColor: "#00416A",
                    color: "#00416A",
                    textTransform: "none",
                }
            } >
            Download Template <
            /Button> <
            Button variant = "contained"
            component = "label"
            sx = {
                {
                    backgroundColor: "#00416A",
                    textTransform: "none"
                }
            } >
            Bulk Upload <
            input type = "file"
            hidden accept = ".xlsx"
            onChange = {
                handleBulkUpload
            }
            /> <
            /Button> <
            /Box> <
            /Grid>

            <
            Box component = "form"
            onSubmit = {
                handleSubmit
            }
            noValidate >
            <
            Grid container spacing = {
                3
            } >
            <
            Grid item xs = {
                12
            }
            sm = {
                3
            } >
            <
            TextField label = "Vendor Name"
            name = "name"
            fullWidth required value = {
                formData.name
            }
            onChange = {
                handleChange
            }
            InputLabelProps = {
                {
                    shrink: true
                }
            }
            error = {
                Boolean(errors.name)
            }
            /> <
            /Grid> <
            Grid item xs = {
                12
            }
            sm = {
                3
            } >
            <
            TextField label = "Vendor Code"
            name = "code"
            fullWidth required value = {
                formData.code
            }
            onChange = {
                handleChange
            }
            InputLabelProps = {
                {
                    shrink: true
                }
            }

            error = {
                Boolean(errors.code)
            }
            /> <
            /Grid> <
            Grid item xs = {
                12
            }
            sm = {
                3
            } >
            <
            TextField label = "Email"
            name = "email"
            type = "email"
            fullWidth required value = {
                formData.email
            }
            onChange = {
                handleChange
            }
            InputLabelProps = {
                {
                    shrink: true
                }
            }

            error = {
                Boolean(errors.email)
            }
            /> <
            /Grid> <
            Grid item xs = {
                12
            }
            sm = {
                3
            } >
            <
            TextField label = "Phone"
            name = "phone"
            fullWidth required value = {
                formData.phone
            }
            onChange = {
                handleChange
            }
            InputLabelProps = {
                {
                    shrink: true
                }
            }

            error = {
                Boolean(errors.phone)
            }
            /> <
            /Grid>

            <
            Grid item xs = {
                12
            }
            sm = {
                3
            } >
            <
            TextField label = "GST Number"
            name = "gst_no"
            fullWidth required value = {
                formData.gst_no
            }
            onChange = {
                handleChange
            }
            InputLabelProps = {
                {
                    shrink: true
                }
            }

            error = {
                Boolean(errors.gst_no)
            }
            /> <
            /Grid> <
            Grid item xs = {
                12
            }
            sm = {
                3
            } >
            <
            TextField select label = "Vendor Type"
            name = "vendor_type"
            fullWidth value = {
                formData.vendor_type
            }
            onChange = {
                handleChange
            }
            InputLabelProps = {
                {
                    shrink: true
                }
            }

            >
            {
                vendorTypes.map((type) => ( <
                    MenuItem key = {
                        type.value
                    }
                    value = {
                        type.value
                    } > {
                        type.label
                    } <
                    /MenuItem>
                ))
            } <
            /TextField> <
            /Grid> <
            Grid item xs = {
                12
            }
            sm = {
                3
            } >
            <
            TextField label = "Address"
            name = "address"
            fullWidth value = {
                formData.address
            }
            onChange = {
                handleChange
            }
            InputLabelProps = {
                {
                    shrink: true
                }
            }

            multiline rows = {
                1
            }
            /> <
            /Grid> <
            Grid item xs = {
                12
            }
            sm = {
                3
            } >
            <
            Box sx = {
                {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.5
                }
            } >
            <
            Button component = "label"
            variant = "outlined"
            startIcon = { < UploadIcon size = {
                    16
                }
                />}
                // size="small"
                sx = {
                    {
                        color: "#00416A",
                        borderColor: "#00416A"
                    }
                } >
                Upload Document <
                input
                type = "file"
                hidden
                name = "document"
                onChange = {
                    handleFileChange
                }
                /> <
                /Button> {
                    formData.document && ( <
                        Typography variant = "caption"
                        color = "success.main"
                        fontWeight = {
                            600
                        } >
                        {
                            formData.document.name.slice(0, 15)
                        }...
                        <
                        /Typography>
                    )
                } <
                /Box> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                textAlign = "center"
                mt = {
                    1
                } >
                <
                Button
                type = "submit"
                variant = "contained"
                sx = {
                    {
                        background: "#00416A",
                        textTransform: "none",
                        px: 4
                    }
                }
                disabled = {
                    loading
                } >
                {
                    loading ? "Submitting..." : "Submit Vendor"
                } <
                /Button> <
                /Grid> <
                /Grid> <
                /Box> <
                /Paper>

                { /* List Section */ } <
                Paper sx = {
                    {
                        p: 3,
                        borderRadius: 2,
                        border: "1px solid #00416A",
                        mt: 4
                    }
                } >
                <
                Box
                sx = {
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
                Supplier List <
                /Typography>

                <
                TextField
                size = "small"
                placeholder = "Search by Name, Code, or Email..."
                value = {
                    searchTerm
                }
                onChange = {
                    handleSearchChange
                }
                sx = {
                    {
                        width: "350px"
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
                            color = "#666" / >
                            <
                            /InputAdornment>
                        ),
                    }
                }
                /> <
                /Box>

                <
                TableContainer component = {
                    Paper
                }
                elevation = {
                    1
                } >
                <
                Table size = "small" >
                <
                TableHead sx = {
                    {
                        backgroundColor: "#0f52ba"
                    }
                } >
                <
                TableRow > {
                    [
                        "Name",
                        "Code",
                        "Phone",
                        "Email",
                        "Type",
                        "GST No",
                        "Address",
                    ].map((header) => ( <
                        TableCell key = {
                            header
                        }
                        sx = {
                            {
                                fontWeight: 700,
                                color: "#fff"
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
                    visibleVendors.length > 0 ? (
                        visibleVendors.map((vendor, index) => ( <
                            TableRow key = {
                                index
                            }
                            hover >
                            <
                            TableCell > {
                                vendor.name || "-"
                            } < /TableCell> <
                            TableCell > {
                                vendor.code || "-"
                            } < /TableCell> <
                            TableCell > {
                                vendor.phone || "-"
                            } < /TableCell> <
                            TableCell > {
                                vendor.email || "-"
                            } < /TableCell> <
                            TableCell > {
                                vendor.vendor_type || "Supplier"
                            } < /TableCell> <
                            TableCell > {
                                vendor.gst_no || "-"
                            } < /TableCell> <
                            TableCell > {
                                vendor.address || "-"
                            } < /TableCell> <
                            /TableRow>
                        ))
                    ) : ( <
                        TableRow >
                        <
                        TableCell colSpan = {
                            7
                        }
                        align = "center"
                        sx = {
                            {
                                py: 3,
                                color: "text.secondary"
                            }
                        } >
                        {
                            searchTerm ?
                            "No results found for your search." :
                                "No vendors available."
                        } <
                        /TableCell> <
                        /TableRow>
                    )
                } <
                /TableBody> <
                /Table> <
                /TableContainer>

                <
                TablePagination
                rowsPerPageOptions = {
                    [5, 10, 25]
                }
                component = "div"
                count = {
                    filteredVendors.length
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

                <
                CustomSnackbar
                open = {
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
                />
            );
        };

        export default VendorMasterForm;