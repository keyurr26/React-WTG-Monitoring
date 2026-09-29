import React, {
    useState,
    useCallback,
    useEffect
} from "react";
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Grid,
    Paper,
    Typography,
    Stack,
} from "@mui/material";
import CustomSnackbar from "../../../components/comman/CustomSnackbar";
import {
    useDispatch,
    useSelector
} from "react-redux";
import DocumentAttachmentDialog from "../../MultipleDocumentUpload/DocumentAttachmentDialog";
import {
    postContractor,
    updateContractor,
    GetAttachmentMasterData
} from "../../../Redux/MasterData/masterAction";
import ContractorTable from "../tables/contractorTable";

const ContractorForm = () => {
    const dispatch = useDispatch();
    const {
        attachmentList,
        documentList
    } = useSelector(
        (state) => state.masterData || {},
    );
    const intialState = {
        firm_name: "",
        contact_person: "",
        address: "",
        phone: "",
        email: "",
        gst_number_con: "",
        contractor_type: "civil",
        agreement_number: "",
        scope_of_work: "",
    };

    const [formData, setFormData] = useState(intialState);
    const [errors, setErrors] = useState({});
    const [editId, setEditId] = useState(null);

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

    useEffect(() => {
        dispatch(GetAttachmentMasterData({
            activity: "CONTRACTOR"
        }));

    }, [dispatch])

    const contractorTypes = [{
            label: "Civil",
            value: "civil"
        },
        {
            label: "Electrical",
            value: "electrical"
        },
        {
            label: "Mechanical",
            value: "mechanical"
        },
        {
            label: "Other",
            value: "other"
        },
    ];

    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;

        if (errors[name]) {
            setErrors((prev) => ({ ...prev,
                [name]: ""
            }));
        }

        if (name === "phone") {
            const cleanNumericValue = value.replace(/[^0-9+\s-]/g, "");
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

    const handleDocumentDataChange = (field, value) => {
        // If the dialog returns a standard event object or manual field/value pair
        if (field && field.target) {
            handleChange(field);
            return;
        }

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    // Catch incoming row selection from Table callback and populate workspace fields
    const handleEditClick = useCallback((row) => {
        setEditId(row.id);
        setErrors({});
        setFormData({
            firm_name: row.firm_name || "",
            contact_person: row.contact_person || "",
            address: row.address || "",
            phone: row.phone || "",
            email: row.email || "",
            // Handles field mapping variant safety if your backend uses gst_no or agreement_no keys
            gst_number_con: row.gst_number_con || row.gst_no || "",
            contractor_type: row.contractor_type || "civil",
            agreement_number: row.agreement_number || row.agreement_no || "",
            scope_of_work: row.scope_of_work || "",
        });

        // Smooth-scroll focus back to top of the form layout viewport
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, []);

    // 🔥 Clear modifications and exit edit mode seamlessly
    const handleCancelEdit = () => {
        setEditId(null);
        setErrors({});
        setFormData(intialState);
        showSnackbar("Edit mode cancelled.", "info");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        let hasValidationErrors = false;
        let currentErrors = {};

        if (!formData.firm_name.trim()) {
            currentErrors.firm_name = "Firm Name is strictly mandatory.";
            hasValidationErrors = true;
        }
        if (!formData.phone.trim()) {
            currentErrors.phone = "Phone number is strictly mandatory.";
            hasValidationErrors = true;
        }
        if (!formData.gst_number_con.trim()) {
            currentErrors.gst_number_con = "GST Number is strictly mandatory.";
            hasValidationErrors = true;
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            currentErrors.email =
                "Please present a valid structural email formatting structure.";
            hasValidationErrors = true;
        }

        if (hasValidationErrors) {
            setErrors(currentErrors);
            showSnackbar("Please fill out all mandatory inputs correctly.", "error");
            return;
        }

        try {
            if (editId) {
                // 🔥 UPDATE BRANCH: Runs if an editId tracking reference exists
                // Remap keys to match what your backend model fields expect (e.g. gst_no, agreement_no)
                const updatePayload = {
                    ...formData,
                    id: editId,
                    gst_no: formData.gst_number_con,
                    agreement_no: formData.agreement_number,
                };
                await dispatch(updateContractor(editId, updatePayload));
                showSnackbar(
                    "Contractor instance record successfully updated!",
                    "success",
                );
                setEditId(null);
            } else {
                // ➕ CREATE BRANCH: Fallback option if editId is null
                await dispatch(postContractor(formData));
                showSnackbar(
                    "Contractor instance record successfully created!",
                    "success",
                );
            }

            setFormData(intialState);
        } catch (err) {
            console.error("Action Catch Interceptor:", err);

            if (err.response && typeof err.response.data === "object") {
                const serverErrors = {};
                Object.keys(err.response.data).forEach((field) => {
                    const messages = err.response.data[field];
                    serverErrors[field] = Array.isArray(messages) ?
                        messages[0] :
                        messages;
                });
                setErrors(serverErrors);
                showSnackbar(
                    "Server validation rejected submitted dataset parameters.",
                    "error",
                );
            } else {
                showSnackbar(
                    err.message || "An unexpected processing error occurred.",
                    "error",
                );
            }
        }
    };

    return ( <
        >
        <
        Paper elevation = {
            1
        }
        sx = {
            {
                p: 3,
                borderRadius: 2,
                mt: -2,
                border: "1px solid #00416A",
            }
        } >
        { /* Dynamic Title Headers changing contextually based on editId presence */ } <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A",
                mt: 0.5
            }
        } >
        {
            editId ?
            "Modify Contractor Master Details" :
                "Create New Contractor"
        } <
        /Typography> <
        Typography sx = {
            {
                color: "text.secondary",
                mb: 3
            }
        } > {
            editId ?
            "Updating changes live into operational project modules. Fields must remain parameter compliant." :
                "Create and manage contractor master data for turbine installation progress."
        } <
        /Typography>

        <
        Box component = "form"
        onSubmit = {
            handleSubmit
        }
        noValidate >
        <
        Grid container spacing = {
            2
        } >
        <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField label = "Firm Name"
        name = "firm_name"
        value = {
            formData.firm_name
        }
        onChange = {
            handleChange
        }
        placeholder = "Ex: Global Wind Infrastructure Ltd."
        InputLabelProps = {
            {
                shrink: true
            }
        }
        fullWidth required error = {
            Boolean(errors.firm_name)
        }
        helperText = {
            errors.firm_name
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
        TextField label = "Contact Person"
        name = "contact_person"
        value = {
            formData.contact_person
        }
        onChange = {
            handleChange
        }
        placeholder = "Ex: Michael Anderson"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        fullWidth /
        >
        <
        /Grid>

        <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField label = "Phone"
        name = "phone"
        value = {
            formData.phone
        }
        onChange = {
            handleChange
        }
        placeholder = "Ex: +14155552671"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        fullWidth required error = {
            Boolean(errors.phone)
        }
        helperText = {
            errors.phone
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
        TextField label = "Email"
        name = "email"
        value = {
            formData.email
        }
        onChange = {
            handleChange
        }
        placeholder = "Ex: operations@globalwindinfra.com"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        fullWidth type = "email"
        error = {
            Boolean(errors.email)
        }
        helperText = {
            errors.email
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
        TextField select label = "Contractor Type"
        name = "contractor_type"
        value = {
            formData.contractor_type
        }
        onChange = {
            handleChange
        }
        InputLabelProps = {
            {
                shrink: true
            }
        }
        fullWidth >
        {
            contractorTypes.map((type) => ( <
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
        /Grid>

        <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField label = "Agreement Number"
        name = "agreement_number"
        value = {
            formData.agreement_number
        }
        onChange = {
            handleChange
        }
        placeholder = "Ex: GW-CTR-2025-001"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        fullWidth /
        >
        <
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
        name = "gst_number_con"
        value = {
            formData.gst_number_con
        }
        onChange = {
            handleChange
        }
        placeholder = "Ex: 22AAAAA1111A1Z1"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        fullWidth required error = {
            Boolean(errors.gst_number_con)
        }
        helperText = {
            errors.gst_number_con
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
        TextField label = "Scope of Work"
        name = "scope_of_work"
        value = {
            formData.scope_of_work
        }
        onChange = {
            handleChange
        }
        placeholder = "Ex: General installation tasks..."
        InputLabelProps = {
            {
                shrink: true
            }
        }
        fullWidth rows = {
            2
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        } >
        <
        TextField label = "Address"
        name = "address"
        value = {
            formData.address
        }
        onChange = {
            handleChange
        }
        placeholder = "Ex: 1200 Energy Park Drive, Houston, TX 77002, USA"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        fullWidth multiline rows = {
            1
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            8
        } > { /* REUSABLE POPUP COMPONENT */ } <
        DocumentAttachmentDialog activityCode = "CONTRACTOR"
        attachmentMasterList = {
            attachmentList
        }
        formData = {
            formData
        }
        onDataChange = {
            handleDocumentDataChange
        }
        // mainFormDate={formData.date_of_sampling}
        /> <
        /Grid>

        { /* Action Buttons: Switches between Submit and Save/Cancel view dynamically */ } <
        Grid item xs = {
            12
        } >
        <
        Stack direction = "row"
        spacing = {
            2
        }
        justifyContent = "center"
        sx = {
            {
                mt: 1
            }
        } >
        <
        Button variant = "contained"
        type = "submit"
        size = "small"
        sx = {
            {
                background: "#00416A",
                textTransform: "none",
                px: 4
            }
        } >
        {
            editId ? "Update Contractor" : "Submit"
        } <
        /Button>

        {
            editId && ( <
                Button variant = "outlined"
                color = "inherit"
                size = "small"
                onClick = {
                    handleCancelEdit
                }
                sx = {
                    {
                        textTransform: "none",
                        px: 3
                    }
                } >
                Cancel <
                /Button>
            )
        } <
        /Stack> <
        /Grid> <
        /Grid> <
        /Box> <
        /Paper>

        <
        Box sx = {
            {
                mt: 4,
                borderRadius: 3,
                background: "#fff",
                boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
            }
        } >
        { /* 🔥 Hook up the handleEditClick callback prop to table actions */ } <
        ContractorTable onEdit = {
            handleEditClick
        }
        /> <
        /Box>

        <
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
        />
    );
};

export default ContractorForm;