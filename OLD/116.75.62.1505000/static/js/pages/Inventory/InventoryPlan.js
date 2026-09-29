import React, {
    useState,
    useEffect
} from "react";
import {
    TextField,
    Grid,
    Button,
    Paper,
    MenuItem,
} from "@mui/material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetMaterialMasterData,
    CreateInventoryPlan
} from "../../Redux/MasterData/masterAction";
import InventoryPlanTable from "./InventoryPlanTable";
import CustomSnackbar from "../../components/comman/CustomSnackbar";


const InventoryPlan = ({
    project,
    windfarm
}) => {
    const dispatch = useDispatch();
    const {
        GETmaterialMaster = []
    } = useSelector((state) => state.masterData);
    const {
        success
    } = useSelector((state) => state.masterData); // if your reducer has success flag

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [formData, setFormData] = useState({
        material: "",
        project: project || "",
        windfarm: windfarm || "",
        required_qty: "",
        safety_stock: "",
        reorder_level: "",
        lead_time_days: "",
        required_by_date: "",
    });

    // Load material list
    useEffect(() => {
        dispatch(GetMaterialMasterData());
    }, []);

    // Auto-update project/windfarm
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            project: project,
            windfarm: windfarm
        }));
    }, [project, windfarm]);

    const handleChange = (e) => {
        setFormData({ ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        dispatch(CreateInventoryPlan(formData)).then(() => {
            // reset form fields
            setFormData({
                material: "",
                project: project,
                windfarm: windfarm,
                required_qty: "",
                safety_stock: "",
                reorder_level: "",
                lead_time_days: "",
                required_by_date: "",
            });

            setSnackbar({
                open: true,
                message: "Material saved successfully!",
                severity: "success",
            });
        })
    };

    return ( <
        >
        <
        Paper sx = {
            {
                p: 3,
                border: "none",
                mt: -5
            }
        } >
        <
        Grid container spacing = {
            2
        } >
        <
        Grid item xs = {
            12
        } >
        <
        TextField select fullWidth label = "Material"
        name = "material"
        value = {
            formData.material
        }
        onChange = {
            handleChange
        } >
        {
            GETmaterialMaster.map((m) => ( <
                MenuItem key = {
                    m.id
                }
                value = {
                    m.id
                } > {
                    m.name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        <
        Grid item xs = {
            6
        } >
        <
        TextField fullWidth label = "Required Qty"
        name = "required_qty"
        value = {
            formData.required_qty
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            6
        } >
        <
        TextField fullWidth label = "Safety Stock"
        name = "safety_stock"
        value = {
            formData.safety_stock
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            6
        } >
        <
        TextField fullWidth label = "Reorder Level"
        name = "reorder_level"
        value = {
            formData.reorder_level
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            6
        } >
        <
        TextField fullWidth label = "Lead Time (days)"
        name = "lead_time_days"
        value = {
            formData.lead_time_days
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        } >
        <
        TextField fullWidth type = "date"
        label = "Required By"
        name = "required_by_date"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        value = {
            formData.required_by_date
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        textAlign = "right" >
        <
        Button variant = "contained"
        onClick = {
            handleSubmit
        }
        sx = {
            {
                background: '#00416a'
            }
        } >
        Create Inventory Plan <
        /Button> <
        /Grid> <
        /Grid> <
        CustomSnackbar { ...snackbar
        }
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        }
        /> <
        /Paper>

        { /* Inventory Plan Table */ } <
        InventoryPlanTable selectedProject = {
            project
        }
        selectedWindfarm = {
            windfarm
        }
        />


        <
        />
    );
};

export default InventoryPlan;