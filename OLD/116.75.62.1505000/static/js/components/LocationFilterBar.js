import React, {
    useEffect,
    useMemo
} from "react";

import {
    Grid,
    TextField,
    MenuItem,
    Box,

    //   IconButton,
    Tooltip,
    Button,
} from "@mui/material";

import {
    useSelector,
    useDispatch
} from "react-redux";

import RestartAltIcon from "@mui/icons-material/RestartAlt";

import {
    GetTurbineFilterData
} from "../Redux/InstallationData/ElectricalLinesData/ElectricalActions";

const LocationFilterBar = ({
    filters,
    setFilters,
    showCluster = true
}) => {
    const dispatch = useDispatch();

    const {
        user
    } = useSelector((state) => state.auth || {});

    const userRole = user ? .role;

    const {
        getturbinefilter = [], loading
    } = useSelector(
        (state) => state.electricalData || {},
    );

    // ✅ FIX: refetch on login / role change

    useEffect(() => {
        if (user ? .id) {
            dispatch(GetTurbineFilterData());
        }
    }, [dispatch, user ? .id]);

    // ----------------------------

    // PROJECTS

    // ----------------------------

    const projects = useMemo(() => {
        const map = new Map();

        getturbinefilter.forEach((r) => {
            if (r.project_id && !map.has(r.project_id)) {
                map.set(r.project_id, {
                    id: r.project_id,

                    name: r.project_name,
                });
            }
        });

        return [...map.values()];
    }, [getturbinefilter]);

    // ----------------------------

    // WINDFARMS

    // ----------------------------

    const windfarms = useMemo(() => {
        const map = new Map();

        getturbinefilter

            .filter((r) =>
                filters.project ?
                String(r.project_id) === String(filters.project) :
                true,
            )

            .forEach((r) => {
                if (r.windfarm_id && !map.has(r.windfarm_id)) {
                    map.set(r.windfarm_id, {
                        id: r.windfarm_id,

                        name: r.windfarm_name,
                    });
                }
            });

        return [...map.values()];
    }, [getturbinefilter, filters.project]);

    // ----------------------------

    // CLUSTERS (FIXED)

    // ----------------------------

    const clusters = useMemo(() => {
        const map = new Map();

        getturbinefilter

            .filter((r) => {
                if (!filters.windfarm) return true; // ✅ show all clusters

                return String(r.windfarm_id) === String(filters.windfarm);
            })

            .forEach((r) => {
                // allow null clusters safely

                if (!r.cluster_id) return;

                if (!map.has(r.cluster_id)) {
                    map.set(r.cluster_id, {
                        id: r.cluster_id,

                        name: r.cluster_name,
                    });
                }
            });

        return [...map.values()];
    }, [getturbinefilter, filters.windfarm]);

    // ----------------------------

    // HANDLERS

    // ----------------------------

    const handleProjectChange = (e) => {
        setFilters({
            project: e.target.value,

            windfarm: "",

            cluster: "",
        });
    };

    const handleWindfarmChange = (e) => {
        setFilters({
            ...filters,

            windfarm: e.target.value,

            cluster: "",
        });
    };

    const handleClusterChange = (e) => {
        setFilters({
            ...filters,

            cluster: e.target.value,
        });
    };


    const handleReset = () => {
        setFilters({
            project: "",
            windfarm: "",
            cluster: "",
        });

        // dispatch({ type: "CLEAR_TURBINE_FILTER_DATA" });

        // dispatch(GetTurbineFilterData());
    };

    // useEffect(() => {

    //   setFilters({

    //     project: "",

    //     windfarm: "",

    //     cluster: "",

    //   });

    // }, [user?.id]);

    return ( <
        Box sx = {
            {
                p: 2.5,
                // mb: 3,
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
                backdropFilter: "blur(8px)",
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                maxWidth: "xl",
                mx: "auto",
                boxShadow: "0 10px 25px -5px rgba(102, 126, 234, 0.08), 0 8px 10px -6px rgba(102, 126, 234, 0.08)",
                transition: "all 0.3s ease",
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2.5,
                    backgroundColor: "#fff",
                    transition: "all 0.2s ease",
                    "&:hover": {
                        borderColor: "#667eea",
                    },
                    "&.Mui-focused": {
                        boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.15)",
                    },
                },
            }
        } >
        <
        Grid container spacing = {
            2.5
        }
        alignItems = "center"
        justifyContent = "center" > { /* PROJECT */ } <
        Grid item xs = {
            12
        }
        md = {
            showCluster ? 3.5 : 4.5
        } >
        <
        TextField select fullWidth size = "small"
        label = "Select Project"
        value = {
            filters.project || ""
        }
        onChange = {
            handleProjectChange
        }
        InputLabelProps = {
            {
                style: {
                    fontWeight: 500
                }
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
                    p.name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* WINDFARM */ } <
        Grid item xs = {
            12
        }
        md = {
            showCluster ? 3.5 : 4.5
        } >
        <
        TextField select fullWidth size = "small"
        label = "Select Windfarm"
        value = {
            filters.windfarm || ""
        }
        onChange = {
            handleWindfarmChange
        }
        disabled = {!filters.project
        }
        InputLabelProps = {
            {
                style: {
                    fontWeight: 500
                }
            }
        } >
        {
            windfarms.length > 0 ? (
                windfarms.map((w) => ( <
                    MenuItem key = {
                        w.id
                    }
                    value = {
                        w.id
                    } > {
                        w.name
                    } <
                    /MenuItem>
                ))
            ) : ( <
                MenuItem disabled > No Windfarms Available < /MenuItem>
            )
        } <
        /TextField> <
        /Grid>

        { /* CLUSTER */ } {
            showCluster && ( <
                Grid item xs = {
                    12
                }
                md = {
                    3.5
                } >
                <
                TextField select fullWidth size = "small"
                label = "Select Cluster"
                value = {
                    filters.cluster || ""
                }
                onChange = {
                    handleClusterChange
                }
                disabled = {!filters.windfarm
                }
                InputLabelProps = {
                    {
                        style: {
                            fontWeight: 500
                        }
                    }
                } >
                <
                MenuItem value = "" > All Clusters < /MenuItem> {
                    clusters.length > 0 ? (
                        clusters.map((c) => ( <
                            MenuItem key = {
                                c.id
                            }
                            value = {
                                c.id
                            } > {
                                c.name
                            } <
                            /MenuItem>
                        ))
                    ) : ( <
                        MenuItem disabled > No Clusters Available < /MenuItem>
                    )
                } <
                /TextField> <
                /Grid>
            )
        }

        { /* RESET */ } <
        Grid item xs = {
            12
        }
        md = {
            showCluster ? 1.5 : 3
        } >
        <
        Tooltip title = "Reset Filters" >
        <
        Button variant = "outlined"
        color = "primary"
        // startIcon={<RestartAltIcon />}
        onClick = {
            handleReset
        }
        fullWidth sx = {
            {
                borderRadius: 2.5,
                py: 0.9,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#667eea",
                color: "#667eea",
                "&:hover": {
                    backgroundColor: "rgba(102, 126, 234, 0.04)",
                    borderColor: "#764ba2",
                    color: "#764ba2",
                },
            }
        } >
        Reset <
        /Button> <
        /Tooltip> <
        /Grid> <
        /Grid> <
        /Box>
    );
};

export default LocationFilterBar;