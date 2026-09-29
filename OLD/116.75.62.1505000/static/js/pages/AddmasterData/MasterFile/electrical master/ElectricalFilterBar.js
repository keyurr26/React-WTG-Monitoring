import React, {
    useMemo,
    useEffect
} from "react";
import {
    Grid,
    TextField,
    MenuItem,
    Box
} from "@mui/material";
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    GetTurbineFilterData
} from "../../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";

const ElectricalFilterBar = ({
    filters,
    setFilters,
    onTurbinesChange,
    showCluster = true,
    showTurbine = true,
    compact = false,
}) => {
    const dispatch = useDispatch();

    const {
        getturbinefilter = []
    } = useSelector(
        (state) => state.electricalData,
    );

    useEffect(() => {
        dispatch(GetTurbineFilterData());
    }, [dispatch]);

    // console.log("getturbinefilter", getturbinefilter);

    // 1. Projects
    const projects = useMemo(() => {
        const map = new Map();
        getturbinefilter.forEach((i) =>
            map.set(i.project_id, {
                id: i.project_id,
                name: i.project_name
            }),
        );
        return Array.from(map.values());
    }, [getturbinefilter]);

    // 2. Windfarms
    const windfarms = useMemo(() => {
        if (!filters.project) return [];
        const filtered = getturbinefilter.filter(
            (i) => i.project_id === Number(filters.project),
        );
        const map = new Map();
        filtered.forEach((i) =>
            map.set(i.windfarm_id, {
                id: i.windfarm_id,
                name: i.windfarm_name,
            }),
        );
        return Array.from(map.values());
    }, [getturbinefilter, filters.project]);

    // 3. Clusters
    const clusters = useMemo(() => {
        if (!filters.windfarm) return [];
        const filtered = getturbinefilter.filter(
            (i) => i.windfarm_id === Number(filters.windfarm),
        );
        const map = new Map();
        filtered.forEach((i) =>
            map.set(i.cluster_id, {
                id: i.cluster_id,
                name: i.cluster_name,
            }),
        );
        return Array.from(map.values());
    }, [getturbinefilter, filters.windfarm]);

    // 4. Turbines (🔥 NEW)
    const turbines = useMemo(() => {
        if (!filters.windfarm) return [];

        const filtered = getturbinefilter.filter((i) => {
            const matchWindfarm = i.windfarm_id === Number(filters.windfarm);

            const matchCluster =
                filters.cluster === "" || i.cluster_id === Number(filters.cluster);

            return matchWindfarm && matchCluster;
        });

        const map = new Map();

        filtered.forEach((i) =>
            map.set(i.turbine_id, {
                id: i.turbine_id,
                name: i.location_no,
                cluster_id: i.cluster_id,
                cluster_name: i.cluster_name,
                wtg_capacity_mw: i.wtg_capacity_mw,
            }),
        );

        return Array.from(map.values());
    }, [getturbinefilter, filters.windfarm, filters.cluster]);

    // Notify parent when turbines change
    useEffect(() => {
        if (onTurbinesChange) {
            onTurbinesChange(turbines);
        }
    }, [turbines, onTurbinesChange]);

    return ( <
        Box sx = {
            {
                display: "flex",
                justifyContent: "center",
                mt: 1,
            }
        } >
        <
        Box sx = {
            {
                width: "100%",
                maxWidth: "1100px", // ✅ control width (important)
                p: 1,
                background: "none",
                borderRadius: 3,
                //   boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }
        } >
        <
        Grid container spacing = {
            2
        }
        justifyContent = "center" > {
            [{
                    label: "Project",
                    value: filters.project,
                    disabled: false,
                    options: projects,
                    onChange: (e) =>
                        setFilters({
                            project: e.target.value,
                            windfarm: "",
                            cluster: "",
                            turbine: "",
                        }),
                },
                {
                    label: "Windfarm",
                    value: filters.windfarm,
                    disabled: !filters.project,
                    options: windfarms,
                    onChange: (e) =>
                        setFilters({
                            ...filters,
                            windfarm: e.target.value,
                            cluster: "",
                            turbine: "",
                        }),
                },
                showCluster && {
                    label: "Cluster",
                    value: filters.cluster,
                    disabled: !filters.windfarm,
                    options: clusters,
                    onChange: (e) =>
                        setFilters({
                            ...filters,
                            cluster: e.target.value,
                            turbine: "",
                        }),
                },
                showTurbine && {
                    label: "Turbine",
                    value: filters.turbine,
                    disabled: !filters.cluster,
                    options: turbines,
                    onChange: (e) =>
                        setFilters({ ...filters,
                            turbine: e.target.value
                        }),
                },
            ]
            .filter(Boolean)
            .map((field, index) => ( <
                Grid item xs = {
                    12
                }
                sm = {
                    compact ? 6 : 6
                }
                md = {
                    compact ? 6 : 3
                }
                key = {
                    index
                } >
                <
                TextField select fullWidth size = "small"
                label = {
                    field.label
                }
                value = {
                    field.value
                }
                disabled = {
                    field.disabled
                }
                onChange = {
                    field.onChange
                }
                sx = {
                    {
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "4px",
                            height: "52px",
                            background: "#fff",
                            "& fieldset": {
                                borderColor: "#d0d5dd",
                            },
                            "&:hover fieldset": {
                                borderColor: "#1976d2",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1976d2",
                                borderWidth: "2px",
                            },
                        },
                    }
                } >
                <
                MenuItem value = "" > Select {
                    field.label
                } < /MenuItem>

                {
                    field.options.map((opt) => ( <
                        MenuItem key = {
                            opt.id
                        }
                        value = {
                            opt.id
                        } > {
                            opt.name
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid>
            ))
        } <
        /Grid> <
        /Box> <
        /Box>
    );
};

export default ElectricalFilterBar;