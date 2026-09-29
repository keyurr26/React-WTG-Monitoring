import React, {
    useState,
    useEffect
} from 'react';
import {
    Box,
    Button,
    Grid,
    MenuItem,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import MaterialReceivedTable from './materialReceivedTable';
import {
    GetMaterialMasterData,
    CreateMaterialRecivedData,
    GetVendorData
} from '../../Redux/MasterData/masterAction';
import {
    yardOptions
} from '../../constants/choices';
import NumberTextField from '../../components/comman/NumberTextField';

// Color Scheme
const COLORS = {
    primary: "#00416a",
    secondary: "#E57A28",
    lightBlue: "#e6f2ff",
    cardBg: "#ffffff",
    textLight: "#6c757d",
    border: "#e0e0e0"
};

const storageMethods = ['Open yard', 'Covered'];
const conditionOptions = ['Passed', 'Failed'];

const MaterialReceivedForm = ({
    project,
    windfarm
}) => {
    const dispatch = useDispatch();
    const {
        GETmaterialMaster,
        vendorData = []
    } = useSelector((state) => state.masterData || {});

    const [formData, setFormData] = useState({
        material: '',
        project: project || "",
        windfarm: windfarm || "",
        supplier_name: '',
        storage_location: '',
        storage_method: '',
        condition_on_arrival: '',
        received_by: '',
        dispatch_date: '',
        received_date: '',
        quantity: '',
        invoice_number: '',
        // rebar_diameter: '',
        grn_entry: '',
        // steel_grade: '',
        sr_no: '',
        warranty_date: '',
        expiry_date: '',
        document: null
    });

    // Fetch data
    useEffect(() => {
        dispatch(GetMaterialMasterData());
        dispatch(GetVendorData());
    }, [dispatch]);

    // Set project/windfarm
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            project: project,
            windfarm: windfarm
        }));
    }, [project, windfarm]);

    // Material selection
    const selectedMaterial = GETmaterialMaster ? .find((m) => m.id === formData.material);
    const uniqueMaterials = GETmaterialMaster ? .filter(
        (material, index, self) =>
        index === self.findIndex((m) => m.material_code === material.material_code)
    );

    // Auto-clear warranty fields
    useEffect(() => {
        if (selectedMaterial && !selectedMaterial.warranty_applicable) {
            setFormData(prev => ({
                ...prev,
                warranty_date: '',
                expiry_date: '',
            }));
        }
    }, [selectedMaterial]);

    // Handlers
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            document: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!project || !windfarm) {
            alert("Please select Project and Windfarm from Inventory Management screen.");
            return;
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== "") {
                formDataToSend.append(key, formData[key]);
            }
        }

        try {
            const response = await dispatch(CreateMaterialRecivedData(formDataToSend));
            // const newGRN = response?.payload?.grn_entry;

            // if (newGRN) {
            //   setFormData(prev => ({ ...prev, grn_entry: newGRN }));
            // }

            alert("Material received data submitted!");

            // Reset form
            setFormData({
                material: '',
                project: project,
                windfarm: windfarm,
                supplier_name: '',
                storage_location: '',
                storage_method: '',
                condition_on_arrival: '',
                received_by: '',
                dispatch_date: '',
                received_date: '',
                quantity: '',
                invoice_number: '',

                grn_entry: '',

                sr_no: '',
                warranty_date: '',
                expiry_date: '',
                document: null
            });

        } catch (err) {
            console.error(err);
            alert("Submission failed.");
        }
    };

    return ( <
        >
        <
        Paper elevation = {
            1
        }

        >

        { /* Form Content */ } <
        Box sx = {
            {
                p: 3
            }
        } >
        <
        Typography variant = "subtitle1"
        sx = {
            {
                fontWeight: 600,
                color: COLORS.primary,
                mb: 3
            }
        } >
        Create, organize, and manage detailed material records <
        /Typography>

        <
        Box component = "form"
        onSubmit = {
            handleSubmit
        } >
        <
        Grid container spacing = {
            2
        } > { /* Material & Supplier */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField select fullWidth size = "small"
        label = "Material"
        name = "material"
        value = {
            formData.material
        }
        onChange = {
            handleChange
        }
        required sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white"
                }
            }
        } >
        {
            uniqueMaterials ? .map((m) => ( <
                MenuItem key = {
                    m.id
                }
                value = {
                    m.id
                } > {
                    m.name
                }({
                    m.material_code
                }) <
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
            6
        } >
        <
        TextField select fullWidth size = "small"
        label = "Supplier Name"
        name = "supplier_name"
        value = {
            formData.supplier_name
        }
        onChange = {
            handleChange
        }
        required sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white"
                }
            }
        } >
        {
            vendorData.map((s) => ( <
                MenuItem key = {
                    s.id
                }
                value = {
                    s.id
                } > {
                    s.name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Dates */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth size = "small"
        label = "Dispatch Date"
        name = "dispatch_date"
        type = "date"
        value = {
            formData.dispatch_date
        }
        onChange = {
            handleChange
        }
        InputLabelProps = {
            {
                shrink: true
            }
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white"
                }
            }
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth size = "small"
        label = "Received Date"
        name = "received_date"
        type = "date"
        value = {
            formData.received_date
        }
        onChange = {
            handleChange
        }
        InputLabelProps = {
            {
                shrink: true
            }
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white"
                }
            }
        }
        /> <
        /Grid>

        { /* GRN & Basic Fields */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth size = "small"
        label = "GRN Entry"
        name = "grn_entry"
        value = {
            formData.grn_entry || ''
        }
        onChange = {
            handleChange
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#f5f5f5"
                }
            }
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField select fullWidth size = "small"
        label = "Storage Method"
        name = "storage_method"
        value = {
            formData.storage_method
        }
        onChange = {
            handleChange
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white"
                }
            }
        } >
        {
            storageMethods.map((opt) => ( <
                MenuItem key = {
                    opt
                }
                value = {
                    opt
                } > {
                    opt
                } < /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Condition & Received By */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField select fullWidth size = "small"
        label = "Condition on Arrival"
        name = "condition_on_arrival"
        value = {
            formData.condition_on_arrival
        }
        onChange = {
            handleChange
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white"
                }
            }
        } >
        {
            conditionOptions.map((opt) => ( <
                MenuItem key = {
                    opt
                }
                value = {
                    opt
                } > {
                    opt
                } < /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth size = "small"
        label = "Received By"
        name = "received_by"
        value = {
            formData.received_by
        }
        onChange = {
            handleChange
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white"
                }
            }
        }
        /> <
        /Grid>

        { /* Quantity & Invoice */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        NumberTextField fullWidth size = "small"
        label = "Quantity"
        name = "quantity"
        type = "number"
        value = {
            formData.quantity
        }
        onChange = {
            handleChange
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white"
                }
            }
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth size = "small"
        label = "Invoice Number/ DC No."
        name = "invoice_number"
        value = {
            formData.invoice_number
        }
        onChange = {
            handleChange
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white"
                }
            }
        }
        /> <
        /Grid>

        { /* Rebar & Steel Grade */ } {
            /* <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Rebar Diameter"
                              name="rebar_diameter"
                              value={formData.rebar_diameter}
                              onChange={handleChange}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  backgroundColor: "white"
                                }
                              }}
                            />
                          </Grid> */
        }

        {
            /* <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Steel Grade"
                              name="steel_grade"
                              value={formData.steel_grade}
                              onChange={handleChange}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "8px",
                                  backgroundColor: "white"
                                }
                              }}
                            />
                          </Grid> */
        }

        { /* Serial Number */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth size = "small"
        // label="Material Sr. No"
        label = {
            selectedMaterial ? .material_type !== "Capital Spare" ?
            "Batch No." :
            "Material Sr. No"
        }
        name = "sr_no"
        value = {
            formData.sr_no
        }
        onChange = {
            handleChange
        }
        // disabled={selectedMaterial && selectedMaterial.material_type !== "Capital Spare"}
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white"
                }
            }
        }
        /> <
        /Grid>

        { /* Warranty Date */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth size = "small"
        label = "Warranty Date"
        name = "warranty_date"
        type = "date"
        value = {
            formData.warranty_date
        }
        onChange = {
            handleChange
        }
        InputLabelProps = {
            {
                shrink: true
            }
        }
        disabled = {
            selectedMaterial && !selectedMaterial.warranty_applicable
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white"
                }
            }
        }
        /> <
        /Grid>

        { /* Expiry Date */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth size = "small"
        label = "Expiry Date"
        name = "expiry_date"
        type = "date"
        value = {
            formData.expiry_date
        }
        onChange = {
            handleChange
        }
        InputLabelProps = {
            {
                shrink: true
            }
        }
        disabled = {
            selectedMaterial && !selectedMaterial.shelf_life_applicable
        }
        sx = {
            {
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "white"
                }
            }
        }
        /> <
        /Grid>

        { /* File Upload */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        Button variant = "outlined"
        component = "label"
        fullWidth required sx = {
            {
                borderRadius: "8px",
                // Apply error border color if validation fails
                borderColor: !formData.document ? "error.main" : COLORS.border,
                color: !formData.document ? "error.main" : COLORS.primary,
                textTransform: "none",
                py: 1,
                "&:hover": {
                    borderColor: !formData.document ? "error.dark" : COLORS.secondary,
                    backgroundColor: `${COLORS.secondary}08`
                }
            }
        }
        // sx={{
        //   borderRadius: "8px",
        //   borderColor: COLORS.border,
        //   color: COLORS.primary,
        //   textTransform: "none",
        //   py: 1,
        //   "&:hover": {
        //     borderColor: COLORS.secondary,
        //     backgroundColor: `${COLORS.secondary}08`
        //   }
        // }}
        >
        {
            formData.document ? "E-Way-Bill Selected" : "Upload E-Way-Bill"
        } <
        input type = "file"
        hidden onChange = {
            handleFileChange
        }
        /> <
        /Button> {
            formData.document ? ( <
                Typography variant = "caption"
                sx = {
                    {
                        color: COLORS.secondary,
                        mt: 0.5,
                        display: "block"
                    }
                } > ✓{
                    formData.document.name
                } <
                /Typography>
            ) : ( <
                Typography variant = "caption"
                sx = {
                    {
                        color: "error.main",
                        mt: 0.5,
                        display: "block"
                    }
                } >
                E - Way - Bill document is required <
                /Typography>
            )
        } {
            /* {formData.document && (
                              <Typography variant="caption" sx={{ color: COLORS.secondary, mt: 0.5, display: "block" }}>
                                ✓ {formData.document.name}
                              </Typography>
                            )} */
        } <
        /Grid>

        { /* Submit Button */ } <
        Grid item xs = {
            12
        }
        sx = {
            {
                mt: 2
            }
        } >
        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "center"
            }
        } >
        <
        Button type = "submit"
        variant = "contained"
        sx = {
            {
                borderRadius: "8px",
                backgroundColor: '#00416a',
                textTransform: "none",
                px: 6,
                py: 1,
                "&:hover": {
                    backgroundColor: '#00418a'
                }
            }
        } >
        Submit Record <
        /Button> <
        /Box> <
        /Grid> <
        /Grid> <
        /Box> <
        /Box> <
        /Paper>

        <
        MaterialReceivedTable selectedProject = {
            project
        }
        selectedWindfarm = {
            windfarm
        }
        /> <
        />
    );
};

export default MaterialReceivedForm;