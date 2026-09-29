import React, {
    useState,
    useEffect
} from "react";
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    MenuItem,
    Paper
} from "@mui/material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import NumberTextField from "../../../components/comman/NumberTextField";
import {
    GetMaterialRecivedData,
    CreateMaterialIssueData,
    GetMaterialIssueData,
} from "../../../Redux/MasterData/masterAction";
import {
    getTurbineLocations
} from "../../../Redux/TurbineMasterData/turbineAction";
import MaterialStockTable from "../tables/MaterialStockTable";
import {
    getClusters
} from "../../../Redux/InstallationData/CartRoadData/cartroadAction";

// Color Scheme
const COLORS = {
    primary: "#00416a",
    secondary: "#E57A28",
    lightBlue: "#e6f2ff",
    cardBg: "#ffffff",
    textLight: "#6c757d",
    border: "#e0e0e0"
};

const MaterialIssuedForm = ({
    project,
    windfarm,
    GETmaterialMaster = [],
    ContractorData = []
}) => {
    const dispatch = useDispatch();

    // Redux data
    const {
        FetchMaterialRecivedData = []
    } = useSelector((state) => state.masterData || {});
    const {
        clusters = []
    } = useSelector((state) => state.cardRoad || {});
    const {
        turbineLocations = []
    } = useSelector((state) => state.turbineData || {});

    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [selectedMaterialId, setSelectedMaterialId] = useState(null);
    const [issuedRows, setIssuedRows] = useState([]);
    const [formData, setFormData] = useState({
        material: "",
        project: project || "",
        project_name: "",
        windfarm: windfarm || "",
        windfarm_name: "",
        cluster: "",
        issued_turbine: "",
        received: "",
        issued_to: "",
        issued_by: "",
        quantity: "",
        issued_date: "",
        work_order_no: "",
        issue_quantity: 0,
        rows: [],
    });

    useEffect(() => {
        dispatch(getClusters());
        dispatch(GetMaterialRecivedData());
        dispatch(getTurbineLocations());
        dispatch(GetMaterialIssueData());
    }, [dispatch]);

    // Keep project and windfarm fields synced when props update
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            project: project || "",
            windfarm: windfarm || ""
        }));
    }, [project, windfarm]);

    // FILTER MATERIALS BASED ON SELECTED PROJECT + WINDFARM PROPS
    const filteredDropdownMaterials = FetchMaterialRecivedData
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

    const filteredClusters = clusters.filter(
        (c) => Number(c.windfarm) === Number(formData.windfarm)
    );

    const filteredTurbines = turbineLocations.filter(
        (t) => Number(t.cluster) === Number(formData.cluster)
    );
    // console.log("filteredTurbines",filteredTurbines)
    // If user manually picks material in dropdown, auto-populate project/windfarm (existing logic)
    const handleMaterialChange = (e) => {
        const material_id = e.target.value;
        setSelectedMaterialId(material_id);

        // Find latest received record matching this material, project, and windfarm
        const relatedReceives = FetchMaterialRecivedData.filter(
            (rec) =>
            Number(rec.material) === Number(material_id) &&
            Number(rec.project) === Number(project) &&
            Number(rec.windfarm) === Number(windfarm)
        );

        const latestReceive = relatedReceives.length > 0 ? relatedReceives[relatedReceives.length - 1] : null;

        setFormData((prev) => ({
            ...prev,
            material: material_id,
            project: project || (latestReceive ? latestReceive.project : ""),
            windfarm: windfarm || (latestReceive ? latestReceive.windfarm : ""),
            available_balance: 0,
            quantity: "",
        }));

        setSelectedMaterial(null);
    };

    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;

        if (name === "quantity") {
            const q = value === "" ? "" : Number(value);
            setFormData((prev) => ({
                ...prev,
                [name]: q,
            }));
            return;
        }

        setFormData((prev) => ({ ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (issuedRows.length === 0) {
            alert("Please enter issued quantity in table.");
            return;
        }

        try {
            for (const row of issuedRows) {
                const payload = {
                    material_id: row.material,
                    project_id: row.project,
                    windfarm_id: row.windfarm,
                    cluster_id: formData.cluster || null,
                    received_id: row.received_id,
                    issued_turbine_id: formData.issued_turbine || null,
                    issued_to: formData.issued_to || "",
                    issued_by: formData.issued_by || "",
                    quantity: Number(row.new_issue),
                    issued_date: formData.issued_date || null,
                    work_order_no: formData.work_order_no || "",
                };

                await dispatch(CreateMaterialIssueData(payload));
            }

            alert("✔ All material issue entries submitted!");

            dispatch(GetMaterialRecivedData());
            dispatch(GetMaterialIssueData());

            // Reset form variables safely
            setFormData(prev => ({
                ...prev,
                material: "",
                cluster: "",
                issued_turbine: "",
                issued_to: "",
                issued_by: "",
                quantity: "",
                issued_date: "",
                work_order_no: "",
                issue_quantity: 0,
                rows: [],
            }));
            setIssuedRows([]);
            setSelectedMaterialId(null);

        } catch (err) {
            console.error("Submission failed: ", err);
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
                mt: -4,
                border: "1px solid #00416A"
            }
        } >
        <
        Box sx = {
            {
                p: 3
            }
        } >
        <
        Typography variant = "body2"
        sx = {
            {
                mb: 3
            }
        } >
        Select material from the stock table below(only items with positive balance are shown) or pick from dropdown..... <
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
        } > { /* Material Selection */ }

        <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField select fullWidth label = "Material"
        name = "material"
        value = {
            formData.material
        }
        onChange = {
            handleMaterialChange
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
        size = "small" >
        <
        MenuItem value = "" > Select Material < /MenuItem>

        {
            uniqueMaterials.length === 0 && ( <
                MenuItem disabled >
                No material available
                for this windfarm <
                /MenuItem>
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

        { /* Cluster */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField select fullWidth label = "Cluster"
        name = "cluster"
        value = {
            formData.cluster || ""
        }
        onChange = {
            handleChange
        }
        size = "small"
        disabled = {!formData.windfarm
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
        } >
        <
        MenuItem value = "" > Select Cluster < /MenuItem> {
            filteredClusters.length === 0 && ( <
                MenuItem disabled > No clusters available < /MenuItem>
            )
        } {
            filteredClusters.map((c) => ( <
                MenuItem key = {
                    c.id
                }
                value = {
                    c.id
                } > {
                    c.cluster_name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Issued Turbine */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField select fullWidth label = "Issued Turbine"
        name = "issued_turbine"
        value = {
            formData.issued_turbine || ""
        }
        onChange = {
            handleChange
        }
        size = "small"
        disabled = {!formData.cluster
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
        } >
        <
        MenuItem value = "" > Select Turbine < /MenuItem> {
            filteredTurbines.length === 0 && ( <
                MenuItem disabled >
                No turbines
                for selected cluster <
                /MenuItem>
            )
        } {
            filteredTurbines.map((t) => ( <
                MenuItem key = {
                    t.id
                }
                value = {
                    t.id
                } > {
                    t.location_no
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Issued To */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField select fullWidth label = "Issued To"
        name = "issued_to"
        value = {
            formData.issued_to
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
        size = "small" >
        <
        MenuItem value = "" > Select Contractor < /MenuItem> {
            ContractorData.map((c) => ( <
                MenuItem key = {
                    c.id
                }
                value = {
                    c.id
                } > {
                    c.firm_name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Issued By */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth label = "Issued By"
        name = "issued_by"
        value = {
            formData.issued_by
        }
        onChange = {
            handleChange
        }
        size = "small" /
        >
        <
        /Grid>

        { /* Quantity */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        NumberTextField fullWidth label = "Quantity to Issue"
        name = "quantity"
        type = "number"
        value = {
            formData.quantity
        }
        onChange = {
            handleChange
        }
        size = "small"
        InputProps = {
            {
                readOnly: true
            }
        }
        error = {!formData.quantity
        }
        helperText = {
            formData.quantity ?
            "✓ Auto-populated from the below table." :
                "⚠️ Quantity missing! Please issue this material in the table below first."
        }
        /> <
        /Grid>

        { /* Issued Date */ } {
            /* <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Issued Date"
                              name="issued_date"
                              type="date"
                              value={formData.issued_date}
                              onChange={handleChange}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid> */
        }

        <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth label = "Issued Date"
        name = "issued_date"
        type = "date"
        value = {
            formData.issued_date
        }
        onChange = {
            handleChange
        }
        size = "small"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        inputProps = {
            {
                max: new Date().toISOString().split("T")[0],
            }
        }
        /> <
        /Grid>

        { /* Work Order Number */ } <
        Grid item xs = {
            12
        }
        sm = {
            6
        } >
        <
        TextField fullWidth label = "Work Order Number"
        name = "work_order_no"
        value = {
            formData.work_order_no
        }
        onChange = {
            handleChange
        }
        size = "small" /
        >
        <
        /Grid>

        { /* Submit Button */ } <
        Grid item xs = {
            12
        }
        textAlign = "center" >
        <
        Button variant = "contained"
        type = "submit"
        size = "small"
        sx = {
            {
                background: "#00416A",
                borderRadius: 2,
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(25,118,210,0.35)",
            }
        } >
        Submit <
        /Button> <
        /Grid> <
        /Grid> <
        /Box> <
        /Box> <
        /Paper>

        { /* Stock table below form */ } <
        MaterialStockTable selectedProject = {
            project
        }
        selectedWindfarm = {
            windfarm
        }
        selectedMaterial = {
            selectedMaterialId
        }
        onIssuedChange = {
            (rows) => {
                const issuedOnly = rows.filter((r) => Number(r.new_issue) > 0);
                setIssuedRows(issuedOnly);

                const totalNewIssue = issuedOnly.reduce(
                    (sum, r) => sum + Number(r.new_issue || 0),
                    0,
                );

                setFormData((prev) => ({
                    ...prev,
                    quantity: totalNewIssue,
                }));
            }
        }
        /> <
        />
    );
};

export default MaterialIssuedForm;