import React, {
    useEffect,
    useState
} from "react";
import {
    Box,

    Grid,
    TextField,
    MenuItem,
    Typography,
    Button,
    ToggleButton,
    ToggleButtonGroup,

} from "@mui/material";

import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetProjectsData,
    GetWindFarmMasterData,
    GetMaterialMasterData,
    createProjectTransfer
} from "../../Redux/MasterData/masterAction";
import MaterialStockTransferTable from "./MaterialStockTransferTable";

const MaterialStockTransfer = ({
    project,
    windfarm
}) => {
    const dispatch = useDispatch();

    const {
        projects = [], WindfarmData = [], GETmaterialMaster = []
    } =
    useSelector((state) => state.masterData || {});

    const [transferType, setTransferType] = useState("project");

    // Source / Destination States
    const [sourceProject, setSourceProject] = useState("");
    const [sourceWindfarm, setSourceWindfarm] = useState("");

    const [destProject, setDestProject] = useState("");
    const [destWindfarm, setDestWindfarm] = useState("");

    const [material, setMaterial] = useState("");
    const [qty, setQty] = useState("");
    const [reason, setReason] = useState("");


    // Load master data
    useEffect(() => {
        dispatch(GetProjectsData());
        dispatch(GetWindFarmMasterData());
        dispatch(GetMaterialMasterData());
    }, [dispatch]);

    // Filter windfarms for each project
    const filteredSourceWindfarms = WindfarmData.filter(
        (wf) => wf.project === sourceProject
    );
    const filteredDestWindfarms = WindfarmData.filter(
        (wf) => wf.project === destProject
    );

    const handleSubmit = () => {
        if (!sourceProject ||
            !sourceWindfarm ||
            !destProject ||
            !destWindfarm ||
            !material ||
            !qty
        ) {
            alert("Please fill all required fields.");
            return;
        }

        const payload = {
            transfer_type: transferType,
            source_project: sourceProject,
            source_windfarm: sourceWindfarm,
            dest_project: destProject,
            dest_windfarm: destWindfarm,
            material,
            qty,
            reason,

        };


        // 🔥 CALL REDUX ACTION
        dispatch(createProjectTransfer(payload))
            .then(() => {
                alert("Transfer Request Submitted Successfully!");
            })
            .catch((err) => {
                alert("Failed to submit transfer request!");
            });
    };


    return ( <
        >

        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416a",
                mt: -5,
            }
        } >
        Material Stock Transfer <
        /Typography>

        { /* SELECT TRANSFER TYPE */ } <
        Box sx = {
            {
                mb: 3
            }
        } >
        <
        Typography sx = {
            {
                fontWeight: 600,
                mb: 1
            }
        } >
        Transfer Type <
        /Typography>


        <
        Box sx = {
            {
                mb: 2
            }
        } >
        <
        ToggleButtonGroup value = {
            transferType
        }
        exclusive onChange = {
            (e, newValue) => {
                if (newValue !== null) setTransferType(newValue);
            }
        }
        size = "medium"
        sx = {
            {
                borderRadius: 2, // rounded corners for the group
                "& .MuiToggleButton-root": {
                    textTransform: "none", // keep text normal, not uppercase
                    fontWeight: 600,
                    color: "#00416A", // unselected color
                    border: "1px solid #00416A",
                    "&.Mui-selected": {
                        backgroundColor: "#00416A",
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: "#00335a",
                        },
                    },
                    "&:hover": {
                        borderColor: "#00335a",
                        backgroundColor: "rgba(0,65,106,0.1)",
                    },
                },
            }
        } >
        <
        ToggleButton value = "project" > Project→ Project < /ToggleButton> <
        ToggleButton value = "site" > Windfarm→ Windfarm < /ToggleButton> <
        /ToggleButtonGroup> <
        /Box>

        <
        /Box>

        <
        Grid container spacing = {
            3
        } > { /* SOURCE PROJECT */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField select fullWidth size = "small"
        label = "Source Project"
        value = {
            sourceProject
        }
        onChange = {
            (e) => {
                setSourceProject(e.target.value);
                setSourceWindfarm("");
            }
        } >
        {
            projects.map((p) => ( <
                MenuItem key = {
                    p.id
                }
                value = {
                    p.id
                } > {
                    p.project_name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* DESTINATION PROJECT */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField select fullWidth size = "small"
        label = "Destination Project"
        value = {
            destProject
        }
        onChange = {
            (e) => {
                setDestProject(e.target.value);
                setDestWindfarm("");
            }
        } >
        {
            projects
            .filter((p) => p.id !== sourceProject)
            .map((p) => ( <
                MenuItem key = {
                    p.id
                }
                value = {
                    p.id
                } > {
                    p.project_name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* SOURCE WIND FARM */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField select fullWidth size = "small"
        label = "Source Windfarm"
        value = {
            sourceWindfarm
        }
        onChange = {
            (e) => setSourceWindfarm(e.target.value)
        }
        disabled = {!sourceProject
        } >
        {
            filteredSourceWindfarms.map((wf) => ( <
                MenuItem key = {
                    wf.id
                }
                value = {
                    wf.id
                } > {
                    wf.windfarm_name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* DESTINATION WIND FARM */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField select fullWidth size = "small"
        label = "Destination Windfarm"
        value = {
            destWindfarm
        }
        onChange = {
            (e) => setDestWindfarm(e.target.value)
        }
        disabled = {!destProject
        } >
        {
            filteredDestWindfarms.map((wf) => ( <
                MenuItem key = {
                    wf.id
                }
                value = {
                    wf.id
                } > {
                    wf.windfarm_name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* MATERIAL */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField select fullWidth size = "small"
        label = "Select Material"
        value = {
            material
        }
        onChange = {
            (e) => setMaterial(e.target.value)
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

        { /* QTY */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth size = "small"
        type = "number"
        label = "Transfer Quantity"
        value = {
            qty
        }
        onChange = {
            (e) => setQty(e.target.value)
        }
        /> <
        /Grid>

        { /* REASON */ } <
        Grid item xs = {
            12
        } >
        <
        TextField fullWidth size = "small"
        label = "Reason"
        value = {
            reason
        }
        onChange = {
            (e) => setReason(e.target.value)
        }
        /> <
        /Grid>

        { /* NOTE */ } {
            /* <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    size="small"
                                    label="Additional Note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                            </Grid> */
        }

        { /* SUBMIT BUTTON */ } <
        Grid item xs = {
            3
        }
        textAlign = "center" >
        <
        Button variant = "contained"

        onClick = {
            handleSubmit
        }
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
        Submit Transfer Request <
        /Button> <
        /Grid> <
        /Grid>

        <
        MaterialStockTransferTable /
        >
        <
        />
    );
};

export default MaterialStockTransfer;