import React from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    IconButton,
    Paper,
    Container,
} from "@mui/material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    IoMdArrowRoundBack
} from "react-icons/io";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import WindPowerIcon from "@mui/icons-material/WindPower";
import ShareIcon from "@mui/icons-material/Share";
import SettingsPowerIcon from "@mui/icons-material/SettingsPower";
import GroupIcon from "@mui/icons-material/Group";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import RouteIcon from "@mui/icons-material/Route";
import UserAccessTable from "./tables/UserAccessTable";
import {
    useNavigate
} from "react-router-dom";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import BentoIcon from '@mui/icons-material/Bento';
import CellTowerIcon from '@mui/icons-material/CellTower';
import LayersIcon from "@mui/icons-material/Layers";
import PlatformMasterForm from "../Platforms/PlatformMasterForm";
// Masters
import ProjectMaster from "./MasterFile/projectMaster";
import UserMaster from "./MasterFile/userMaster";
import WTGMaster from "./MasterFile/WindfarmMaster";
import MaterialMaster from "./MasterFile/MaterialMaster";
import ContractorForm from "./MasterFile/ContractorForm";
import VendorMaster from "./MasterFile/VendorMaster";
import WtgMakeModelMaster from "./MasterFile/WtgMakeModelMaster";
import TurbineLocationForm from "../TurbineMaster/TurbineMaster";
import RoadPlanner from "./MasterFile/RoadPlanner";
import ClusterMaster from "./MasterFile/ClusterMaster";
import ActivityScheduleMaster from "./MasterFile/ActivityScheduleMaster";
import AttachmentMasterForm from "./MasterFile/AttachmentMasterForm";
import KPIConfigForm from "./MasterFile/KPIConfigForm";
import ElectricalMaster from "./MasterFile/electrical master/ElectricalMaster";
import TurbinePlannedForm from "./MasterFile/TurbinePlannedForm";
import PoleMasterindex from "./MasterFile/electrical master/Polemaster";
import {
    GetComponentTypesList
} from "../../Redux/MasterData/masterAction";
import USSMaster from "./MasterFile/ussMaster/UssMaster";
const masters = [{
        label: "Project",
        icon: < AccountTreeIcon / > ,
        component: ProjectMaster
    },
    {
        label: "WTG Make/Model",
        icon: < CategoryIcon / > ,
        component: WtgMakeModelMaster,
    },
    {
        label: "Windfarm",
        icon: < WindPowerIcon / > ,
        component: WTGMaster
    },
    {
        label: "Cluster",
        icon: < ShareIcon / > ,
        component: ClusterMaster
    },
    {
        label: "Turbine",
        icon: < SettingsPowerIcon / > ,
        component: TurbineLocationForm,
    },
    {
        label: "Users",
        icon: < GroupIcon / > ,
        component: UserMaster
    },
    {
        label: "Project Access Manager",
        icon: < GroupIcon / > ,
        component: UserAccessTable,
    },
    {
        label: "Activity Schedule",
        icon: < CalendarMonthIcon / > ,
        component: ActivityScheduleMaster,
    },
    {
        label: "Turbine Planned Master",
        icon: < GroupIcon / > ,
        component: TurbinePlannedForm,
    },
    {
        label: "Contractor",
        icon: < PersonIcon / > ,
        component: ContractorForm
    },
    {
        label: "Supplier",
        icon: < PersonIcon / > ,
        component: VendorMaster
    },

    {
        label: "Attachment Master",
        icon: < CloudUploadIcon / > ,
        component: AttachmentMasterForm,
    },
    {
        label: "Material",
        icon: < InventoryIcon / > ,
        component: MaterialMaster
    },
    {
        label: "Platform Master",
        icon: < LayersIcon / > ,
        component: PlatformMasterForm,
    },

    {
        label: "KPI Master",
        icon: < CalendarMonthIcon / > ,
        component: KPIConfigForm,
    },
    {
        label: "Electrical Master",
        icon: < DynamicFormIcon / > ,
        component: ElectricalMaster,
    },
    {
        label: "Pole Master",
        icon: < DynamicFormIcon / > ,
        component: PoleMasterindex,
    },

    {
        label: "Uss Master",
        icon: < BentoIcon / > ,
        component: USSMaster,
    },

    // { label: "Cart Road Planner", icon: <RouteIcon />, component: <RoadPlanner /> },
];

const ProjectIndex = () => {
    const dispatch = useDispatch();
    const {
        componentTypesList = []
    } = useSelector((state) => state.masterData);
    const [activeTab, setActiveTab] = React.useState(0);
    const navigate = useNavigate();

    const SelectedMasterComponent = masters[activeTab].component;

    return ( <
        >

        <
        Box sx = {
            {
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 20,
            }
        } >
        <
        IconButton onClick = {
            () => navigate("/dash-board")
        }
        sx = {
            {
                position: "absolute",
                left: 16,
                color: "#00416A",
            }
        } >
        <
        IoMdArrowRoundBack / >
        <
        /IconButton>

        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A",
            }
        } >
        Master Management <
        /Typography> <
        /Box>

        <
        Container maxWidth = "xl"
        sx = {
            {
                py: 2
            }
        } >
        <
        Paper elevation = {
            3
        }
        sx = {
            {
                borderRadius: 3,
                overflow: "hidden"
            }
        } >
        <
        Box sx = {
            {
                borderBottom: 1,
                borderColor: "#fff",
                color: "white",
                background: "linear-gradient(45deg, #003366, #0f52ba)",
            }
        } >
        <
        Tabs value = {
            activeTab
        }
        onChange = {
            (e, val) => setActiveTab(val)
        }
        variant = "scrollable"
        scrollButtons = "auto"
        sx = {
            {
                px: 2,
                "& .MuiTabs-indicator": {
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "#FFAA00",
                },
            }
        } >
        {
            masters.map((m, i) => ( <
                Tab key = {
                    i
                }
                icon = {
                    m.icon
                }
                iconPosition = "start"
                label = {
                    m.label
                }
                sx = {
                    {
                        textTransform: "none",
                        fontWeight: 700,
                        minHeight: 64,
                        px: 3,
                        fontSize: "0.8rem",
                        color: "#fff",
                        "&.Mui-selected": {
                            color: "#fff",
                        },
                        "& .MuiTab-iconWrapper": {
                            fontSize: "1.4rem",
                            color: "#fff",
                        },
                    }
                }
                />
            ))
        } <
        /Tabs> <
        /Box> <
        Box sx = {
            {
                p: 4,
                minHeight: "70vh"
            }
        } >
        <
        SelectedMasterComponent / >
        <
        /Box> <
        /Paper> <
        /Container> <
        />
    );
};

export default ProjectIndex;