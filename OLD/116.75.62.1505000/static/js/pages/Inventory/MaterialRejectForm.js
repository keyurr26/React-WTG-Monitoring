import React, {
    useEffect,
    useState
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetMaterialIssueData,
    GetMaterialMasterData,
    CreateMaterialRejectNoteData
} from "../../Redux/MasterData/masterAction";
import MaterialRejectTable from "./MaterialRejectTable";
import {
    Box,
    Card,
    CardContent,
    TextField,
    MenuItem,
    Button,
    Typography,

} from "@mui/material";

const MaterialRejectForm = ({
    project,
    windfarm
}) => {
    const dispatch = useDispatch();
    const {
        MaterialIssueData,
        GETmaterialMaster = [],
        MaterialRejectList: []
    } = useSelector((state) => state.masterData);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [selectedMaterialId, setSelectedMaterialId] = useState(null);

    const [formData, setFormData] = useState({
        issue: "",
        reject_qty: "",
        condition: "",
        reason: "",
        rejected_by: "",
        photo: null,
    });

    useEffect(() => {
        dispatch(GetMaterialIssueData());
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

    const handleRowClick = (issue) => {
        setSelectedIssue(issue);
        setFormData({
            ...formData,
            issue: issue.id,
        });
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            data.append("issue", formData.issue);
            data.append("reject_qty", formData.reject_qty);
            data.append("condition", formData.condition);
            data.append("reason", formData.reason);
            data.append("rejected_by", formData.rejected_by);

            if (formData.photo) {
                data.append("photo", formData.photo);
            }

            const response = await dispatch(CreateMaterialRejectNoteData(data));

            alert("Material Reject Note created successfully!");

            // Clear form after submit
            setFormData({
                issue: "",
                reject_qty: "",
                condition: "",
                reason: "",
                rejected_by: "",
                photo: null,
            });

            setSelectedIssue(null);
        } catch (error) {
            alert("Error submitting reject note!");
            console.error("Reject note error:", error);
        }
    };


    return ( <
        Box p = {
            3
        } > { /* ---------------------- FORM SECTION ------------------------ */ } <
        Card sx = {
            {
                mb: 4,
                mt: -8
            }
        } >
        <
        CardContent >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416a",
            }
        } > Material Reject Form < /Typography>


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
        }

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
        /TextField>

        { /* Reject Qty */ } <
        TextField fullWidth type = "number"
        label = "Reject Quantity"
        sx = {
            {
                mt: 2
            }
        }
        value = {
            formData.reject_qty
        }
        onChange = {
            (e) =>
            setFormData({ ...formData,
                reject_qty: e.target.value
            })
        }
        />

        { /* Condition */ } <
        TextField select fullWidth label = "Condition"
        sx = {
            {
                mt: 2
            }
        }
        value = {
            formData.condition
        }
        onChange = {
            (e) =>
            setFormData({ ...formData,
                condition: e.target.value
            })
        } >
        <
        MenuItem value = "damaged" > Damaged < /MenuItem> <
        MenuItem value = "broken" > Broken < /MenuItem> <
        MenuItem value = "rusted" > Rusted < /MenuItem> <
        MenuItem value = "wrong_item" > Wrong Item < /MenuItem> <
        MenuItem value = "other" > Other < /MenuItem> <
        /TextField>

        { /* Reason */ } <
        TextField fullWidth multiline rows = {
            2
        }
        label = "Reason"
        sx = {
            {
                mt: 2
            }
        }
        value = {
            formData.reason
        }
        onChange = {
            (e) =>
            setFormData({ ...formData,
                reason: e.target.value
            })
        }
        />

        { /* Rejected By */ } <
        TextField fullWidth label = "Rejected By"
        sx = {
            {
                mt: 2
            }
        }
        value = {
            formData.rejected_by
        }
        onChange = {
            (e) =>
            setFormData({ ...formData,
                rejected_by: e.target.value
            })
        }
        />

        { /* Photo Upload */ } <
        Button component = "label"
        sx = {
            {
                mt: 2,
                border: "1px solid #00416a",
                color: "#00416a",
            }
        } >
        Upload Photo <
        input type = "file"
        hidden name = "photo"
        onChange = {
            (e) =>
            setFormData({ ...formData,
                photo: e.target.files[0]
            })
        }
        /> <
        /Button>

        <
        Button variant = "contained"
        color = "primary"
        sx = {
            {
                mt: 3,
                ml: 3
            }
        }
        onClick = {
            handleSubmit
        }
        disabled = {!formData.issue || !formData.reject_qty
        } >
        Submit Reject Note <
        /Button>

        <
        /CardContent> <
        /Card>

        <
        MaterialRejectTable selectedProject = {
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

export default MaterialRejectForm;