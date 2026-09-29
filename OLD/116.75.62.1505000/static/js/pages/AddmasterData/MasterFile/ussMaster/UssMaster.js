import React, {
    useState,
    useMemo,
    useEffect
} from "react";
import {
    Box,
    Typography,
    Paper,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Grid,
    TableContainer,
} from "@mui/material";

import {
    useDispatch,
    useSelector
} from "react-redux";

import ElectricalFilterBar from "../electrical master/ElectricalFilterBar";

import {
    CreateUSSMasterData,
    GetUSSMasterData,
} from "../../../../Redux/MasterData/masterAction";

export default function USSMaster() {
    const dispatch = useDispatch();

    const [referenceDiagram, setReferenceDiagram] = useState(null);

    // ✅ turbine filter data
    const {
        getturbinefilter = []
    } = useSelector(
        (state) => state.electricalData,
    );

    // ✅ USS master data
    const {
        getUssMaster = [], loading: ussMasterLoading
    } = useSelector(
        (state) => state.masterData,
    );

    const [filters, setFilters] = useState({
        project: "",
        windfarm: "",
        cluster: "",
    });

    const [allTurbines, setAllTurbines] = useState([]);
    const [ussList, setUssList] = useState([]);
    const [loading, setLoading] = useState(false);

    // ✅ CALL USS MASTER API
    useEffect(() => {
        dispatch(GetUSSMasterData());
    }, [dispatch]);

    // ✅ SET TABLE DATA FROM API
    useEffect(() => {
        if (getUssMaster ? .length) {
            setUssList(getUssMaster);
        }
    }, [getUssMaster]);

    const filteredUssList = useMemo(() => {
        return ussList.filter((u) => {
            const matchProject = !filters.project || Number(u.project) === Number(filters.project);

            const matchWindfarm = !filters.windfarm || Number(u.windfarm) === Number(filters.windfarm);

            const matchCluster = !filters.cluster || Number(u.cluster) === Number(filters.cluster);

            return matchProject && matchWindfarm && matchCluster;
        });
    }, [ussList, filters]);

    // ✅ MAPS FOR NAME BINDING
    const projectMap = useMemo(() => {
        const map = new Map();

        getturbinefilter.forEach((item) => {
            map.set(item.project_id, item.project_name);
        });

        return map;
    }, [getturbinefilter]);

    const windfarmMap = useMemo(() => {
        const map = new Map();

        getturbinefilter.forEach((item) => {
            map.set(item.windfarm_id, item.windfarm_name);
        });

        return map;
    }, [getturbinefilter]);

    const clusterMap = useMemo(() => {
        const map = new Map();

        getturbinefilter.forEach((item) => {
            map.set(item.cluster_id, item.cluster_name);
        });

        return map;
    }, [getturbinefilter]);

    const getProjectName = (id) => projectMap.get(Number(id)) || id;

    const getWindfarmName = (id) => windfarmMap.get(Number(id)) || id;

    const getClusterName = (id) => clusterMap.get(Number(id)) || id;

    /* =========================
       GENERATE USS MASTER
    ========================= */

    const handleGenerate = async () => {
        try {
            if (!filters.project || !filters.windfarm || !filters.cluster) {
                alert("Please select Project, Windfarm and Cluster");
                return;
            }

            if (!allTurbines.length) {
                alert("No turbines available for selected cluster");
                return;
            }

            setLoading(true);

            const filteredTurbines = allTurbines.filter(
                (t) => t.cluster_id === Number(filters.cluster),
            );

            if (!filteredTurbines.length) {
                alert("No turbines found for selected cluster");
                return;
            }

            // ✅ cluster duplicate check
            const clusterAlreadyExists = getUssMaster.some(
                (u) => Number(u.cluster) === Number(filters.cluster),
            );

            if (clusterAlreadyExists) {
                alert("USS already generated for selected cluster");
                return;
            }

            for (const t of filteredTurbines) {
                const formData = new FormData();

                formData.append("project", Number(filters.project));

                formData.append("windfarm", Number(filters.windfarm));

                formData.append("cluster", Number(filters.cluster));

                formData.append("turbine", t.id);

                formData.append("uss_name", `USS-${t.name}`);

                // formData.append("referred_diagram", referenceDiagram);

                if (referenceDiagram) {
                    formData.append("referred_diagram", referenceDiagram);
                }

                await dispatch(CreateUSSMasterData(formData));
            }

            // ✅ REFRESH LIST API
            dispatch(GetUSSMasterData());

            alert(`${filteredTurbines.length} USS generated & saved successfully`);
        } catch (error) {
            console.error("❌ Error generating USS:", error);
            alert("Failed to generate USS");
        } finally {
            setLoading(false);
        }
    };

    return ( <
        Box sx = {
            {
                p: 3,
                bgcolor: "#f5f7fb",
                minHeight: "100vh"
            }
        } > { /* HEADER */ } <
        Typography variant = "h5"
        fontWeight = {
            700
        } >
        USS MASTER SYSTEM <
        /Typography>

        <
        Typography variant = "body2"
        color = "text.secondary" >
        Project→ Windfarm→ Cluster wise USS generation <
        /Typography>

        { /* FILTER */ } <
        Paper sx = {
            {
                p: 2,
                mt: 3
            }
        } >
        <
        Grid container spacing = {
            2
        }
        alignItems = "center" >
        <
        Grid item xs = {
            12
        }
        md = {
            9
        } >
        <
        ElectricalFilterBar filters = {
            filters
        }
        setFilters = {
            setFilters
        }
        showCluster = {
            true
        }
        showTurbine = {
            false
        }
        onTurbinesChange = {
            setAllTurbines
        }
        /> <
        /Grid>

        { /* Reference Diagram Upload */ } <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        Box sx = {
            {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 1,
            }
        } >
        <
        Typography variant = "subtitle2"
        fontWeight = {
            600
        } >
        Reference Diagram <
        /Typography>

        <
        Button variant = "outlined"
        component = "label"
        size = "small"
        fullWidth >
        Upload PDF <
        input hidden type = "file"
        accept = ".pdf"
        onChange = {
            (e) => setReferenceDiagram(e.target.files[0])
        }
        /> <
        /Button>

        <
        Typography variant = "caption"
        color = "text.secondary"
        sx = {
            {
                maxWidth: "100%",
                wordBreak: "break-word",
            }
        } >
        {
            referenceDiagram ? referenceDiagram.name : "No file selected"
        } <
        /Typography> <
        /Box> <
        /Grid> <
        /Grid>

        <
        Box sx = {
            {
                mt: 2
            }
        } >
        <
        Button variant = "contained"
        onClick = {
            handleGenerate
        }
        disabled = {
            loading
        } >
        {
            loading ? "Generating..." : "Generate USS Master"
        } <
        /Button> <
        /Box> <
        /Paper>

        { /* TABLE */ } <
        Paper sx = {
            {
                mt: 3,
                p: 2,
                borderRadius: 2,
                border: "1px solid #00416A",
            }
        } >
        <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                maxHeight: 550,
                borderRadius: 2,
                border: "1px solid #d9d9d9",
                boxShadow: 2,
            }
        } >
        <
        Table stickyHeader size = "small" >
        <
        TableHead >
        <
        TableRow sx = {
            {
                "& .MuiTableCell-root": {
                    bgcolor: "#00416A",
                    color: "#fff",
                    fontWeight: 700,
                    textAlign: "center",
                    fontSize: 14,
                    borderBottom: "none",
                },
            }
        } >
        {
            [
                "Turbine",
                "USS Name",
                "Project",
                "Windfarm",
                "Cluster",
                "Reference Diagram",
            ].map((h) => ( <
                TableCell key = {
                    h
                }
                sx = {
                    {
                        color: "#fff",
                        fontWeight: 700
                    }
                } > {
                    h
                } <
                /TableCell>
            ))
        } <
        /TableRow> <
        /TableHead>

        <
        TableBody > {
            filteredUssList.map((u, index) => ( <
                TableRow key = {
                    index
                }
                hover sx = {
                    {
                        bgcolor: index % 2 === 0 ? "#fafafa" : "#fff",
                        "&:hover": {
                            bgcolor: "#f1f7ff",
                        },
                    }
                } >
                <
                TableCell >
                <
                Chip label = {
                    u.turbine_name
                }
                color = "primary" / >
                <
                /TableCell>

                <
                TableCell sx = {
                    {
                        fontWeight: 700
                    }
                } > {
                    u.uss_name
                } < /TableCell>

                { /* ✅ SHOW NAMES INSTEAD OF IDS */ } <
                TableCell > {
                    getProjectName(u.project)
                } < /TableCell>

                <
                TableCell > {
                    getWindfarmName(u.windfarm)
                } < /TableCell>

                <
                TableCell > {
                    getClusterName(u.cluster)
                } < /TableCell>

                <
                TableCell > {
                    u.referred_diagram ? ( <
                        Button variant = "outlined"
                        size = "small"
                        href = {
                            u.referred_diagram
                        }
                        target = "_blank"
                        rel = "noopener noreferrer" >
                        View PDF <
                        /Button>
                    ) : ( <
                        Typography variant = "caption"
                        color = "text.secondary" >
                        -
                        <
                        /Typography>
                    )
                } <
                /TableCell> <
                /TableRow>
            ))
        } <
        /TableBody> <
        /Table> <
        /TableContainer>

        {
            !filteredUssList.length && !ussMasterLoading && ( <
                Box sx = {
                    {
                        p: 3,
                        textAlign: "center"
                    }
                } >
                <
                Typography color = "text.secondary" > No USS Data Found < /Typography> <
                /Box>
            )
        } <
        /Paper> <
        /Box>
    );
}