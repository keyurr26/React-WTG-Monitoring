import React, {
    useEffect,
    useState,
    useMemo
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    MenuItem,
    Paper,
    CircularProgress
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import OutboxIcon from "@mui/icons-material/Outbox";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import AssessmentIcon from "@mui/icons-material/Assessment";
import {
    GetProjectsData,
    GetWindFarmMasterData,
    GetMaterialStockSummary,
    GetWTGMakeModelData
} from "../../../Redux/MasterData/masterAction";
import MaterialAgingBucketChart from "./MaterialAgingBucketChart";
import MaterialFifoAgingTable from "./MaterialFifoAgingTable";
import ExpiryAlertTable from "./ExpiryAlertTable";

import {
    GetMaterialAgingData
} from "../../../Redux/InventaryData/inventaryAction";

import StockDistributionPieChart from "./StockDistributionPieChart";

import MaterialBarChart from "./MaterialBarChart";

const KPI_GRADIENTS = [
    "linear-gradient(135deg, #ff512f, #dd2476)",
    "linear-gradient(135deg, #11998e, #38ef7d)",
    "linear-gradient(135deg, #396afc, #2948ff)",
    "linear-gradient(135deg, #f7971e, #ffd200)",
];

const InventoryDashboard = () => {
    const dispatch = useDispatch();
    const {
        materialAging = [], loading: inventoryLoading = false
    } = useSelector(
        (state) => state.inventaryData,
    );
    const {
        projects = [],
            WindfarmData = [],
            stockSummary = [],
            loading = false, // Stock summary loading state
    } = useSelector((state) => state.masterData || {});

    const [selectedProject, setSelectedProject] = useState("");
    const [selectedWindfarm, setSelectedWindfarm] = useState("");
    const [wtgModel, setWtgModel] = useState("");

    // 🔥 Load Master Data
    useEffect(() => {
        dispatch(GetProjectsData());
        dispatch(GetWindFarmMasterData());
        dispatch(GetWTGMakeModelData());
    }, [dispatch]);

    // 🔥 Backend Stock Filter → Project + Windfarm Only
    useEffect(() => {
        const params = {};
        if (selectedProject) params.project = selectedProject;
        if (selectedWindfarm) params.windfarm = selectedWindfarm;
        if (wtgModel) params.model = wtgModel;

        dispatch(GetMaterialStockSummary(params));
    }, [dispatch, selectedProject, selectedWindfarm, wtgModel]);

    // =====================================================
    // ⭐ DATA FOR KPI + BAR + PIE (Project/Windfarm only)
    // =====================================================
    const projectFilteredStock = useMemo(() => {
        const map = {};
        stockSummary.forEach((item) => {
            if (!map[item.material_name]) {
                map[item.material_name] = { ...item
                };
            } else {
                map[item.material_name].total_received += item.total_received || 0;
                map[item.material_name].total_issued += item.total_issued || 0;
                map[item.material_name].total_returned += item.total_returned || 0;
                map[item.material_name].balance_qty += item.balance_qty || 0;
            }
        });
        return Object.values(map);
    }, [stockSummary]);

    // =====================================================
    // ⭐ DATA FOR LINE CHART (WTG MODEL ONLY)
    // =====================================================
    const modelFilteredStock = useMemo(() => {
        let data = stockSummary;
        if (wtgModel) {
            data = data.filter((d) => d.wtg_model === wtgModel);
        }
        const map = {};
        data.forEach((item) => {
            if (!map[item.material_name]) {
                map[item.material_name] = { ...item
                };
            } else {
                map[item.material_name].total_received += item.total_received || 0;
                map[item.material_name].total_issued += item.total_issued || 0;
                map[item.material_name].total_returned += item.total_returned || 0;
                map[item.material_name].balance_qty += item.balance_qty || 0;
            }
        });
        return Object.values(map);
    }, [stockSummary, wtgModel]);

    useEffect(() => {
        const params = {};
        if (selectedProject) params.project = selectedProject;
        if (selectedWindfarm) params.windfarm = selectedWindfarm;

        dispatch(GetMaterialAgingData(params));
    }, [dispatch, selectedProject, selectedWindfarm]);

    // =====================================================
    // ⭐ KPI
    // =====================================================
    const kpiData = useMemo(
        () => ({
            totalReceived: projectFilteredStock.reduce(
                (a, s) => a + (s.total_received || 0),
                0,
            ),
            totalIssued: projectFilteredStock.reduce(
                (a, s) => a + (s.total_issued || 0),
                0,
            ),
            totalReturn: projectFilteredStock.reduce(
                (a, s) => a + (s.total_returned || 0),
                0,
            ),
            totalBalance: projectFilteredStock.reduce(
                (a, s) => a + (s.balance_qty || 0),
                0,
            ),
        }), [projectFilteredStock],
    );

    // Initial Full-Page Loader when data is fetching and projects haven't loaded yet
    if (loading && projects.length === 0) {
        return ( <
            Box sx = {
                {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                }
            } >
            <
            CircularProgress size = {
                60
            }
            /> <
            /Box>
        );
    }

    return ( <
        Box sx = {
            {
                p: 3,
                position: "relative"
            }
        } > { /* KPI */ } <
        Grid container spacing = {
            3
        }
        sx = {
            {
                mb: 3
            }
        } > {
            [{
                    title: "Total Received",
                    value: kpiData.totalReceived,
                    icon: < Inventory2Icon sx = {
                        {
                            fontSize: 55,
                            opacity: 0.5
                        }
                    }
                    />,
                },
                {
                    title: "Total Issued",
                    value: kpiData.totalIssued,
                    icon: < OutboxIcon sx = {
                        {
                            fontSize: 55,
                            opacity: 0.5
                        }
                    }
                    />,
                },
                {
                    title: "Return Stock",
                    value: kpiData.totalReturn,
                    icon: < KeyboardReturnIcon sx = {
                        {
                            fontSize: 55,
                            opacity: 0.5
                        }
                    }
                    />,
                },
                {
                    title: "Balance Stock",
                    value: kpiData.totalBalance,
                    icon: < AssessmentIcon sx = {
                        {
                            fontSize: 55,
                            opacity: 0.5
                        }
                    }
                    />,
                },
            ].map((kpi, i) => ( <
                Grid item xs = {
                    12
                }
                sm = {
                    3
                }
                key = {
                    i
                } >
                <
                Card sx = {
                    {
                        p: 2,
                        color: "white",
                        background: KPI_GRADIENTS[i],
                        borderRadius: 3,
                        position: "relative",
                        overflow: "hidden",
                    }
                } >
                <
                CardContent sx = {
                    {
                        display: "flex",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                    }
                } >
                <
                Box > {
                    kpi.icon
                } < /Box> <
                Box >
                <
                Typography variant = "h6" > {
                    kpi.title
                } < /Typography> <
                Typography variant = "h4"
                fontWeight = {
                    700
                } > {
                    kpi.value.toLocaleString()
                } <
                /Typography> <
                /Box> <
                /CardContent> <
                /Card> <
                /Grid>
            ))
        } <
        /Grid>

        { /* PROJECT FILTER */ } <
        Paper sx = {
            {
                p: 2,
                mb: 3,
                borderRadius: 3
            }
        } >
        <
        Grid container spacing = {
            2
        } >
        <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        TextField select fullWidth size = "small"
        label = "Project"
        value = {
            selectedProject
        }
        onChange = {
            (e) => {
                setSelectedProject(e.target.value);
                setSelectedWindfarm("");
            }
        }
        SelectProps = {
            {
                displayEmpty: true,
                renderValue: (value) => {
                    if (!value) return "-- Select Project --";
                    const project = projects.find((p) => p.id === value);
                    return project ? project.project_name : "";
                },
            }
        }
        InputLabelProps = {
            {
                shrink: true
            }
        } >
        <
        MenuItem value = "" > All Projects < /MenuItem> {
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

        <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        TextField select fullWidth size = "small"
        label = "Windfarm"
        value = {
            selectedWindfarm
        }
        disabled = {!selectedProject
        }
        onChange = {
            (e) => setSelectedWindfarm(e.target.value)
        }
        SelectProps = {
            {
                displayEmpty: true,
                renderValue: (value) => {
                    if (!value) return "-- Select Windfarm --";
                    const windfarm = WindfarmData.find((w) => w.id === value);
                    return windfarm ? windfarm.windfarm_name : "";
                },
            }
        }
        InputLabelProps = {
            {
                shrink: true
            }
        } >
        <
        MenuItem value = "" > All Windfarms < /MenuItem> {
            WindfarmData.filter((w) => w.project === selectedProject).map(
                (w) => ( <
                    MenuItem key = {
                        w.id
                    }
                    value = {
                        w.id
                    } > {
                        w.windfarm_name
                    } <
                    /MenuItem>
                ),
            )
        } <
        /TextField> <
        /Grid> <
        /Grid> <
        /Paper>

        { /* ⭐ MATERIAL STOCK SUMMARY (BAR CHART) WITH LOADER */ } <
        Paper sx = {
            {
                p: 2,
                mb: 3,
                borderRadius: 3,
                position: "relative",
                minHeight: "250px",
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                mb: 2,
                color: "#00416A",
                fontWeight: "bold",
                borderBottom: "2px solid #1976d2",
                pb: 1,
            }
        } >
        Material Stock Summary <
        /Typography>

        {
            loading ? ( <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px",
                    }
                } >
                <
                CircularProgress / >
                <
                /Box>
            ) : ( <
                MaterialBarChart data = {
                    modelFilteredStock
                }
                />
            )
        } <
        /Paper>

        { /* OTHER CHARTS & TABLES WITH INDIVIDUAL LOADERS */ } <
        Grid container spacing = {
            3
        } >
        <
        Grid item xs = {
            12
        }
        md = {
            8
        } > {
            inventoryLoading ? ( <
                Paper sx = {
                    {
                        p: 4,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "200px",
                        borderRadius: 3,
                    }
                } >
                <
                CircularProgress / >
                <
                /Paper>
            ) : ( <
                ExpiryAlertTable data = {
                    materialAging
                }
                />
            )
        } <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            4
        } > {
            loading ? ( <
                Paper sx = {
                    {
                        p: 4,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "200px",
                        borderRadius: 3,
                    }
                } >
                <
                CircularProgress / >
                <
                /Paper>
            ) : ( <
                StockDistributionPieChart data = {
                    projectFilteredStock
                }
                />
            )
        } <
        /Grid> <
        /Grid>

        <
        Grid container spacing = {
            3
        }
        sx = {
            {
                mt: 2
            }
        } >
        <
        Grid item xs = {
            12
        } > {
            inventoryLoading ? ( <
                Paper sx = {
                    {
                        p: 4,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "200px",
                        borderRadius: 3,
                    }
                } >
                <
                CircularProgress / >
                <
                /Paper>
            ) : ( <
                MaterialAgingBucketChart data = {
                    materialAging
                }
                />
            )
        } <
        /Grid>

        <
        Grid item xs = {
            12
        } > {
            inventoryLoading ? ( <
                Paper sx = {
                    {
                        p: 4,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: "200px",
                        borderRadius: 3,
                    }
                } >
                <
                CircularProgress / >
                <
                /Paper>
            ) : ( <
                MaterialFifoAgingTable data = {
                    materialAging
                }
                />
            )
        } <
        /Grid> <
        /Grid> <
        /Box>
    );
};

export default InventoryDashboard;