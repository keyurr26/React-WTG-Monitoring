import React, {
    useState,
    useEffect,
    useMemo
} from "react";
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    IconButton,
    Container,
    Paper,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import CustomSnackbar from "../../components/comman/CustomSnackbar";
import {
    IoMdArrowRoundBack
} from "react-icons/io";
import {
    SQ_STATUS_OPTIONS,
    SQ_SEVERITY_OPTIONS,
    SQ_CATEGORY_CHOICES,
} from "../../constants/choices";
import {
    useNavigate
} from "react-router-dom";
import {
    useDispatch,
    useSelector
} from "react-redux";
import parseErrorMessage from "../../utils/errorFunction";
import {
    GetComponentTypesList,
    GetInspectors,
} from "../../Redux/MasterData/masterAction";
import {
    getTurbineLocations
} from "../../Redux/TurbineMasterData/turbineAction";
import {
    PostSQRecord,
    GetSQRecords,
    GetRoadFilterData,
    GetSqElectricalRecordList,
} from "../../Redux/SafetyQualityData/SafetyQualityAction";
import LocationFilterBar from "../../components/LocationFilterBar";
import ShieldMoonIcon from "@mui/icons-material/ShieldMoon";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SQRecordList from "./SQRecordList";
import {
    GETUSSRecordList
} from "../../Redux/SafetyQualityData/SafetyQualityAction";

const ROAD_ACTIVITY_MAP = {
    "MAIN ROAD": "main",
    MAIN_ROAD: "main",
    "APPROACH ROAD": "approach",
    APPROACH_ROAD: "approach",
    "ACCESS ROAD": "access",
    ACCESS_ROAD: "access",
};

const USS_ACTIVITY_MAP = {
    DP_YARD_COLUMN_CASTING: "DP Yard Column casting",
    // "DP_YARD_SLAB_CASTING": "DP Yard Slab casting",

    DP_YARD_SLAB_CASTING: "DP Yard Slab Casting", // ✅
    DELIVERY_OF_ELECTRICAL_ACCESSORIES: "Delivery of electrical accessories",
    TRAFO_CSS_ERECTION: "Trafo/CSS erection",
    INSTALLATION_OF_ELECTRICAL_ACCESSORIES: "Installation of electrical accessories",
    EARTH_PIT_MARKING: "Earth pit marking",
    EARTH_BORING: "Earth boring",
    EARTH_ROD_INSTALLATION: "Earth rod installation",
    EARTHING_STRIP_LAYING: "Earthing strip laying",
    LT_CABLE_TERMINATION: "LT cable Termination",
    HAND_RAIL_FIXING_ON_TRANSFORMER_SLAB: "Hand rail fixing on Transformer Slab",
    DP_YARD_COMPLETION: "DP yard Completion",
    SERVICE_LIFT_PLATFORM: "Service lift platform",
    EB_COMMISSIONING: "EB Commissioning",
};
const normalizeActivity = (activity) => {
    if (!activity) return "";
    return activity.toUpperCase().replace(/_/g, " ");
};

const SafetyQualityForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* ---------------- REDUX & AUTH DATA ---------------- */
    const {
        loading,
        sqlist = [],
        electricalRecordList = [],
        RoadList = [],
        UssList = [],
    } = useSelector((state) => state.sqData || {});
    const {
        turbineLocations = []
    } = useSelector(
        (state) => state.turbineData || {},
    );
    const {
        inspectors = [], componentTypesList = []
    } = useSelector(
        (state) => state.masterData || {},
    );

    const user = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const role = (user.role || "").toLowerCase();
    const isOfficer = ["quality_officer", "safety_officer"].includes(role);

    /* ---------------- DATA FILTERING ---------------- */
    const safetyData = useMemo(
        () => sqlist.filter((r) => r.record_type === "safety"), [sqlist],
    );
    const qualityData = useMemo(
        () => sqlist.filter((r) => r.record_type === "quality"), [sqlist],
    );

    const filteredTabs = useMemo(() => {
        const allTabs = [{
                id: "safety",
                label: "Safety Records",
                icon: < ShieldMoonIcon fontSize = "small" / > ,
                data: safetyData,
            },
            {
                id: "quality",
                label: "Quality Records",
                icon: < VerifiedUserIcon fontSize = "small" / > ,
                data: qualityData,
            },
        ];
        if (role === "safety_officer")
            return allTabs.filter((t) => t.id === "safety");
        if (role === "quality_officer")
            return allTabs.filter((t) => t.id === "quality");
        return allTabs;
    }, [role, safetyData, qualityData]);

    /* ---------------- STATE ---------------- */
    const [tabIndex, setTabIndex] = useState(0);
    const [filters, setFilters] = useState({
        project: "",
        windfarm: "",
        cluster: "",
    });
    const [selectedTurbine, setSelectedTurbine] = useState("");
    const [selectedLineId, setSelectedLineId] = useState("");
    const [selectedPoleId, setSelectedPoleId] = useState("");
    const [selectedRoadId, setSelectedRoadId] = useState("");
    const [ncPreview, setNcPreview] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const initialFormState = {
        electrical_line_id: "",
        pole_id: "",
        road_id: "",
        turbine: "",
        record_type: role === "quality_officer" ? "quality" : "safety",
        turbine_activity: "",
        category: "",
        date: "",
        note_details: "",
        quality_defect: "",
        corrective_action: "",
        severity: "low",
        status: "open",
        nc_photo: null,
        solved_by: "",
        uss_id: "",
        level: "",
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        dispatch(GetSQRecords());
        dispatch(getTurbineLocations());
        dispatch(GetComponentTypesList());
        dispatch(GetInspectors());
        // dispatch(GetSqElectricalRecordList());
        dispatch(GetRoadFilterData());
        dispatch(GETUSSRecordList());
    }, [dispatch]);

    useEffect(() => {
        dispatch(
            GetSqElectricalRecordList({
                project: filters.project || undefined,
                windfarm: filters.windfarm || undefined,
                cluster: filters.cluster || undefined, // optional
                approval_level: formData.level || undefined,
            }),
        );
    }, [
        dispatch,
        filters.project,
        filters.windfarm,
        filters.cluster,
        formData.level,
    ]);

    useEffect(() => {
        setFormData((prev) => ({ ...prev,
            turbine_activity: ""
        }));
        setSelectedLineId("");
        setSelectedPoleId("");
        setSelectedRoadId("");
        setSelectedTurbine("");
    }, [formData.category]);

    useEffect(() => {
        setSelectedLineId("");
        setSelectedPoleId("");
        setSelectedRoadId("");
    }, [formData.turbine_activity]);

    useEffect(() => {
        setSelectedPoleId("");
    }, [selectedLineId]);

    const dynamicCategoryActivityMap = useMemo(() => {
        const map = {};
        componentTypesList.forEach((item) => {
            if (item.type === "ACTIVITY" && item.category) {
                const categoryKey = item.category.toLowerCase();
                if (!map[categoryKey]) {
                    map[categoryKey] = [];
                }
                map[categoryKey].push({
                    value: item.name,
                    label: item.label || item.name,
                });
            }
        });
        return map;
    }, [componentTypesList]);

    /* ---------------- AVAILABLE ACTIVITIES ---------------- */
    const availableActivities = useMemo(() => {
        if (!formData.category) return [];
        const selectedCat = formData.category.toLowerCase();
        return dynamicCategoryActivityMap[selectedCat] || [];
    }, [formData.category, dynamicCategoryActivityMap]);

    const filteredElectricalData = useMemo(() => {
        return electricalRecordList.filter((item) => {
            const matchProject = filters.project ?
                String(item.project_id) === String(filters.project) :
                true;
            const matchWindfarm = filters.windfarm ?
                String(item.windfarm_id) === String(filters.windfarm) :
                true;
            const matchCluster = filters.cluster ?
                String(item.cluster_id) === String(filters.cluster) :
                true;
            return matchProject && matchWindfarm && matchCluster;
        });
    }, [
        electricalRecordList,
        filters.project,
        filters.windfarm,
        filters.cluster,
    ]);

    const filteredUssList = useMemo(() => {
        if (!formData.turbine_activity || !UssList || UssList.length === 0)
            return [];

        // Get mapped activity name from dropdown value
        const mappedActivity = USS_ACTIVITY_MAP[formData.turbine_activity];
        if (!mappedActivity) return [];

        // Filter USS list by matching activity name
        return UssList.filter((uss) => uss.activity_name === mappedActivity);
    }, [UssList, formData.turbine_activity]);
    const filteredRoadData = useMemo(() => {
        return RoadList.filter((item) => {
            const matchProject = filters.project ?
                String(item.project_id) === String(filters.project) :
                true;
            const matchWindfarm = filters.windfarm ?
                String(item.windfarm_id) === String(filters.windfarm) :
                true;
            const matchCluster = filters.cluster ?
                String(item.cluster_id) === String(filters.cluster) :
                true;
            return matchProject && matchWindfarm && matchCluster;
        });
    }, [RoadList, filters.project, filters.windfarm, filters.cluster]);
    const filteredTurbines = useMemo(() => {
        return turbineLocations.filter((t) => {
            const mProj = filters.project ?
                Number(t.project) === Number(filters.project) :
                true;
            const mWf = filters.windfarm ?
                Number(t.windfarm) === Number(filters.windfarm) :
                true;
            const mClust = filters.cluster ?
                Number(t.cluster) === Number(filters.cluster) :
                true;
            return mProj && mWf && mClust;
        });
    }, [turbineLocations, filters]);

    const shouldHideTurbine = useMemo(() => {
        return ["road", "electrical"].includes(formData.category);
    }, [formData.category]);

    const isElectricalSelected = useMemo(() => {
        return formData.category === "electrical";
    }, [formData.category]);

    const isRoadSelected = useMemo(() => {
        return formData.category === "road";
    }, [formData.category]);

    // const filteredLineNames = useMemo(() => {
    //     if (!isElectricalSelected || !formData.turbine_activity) {
    //         return [];
    //     }

    //     const activityValue = formData.turbine_activity.toLowerCase();

    //     return filteredElectricalData.filter((item) => {
    //         const lineName = item.line_name ? item.line_name.toLowerCase() : '';
    //         const lineType = item.line_type ? item.line_type.toLowerCase() : '';

    //         const cleanActivity = activityValue.replace(/[^a-zA-Z]/g, '').toLowerCase();
    //         const cleanLineName = lineName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    //         const cleanLineType = lineType.replace(/[^a-zA-Z]/g, '').toLowerCase();

    //         const matchesLineName = lineName.includes(activityValue) ||
    //                                cleanLineName.includes(cleanActivity);

    //         const matchesLineType = lineType.includes(activityValue) ||
    //                                cleanLineType.includes(cleanActivity);

    //         return matchesLineName || matchesLineType;
    //     });
    // }, [isElectricalSelected, formData.turbine_activity, filteredElectricalData]);

    const filteredLineNames = useMemo(() => {
        if (!isElectricalSelected || !formData.turbine_activity) {
            return [];
        }

        return filteredElectricalData.filter((item) => {
            const lineType = (item.line_type || "").toUpperCase();

            switch (formData.turbine_activity) {
                case "SCOH_DOG":
                    return lineType.includes("SCOH-DOG");

                case "SCOH_PANTHER":
                    return lineType.includes("SCOH") && !lineType.includes("DOG");

                case "DCOH":
                    return lineType.includes("DCOH");

                case "MCOH":
                    return lineType.includes("MCOH");

                default:
                    return false;
            }
        });
    }, [isElectricalSelected, formData.turbine_activity, filteredElectricalData]);

    const selectedLineData = useMemo(() => {
        if (!selectedLineId) return null;

        return filteredElectricalData.find(
            (item) => item.electrical_line_id === Number(selectedLineId),
        );
    }, [selectedLineId, filteredElectricalData]);

    const filteredPoles = useMemo(() => {
        if (!selectedLineData || !selectedLineData.pole_details) {
            return [];
        }
        return selectedLineData.pole_details;
    }, [selectedLineData]);

    const filteredRoads = useMemo(() => {
        if (!isRoadSelected || !formData.turbine_activity) {
            return [];
        }

        const normalizedActivity = normalizeActivity(formData.turbine_activity);
        const roadType = ROAD_ACTIVITY_MAP[normalizedActivity];

        if (!roadType) {
            console.warn(`⚠️ No road type found for activity: ${normalizedActivity}`);
            return [];
        }

        return filteredRoadData.filter((road) => {
            const roadTypeLower = road.type ? road.type.toLowerCase() : "";
            return roadTypeLower === roadType.toLowerCase();
        });
    }, [isRoadSelected, formData.turbine_activity, filteredRoadData]);

    /* ---------------- HELPERS ---------------- */
    const getPillTabStyles = (isSelected) => ({
        minHeight: "40px",
        borderRadius: "50px",
        textTransform: "none",
        fontWeight: 700,
        px: 4,
        fontSize: "0.95rem",
        transition: "all 0.3s ease",
        border: isSelected ? "2px solid #3b82f6" : "2px solid #1e3a8a",
        color: isSelected ? "#3b82f6" : "#e95252",
        backgroundColor: "#fff",
        "&.Mui-selected": {
            color: "#3b82f6",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 12px rgba(30, 58, 138, 0.15)",
        },
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.02)",
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = new FormData();

        // Base values without uss_id
        const baseValues = {
            record_type: role === "quality_officer" ? "quality" : "safety",
            turbine_activity: formData.turbine_activity,
            category: formData.category,
            date: formData.date,
            note_details: formData.note_details,
            severity: formData.severity,
            status: formData.status,
            quality_defect: formData.quality_defect || "",
            corrective_action: formData.corrective_action || "",
            solved_by: formData.solved_by || "",
            project: filters.project,
            windfarm: filters.windfarm,
            cluster: filters.cluster,
        };

        if (formData.nc_photo) {
            payload.append("nc_photo", formData.nc_photo);
        }
        // Electrical ke liye hi level bhejna hai
        if (isElectricalSelected) {
            baseValues.level = formData.level;
        }

        if (formData.uss_id) {
            payload.append("uss_id", formData.uss_id);
            // console.log("✅ uss_id appended:", formData.uss_id);
        } else {
            // console.log("❌ uss_id is empty");
        }

        // Handle other location fields
        if (isElectricalSelected) {
            baseValues.turbine = null;
            if (selectedLineId) {
                payload.append("electrical_line_id", selectedLineId);
            }
            if (selectedPoleId) {
                payload.append("pole_id", selectedPoleId);
            }
        } else if (isRoadSelected) {
            baseValues.turbine = null;
            if (selectedRoadId) {
                payload.append("road_id", selectedRoadId);
            } else {
                setSnackbar({
                    open: true,
                    message: "Please select a road",
                    severity: "error",
                });
                return;
            }
        } else {
            if (selectedTurbine) {
                payload.append("turbine", selectedTurbine);
            }
            // Don't append null values
        }

        // Append all other base values
        Object.entries(baseValues).forEach(([k, v]) => {
            if (v !== null && v !== undefined && v !== "") {
                payload.append(k, v);
            }
        });

        try {
            await dispatch(PostSQRecord(payload));
            setSnackbar({
                open: true,
                message: "Issue Raised successfully",
                severity: "success",
            });
            setFormData(initialFormState);
            setSelectedTurbine("");
            setSelectedLineId("");
            setSelectedPoleId("");
            setSelectedRoadId("");
            setNcPreview(null);
        } catch (err) {
            console.error("❌ Error response:", err.response);
            setSnackbar({
                open: true,
                message: parseErrorMessage(err.response ? .data),
                severity: "error",
            });
        }
    };

    const currentTabData =
        filteredTabs[isOfficer ? tabIndex - 1 : tabIndex] ? .data || [];

    const roleWiseStats = useMemo(() => {
        return {
            total: currentTabData.length,
            open: currentTabData.filter((r) => r.status === "open").length,
            closed: currentTabData.filter((r) => r.status === "closed").length,
            pendingApproval: currentTabData.filter((r) => !r.approve_date).length,
        };
    }, [currentTabData]);

    const isFormValid = useMemo(() => {
        if (!formData.category) return false;
        if (!formData.turbine_activity) return false;
        if (!formData.date) return false;
        if (!formData.note_details) return false;

        if (filteredUssList.length > 0 && !formData.uss_id) {
            return false;
        }

        if (isElectricalSelected) {
            return !!selectedLineId && !!selectedPoleId && !!formData.level;
        }

        if (isRoadSelected) {
            return !!selectedRoadId;
        }

        return !!selectedTurbine;
    }, [
        formData.category,
        formData.turbine_activity,
        formData.date,
        formData.note_details,
        formData.uss_id,
        filteredUssList.length,
        isElectricalSelected,
        isRoadSelected,
        selectedLineId,
        selectedPoleId,
        selectedRoadId,
        selectedTurbine,
    ]);

    return ( <
        Container maxWidth = "xl"
        sx = {
            {
                mb: 4,
                mt: 2
            }
        } >
        <
        Paper elevation = {
            4
        }
        sx = {
            {
                borderRadius: 4,
                overflow: "hidden",
                bgcolor: "white"
            }
        } >
        <
        Box sx = {
            {
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                gap: 1,
            }
        } >
        <
        IconButton onClick = {
            () => navigate("/safety-quality")
        }
        sx = {
            {
                position: "absolute",
                left: 15,
                top: 20,
                color: "white"
            }
        } >
        <
        IoMdArrowRoundBack size = {
            24
        }
        /> <
        /IconButton> <
        Typography variant = "h5"
        sx = {
            {
                color: "white",
                fontWeight: 700,
                mb: 1
            }
        } >
        Safety & Quality Management <
        /Typography> <
        /Box>

        <
        Box sx = {
            {
                mt: 2,
                display: "flex",
                justifyContent: "center"
            }
        } >
        <
        Tabs value = {
            tabIndex
        }
        onChange = {
            (e, v) => setTabIndex(v)
        }
        centered TabIndicatorProps = {
            {
                style: {
                    display: "none"
                }
            }
        }
        sx = {
            {
                "& .MuiTabs-flexContainer": {
                    gap: 1,
                },
            }
        } >
        {
            isOfficer && ( <
                Tab label = "Raise New Issue"
                sx = {
                    getPillTabStyles(tabIndex === 0)
                }
                />
            )
        } {
            filteredTabs.map((tab, index) => {
                const actualIndex = isOfficer ? index + 1 : index;
                return ( <
                    Tab key = {
                        tab.id
                    }
                    icon = {
                        tab.icon
                    }
                    iconPosition = "start"
                    label = {
                        tab.label.split(" ")[0]
                    }
                    sx = {
                        getPillTabStyles(tabIndex === actualIndex)
                    }
                    />
                );
            })
        } <
        /Tabs> <
        /Box>

        {
            tabIndex === 0 && isOfficer && ( <
                Box sx = {
                    {
                        maxWidth: "lg",
                        mx: "auto",
                        mt: 2
                    }
                } >
                <
                Paper elevation = {
                    1
                }
                sx = {
                    {
                        mb: 6,
                        border: "1px solid #e2e8f0",
                        borderRadius: 2
                    }
                } >
                <
                Box component = "form"
                onSubmit = {
                    handleSubmit
                }
                sx = {
                    {
                        p: {
                            xs: 2,
                            md: 4
                        }
                    }
                } >
                <
                Typography variant = "h5"
                color = "primary.main"
                gutterBottom sx = {
                    {
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                    }
                } >
                Add Location Details <
                /Typography>

                { /* Location Filter - No changes here */ } <
                Grid container spacing = {
                    3
                }
                alignItems = "center"
                sx = {
                    {
                        mb: 3
                    }
                } >
                <
                Grid item xs = {
                    12
                }
                md = {
                    12
                } >
                <
                LocationFilterBar filters = {
                    filters
                }
                setFilters = {
                    setFilters
                }
                /> <
                /Grid> <
                /Grid>

                <
                Box sx = {
                    {
                        mb: 4
                    }
                } >
                <
                Grid container spacing = {
                    3
                } > { /* Process Type */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth size = "small"
                label = "Process Type"
                value = {
                    formData.category
                }
                onChange = {
                    (e) =>
                    setFormData({
                        ...formData,
                        category: e.target.value,
                    })
                }
                required >
                {
                    SQ_CATEGORY_CHOICES.map((cat) => ( <
                        MenuItem key = {
                            cat.value
                        }
                        value = {
                            cat.value
                        } > {
                            cat.label
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid>

                { /* Activity */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth size = "small"
                label = "Activity"
                value = {
                    formData.turbine_activity
                }
                onChange = {
                    (e) =>
                    setFormData({
                        ...formData,
                        turbine_activity: e.target.value,
                    })
                }
                required disabled = {!formData.category
                } >
                {
                    availableActivities.map((act) => ( <
                        MenuItem key = {
                            act.value
                        }
                        value = {
                            act.value
                        } > {
                            act.label
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid> { /* USS Selection - Add this after the Activity field */ } {
                    formData.turbine_activity &&
                        filteredUssList.length > 0 && ( <
                            Grid item xs = {
                                12
                            }
                            md = {
                                3
                            } >
                            <
                            TextField select fullWidth size = "small"
                            label = "Select USS"
                            value = {
                                formData.uss_id || ""
                            }
                            onChange = {
                                (e) => {
                                    const selectedUssId = e.target.value;

                                    const selectedUss = filteredUssList.find(
                                        (uss) => uss.id === parseInt(selectedUssId),
                                    );

                                    setFormData({
                                        ...formData,
                                        uss_id: selectedUssId,
                                        // Optionally auto-select turbine based on USS selection
                                        turbine: selectedUss ? .turbine_id || formData.turbine,
                                    });

                                    // If you want to auto-populate other fields from USS data
                                    if (selectedUss) {
                                        // You can auto-set turbine or other fields here
                                        setSelectedTurbine(
                                            selectedUss.turbine_id || "",
                                        );
                                    }
                                }
                            }
                            required helperText = "Select USS location for this activity" >
                            <
                            MenuItem value = "" >
                            <
                            em > Select USS < /em> <
                            /MenuItem> {
                                filteredUssList.map((uss) => ( <
                                    MenuItem key = {
                                        uss.id
                                    }
                                    value = {
                                        uss.id
                                    } > {
                                        uss.uss_name
                                    } {
                                        uss.activity_name && ` (${uss.activity_name})`
                                    } { /* {uss.turbine_id && ` - Turbine: ${uss.turbine_id}`} */ } <
                                    /MenuItem>
                                ))
                            } <
                            /TextField> <
                            /Grid>
                        )
                } {
                    isElectricalSelected && formData.turbine_activity && ( <
                        Grid item xs = {
                            12
                        }
                        md = {
                            3
                        } >
                        <
                        TextField select fullWidth size = "small"
                        label = "Line Name *"
                        value = {
                            selectedLineId
                        }
                        onChange = {
                            (e) => setSelectedLineId(e.target.value)
                        }
                        required error = {!selectedLineId
                        }
                        helperText = {!selectedLineId ? "Please select a line" : ""
                        } >
                        <
                        MenuItem value = "" >
                        <
                        em > Select Line < /em> <
                        /MenuItem> {
                            filteredLineNames.length > 0 ? (
                                filteredLineNames.map((item) => ( <
                                    MenuItem key = {
                                        item.electrical_line_id
                                    }
                                    value = {
                                        item.electrical_line_id
                                    } >
                                    {
                                        item.line_name
                                    } {
                                        item.line_type && ` (${item.line_type})`
                                    } {
                                        item.pole_details &&
                                            item.pole_details.length > 0 &&
                                            ` - ${item.pole_details.length} poles`
                                    } <
                                    /MenuItem>
                                ))
                            ) : ( <
                                MenuItem disabled value = "" >
                                <
                                em >
                                No lines available
                                for this activity in selected location <
                                /em> <
                                /MenuItem>
                            )
                        } <
                        /TextField> <
                        /Grid>
                    )
                }

                {
                    isElectricalSelected && ( <
                        Grid item xs = {
                            12
                        }
                        md = {
                            3
                        } >
                        <
                        TextField select fullWidth size = "small"
                        label = "Level"
                        value = {
                            formData.level
                        }
                        onChange = {
                            (e) =>
                            setFormData({
                                ...formData,
                                level: e.target.value,
                            })
                        }
                        required >
                        <
                        MenuItem value = "L1" > L1 < /MenuItem> <
                        MenuItem value = "L2" > L2 < /MenuItem> <
                        MenuItem value = "L3" > L3 < /MenuItem> { /* <MenuItem value="FINAL">FINAL</MenuItem> */ } <
                        /TextField> <
                        /Grid>
                    )
                }

                { /* Pole */ } {
                    isElectricalSelected && selectedLineId && ( <
                        Grid item xs = {
                            12
                        }
                        md = {
                            3
                        } > {
                            filteredPoles.length > 0 ? ( <
                                TextField select fullWidth size = "small"
                                label = "Pole *"
                                value = {
                                    selectedPoleId
                                }
                                onChange = {
                                    (e) => setSelectedPoleId(e.target.value)
                                }
                                required error = {!selectedPoleId
                                }
                                helperText = {!selectedPoleId ? "Please select a pole" : ""
                                } >
                                <
                                MenuItem value = "" >
                                <
                                em > Select Pole < /em> <
                                /MenuItem> {
                                    filteredPoles.map((pole) => ( <
                                        MenuItem key = {
                                            pole.pole_id
                                        }
                                        value = {
                                            pole.pole_id
                                        } > {
                                            pole.pole_number
                                        }({
                                            pole.pole_type
                                        }) <
                                        /MenuItem>
                                    ))
                                } <
                                /TextField>
                            ) : ( <
                                TextField fullWidth size = "small"
                                label = "Pole"
                                value = ""
                                disabled error helperText = "⚠️ No poles available for this line." /
                                >
                            )
                        } <
                        /Grid>
                    )
                }

                {
                    isRoadSelected && formData.turbine_activity && ( <
                        Grid item xs = {
                            12
                        }
                        md = {
                            3
                        } >
                        <
                        TextField select fullWidth size = "small"
                        label = "Road Name"
                        value = {
                            selectedRoadId
                        }
                        onChange = {
                            (e) => setSelectedRoadId(e.target.value)
                        }
                        required >
                        <
                        MenuItem value = "" >
                        <
                        em > Select Road < /em> <
                        /MenuItem> {
                            filteredRoads.length > 0 ? (
                                filteredRoads.map((road) => ( <
                                    MenuItem key = {
                                        road.id
                                    }
                                    value = {
                                        road.id
                                    } > {
                                        road.name
                                    } {
                                        road.type && ` (${road.type})`
                                    } <
                                    /MenuItem>
                                ))
                            ) : ( <
                                MenuItem disabled value = "" >
                                <
                                em >
                                No roads available
                                for this activity in selected location <
                                /em> <
                                /MenuItem>
                            )
                        } <
                        /TextField> <
                        /Grid>
                    )
                }

                {
                    !shouldHideTurbine && ( <
                        Grid item xs = {
                            12
                        }
                        md = {
                            3
                        } >
                        <
                        TextField select fullWidth size = "small"
                        label = "Specific Turbine"
                        value = {
                            selectedTurbine
                        }
                        onChange = {
                            (e) => setSelectedTurbine(e.target.value)
                        }
                        required disabled = {!filters.windfarm
                        }
                        sx = {
                            {
                                bgcolor: "#ffffff"
                            }
                        } >
                        {
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
                    )
                }

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField type = "date"
                size = "small"
                label = "Observation Date"
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                fullWidth value = {
                    formData.date
                }
                onChange = {
                    (e) =>
                    setFormData({ ...formData,
                        date: e.target.value
                    })
                }
                required /
                >
                <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth size = "small"
                label = "Severity"
                value = {
                    formData.severity
                }
                onChange = {
                    (e) =>
                    setFormData({
                        ...formData,
                        severity: e.target.value,
                    })
                } >
                {
                    SQ_SEVERITY_OPTIONS.map((o) => ( <
                        MenuItem key = {
                            o.value
                        }
                        value = {
                            o.value
                        } > {
                            o.label
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
                md = {
                    3
                } >
                <
                TextField select fullWidth size = "small"
                label = "Quality Defect"
                value = {
                    formData.quality_defect
                }
                onChange = {
                    (e) =>
                    setFormData({
                        ...formData,
                        quality_defect: e.target.value,
                    })
                } >
                <
                MenuItem value = "defect1" > Defect 1 < /MenuItem> <
                MenuItem value = "defect2" > Defect 2 < /MenuItem> <
                MenuItem value = "defect3" > Defect 3 < /MenuItem> <
                /TextField> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth size = "small"
                label = "Status"
                value = {
                    formData.status
                }
                onChange = {
                    (e) =>
                    setFormData({ ...formData,
                        status: e.target.value
                    })
                } >
                {
                    SQ_STATUS_OPTIONS.map((o) => ( <
                        MenuItem key = {
                            o.value
                        }
                        value = {
                            o.value
                        } > {
                            o.label
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth size = "small"
                label = "Assign To"
                value = {
                    formData.solved_by
                }
                onChange = {
                    (e) =>
                    setFormData({
                        ...formData,
                        solved_by: e.target.value,
                    })
                } >
                {
                    inspectors.map((u) => ( <
                        MenuItem key = {
                            u.id
                        }
                        value = {
                            u.id
                        } > {
                            u.full_name
                        } <
                        /MenuItem>
                    ))
                } <
                /TextField> <
                /Grid>

                { /* Description */ } <
                Grid item xs = {
                    12
                } >
                <
                TextField label = "Description/Deviations"
                size = "small"
                multiline rows = {
                    2
                }
                fullWidth value = {
                    formData.note_details
                }
                onChange = {
                    (e) =>
                    setFormData({
                        ...formData,
                        note_details: e.target.value,
                    })
                }
                required /
                >
                <
                /Grid> <
                /Grid> <
                /Box>

                { /* Photo Upload */ } <
                Grid container spacing = {
                    3
                } >
                <
                Grid item xs = {
                    12
                }
                md = {
                    6
                } > {
                    isOfficer ? (
                        /* Editable Upload Button for Officers */
                        <
                        Button variant = "outlined"
                        component = "label"
                        fullWidth sx = {
                            {
                                height: "56px",
                                borderStyle: "dashed"
                            }
                        } >
                        Upload NC Photo <
                        input hidden type = "file"
                        accept = "image/*"
                        onChange = {
                            (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setFormData({ ...formData,
                                        nc_photo: file
                                    });
                                    setNcPreview(URL.createObjectURL(file));
                                }
                            }
                        }
                        /> <
                        /Button>
                    ) : (
                        /* Read-only / Non-editable View for Non-Officers */
                        <
                        Typography variant = "body2"
                        color = "textSecondary"
                        sx = {
                            {
                                mb: 1
                            }
                        } >
                        {
                            ncPreview ?
                            "NC Photo (Read-only)" :
                                "No NC Photo uploaded."
                        } <
                        /Typography>
                    )
                }

                { /* Photo Preview (Visible to Everyone if ncPreview exists) */ } {
                    ncPreview && ( <
                        Box sx = {
                            {
                                mt: 2,
                                borderRadius: 2,
                                overflow: "hidden",
                                border: "1px solid #ddd",
                            }
                        } >
                        <
                        img src = {
                            ncPreview
                        }
                        alt = "NC Preview"
                        style = {
                            {
                                width: "100%",
                                height: 200,
                                objectFit: "cover",
                            }
                        }
                        /> <
                        /Box>
                    )
                } <
                /Grid> <
                /Grid>

                { /* Submit Button */ } <
                Box sx = {
                    {
                        mt: 5,
                        display: "flex",
                        justifyContent: "center"
                    }
                } >
                <
                Button type = "submit"
                variant = "contained"
                disabled = {!isFormValid
                }
                sx = {
                    {
                        background: "#0891B2"
                    }
                } >
                Submit SQ Record <
                /Button> <
                /Box> <
                /Box> <
                /Paper> <
                /Box>
            )
        }

        { /* RECORDS VIEW */ } {
            ((isOfficer && tabIndex > 0) || !isOfficer) && ( <
                Box sx = {
                    {
                        p: 3
                    }
                } >
                <
                Grid container spacing = {
                    2
                }
                sx = {
                    {
                        mb: 2
                    }
                } >
                <
                Grid item xs = {
                    6
                }
                md = {
                    3
                } >
                <
                Paper sx = {
                    {
                        p: 2,
                        textAlign: "center",
                        bgcolor: "#e3f2fd"
                    }
                } >
                <
                Typography variant = "h6" > {
                    roleWiseStats.total
                } < /Typography> <
                Typography > Total < /Typography> <
                /Paper> <
                /Grid> <
                Grid item xs = {
                    6
                }
                md = {
                    3
                } >
                <
                Paper sx = {
                    {
                        p: 2,
                        textAlign: "center",
                        bgcolor: "#fff3e0"
                    }
                } >
                <
                Typography variant = "h6" > {
                    roleWiseStats.open
                } < /Typography> <
                Typography > Open < /Typography> <
                /Paper> <
                /Grid> <
                Grid item xs = {
                    6
                }
                md = {
                    3
                } >
                <
                Paper sx = {
                    {
                        p: 2,
                        textAlign: "center",
                        bgcolor: "#e8f5e9"
                    }
                } >
                <
                Typography variant = "h6" > {
                    roleWiseStats.closed
                } < /Typography> <
                Typography > Closed < /Typography> <
                /Paper> <
                /Grid> <
                Grid item xs = {
                    6
                }
                md = {
                    3
                } >
                <
                Paper sx = {
                    {
                        p: 2,
                        textAlign: "center",
                        bgcolor: "#fce4ec"
                    }
                } >
                <
                Typography variant = "h6" > {
                    roleWiseStats.pendingApproval
                } <
                /Typography> <
                Typography > Pending Approval < /Typography> <
                /Paper> <
                /Grid> <
                /Grid>

                <
                SQRecordList data = {
                    currentTabData
                }
                title = {
                    `${filteredTabs[isOfficer ? tabIndex - 1 : tabIndex]?.label} Overview`
                }
                themeColor = "#1976d2" /
                >
                <
                /Box>
            )
        }

        <
        CustomSnackbar open = {
            snackbar.open
        }
        message = {
            snackbar.message
        }
        severity = {
            snackbar.severity
        }
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        }
        /> <
        /Paper> <
        /Container>
    );
};

export default SafetyQualityForm;