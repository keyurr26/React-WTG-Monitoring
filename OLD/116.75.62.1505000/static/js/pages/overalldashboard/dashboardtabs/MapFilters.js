// components/MapFilters.jsx
import React, {
    useMemo
} from "react";
import {
    Box,
    MenuItem,
    Select,
    Button
} from "@mui/material";

const MapFilters = ({
    filterOptions = {
        projects: [],
        windfarms: [],
        clusters: []
    },
    project,
    windfarm,
    cluster,
    onProjectChange,
    onWindfarmChange,
    onClusterChange,
    onClear,
}) => {
    // Filter windfarms based on selected project
    const filteredWindfarms = useMemo(() => {
        if (!project) return [];
        return filterOptions.windfarms.filter(w => w.project_id === project);
    }, [filterOptions.windfarms, project]);

    // Filter clusters based on selected windfarm
    const filteredClusters = useMemo(() => {
        if (!windfarm) return [];
        return filterOptions.clusters.filter(c => c.windfarm_id === windfarm);
    }, [filterOptions.clusters, windfarm]);

    return ( <
        Box sx = {
            {
                display: "flex",
                flexWrap: "wrap", // Wrap cleanly on small screens
                gap: 1.5,
                width: "100%",
                marginBottom: 2,
            }
        } >
        <
        Select size = "small"
        value = {
            project ? ? ""
        }
        displayEmpty onChange = {
            (e) => onProjectChange(e.target.value ? Number(e.target.value) : null)
        }
        sx = {
            {
                minWidth: 150,
                bgcolor: "background.paper"
            }
        } >
        <
        MenuItem value = "" > Select Project < /MenuItem> {
            filterOptions.projects.map((p) => ( <
                MenuItem key = {
                    p.id
                }
                value = {
                    p.id
                } > {
                    p.name
                } < /MenuItem>
            ))
        } <
        /Select>

        <
        Select size = "small"
        value = {
            windfarm ? ? ""
        }
        displayEmpty disabled = {!project
        }
        onChange = {
            (e) => onWindfarmChange(e.target.value ? Number(e.target.value) : null)
        }
        sx = {
            {
                minWidth: 160,
                bgcolor: "background.paper"
            }
        } >
        <
        MenuItem value = "" > Select Windfarm < /MenuItem> {
            filteredWindfarms.map((w) => ( <
                MenuItem key = {
                    w.id
                }
                value = {
                    w.id
                } > {
                    w.name
                } < /MenuItem>
            ))
        } <
        /Select>

        <
        Select size = "small"
        value = {
            cluster ? ? ""
        }
        displayEmpty disabled = {!windfarm
        }
        onChange = {
            (e) => onClusterChange(e.target.value ? Number(e.target.value) : null)
        }
        sx = {
            {
                minWidth: 150,
                bgcolor: "background.paper"
            }
        } >
        <
        MenuItem value = "" > Select Cluster < /MenuItem> {
            filteredClusters.map((c) => ( <
                MenuItem key = {
                    c.id
                }
                value = {
                    c.id
                } > {
                    c.name
                } < /MenuItem>
            ))
        } <
        /Select>

        {
            (project || windfarm || cluster) && ( <
                Button size = "small"
                variant = "outlined"
                color = "error"
                onClick = {
                    onClear
                }

                sx = {
                    {
                        ml: {
                            sm: "auto"
                        },
                        px: 2,
                        borderRadius: 2
                    }
                } >
                Clear <
                /Button>
            )
        } <
        /Box>
    );
};

export default MapFilters;