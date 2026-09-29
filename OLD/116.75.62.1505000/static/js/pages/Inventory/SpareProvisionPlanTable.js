import React, {
    useState,
    useEffect
} from "react";
import {
    Box,
    Grid,
    TextField,
    Button,
    MenuItem,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableContainer
} from "@mui/material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    CreateSpareProvisionPlan,
    GetMaterialMasterData
} from "../../Redux/MasterData/masterAction";
import {
    GetSpareProvisionPlan
} from "../../Redux/MasterData/masterAction";

const SpareProvisionPlanTable = ({
    project,
    windfarm
}) => {
    const dispatch = useDispatch();
    const {
        GETmaterialMaster,
        spareProvisionPlans = []
    } = useSelector((state) => state.masterData || {});


    const [formData, setFormData] = useState({
        material: "",
        min_qty: "",
        max_qty: "",
    });

    // Fetch master data
    useEffect(() => {
        dispatch(GetMaterialMasterData());
    }, [dispatch]);



    const handleChange = (e) => {
        setFormData({ ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        if (!formData.material || !formData.min_qty || !formData.max_qty) return alert("Fill all fields");

        dispatch(CreateSpareProvisionPlan({
            project,
            windfarm,
            material: formData.material,
            min_qty: formData.min_qty,
            max_qty: formData.max_qty,
        }));

        setFormData({
            material: "",
            min_qty: "",
            max_qty: ""
        }); // reset
    };

    // Fetch existing spare plans whenever project or windfarm changes
    useEffect(() => {
        if (project && windfarm) {
            dispatch(GetSpareProvisionPlan({
                project,
                windfarm
            }));
        }
    }, [project, windfarm, dispatch]);

    return ( <
        Box sx = {
            {
                p: 1
            }
        } > { /* Form */ } <
        Paper elevation = {
            1
        }
        sx = {
            {
                p: 3,
                borderRadius: 2,
                mt: -5
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416a"
            }
        } > Add Spare Provision Plan < /Typography> <
        Grid container spacing = {
            2
        }
        sx = {
            {
                mb: 4
            }
        } >
        <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        TextField select fullWidth label = "Material"
        name = "material"
        value = {
            formData.material
        }
        onChange = {
            handleChange
        }
        size = "small" >
        {
            GETmaterialMaster.map((m) => ( <
                MenuItem key = {
                    m.id
                }
                value = {
                    m.id
                } > {
                    m.name
                } < /MenuItem>
            ))
        } <
        /TextField> <
        /Grid> <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        TextField label = "Min Qty"
        name = "min_qty"
        type = "number"
        value = {
            formData.min_qty
        }
        onChange = {
            handleChange
        }
        fullWidth size = "small" /
        >
        <
        /Grid> <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        TextField label = "Max Qty"
        name = "max_qty"
        type = "number"
        value = {
            formData.max_qty
        }
        onChange = {
            handleChange
        }
        fullWidth size = "small" /
        >
        <
        /Grid> <
        Grid item xs = {
            12
        } >
        <
        Button variant = "contained"
        sx = {
            {
                background: "#00416a"
            }
        }
        onClick = {
            handleSubmit
        } >
        Create Plan <
        /Button> <
        /Grid> <
        /Grid> <
        /Paper> { /* Table */ } <
        Typography variant = "h6"
        sx = {
            {
                mt: 4,
                fontWeight: 600,
                color: "#00416a"
            }
        } > Existing Spare Provision Plans < /Typography>

        <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                borderRadius: 2,
                background: "#00416a"
            }
        } >
        <
        Table >
        <
        TableHead >
        <
        TableRow >
        <
        TableCell sx = {
            {
                color: "#fff"
            }
        } > Material < /TableCell> <
        TableCell sx = {
            {
                color: "#fff"
            }
        } > Min Qty < /TableCell> <
        TableCell sx = {
            {
                color: "#fff"
            }
        } > Max Qty < /TableCell> <
        TableCell sx = {
            {
                color: "#fff"
            }
        } > Current Stock < /TableCell> <
        TableCell sx = {
            {
                color: "#fff"
            }
        } > Reorder Level < /TableCell> <
        TableCell sx = {
            {
                color: "#fff"
            }
        } > Reorder Required < /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            spareProvisionPlans.map((plan) => ( <
                TableRow key = {
                    plan.id
                } >
                <
                TableCell > {
                    plan.material_name
                } < /TableCell> <
                TableCell > {
                    plan.min_qty
                } < /TableCell> <
                TableCell > {
                    plan.max_qty
                } < /TableCell> <
                TableCell > {
                    plan.current_stock
                } < /TableCell> <
                TableCell > {
                    plan.reorder_level
                } < /TableCell> <
                TableCell > {
                    plan.reorder_required ? "Yes" : "No"
                } < /TableCell> <
                /TableRow>
            ))
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        <
        /Box>
    );
};

export default SpareProvisionPlanTable;