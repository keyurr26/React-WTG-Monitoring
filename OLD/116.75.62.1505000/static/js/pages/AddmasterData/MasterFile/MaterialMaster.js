import React, {
    useState,
    useEffect,
    useCallback
} from "react";
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Typography,
    Paper,
    FormControlLabel,
    Radio,
    RadioGroup,
    FormLabel,
    Autocomplete,
} from "@mui/material";
import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    CreateMaterialMasterData,
    GetMaterialMasterData,
    DownloadMaterialTemplate,
    BulkUploadMaterial,
    GetWTGMakeModelData,
    GetComponentTypesList,
} from "../../../Redux/MasterData/masterAction";

import CustomSnackbar from "../../../components/comman/CustomSnackbar";
import MaterialMasterTable from "../tables/materialMasterTable";
import parseErrorMessage from "../../../utils/errorFunction";

const categories = ["Electrical", "Mechanical", "Civil", "Other"];
const types = ["Capital Spare", "Consumable", "Equipment"];
const unitsOfMeasure = ["Nos", "KG", "Meter", "Litre", "Set", "PCS"];

const MaterialMaster = () => {
        const dispatch = useDispatch();
        const {
            GETmaterialMaster = [],
                WTGMakeModelData = [],
                componentTypesList = [],
        } = useSelector((state) => state.masterData || "");

        const intialState = {
            name: "",
            category: "",
            material_type: "",
            budget_cost: "",
            manufacturer: "",
            model: [],
            model_per_oem: "",
            part_code: "",
            inspection_report: null,
            component_type: "",
            unit_of_measure: "",
            material_code: "",
            warranty_applicable: false,
            shelf_life_applicable: false,
        };

        const [formData, setFormData] = useState(intialState);
        const [errors, setErrors] = useState({});
        const [loading, setLoading] = useState(false); // 🔄 Added loading state

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

        useEffect(() => {
            dispatch(GetMaterialMasterData());
            dispatch(GetWTGMakeModelData());
            dispatch(GetComponentTypesList());
        }, [dispatch]);

        // Auto generate material code based on manufacturer, category & model_per_oem
        useEffect(() => {
            const {
                manufacturer,
                category,
                model_per_oem
            } = formData;

            if (!manufacturer || !category || !model_per_oem) return;

            const manufacturerPrefix = manufacturer.substring(0, 3).toUpperCase();
            const categoryPrefix = category.substring(0, 1).toUpperCase();
            const prefix = `${manufacturerPrefix}${categoryPrefix}`;

            const matchedMaterials = GETmaterialMaster.filter(
                (m) =>
                m.material_code ? .startsWith(prefix) &&
                m.manufacturer === manufacturer &&
                m.category === category
            );

            const existingSameOEM = matchedMaterials.find(
                (m) => m.model_per_oem === model_per_oem
            );

            if (existingSameOEM) {
                setFormData((prev) => ({
                    ...prev,
                    material_code: existingSameOEM.material_code,
                }));
                return;
            }

            let lastNumber = 0;
            matchedMaterials.forEach((m) => {
                const match = m.material_code ? .match(/\d+$/);
                if (match) {
                    lastNumber = Math.max(lastNumber, parseInt(match[0]));
                }
            });

            const nextCode = `${prefix}${String(lastNumber + 1).padStart(4, "0")}`;
            setFormData((prev) => ({ ...prev,
                material_code: nextCode
            }));
        }, [
            formData.manufacturer,
            formData.category,
            formData.model_per_oem,
            GETmaterialMaster,
        ]);

        const filteredComponentTypes = componentTypesList
            .filter((item) => item.type === "Material Type")
            .filter((item) => !formData.category || item.category === formData.category)
            .reduce((acc, current) => {
                const x = acc.find((item) => item.name === current.name);
                if (!x) return acc.concat([current]);
                return acc;
            }, []);

        const handleChange = (e) => {
            const {
                name,
                value,
                type,
                files
            } = e.target;
            if (errors[name]) setErrors((prev) => ({ ...prev,
                [name]: ""
            }));

            setFormData((prev) => ({
                ...prev,
                [name]: type === "file" ? files[0] : value,
            }));
        };

        // --- Async Submit Handler with Loading Guard ---
        const handleSubmit = async (e) => {
            e.preventDefault();
            setErrors({});

            let hasValidationErrors = false;
            let currentErrors = {};

            if (!formData.name.trim()) {
                currentErrors.name = "Material Name is required.";
                hasValidationErrors = true;
            }
            if (!formData.category) {
                currentErrors.category = "Category selection is required.";
                hasValidationErrors = true;
            }
            if (!formData.material_type) {
                currentErrors.material_type = "Material Type selection is required.";
                hasValidationErrors = true;
            }
            if (!String(formData.budget_cost).trim()) {
                currentErrors.budget_cost = "Budget cost tracking parameter is required.";
                hasValidationErrors = true;
            }
            if (!formData.manufacturer.trim()) {
                currentErrors.manufacturer = "Manufacturer Make is required.";
                hasValidationErrors = true;
            }
            if (!formData.model_per_oem.trim()) {
                currentErrors.model_per_oem = "OEM Model tracking code reference is required.";
                hasValidationErrors = true;
            }
            if (!formData.component_type) {
                currentErrors.component_type = "Consumption Assembly is required.";
                hasValidationErrors = true;
            }
            if (!formData.unit_of_measure) {
                currentErrors.unit_of_measure = "Unit of Measure is required.";
                hasValidationErrors = true;
            }

            if (hasValidationErrors) {
                setErrors(currentErrors);
                const firstMsg = Object.values(currentErrors)[0];
                showSnackbar(firstMsg, "error");
                return;
            }

            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== "") {
                    data.append(key, Array.isArray(value) ? value.join(", ") : value);
                }
            });

            setLoading(true); // 🔄 Enable Loader
            try {
                await dispatch(CreateMaterialMasterData(data));
                dispatch(GetMaterialMasterData());
                setFormData(intialState);
                showSnackbar("Material saved successfully!", "success");
            } catch (error) {
                const serverAlert = parseErrorMessage(error.response ? .data || error);
                showSnackbar(serverAlert, "error");
                if (error.response ? .data && typeof error.response.data === "object") {
                    setErrors(error.response.data);
                }
            } finally {
                setLoading(false); // 🔄 Disable Loader
            }
        };

        // --- Bulk Upload Handler with Loading Guard ---
        const handleBulkUpload = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setLoading(true); // 🔄 Enable Loader
            try {
                const response = await dispatch(BulkUploadMaterial(file));
                dispatch(GetMaterialMasterData());
                showSnackbar("Bulk data processed successfully!", "success");
            } catch (error) {
                const serverAlert = parseErrorMessage(error.response ? .data || error);
                showSnackbar(serverAlert, "error");
            } finally {
                setLoading(false); // 🔄 Disable Loader
                e.target.value = null; // Clear file input
            }
        };

        const fields = [{
                label: "Material Name",
                key: "name",
                type: "text",
                required: true
            },
            {
                label: "Category",
                key: "category",
                type: "select",
                options: categories,
                required: true
            },
            {
                label: "Type",
                key: "material_type",
                type: "select",
                options: types,
                required: true
            },
            {
                label: "Material Cost",
                key: "budget_cost",
                type: "number",
                required: true
            },
            {
                label: "Make",
                key: "manufacturer",
                type: "text",
                required: true
            },
            {
                label: "Model As Per OEM",
                key: "model_per_oem",
                type: "text",
                required: true
            },
            {
                label: "Consumption Assembly",
                key: "component_type",
                type: "select",
                options: filteredComponentTypes,
                required: true
            },
            {
                label: "Unit of Measure",
                key: "unit_of_measure",
                type: "select",
                options: unitsOfMeasure,
                required: true
            },
            {
                label: "Material Code",
                key: "material_code",
                type: "text",
                readOnly: true
            },
            {
                label: "OEM Part Code",
                key: "part_code",
                type: "text"
            },
        ];

        const placeholders = {
            name: "Ex: Tower Base Flange Bolt Mcbc36",
            category: "Select material category",
            material_type: "Select material type",
            budget_cost: "Ex: 1250.00",
            manufacturer: "Ex: Global Wind Systems",
            model_per_oem: "Ex: GWS-TB-2026",
            component_type: "Ex: Select component type",
            unit_of_measure: "Ex: kg, m, pcs",
            material_code: "Auto-generated material code",
            part_code: "Enter OEM part number (e.g., PRT-4587-A)",
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
                        mt: -2,
                        borderRadius: 2,
                        backdropFilter: "blur(10px)",
                        background: "rgba(255, 255, 255, 0.75)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                        transition: "0.3s",
                        border: "1px solid #00416A",
                        position: "relative",
                        "&:hover": {
                            boxShadow: "0 12px 45px rgba(0,0,0,0.14)"
                        },
                    }
                } >
                { /* 🔄 Loading Overlay banner or visual note */ } {
                    loading && ( <
                        Box sx = {
                            {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(255, 255, 255, 0.6)",
                                zIndex: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 2,
                            }
                        } >
                        <
                        Typography variant = "h6"
                        sx = {
                            {
                                color: "#00416A",
                                fontWeight: 600
                            }
                        } >
                        Processing request, please wait...
                        <
                        /Typography> <
                        /Box>
                    )
                }

                <
                Typography variant = "h6"
                sx = {
                    {
                        fontWeight: 700,
                        color: "#00416A",
                        mt: 1
                    }
                } >
                Create New Material <
                /Typography> <
                Typography sx = {
                    {
                        color: "text.secondary",
                        mb: 3
                    }
                } >
                Define and organize material master data
                for your windfarm inventory. <
                /Typography>

                { /* Upload Action Row */ } <
                Box display = "flex"
                justifyContent = "right"
                gap = {
                    2
                }
                mb = {
                    2
                } >
                <
                label htmlFor = "bulk-upload-input" >
                <
                Button variant = "contained"
                component = "span"
                disabled = {
                    loading
                }
                sx = {
                    {
                        background: "#00416A",
                        color: "#fff",
                        textTransform: "none"
                    }
                } >
                Bulk Upload Excel <
                /Button> <
                /label>

                <
                input id = "bulk-upload-input"
                type = "file"
                accept = ".xlsx"
                hidden onChange = {
                    handleBulkUpload
                }
                />

                <
                Button variant = "outlined"
                disabled = {
                    loading
                }
                sx = {
                    {
                        borderColor: "#00416A",
                        color: "#00416A",
                        textTransform: "none"
                    }
                }
                onClick = {
                    () => dispatch(DownloadMaterialTemplate())
                } >
                Download Template <
                /Button> <
                /Box>

                { /* Configuration Core Fields Grid */ } <
                Box component = "form"
                onSubmit = {
                    handleSubmit
                }
                noValidate >
                <
                Grid container spacing = {
                    2
                } > {
                    fields.map((field) => ( <
                        Grid item xs = {
                            12
                        }
                        sm = {
                            3
                        }
                        key = {
                            field.key
                        } > {
                            field.type === "select" ? ( <
                                TextField select name = {
                                    field.key
                                }
                                label = {
                                    field.label
                                }
                                fullWidth disabled = {
                                    loading
                                }
                                required = {
                                    field.required
                                }
                                value = {
                                    formData[field.key]
                                }
                                onChange = {
                                    handleChange
                                }
                                InputLabelProps = {
                                    {
                                        shrink: true
                                    }
                                }
                                SelectProps = {
                                    {
                                        displayEmpty: true
                                    }
                                }
                                size = "small"
                                error = {
                                    Boolean(errors[field.key])
                                }
                                helperText = {
                                    errors[field.key] ? .[0] || errors[field.key]
                                } >
                                <
                                MenuItem value = "" >
                                --{
                                    placeholders[field.key]
                                }--
                                <
                                /MenuItem> {
                                    field.options.map((option) => {
                                        const isObj = typeof option === "object" && option !== null;
                                        const val = isObj ? option.name : option;
                                        const label = isObj ? option.name : option;
                                        return ( <
                                            MenuItem key = {
                                                label
                                            }
                                            value = {
                                                val
                                            } > {
                                                label
                                            } <
                                            /MenuItem>
                                        );
                                    })
                                } <
                                /TextField>
                            ) : ( <
                                TextField name = {
                                    field.key
                                }
                                label = {
                                    field.label
                                }
                                type = {
                                    field.type
                                }
                                fullWidth disabled = {
                                    loading
                                }
                                required = {
                                    field.required
                                }
                                value = {
                                    formData[field.key]
                                }
                                onChange = {
                                    handleChange
                                }
                                placeholder = {
                                    placeholders[field.key]
                                }
                                InputLabelProps = {
                                    {
                                        shrink: true
                                    }
                                }
                                size = "small"
                                error = {
                                    Boolean(errors[field.key])
                                }
                                helperText = {
                                    errors[field.key] ? .[0] || errors[field.key]
                                }
                                InputProps = {
                                    {
                                        readOnly: field.readOnly || false,
                                    }
                                }
                                />
                            )
                        } <
                        /Grid>
                    ))
                }

                { /* WTG Model Field Selector */ } <
                Grid item xs = {
                    12
                }
                sm = {
                    3
                } >
                <
                Autocomplete multiple disabled = {
                    loading
                }
                options = {
                    WTGMakeModelData.map((item) => item.wtg_model)
                }
                value = {
                    formData.model || []
                }
                onChange = {
                    (e, newValue) =>
                    setFormData({ ...formData,
                        model: newValue
                    })
                }
                renderInput = {
                    (params) => ( <
                        TextField { ...params
                        }
                        label = "WTG Model(s)"
                        fullWidth size = "small"
                        InputLabelProps = {
                            {
                                shrink: true
                            }
                        }
                        />
                    )
                }
                /> <
                /Grid>

                { /* Document Specification Field */ } <
                Grid item xs = {
                    12
                }
                sm = {
                    3
                } >
                <
                Box sx = {
                    {
                        mt: 0.5
                    }
                } >
                <
                Button variant = "outlined"
                component = "label"
                fullWidth size = "small"
                disabled = {
                    loading
                }
                sx = {
                    {
                        color: "#00416A",
                        borderColor: "#00416A",
                        height: "40px"
                    }
                } >
                Upload Specification <
                input type = "file"
                name = "inspection_report"
                hidden onChange = {
                    handleChange
                }
                /> <
                /Button> {
                    formData.inspection_report && ( <
                        Typography variant = "caption"
                        color = "success.main"
                        display = "block"
                        mt = {
                            0.5
                        }
                        fontWeight = {
                            600
                        } >
                        Selected: {
                            formData.inspection_report.name.slice(0, 20)
                        }...
                        <
                        /Typography>
                    )
                } <
                /Box> <
                /Grid>

                { /* Radio Operational Selectors */ } <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                } >
                <
                FormLabel sx = {
                    {
                        fontWeight: 600,
                        fontSize: "14px"
                    }
                } > Warranty < /FormLabel> <
                RadioGroup row value = {
                    formData.warranty_applicable ? "yes" : "no"
                }
                onChange = {
                    (e) =>
                    setFormData({
                        ...formData,
                        warranty_applicable: e.target.value === "yes",
                    })
                } >
                <
                FormControlLabel value = "yes"
                disabled = {
                    loading
                }
                control = { < Radio size = "small" / >
                }
                label = { < Typography variant = "body2" > Applicable < /Typography>} / >
                    <
                    FormControlLabel value = "no"
                    disabled = {
                        loading
                    }
                    control = { < Radio size = "small" / >
                    }
                    label = { < Typography variant = "body2" > Not Applicable < /Typography>} / >
                        <
                        /RadioGroup> <
                        /Grid>

                        <
                        Grid item xs = {
                            12
                        }
                        sm = {
                            6
                        } >
                        <
                        FormLabel sx = {
                            {
                                fontWeight: 600,
                                fontSize: "14px"
                            }
                        } > Shelf Life < /FormLabel> <
                        RadioGroup
                        row
                        value = {
                            formData.shelf_life_applicable ? "yes" : "no"
                        }
                        onChange = {
                            (e) =>
                            setFormData({
                                ...formData,
                                shelf_life_applicable: e.target.value === "yes",
                            })
                        } >
                        <
                        FormControlLabel value = "yes"
                        disabled = {
                            loading
                        }
                        control = { < Radio size = "small" / >
                        }
                        label = { < Typography variant = "body2" > Applicable < /Typography>} / >
                            <
                            FormControlLabel value = "no"
                            disabled = {
                                loading
                            }
                            control = { < Radio size = "small" / >
                            }
                            label = { < Typography variant = "body2" > Not Applicable < /Typography>} / >
                                <
                                /RadioGroup> <
                                /Grid>

                                { /* Submission Action Anchor */ } <
                                Grid item xs = {
                                    12
                                }
                                textAlign = "center" >
                                <
                                Button
                                type = "submit"
                                variant = "contained"
                                size = "small"
                                disabled = {
                                    loading
                                }
                                sx = {
                                    {
                                        background: "#00416A",
                                        textTransform: "none",
                                        px: 4
                                    }
                                } >
                                {
                                    loading ? "Saving..." : "Save Material"
                                } <
                                /Button> <
                                /Grid> <
                                /Grid> <
                                /Box> <
                                /Paper>

                                <
                                MaterialMasterTable materials = {
                                    GETmaterialMaster
                                }
                                />

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

                        export default MaterialMaster;