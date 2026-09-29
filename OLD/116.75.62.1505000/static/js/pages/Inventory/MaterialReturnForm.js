import React, {
    useEffect,
    useState
} from "react";
import {
    Box,
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
    MenuItem,

    Snackbar,
    Alert
} from "@mui/material";
import MaterialReturnTable from "./MaterialReturnTable"
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetMaterialIssueData,
    CreateMaterialReturnNote,
    GetMaterialReturnNotes,
    GetMaterialMasterData
} from "../../Redux/MasterData/masterAction";

const unitsOfMeasure = ["kg", "m", "pcs"];

const MaterialReturnNoteForm = ({
    project,
    windfarm
}) => {
    const dispatch = useDispatch();

    const {
        MaterialIssueData = [],
            // materialReturnNotes = [],
            GETmaterialMaster = []
    } =
    useSelector((state) => state.masterData || {});

    const [openSnack, setOpenSnack] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [selectedMaterialId, setSelectedMaterialId] = useState(null);
    const [formData, setFormData] = useState({
        project,
        windfarm,
        material: "",
        return_qty: "",
        uom: "",
        returned_by: "",
        return_date: "",
        reason: "",
        condition: "",
    });

    useEffect(() => {
        dispatch(GetMaterialIssueData());
        dispatch(GetMaterialReturnNotes());
        dispatch(GetMaterialMasterData());
    }, [dispatch]);

    // FILTER MATERIALS BASED ON SELECTED PROJECT + WINDFARM
    const filteredDropdownMaterials = (MaterialIssueData || [])
        .filter(
            (rec) =>
            Number(rec.project) === Number(project) &&
            Number(rec.windfarm) === Number(windfarm)
        )
        .map((rec) => {
            const mat = GETmaterialMaster.find((m) => m.id === rec.material);
            return {
                id: rec.material,
                name: mat ? mat.name : "Unknown Material",
                code: mat ? mat.material_code : "",
            };
        });

    // remove duplicates
    const uniqueMaterials = Array.from(
        new Map(filteredDropdownMaterials.map((item) => [item.id, item])).values()
    );

    const handleMaterialChange = (e) => {
        const materialId = e.target.value;

        setSelectedMaterialId(materialId); // <-- correct setter

        setFormData({
            ...formData,
            material: materialId,
        });

        // Clear selected issue when material changes
        setSelectedIssue(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRowClick = (issue) => {
        setSelectedIssue(issue);

        setSelectedMaterialId(issue.material); // ← updates filtering + table

        setFormData(prev => ({
            ...prev,
            material: issue.material, // ← dropdown auto-selects
            issue: issue.id,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(CreateMaterialReturnNote(formData));
        setOpenSnack(true);

        setTimeout(() => {
            dispatch(GetMaterialReturnNotes());
        }, 500);

        setFormData({
            project,
            windfarm,
            material: "",
            return_qty: "",
            uom: "",
            returned_by: "",
            return_date: "",
            reason: "",
            condition: "",
        });
    };

    return ( <
        Box >
        <
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
                mb: 2,
                color: "#00416a",
                fontWeight: 600
            }
        } >
        Material Return Note <
        /Typography> <
        Typography variant = "body2"
        sx = {
            {
                mb: 2
            }
        } >
        Contractor has returned the surplus materials remaining after the completion of assigned work.

        <
        /Typography>

        { /* Show selected issue details */ } {
            selectedIssue && ( <
                Box mt = {
                    2
                }
                p = {
                    2
                }
                bgcolor = "#f9f9f9"
                borderRadius = {
                    2
                } > {
                    /* <Typography>Material: {selectedIssue.material_name}</Typography>
                                                <Typography>Project: {selectedIssue.project_name}</Typography> */
                } <
                Typography > Windfarm: {
                    selectedIssue.windfarm_name
                } < /Typography> <
                Typography > Turbine: {
                    selectedIssue.turbine_name
                } < /Typography> <
                Typography > Issue Quantity: {
                    selectedIssue.quantity
                } < /Typography> <
                Typography > WO No: {
                    selectedIssue.work_order_no
                } < /Typography> <
                /Box>
            )
        } <
        form onSubmit = {
            handleSubmit
        } >
        <
        Grid container spacing = {
            2
        } >

        { /* Material */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        TextField select fullWidth label = "Material (dropdown)"
        name = "material"
        value = {
            formData.material
        }
        onChange = {
            handleMaterialChange
        }
        size = "small" >
        <
        MenuItem value = "" > Select Material < /MenuItem>

        {
            uniqueMaterials.length === 0 && ( <
                MenuItem disabled > No material available
                for this windfarm < /MenuItem>
            )
        }

        {
            uniqueMaterials.map((m) => ( <
                MenuItem key = {
                    m.id
                }
                value = {
                    m.id
                } > {
                    m.name
                }({
                    m.code
                }) <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* UOM */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        TextField select fullWidth label = "Unit"
        name = "uom"
        value = {
            formData.uom
        }
        onChange = {
            handleChange
        } >
        {
            unitsOfMeasure.map((unit) => ( <
                MenuItem key = {
                    unit
                }
                value = {
                    unit
                } > {
                    unit.toUpperCase()
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Return Qty */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        TextField fullWidth label = "Return Quantity"
        type = "number"
        name = "return_qty"
        value = {
            formData.return_qty
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        { /* Returned By */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        TextField fullWidth label = "Returned By"
        name = "returned_by"
        value = {
            formData.returned_by
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        { /* Return Date */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        TextField fullWidth label = "Return Date"
        type = "date"
        name = "return_date"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        value = {
            formData.return_date
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        { /* Condition */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        TextField select fullWidth label = "Condition"
        name = "condition"
        value = {
            formData.condition
        }
        onChange = {
            handleChange
        } >
        <
        MenuItem value = "OK" > OK < /MenuItem> <
        MenuItem value = "DAMAGED" > Damaged < /MenuItem> <
        MenuItem value = "REPAIR" > Repair Required < /MenuItem> <
        MenuItem value = "EXPIRED" > Expired < /MenuItem> <
        MenuItem value = "EXCESS" > Excess Material < /MenuItem> <
        /TextField> <
        /Grid>

        { /* Reason */ } <
        Grid item xs = {
            12
        } >
        <
        TextField fullWidth label = "Reason"
        multiline rows = {
            2
        }
        name = "reason"
        value = {
            formData.reason
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
        textAlign = "center" >
        <
        Button type = "submit"
        variant = "contained"
        sx = {
            {
                py: 1.5,
                borderRadius: 2,
                background: "#00416a",
                "&:hover": {
                    background: "#00418a"
                },
            }
        } >
        Save Return Note <
        /Button> <
        /Grid> <
        /Grid> <
        /form> <
        /Paper>

        { /* TABLE BELOW FORM */ } {
            /* <Paper sx={{ mt: 4, p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#444" }}>
                                Returned Material List
                            </Typography>
             
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Material</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>UOM</TableCell>
                                            <TableCell>Returned By</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Condition</TableCell>
                                            <TableCell>Reason</TableCell>
                                        </TableRow>
                                    </TableHead>
             
                                    <TableBody>
                                        {materialReturnNotes
                                            .filter((item) => item.project === project && item.windfarm === windfarm)
                                            .map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell>{row.material_name}</TableCell>
                                                    <TableCell>{row.return_qty}</TableCell>
                                                    <TableCell>{row.uom}</TableCell>
                                                    <TableCell>{row.returned_by}</TableCell>
                                                    <TableCell>{row.return_date}</TableCell>
                                                    <TableCell>{row.condition}</TableCell>
                                                    <TableCell>{row.reason}</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper> */
        }

        { /* SNACKBAR */ } <
        Snackbar open = {
            openSnack
        }
        autoHideDuration = {
            1500
        }
        onClose = {
            () => setOpenSnack(false)
        } >
        <
        Alert severity = "success" > Material Returned Successfully! < /Alert> <
        /Snackbar>

        <
        MaterialReturnTable selectedProject = {
            project
        }
        selectedWindfarm = {
            windfarm
        }
        selectedMaterial = {
            selectedMaterialId
        }
        onRowSelect = {
            handleRowClick
        }
        /> <
        /Box>
    );
};

export default MaterialReturnNoteForm;