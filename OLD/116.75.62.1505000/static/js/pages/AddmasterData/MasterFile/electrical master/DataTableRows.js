import React from "react";
import {
    TableRow,
    TableCell,
    TextField,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    Chip,
    Box,
    Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";

export default function DataTableRows({
    lineType,
    currentRows,
    tables,
    availableTurbines,
    handleRowChange,
    isMCOH,
    isSCOHDog,
    isSCOH,
    isDCOH,
    getElectricalMaster,
    filters,
    handleRemoveRow,
    errors
}) {
    const clusters = [
        ...new Map(
            availableTurbines.map((item) => [
                item.cluster_id,
                {
                    id: item.cluster_id,
                    name: item.cluster_name
                },
            ]),
        ).values(),
    ];

    const scohDogLines =
        tables["SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)"] || [];

    const apiLines = getElectricalMaster
        .filter(
            (item) =>
            (item.line_type === "SCOH (Single Circuit Overhead Line)" ||
                item.line_type === "DCOH (Double Circuit Overhead Line)") &&
            item.project === Number(filters.project) &&
            item.windfarm === Number(filters.windfarm),
        )
        .map((item) => ({
            name: item.line_name,
            type: item.line_type.includes("DCOH") ? "DCOH" : "SCOH",
        }));

    // ✅ UPDATED: Ab combinedScohOptions API se lega
    const combinedScohOptions = getElectricalMaster
        .filter(
            (item) =>
            (item.line_type === "SCOH (Single Circuit Overhead Line)" ||
                item.line_type ===
                "SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)") &&
            item.project === Number(filters.project) &&
            item.windfarm === Number(filters.windfarm),
        )
        .map((item) => ({
            id: item.id,
            name: item.line_name,
            type: item.line_type.includes("Dog") ? "SCOH-DOG" : "SCOH",
            cluster: item.cluster,
        }));

    const getAvailableTurbines = (currentRow, index) => {
        const scohRows = tables["SCOH (Single Circuit Overhead Line)"] || [];
        const scohDogRows =
            tables["SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)"] || [];

        // 🔥 API data add karo
        const scohDogAPI = getElectricalMaster.filter(
            (item) =>
            item.line_type ===
            "SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)" &&
            item.project === Number(filters.project) &&
            item.windfarm === Number(filters.windfarm) &&
            item.cluster === Number(currentRow.cluster),
        );

        // API data for SCOH Panther (already used turbines)
        const scohPantherAPI = getElectricalMaster.filter(
            (item) =>
            item.line_type === "SCOH (Single Circuit Overhead Line)" &&
            item.project === Number(filters.project) &&
            item.windfarm === Number(filters.windfarm) &&
            item.cluster === Number(currentRow.cluster),
        );

        const apiRows = scohDogAPI.map((item) => ({
            cluster: item.cluster,
            turbine: item.turbine_ids || [],
        }));

        // 🔥 merge all

        // Get turbines from already posted SCOH Panther lines
        const pantherTurbines = scohPantherAPI.flatMap(
            (item) => item.turbine_ids || [],
        );

        // const allRows = [...scohRows, ...scohDogRows, ...apiRows];

        const allRows = isSCOHDog ?
            [...scohDogRows, ...apiRows] :
            [...scohRows, ...apiRows];

        // Used turbines in same cluster
        // Exclude current row so its own selected turbines remain editable

        const usedTurbines = allRows
            .filter((r) => r.cluster === currentRow.cluster && r !== currentRow)
            .flatMap((r) => r.turbine || []);

        const uniqueUsedTurbines = [
            ...new Set([...usedTurbines, ...pantherTurbines]),
        ];

        return availableTurbines.map((t) => ({
            ...t,
            isUsed: uniqueUsedTurbines.includes(t.id),
        }));
    };

    const getTurbinesByCluster = (clusterId, row, index) => {
        if (!clusterId) return [];
        return getAvailableTurbines(row, index).filter(
            (t) => t.cluster_id === clusterId,
        );
    };

    const isClusterFullyUsed = (cluster) => {
        const scohRows = tables["SCOH (Single Circuit Overhead Line)"] || [];
        const scohDogRows =
            tables["SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)"] || [];
        // 🔥 ADD THIS (API data)
        const scohDogAPI = getElectricalMaster.filter(
            (item) =>
            item.line_type ===
            "SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)" &&
            item.project === Number(filters.project) &&
            item.windfarm === Number(filters.windfarm),
        );

        const apiRows = scohDogAPI.map((item) => ({
            cluster: item.cluster,
            turbine: item.turbine_ids || [],
        }));

        // 🔥 FINAL MERGE (IMPORTANT)
        const allRows = [...scohRows, ...scohDogRows, ...apiRows];

        const usedTurbines = allRows
            .filter((r) => r.cluster === cluster)
            .flatMap((r) => r.turbine || []);

        const uniqueUsed = [...new Set(usedTurbines)];
        const totalClusterTurbines = availableTurbines.filter(
            (t) => t.cluster_id === cluster,
        );

        return uniqueUsed.length === totalClusterTurbines.length;
    };

    // 2. Update getUsedScohDogs to include API data
    const getUsedScohDogs = (currentRow) => {
        const scohRows = tables["SCOH (Single Circuit Overhead Line)"] || [];

        // Table se used dogs (SCOH Panther rows)
        const tableUsedDogs = scohRows
            .filter((r) => r !== currentRow)
            .flatMap((r) => r.scohDog || []);

        // ✅ 🔥 NEW: DCOH se used SCOH Dog lines (API se)
        const dcohUsedDogsFromAPI = getElectricalMaster
            .filter(
                (item) =>
                item.line_type === "DCOH (Double Circuit Overhead Line)" &&
                item.project === Number(filters.project) &&
                item.windfarm === Number(filters.windfarm),
            )
            .flatMap((item) => item.assign_scoh || [])
            .filter((lineName) => lineName ? .includes("SCOH-Dog")); // sirf SCOH Dog lines filter karo

        // ✅ 🔥 NEW: DCOH table se (unsaved rows)
        const dcohRows = tables["DCOH (Double Circuit Overhead Line)"] || [];
        const dcohUsedDogsFromTable = dcohRows
            .filter((r) => r !== currentRow)
            .flatMap((r) => r.scohLine || [])
            .filter((lineName) => lineName ? .includes("SCOH-Dog"));

        // ✅ API se already posted SCOH Panther lines (pehle se tha)
        const apiUsedDogs = getElectricalMaster
            .filter(
                (item) =>
                item.line_type === "SCOH (Single Circuit Overhead Line)" &&
                item.project === Number(filters.project) &&
                item.windfarm === Number(filters.windfarm) &&
                item.cluster === Number(currentRow.cluster),
            )
            .flatMap((item) => item.scoh_dog || []);

        // ✅ SABKO COMBINE KARO
        const allUsedDogs = [
            ...new Set([
                ...tableUsedDogs,
                ...apiUsedDogs,
                ...dcohUsedDogsFromAPI, // 🔥 DCOH API se used
                ...dcohUsedDogsFromTable, // 🔥 DCOH table se used (unsaved)
            ]),
        ];

        return allUsedDogs;
    };

    const usedScohDogFromAPI = getElectricalMaster.flatMap(
        (item) => item.scoh_dog || [],
    );

    const getUsedScohLines = (currentRow) => {
        const dcohRows = tables["DCOH (Double Circuit Overhead Line)"] || [];
        return dcohRows
            .filter((r) => r !== currentRow)
            .flatMap((r) => r.scohLine || []);
    };

    // ✅ API se already used lines (SCOH/DCOH used in DCOH)
    const usedLinesFromAPI = getElectricalMaster
        .filter(
            (item) =>
            item.line_type === "DCOH (Double Circuit Overhead Line)" &&
            item.project === Number(filters.project) &&
            item.windfarm === Number(filters.windfarm),
        )
        .flatMap((item) => item.assign_scoh || []);

    const allUsedLinesFromAPI = [
        ...new Set([...usedScohDogFromAPI, ...usedLinesFromAPI]),
    ];

    // MCOH ke backend saved records se assign_lines nikalo
    const usedMcohLinesFromAPI = getElectricalMaster
        .filter(
            (item) =>
            item.line_type === "MCOH (Multi Circuit Overhead Line)" &&
            item.project === Number(filters.project) &&
            item.windfarm === Number(filters.windfarm),
        )
        .flatMap((item) => item.assign_lines || []);

    const getUsedMCOHLines = (currentRow) => {
        const mcohRows = tables["MCOH (Multi Circuit Overhead Line)"] || [];
        return mcohRows
            .filter((r) => r !== currentRow)
            .flatMap((r) => r.linkedLines || []);
    };

    const getStatusIcon = (status) => {
        if (status ? .includes("✅"))
            return <CheckCircleIcon color = "success"
        fontSize = "small" / > ;
        if (status ? .includes("❌"))
            return <ErrorIcon color = "error"
        fontSize = "small" / > ;
        if (status ? .includes("⚠"))
            return <WarningIcon color = "warning"
        fontSize = "small" / > ;
        return null;
    };

    const getAllUsedTurbines = (currentRow) => {
        if (!currentRow.scohDog || currentRow.scohDog.length === 0) return [];

        // ✅ API se sirf selected SCOH Dog ka data lo
        const selectedDogs = getElectricalMaster.filter(
            (item) =>
            item.line_type ===
            "SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)" &&
            currentRow.scohDog.includes(item.line_name) &&
            item.project === Number(filters.project) &&
            item.windfarm === Number(filters.windfarm) &&
            item.cluster === Number(currentRow.cluster), // ✅ FIX
        );

        // ✅ unke turbine_ids nikalo
        const turbines = selectedDogs.flatMap((item) => item.turbine_ids || []);

        return [...new Set(turbines)];
    };

    const getAllUsedScohDogs = (currentRow) => {
        // Get from current row's selected dogs
        const currentSelected = Array.isArray(currentRow.scohDog) ?
            currentRow.scohDog.filter(Boolean) :
            [];

        // Get from API already used dogs (for display in "All Used SCOH Dogs" column)
        const apiUsedDogs = getElectricalMaster
            .filter(
                (item) =>
                item.line_type === "SCOH (Single Circuit Overhead Line)" &&
                item.project === Number(filters.project) &&
                item.windfarm === Number(filters.windfarm) &&
                item.cluster === Number(currentRow.cluster),
            )
            .flatMap((item) => item.scoh_dog || []);

        // Combine current row's selection with already used from API
        return [...new Set([...currentSelected, ...apiUsedDogs])];
    };

    return ( <
        > {
            currentRows.map((row, index) => ( <
                TableRow key = {
                    row.id
                }
                hover >
                <
                TableCell > { /* <Typography fontWeight="medium">{row.name}</Typography> */ }

                <
                TextField size = "small"
                value = {
                    row.name
                }
                onChange = {
                    (e) =>
                    handleRowChange(lineType, index, "name", e.target.value)
                }
                sx = {
                    {
                        width: 200
                    }
                }
                /> <
                /TableCell>

                <
                TableCell >
                <
                TextField size = "small"
                type = "number"
                value = {
                    row.km
                }
                onChange = {
                    (e) =>
                    handleRowChange(lineType, index, "km", e.target.value)
                }


                sx = {
                    {
                        width: 100,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: errors ? .[index] ? .km ? "red" : "",
                                borderWidth: errors ? .[index] ? .km ? "2px" : "1px",
                            },
                        },
                    }
                }
                inputProps = {
                    {
                        step: "0.1",
                        min: 0
                    }
                }
                /> <
                /TableCell>

                { /* SCOH-Dog */ } {
                    isSCOHDog && ( <
                        TableCell >
                        <
                        FormControl size = "small"
                        sx = {
                            {
                                minWidth: 100,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: errors ? .[index] ? .cluster ? "2px solid red" : "",
                                },
                            }
                        }

                        >
                        <
                        Select value = {
                            row.cluster || ""
                        }
                        onChange = {
                            (e) => {
                                const value = e.target.value;
                                handleRowChange(lineType, index, "cluster", value);
                                handleRowChange(lineType, index, "turbine", []);
                            }
                        }
                        displayEmpty >
                        <
                        MenuItem value = "" >
                        <
                        em > Select < /em> <
                        /MenuItem> {
                            clusters.map((c) => {
                                const isUsed = isClusterFullyUsed(c.id);
                                return ( <
                                    MenuItem key = {
                                        c.id
                                    }
                                    value = {
                                        c.id
                                    }
                                    disabled = {
                                        isUsed
                                    } > {
                                        c.name
                                    } {
                                        isUsed && ( <
                                            Typography variant = "caption"
                                            sx = {
                                                {
                                                    ml: 1,
                                                    color: "red"
                                                }
                                            } >
                                            (All turbines used) <
                                            /Typography>
                                        )
                                    } <
                                    /MenuItem>
                                );
                            })
                        } <
                        /Select> <
                        /FormControl> <
                        /TableCell>
                    )
                }

                { /* SCOH */ } {
                    isSCOH && ( <
                        >
                        <
                        TableCell >
                        <
                        FormControl size = "small"
                        sx = {
                            {
                                minWidth: 100,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: errors ? .[index] ? .cluster ? "2px solid red" : "",
                                },
                            }
                        }

                        >
                        <
                        Select value = {
                            row.cluster || ""
                        }
                        onChange = {
                            (e) => {
                                const value = e.target.value;
                                handleRowChange(lineType, index, "cluster", value);
                                handleRowChange(lineType, index, "turbine", []);
                            }
                        }
                        displayEmpty >
                        <
                        MenuItem value = "" >
                        <
                        em > Select < /em> <
                        /MenuItem> {
                            clusters.map((c) => {
                                const isUsed = isClusterFullyUsed(c.id);
                                return ( <
                                    MenuItem key = {
                                        c.id
                                    }
                                    value = {
                                        c.id
                                    }
                                    // disabled={isUsed}
                                    disabled = {
                                        isSCOHDog && isUsed
                                    } >
                                    {
                                        c.name
                                    } {
                                        isUsed && ( <
                                            Typography variant = "caption"
                                            sx = {
                                                {
                                                    ml: 1,
                                                    color: "red"
                                                }
                                            } >
                                            (All turbines used) <
                                            /Typography>
                                        )
                                    } <
                                    /MenuItem>
                                );
                            })
                        } <
                        /Select> <
                        /FormControl> <
                        /TableCell>

                        <
                        TableCell >
                        <
                        FormControl size = "small"
                        sx = {
                            {
                                minWidth: 150
                            }
                        } >
                        <
                        Select multiple value = {
                            row.turbine || []
                        }
                        // disabled={(row.scohDog || []).length > 0}
                        onChange = {
                            (e) => {
                                const value = e.target.value;
                                handleRowChange(
                                    lineType,
                                    index,
                                    "turbine",
                                    typeof value === "string" ? value.split(",") : value,
                                );
                            }
                        }
                        renderValue = {
                            (selected) =>
                            selected
                            .map((id) => {
                                const t = availableTurbines.find((x) => x.id === id);
                                return t ? `${t.name} (${t.wtg_capacity_mw} MW)` : id;
                            })
                            .join(", ")
                        } >
                        {
                            getTurbinesByCluster(row.cluster, row, index).length ===
                            0 ? ( <
                                MenuItem disabled > No turbines available < /MenuItem>
                            ) : (
                                getTurbinesByCluster(row.cluster, row, index).map((t) => ( <
                                    MenuItem key = {
                                        t.id
                                    }
                                    value = {
                                        t.id
                                    }
                                    disabled = {
                                        t.isUsed
                                    } >
                                    <
                                    Checkbox checked = {
                                        row.turbine ? .indexOf(t.id) > -1
                                    }
                                    /> <
                                    ListItemText
                                    // primary={t.name}
                                    primary = {
                                        `${t.name} (${t.wtg_capacity_mw} MW)`
                                    }
                                    /> {
                                        t.isUsed && ( <
                                            Typography variant = "caption"
                                            sx = {
                                                {
                                                    ml: 1,
                                                    color: "red"
                                                }
                                            } >
                                            (Used) <
                                            /Typography>
                                        )
                                    } <
                                    /MenuItem>
                                ))
                            )
                        } <
                        /Select> <
                        /FormControl> { /* ✅ USED TURBINES SHOW */ } {
                            row.turbine ? .length > 0 && ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        color: "gray",
                                        display: "block",
                                        mt: 0.5
                                    }
                                } >
                                Used: {
                                    " "
                                } {
                                    row.turbine
                                        .map((id) => {
                                            const t = availableTurbines.find((x) => x.id === id);
                                            return t ? `${t.name} (${t.wtg_capacity_mw} MW)` : id;
                                        })
                                        .join(", ")
                                } <
                                /Typography>
                            )
                        } <
                        /TableCell>

                        { /* 🔥 ALL USED TURBINES COLUMN */ } <
                        TableCell sx = {
                            {
                                minWidth: 300,
                                width: 300,
                                // whiteSpace: "nowrap",
                            }
                        } >
                        {
                            row.cluster ?
                            getAllUsedTurbines(row)
                            .map((id) => {
                                const t = availableTurbines.find((x) => x.id === id);
                                return t ? `${t.name} (${t.wtg_capacity_mw} MW)` : id;
                            })
                            .join(", ") || "-" :
                                "-"
                        } <
                        /TableCell>

                        <
                        TableCell >
                        <
                        FormControl size = "small"
                        sx = {
                            {
                                minWidth: 120,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: errors ? .[index] ? .scohDog ? "2px solid red" : "",
                                },
                            }
                        } >
                        <
                        Select multiple value = {
                            row.scohDog || []
                        }
                        // disabled={(row.turbine || []).length > 0}
                        onChange = {
                            (e) => {
                                const value = e.target.value;
                                handleRowChange(
                                    lineType,
                                    index,
                                    "scohDog",
                                    typeof value === "string" ? value.split(",") : value,
                                );
                            }
                        }
                        renderValue = {
                            (selected) =>
                            Array.isArray(selected) ? selected.join(", ") : ""
                        } >
                        { /* 🔥 FIXED: row-wise filtering */ } {
                            getElectricalMaster
                                .filter(
                                    (item) =>
                                    item.line_type ===
                                    "SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)" &&
                                    item.project === Number(filters.project) &&
                                    item.windfarm === Number(filters.windfarm) &&
                                    item.cluster === Number(row.cluster), // ✅ now correct
                                )
                                .map((item) => {
                                    const usedDogs = getUsedScohDogs(row);
                                    const isUsed = usedDogs.includes(item.line_name);

                                    return ( <
                                        MenuItem key = {
                                            item.id
                                        }
                                        value = {
                                            item.line_name
                                        }
                                        disabled = {
                                            isUsed
                                        } >
                                        <
                                        Checkbox checked = {
                                            row.scohDog ? .indexOf(item.line_name) > -1
                                        }
                                        /> <
                                        ListItemText primary = {
                                            item.line_name
                                        }
                                        />

                                        {
                                            isUsed && ( <
                                                Typography variant = "caption"
                                                sx = {
                                                    {
                                                        ml: 1,
                                                        color: "red"
                                                    }
                                                } >
                                                (Used) <
                                                /Typography>
                                            )
                                        } <
                                        /MenuItem>
                                    );
                                })
                        } <
                        /Select> <
                        /FormControl>

                        { /* ✅ USED SCOH DOG */ } {
                            row.scohDog ? .length > 0 && ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        color: "gray",
                                        display: "block",
                                        mt: 0.5
                                    }
                                } >
                                Used: {
                                    row.scohDog.join(", ")
                                } <
                                /Typography>
                            )
                        } <
                        /TableCell>

                        { /* 🔥 ALL USED SCOH DOG COLUMN */ } <
                        TableCell > {
                            row.cluster ? getAllUsedScohDogs(row).join(", ") || "-" : "-"
                        } <
                        /TableCell> <
                        />
                    )
                }

                { /* SCOH-Dog Turbine Multi Select */ } {
                    isSCOHDog && ( <
                        TableCell >
                        <
                        FormControl size = "small"
                        sx = {
                            {
                                minWidth: 150,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: errors ? .[index] ? .turbine ? "2px solid red" : "",
                                },
                            }
                        }

                        >
                        <
                        Select multiple value = {
                            row.turbine || []
                        }
                        onChange = {
                            (e) => {
                                const value = e.target.value;
                                handleRowChange(
                                    lineType,
                                    index,
                                    "turbine",
                                    typeof value === "string" ? value.split(",") : value,
                                );
                            }
                        }
                        renderValue = {
                            (selected) =>
                            selected
                            .map((id) => {
                                const t = availableTurbines.find((x) => x.id === id);
                                return t ? `${t.name} (${t.wtg_capacity_mw} MW)` : id;
                            })
                            .join(", ")
                        } >
                        {
                            getTurbinesByCluster(row.cluster, row, index).map((t) => ( <
                                MenuItem key = {
                                    t.id
                                }
                                value = {
                                    t.id
                                }
                                disabled = {
                                    t.isUsed
                                } >
                                <
                                Checkbox checked = {
                                    row.turbine ? .indexOf(t.id) > -1
                                }
                                /> <
                                ListItemText
                                // primary={t.name}

                                primary = {
                                    `${t.name} (${t.wtg_capacity_mw} MW)`
                                }
                                /> {
                                    t.isUsed && ( <
                                        Typography variant = "caption"
                                        sx = {
                                            {
                                                ml: 1,
                                                color: "red"
                                            }
                                        } >
                                        (Used) <
                                        /Typography>
                                    )
                                } <
                                /MenuItem>
                            ))
                        } <
                        /Select> <
                        /FormControl>

                        { /* ✅ USED TURBINES SHOW */ } {
                            row.turbine ? .length > 0 && ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        color: "gray",
                                        display: "block",
                                        mt: 0.5
                                    }
                                } >
                                Used: {
                                    " "
                                } {
                                    row.turbine
                                        .map((id) => {
                                            const t = availableTurbines.find((x) => x.id === id);
                                            return t ? `${t.name} (${t.wtg_capacity_mw} MW)` : id;
                                        })
                                        .join(", ")
                                } <
                                /Typography>
                            )
                        } <
                        /TableCell>
                    )
                }

                {
                    (isSCOHDog || isSCOH) && ( <
                        > { /* ✅ CAPACITY DETAILS COLUMN */ } <
                        TableCell > {
                            row.totalMW && ( <
                                Box >
                                <
                                Typography variant = "body2"
                                sx = {
                                    {
                                        fontWeight: "bold",
                                        color: row.totalMW === (isSCOH ? 30 : 12) ?
                                            "green" :
                                            row.totalMW > (isSCOH ? 30 : 12) ?
                                            "red" :
                                            "orange",
                                    }
                                } >
                                {
                                    row.totalMW
                                }
                                MW <
                                /Typography>

                                <
                                Typography variant = "caption"
                                display = "block" >
                                Selected: {
                                    row.selectedTurbines
                                } <
                                /Typography> <
                                /Box>
                            )
                        } <
                        /TableCell>

                        { /* ✅ STATUS COLUMN */ } <
                        TableCell > {
                            row.status && ( <
                                Chip label = {
                                    row.status
                                }
                                color = {
                                    row.statusColor === "success" ?
                                    "success" :
                                        row.statusColor === "error" ?
                                        "error" :
                                        "warning"
                                }
                                size = "small" /
                                >
                            )
                        } <
                        /TableCell> <
                        TableCell align = "center" >
                        <
                        Button size = "small"
                        color = "error"
                        variant = "outlined"
                        onClick = {
                            () => handleRemoveRow(lineType, index)
                        } >
                        ✕
                        <
                        /Button> <
                        /TableCell> <
                        />
                    )
                }

                { /* DCOH */ }

                {
                    isDCOH && ( <
                        >
                        <
                        TableCell >
                        <
                        FormControl size = "small"
                        // sx={{ minWidth: 150 }}
                        error = {
                            (row.scohLine || []).length > 2
                        }

                        sx = {
                            {
                                minWidth: 150,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: errors ? .[index] ? .scohLine ||
                                        (row.scohLine || []).length > 2 ?
                                        "2px solid red" :
                                        "",
                                },
                            }
                        } >
                        <
                        Select multiple value = {
                            Array.isArray(row.scohLine) ? row.scohLine : []
                        }
                        onChange = {
                            (e) => {
                                let value = e.target.value;
                                value =
                                    typeof value === "string" ? value.split(",") : value;

                                if (value.length <= 2) {
                                    handleRowChange(lineType, index, "scohLine", value);
                                }
                            }
                        }
                        renderValue = {
                            (selected) =>
                            Array.isArray(selected) ? selected.join(", ") : ""
                        } >
                        {
                            combinedScohOptions.map((item) => {
                                const dcohRows =
                                    tables["DCOH (Double Circuit Overhead Line)"] || [];
                                const usedLinesInCurrentDCOH = dcohRows
                                    .filter((r) => r !== row)
                                    .flatMap((r) => r.scohLine || []);

                                const usedLinesFromAPI = getElectricalMaster
                                    .filter(
                                        (apiItem) =>
                                        apiItem.line_type ===
                                        "DCOH (Double Circuit Overhead Line)" &&
                                        apiItem.project === Number(filters.project) &&
                                        apiItem.windfarm === Number(filters.windfarm),
                                    )
                                    .flatMap((apiItem) => apiItem.assign_scoh || []);

                                const usedScohDogFromSCOHPantherAPI = getElectricalMaster
                                    .filter(
                                        (apiItem) =>
                                        apiItem.line_type ===
                                        "SCOH (Single Circuit Overhead Line)" &&
                                        apiItem.project === Number(filters.project) &&
                                        apiItem.windfarm === Number(filters.windfarm),
                                    )
                                    .flatMap((apiItem) => apiItem.scoh_dog || []);

                                const scohPantherRows =
                                    tables["SCOH (Single Circuit Overhead Line)"] || [];
                                const usedScohDogInCurrentSCOH = scohPantherRows.flatMap(
                                    (r) => r.scohDog || [],
                                );

                                const usedLinesFromMCOHAPI = getElectricalMaster
                                    .filter(
                                        (apiItem) =>
                                        apiItem.line_type ===
                                        "MCOH (Multi Circuit Overhead Line)" &&
                                        apiItem.project === Number(filters.project) &&
                                        apiItem.windfarm === Number(filters.windfarm),
                                    )
                                    .flatMap((apiItem) => apiItem.assign_lines || []);

                                const mcohRows =
                                    tables["MCOH (Multi Circuit Overhead Line)"] || [];
                                const usedLinesInCurrentMCOH = mcohRows.flatMap(
                                    (r) => r.linkedLines || [],
                                );

                                const allUsedLines = [
                                    ...new Set([
                                        ...usedLinesFromAPI,
                                        ...usedLinesInCurrentDCOH,
                                        ...usedScohDogFromSCOHPantherAPI,
                                        ...usedScohDogInCurrentSCOH,
                                        ...usedLinesFromMCOHAPI,
                                        ...usedLinesInCurrentMCOH,
                                    ]),
                                ];

                                const isLineUsed = allUsedLines.includes(item.name);

                                return ( <
                                    MenuItem key = {
                                        item.id
                                    }
                                    value = {
                                        item.name
                                    }
                                    disabled = {
                                        isLineUsed
                                    } >
                                    <
                                    Checkbox checked = {
                                        row.scohLine ? .indexOf(item.name) > -1
                                    }
                                    /> <
                                    ListItemText primary = {
                                        `${item.name} (${item.type})`
                                    }
                                    />

                                    {
                                        isLineUsed && ( <
                                            Typography variant = "caption"
                                            sx = {
                                                {
                                                    ml: 1,
                                                    color: "red"
                                                }
                                            } >
                                            (Already Used in DCOH / SCOH / MCOH) <
                                            /Typography>
                                        )
                                    } <
                                    /MenuItem>
                                );
                            })
                        } <
                        /Select>

                        {
                            (row.scohLine || []).length >= 2 && ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        color: "red",
                                        mt: 0.5
                                    }
                                } >
                                Max 2 SCOH allowed(DCOH = 2 circuits) <
                                /Typography>
                            )
                        }

                        {
                            row.scohLine ? .length > 0 && ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        color: "gray",
                                        display: "block",
                                        mt: 0.5
                                    }
                                } >
                                Used: {
                                    row.scohLine.join(", ")
                                } <
                                /Typography>
                            )
                        } <
                        /FormControl> <
                        /TableCell>

                        <
                        TableCell align = "center" >
                        <
                        Button size = "small"
                        color = "error"
                        variant = "outlined"
                        onClick = {
                            () => handleRemoveRow(lineType, index)
                        } >
                        ✕
                        <
                        /Button> <
                        /TableCell> <
                        />
                    )
                }

                {
                    isMCOH && ( <
                        >
                        <
                        TableCell >
                        <
                        FormControl size = "small"
                        sx = {
                            {
                                minWidth: 80,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: errors ? .[index] ? .totalCircuit ? "2px solid red" : "",
                                },
                            }
                        } >
                        <
                        Select value = {
                            row.totalCircuit
                        }
                        onChange = {
                            (e) =>
                            handleRowChange(
                                lineType,
                                index,
                                "totalCircuit",
                                e.target.value,
                            )
                        }
                        displayEmpty >
                        <
                        MenuItem value = "" >
                        <
                        em > Select < /em> <
                        /MenuItem> <
                        MenuItem value = {
                            3
                        } > 3 < /MenuItem> <
                        MenuItem value = {
                            4
                        } > 4 < /MenuItem> <
                        /Select> <
                        /FormControl> <
                        /TableCell>

                        <
                        TableCell >
                        <
                        FormControl size = "small"
                        sx = {
                            {
                                minWidth: 200,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: errors ? .[index] ? .linkedLines ? "2px solid red" : "",
                                },
                            }
                        }

                        >
                        <
                        Select multiple value = {
                            row.linkedLines || []
                        }
                        onChange = {
                            (e) => {
                                const selectedValues = e.target.value;
                                const newValue =
                                    typeof selectedValues === "string" ?
                                    selectedValues.split(",") :
                                    selectedValues;

                                let totalCircuits = 0;
                                newValue.forEach((lineName) => {
                                    const line = apiLines.find((l) => l.name === lineName);
                                    if (line ? .type === "DCOH") {
                                        totalCircuits += 2;
                                    } else {
                                        totalCircuits += 1;
                                    }
                                });

                                const targetCircuit = Number(row.totalCircuit);
                                if (targetCircuit && totalCircuits > targetCircuit) {
                                    handleRowChange(
                                        lineType,
                                        index,
                                        "linkedLines",
                                        newValue,
                                    );
                                } else {
                                    handleRowChange(
                                        lineType,
                                        index,
                                        "linkedLines",
                                        newValue,
                                    );
                                }
                            }
                        }
                        renderValue = {
                            (selected) => selected.join(", ")
                        } >
                        {
                            apiLines.map((item) => {
                                const usedLines = getUsedMCOHLines(row);

                                const isUsed =
                                    usedLines.includes(item.name) ||
                                    usedLinesFromAPI.includes(item.name) ||
                                    usedMcohLinesFromAPI.includes(item.name);

                                const currentSelected = row.linkedLines || [];
                                let currentTotal = 0;
                                currentSelected.forEach((lineName) => {
                                    const line = apiLines.find((l) => l.name === lineName);
                                    if (line ? .type === "DCOH") {
                                        currentTotal += 2;
                                    } else {
                                        currentTotal += 1;
                                    }
                                });

                                const itemCircuits = item.type === "DCOH" ? 2 : 1;
                                const wouldExceed =
                                    row.totalCircuit &&
                                    currentTotal + itemCircuits >
                                    Number(row.totalCircuit) &&
                                    !currentSelected.includes(item.name);

                                return ( <
                                    MenuItem key = {
                                        item.name
                                    }
                                    value = {
                                        item.name
                                    }
                                    disabled = {
                                        isUsed || wouldExceed
                                    } >
                                    <
                                    Checkbox checked = {
                                        row.linkedLines ? .indexOf(item.name) > -1
                                    }
                                    /> <
                                    ListItemText primary = {
                                        `${item.name} (${item.type} - ${item.type === "DCOH" ? "2 circuits" : "1 circuit"})`
                                    }
                                    /> {
                                        isUsed && ( <
                                            Typography variant = "caption"
                                            sx = {
                                                {
                                                    ml: 1,
                                                    color: "red"
                                                }
                                            } >
                                            (Used) <
                                            /Typography>
                                        )
                                    }

                                    {
                                        wouldExceed && !isUsed && ( <
                                            Typography variant = "caption"
                                            sx = {
                                                {
                                                    ml: 1,
                                                    color: "red"
                                                }
                                            } >
                                            (Would exceed {
                                                    row.totalCircuit
                                                }
                                                circuits) <
                                            /Typography>
                                        )
                                    } <
                                    /MenuItem>
                                );
                            })
                        } <
                        /Select> <
                        /FormControl>

                        {
                            row.linkedLines ? .length > 0 && ( <
                                Typography variant = "caption"
                                sx = {
                                    {
                                        color: "gray",
                                        display: "block",
                                        mt: 0.5
                                    }
                                } >
                                Used: {
                                    row.linkedLines.join(", ")
                                } <
                                /Typography>
                            )
                        }

                        {
                            row.linkedLines ? .length > 0 && ( <
                                Box sx = {
                                    {
                                        mt: 1
                                    }
                                } > {
                                    row.linkedLines.map((lineName, idx) => {
                                        const line = apiLines.find((l) => l.name === lineName);
                                        const circuits = line ? .type === "DCOH" ? 2 : 1;
                                        return ( <
                                            Typography key = {
                                                idx
                                            }
                                            variant = "caption"
                                            sx = {
                                                {
                                                    display: "block",
                                                    color: "gray"
                                                }
                                            } >
                                            •{
                                                lineName
                                            }({
                                                    circuits
                                                }
                                                circuit {
                                                    circuits > 1 ? "s" : ""
                                                }) <
                                            /Typography>
                                        );
                                    })
                                } <
                                Typography variant = "body2"
                                sx = {
                                    {
                                        mt: 0.5,
                                        fontWeight: "bold",
                                        color: row.calculated === Number(row.totalCircuit) ?
                                            "green" :
                                            row.calculated > Number(row.totalCircuit) ?
                                            "red" :
                                            "orange",
                                    }
                                } >
                                Total: {
                                    row.calculated
                                }
                                / {row.totalCircuit || "?"}{" "}
                                circuits <
                                /Typography> <
                                /Box>
                            )
                        } <
                        /TableCell> <
                        TableCell >
                        <
                        Chip label = {
                            row.calculated !== null ? row.calculated : "-"
                        }
                        size = "small"
                        variant = "outlined"
                        color = {
                            row.calculated === Number(row.totalCircuit) ?
                            "success" :
                                row.calculated > Number(row.totalCircuit) ?
                                "error" :
                                "default"
                        }
                        /> <
                        /TableCell>

                        <
                        TableCell >
                        <
                        Box sx = {
                            {
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5
                            }
                        } > {
                            getStatusIcon(row.status)
                        } <
                        Typography variant = "body2"
                        sx = {
                            {
                                color: row.statusColor === "success" ?
                                    "#2e7d32" :
                                    row.statusColor === "error" ?
                                    "#d32f2f" :
                                    row.statusColor === "warning" ?
                                    "#ed6c02" :
                                    "inherit",
                                fontWeight: 500,
                            }
                        } >
                        {
                            row.status || "-"
                        } <
                        /Typography> <
                        /Box> <
                        /TableCell>

                        <
                        TableCell align = "center" >
                        <
                        Button size = "small"
                        color = "error"
                        variant = "outlined"
                        onClick = {
                            () => handleRemoveRow(lineType, index)
                        } >
                        ✕
                        <
                        /Button> <
                        /TableCell> <
                        />
                    )
                } <
                /TableRow>
            ))
        } <
        />
    );
}