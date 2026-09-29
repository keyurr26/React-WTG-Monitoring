import React, {
    useEffect,
    useState
} from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    Paper,
    Container,
    TextField,
    MenuItem,
    Alert
} from "@mui/material";
import {
    IoMdArrowRoundBack
} from "react-icons/io";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    FaArrowCircleDown,
    FaArrowCircleUp,
    FaExchangeAlt,
    FaExclamationTriangle,
    FaUndo,
    FaClipboardCheck,
} from "react-icons/fa";
import {
    useNavigate
} from "react-router-dom";
import MaterialReceivedForm from "./MaterialRecived";
import MaterialIssuedForm from "../AddmasterData/MasterFile/IssueMaterial";
import {
    GetProjectsData,
    GetWindFarmMasterData,
    GetMaterialMasterData,
    fetchContractors
} from "../../Redux/MasterData/masterAction";
import InventoryPlan from "./InventoryPlan";
import SpareProvisionPlanTable from "./SpareProvisionPlanTable";
import MaterialStockTransfer from "./MaterialStockTransfer";
import MaterialReturnForm from "./MaterialReturnForm";
import MaterialRejectForm from "./MaterialRejectForm";



const COLORS = {
    primary: "#00416a",
    secondary: "#E57A28",
    lightBlue: "#e6f2ff",
    cardBg: "#ffffff",
    textLight: "#6c757d",
    border: "#e0e0e0"
};

const sections = [{
        title: "Material Received",
        description: "Record incoming materials from suppliers",
        component: (props) => < MaterialReceivedForm { ...props
        }
        />,
        icon: < FaArrowCircleDown size = {
            28
        }
        color = "#2E7D32" / > ,
        accent: "#2E7D32"
    },
    {
        title: "Material Issued",
        description: "Track issued materials for site usage",
        component: (props) => < MaterialIssuedForm { ...props
        }
        />,
        icon: < FaArrowCircleUp size = {
            28
        }
        color = "#D32F2F" / > ,
        accent: "#D32F2F"
    },
    {
        title: "Stock Transfer",
        description: "Transfer materials between sites",
        component: (props) => < MaterialStockTransfer { ...props
        }
        />,
        icon: < FaExchangeAlt size = {
            28
        }
        color = "#1976D2" / > ,
        accent: "#1976D2"
    },
    {
        title: "Inventory Plan",
        description: "Plan inventory for specific Windfarm",
        component: (props) => < InventoryPlan { ...props
        }
        />,
        icon: < FaClipboardCheck size = {
            28
        }
        color = "#00796B" / > ,
        accent: "#00796B"
    },
    {
        title: "Spare Provision Plan",
        description: "Plan spare parts inventory",
        component: (props) => < SpareProvisionPlanTable { ...props
        }
        />,
        icon: < FaClipboardCheck size = {
            28
        }
        color = "#5D4037" / > ,
        accent: "#5D4037"
    },
    {
        title: "Material Reject",
        description: "Record damaged or faulty materials",
        component: (props) => < MaterialRejectForm { ...props
        }
        />,
        icon: < FaExclamationTriangle size = {
            28
        }
        color = "#F57C00" / > ,
        accent: "#F57C00"
    },
    {
        title: "Material Return",
        description: "Record materials returned from contractor",
        component: (props) => < MaterialReturnForm { ...props
        }
        />,
        icon: < FaUndo size = {
            28
        }
        color = "#6A1B9A" / > ,
        accent: "#6A1B9A"
    },
];

const InventoryManagement = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedWindfarm, setSelectedWindfarm] = useState("");
    const [selectError, setSelectError] = useState("");

    const {
        projects = [], WindfarmData = [], ContractorData = [], GETmaterialMaster = []
    } = useSelector(
        (state) => state.masterData || {}
    );

    // Fetch user role from auth state (Adjust based on your reducer path)
    const {
        userInfo
    } = useSelector((state) => state.auth || {});
    const userRole = userInfo ? .role || "Viewer";

    // Check if user is a store keeper
    const isStoreKeeper = userRole.toLowerCase() === "store keeper" || userRole.toLowerCase() === "storekeeper";

    const filteredWindfarms = WindfarmData.filter(
        (wf) => wf.project === selectedProject
    );

    useEffect(() => {
        dispatch(GetProjectsData());
        dispatch(GetWindFarmMasterData());

        dispatch(GetMaterialMasterData());
        dispatch(fetchContractors());
    }, [dispatch]);


    const handleBack = () => {
        if (activeIndex !== null) setActiveIndex(null);
        else navigate("/inventory-management");
    };

    const handleSectionClick = (index) => {
        if (!selectedProject) {
            setSelectError("Please select a Project first.");
            return;
        }
        if (!selectedWindfarm) {
            setSelectError("Please select a Windfarm first.");
            return;
        }
        setSelectError("");
        setActiveIndex(index);
    };



    return ( <
        Container maxWidth = "xl"
        sx = {
            {
                py: 3
            }
        } >
        <
        Paper elevation = {
            2
        }
        sx = {
            {
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                bgcolor: "background.default",
            }
        } >
        { /* Header */ } <
        Box sx = {
            {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                py: 2.5,
                px: 3,
                position: "relative",
            }
        } >
        <
        IconButton onClick = {
            handleBack
        }
        sx = {
            {
                position: "absolute",
                left: 16,
                color: "white",
                backgroundColor: "rgba(255,255,255,0.1)",
                "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.2)"
                },
            }
        } >
        <
        IoMdArrowRoundBack size = {
            20
        }
        /> <
        /IconButton>

        <
        Typography variant = "h5"
        sx = {
            {
                color: "white",
                fontWeight: 700,
                textAlign: "center",
                letterSpacing: "0.5px",
            }
        } >
        {
            activeIndex === null ?
            "Inventory Management" :
                sections[activeIndex].title
        } <
        /Typography> <
        /Box>

        { /* Content Area */ } <
        Box sx = {
            {
                p: 5
            }
        } > { /* Top Warning Banner for non-store keepers */ } {
            !isStoreKeeper && ( <
                Alert severity = "warning"
                sx = {
                    {
                        mb: 3,
                        fontWeight: 500
                    }
                } >
                You are logged in as < strong > {
                    userRole
                } < /strong>. Only{" "} <
                strong > Store Keepers < /strong> have permission to issue,
                receive, or post inventory data.You have view - only access across other modules. <
                /Alert>
            )
        }

        {
            activeIndex === null ? ( <
                > { /* Filter Section */ } <
                Box sx = {
                    {
                        mb: 4
                    }
                } >
                <
                Typography variant = "subtitle1"
                sx = {
                    {
                        fontWeight: 600,
                        color: COLORS.primary,
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                    }
                } >
                <
                Box component = "span"
                sx = {
                    {
                        width: 4,
                        height: 20,
                        backgroundColor: COLORS.secondary,
                        mr: 1.5,
                        borderRadius: 1,
                    }
                }
                />
                Filter Inventory <
                /Typography>

                <
                Grid container spacing = {
                    2
                } >
                <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                } >
                <
                TextField select fullWidth label = "Select Project"
                value = {
                    selectedProject
                }
                size = "small"
                onChange = {
                    (e) => {
                        setSelectedProject(e.target.value);
                        setSelectedWindfarm("");
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

                <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                } >
                <
                TextField select fullWidth label = "Select Windfarm"
                value = {
                    selectedWindfarm
                }
                size = "small"
                onChange = {
                    (e) => setSelectedWindfarm(e.target.value)
                }
                disabled = {!selectedProject
                } >
                {
                    filteredWindfarms.map((wf) => ( <
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
                /Grid> <
                /Grid>

                {
                    selectError && ( <
                        Typography sx = {
                            {
                                color: "#d32f2f",
                                fontSize: "14px",
                                mt: 2,
                                fontWeight: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }
                        } >
                        <
                        FaExclamationTriangle / > {
                            selectError
                        } <
                        /Typography>
                    )
                } <
                /Box>

                { /* Sections Grid */ } <
                Grid container spacing = {
                    4
                } > {
                    sections.map((section, index) => ( <
                        Grid item xs = {
                            12
                        }
                        sm = {
                            6
                        }
                        md = {
                            3
                        }
                        key = {
                            index
                        } >
                        <
                        Card onClick = {
                            () => handleSectionClick(index)
                        }
                        sx = {
                            {
                                height: "100%",
                                borderRadius: 2,
                                cursor: "pointer",
                                backgroundColor: COLORS.cardBg,
                                border: `1px solid ${COLORS.border}`,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                                    borderColor: section.accent,
                                    "& .section-title": {
                                        color: section.accent,
                                    },
                                },
                            }
                        } >
                        <
                        CardContent sx = {
                            {
                                p: 3,
                                textAlign: "center"
                            }
                        } >
                        <
                        Box sx = {
                            {
                                display: "inline-flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: 60,
                                height: 60,
                                borderRadius: "50%",
                                backgroundColor: `${section.accent}15`,
                                mb: 2.5,
                            }
                        } >
                        {
                            section.icon
                        } <
                        /Box>

                        <
                        Typography className = "section-title"
                        variant = "h6"
                        sx = {
                            {
                                fontWeight: 600,
                                color: COLORS.primary,
                                mb: 1,
                                fontSize: "1.1rem",
                            }
                        } >
                        {
                            section.title
                        } <
                        /Typography>

                        <
                        Typography variant = "body2"
                        sx = {
                            {
                                color: COLORS.textLight,
                                lineHeight: 1.5,
                                fontSize: "0.875rem",
                            }
                        } >
                        {
                            section.description
                        } <
                        /Typography> <
                        /CardContent> <
                        /Card> <
                        /Grid>
                    ))
                } <
                /Grid> <
                />
            ) : (
                /* Active Form Section */
                <
                Box sx = {
                    {
                        backgroundColor: "white",
                        borderRadius: 2,

                        p: {
                            xs: 2,
                            md: 4
                        },
                    }
                } >
                {
                    activeIndex !== null &&
                    (() => {
                        const ActiveComponent = sections[activeIndex].component;

                        return ( <
                            ActiveComponent project = {
                                selectedProject
                            }
                            windfarm = {
                                selectedWindfarm
                            }
                            ContractorData = {
                                ContractorData
                            }
                            GETmaterialMaster = {
                                GETmaterialMaster
                            }
                            />
                        );
                    })()
                } <
                /Box>
            )
        } <
        /Box> <
        /Paper> <
        /Container>
    );
};

export default InventoryManagement;