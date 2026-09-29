// import React from "react";
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Avatar,
//   Stack,
//   Chip,
//   LinearProgress,
//   Divider,
// } from "@mui/material";
// import { ElectricalIcon } from "../TabIcons";
// import LocationFilterBar from "../../../components/LocationFilterBar";

// // Layout constraints to fix grid overlapping issues
// const cardStyle = {
//   p: 3,
//   borderRadius: 3,
//   display: "flex",
//   flexDirection: "column",
//   height: "30%",
//   minHeight: "206px",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
//   border: "1px solid rgba(0,0,0,0.06)",
//   background: "#fff",
//   overflow: "hidden",
//   transition: "transform 0.2s, box-shadow 0.2s",
//   "&:hover": {
//     transform: "translateY(-2px)",
//     boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
//   },
// };

// // Sub-component for structured row rendering
// const DataRow = ({ label, value, color = "text.primary" }) => {
//   const displayLabel = label && label !== "null" ? label.replaceAll("_", " ").toUpperCase() : "UNSPECIFIED";
//   return (
//     <Box sx={{ width: "100%" }}>
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.25 }}>
//         <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mr: 1 }}>
//           {displayLabel}
//         </Typography>
//         <Typography variant="body2" color={color} fontWeight={600} sx={{ whiteSpace: "nowrap" }}>
//           {value}
//         </Typography>
//       </Box>
//       <Divider sx={{ opacity: 0.6 }} />
//     </Box>
//   );
// };

// // Helper function to format material names
// const formatMaterialName = (key) => {
//   const materialMap = {
//     'f_clamp': 'F Clamp',
//     'v_cross_arm': 'V Cross Arm',
//     'c_channel_100x60x60': 'C Channel 100x60x60',
//     'h_frame': 'H Frame',
//     'stay': 'Stay',
//     'pin_insulator': 'Pin Insulator',
//     'disc_insulator': 'Disc Insulator',
//     'suspension_insulator': 'Suspension Insulator'
//   };

//   return materialMap[key] || key.replace(/_/g, ' ').toUpperCase();
// };

// const ElectricalDashboardTab = ({
//   electricalData,
//   loading,
//   filters,
//   setFilters
// }) => {
//   // Safe Mappings with API Fallbacks
//   const overview = electricalData?.overview || {};
//   const lineStatus = electricalData?.line_status || {};
//   const lineSummary = electricalData?.line_summary || {};
//   const poleSummary = electricalData?.pole_summary || {};
//   const lineTypeSummary = electricalData?.line_type_summary || {};
//   const towerTypeSummary = electricalData?.tower_type_summary || {};
//   const submissionSummary = electricalData?.submission_summary || {};
//   const approvalSummary = electricalData?.approval_summary || {};
//   const workStatus = electricalData?.work_status || {};
//   const crossingSummary = electricalData?.crossing_summary || {};
//   const landSummary = electricalData?.land_summary || {};
//   const materialSummary = electricalData?.material_summary || {};

//   // Filter out materials with value 0 to show only relevant items
//   const filteredMaterials = Object.entries(materialSummary).filter(([key, value]) => value > 0);
//   const hasMaterials = filteredMaterials.length > 0;

//   // Calculate total materials
//   const totalMaterials = Object.values(materialSummary).reduce((sum, val) => sum + val, 0);

//   // Contextual Top-Level Dashboard Metrics
//   const metrics = [
//     { label: "Total Lines Map", value: overview.total_lines || 0, progress: 100, color: "#2196F3" },
//     { label: "Total Distance (KM)", value: overview.total_km || 0, progress: 100, color: "#00BCD4" },
//     { label: "Total Poles Installed", value: overview.total_poles || 0, progress: 100, color: "#FF9800" },
//     { label: "Project Completion", value: `${overview.completion_percent || 0}%`, progress: overview.completion_percent || 0, color: "#4CAF50" },
//   ];

//   // Check if data is available
//   const hasData = electricalData && Object.keys(electricalData).length > 0;

//   console.log("electricalData",electricalData)

//   return (
//     <Box sx={{ p: { xs: 2, md: 3 }, width: "100%", boxSizing: "border-box" }}>

//       {/* ================= HEADER WITH FILTERS ================= */}
//       <Box sx={{ mb: 4 }}>
//         <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'stretch', md: 'center' }}>
//           <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
//             <Avatar
//               sx={{
//                 width: 56,
//                 height: 56,
//                 background: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
//                 boxShadow: "0 4px 12px rgba(156, 39, 176, 0.3)",
//               }}
//             >
//               <ElectricalIcon sx={{ fontSize: 28, color: "#fff" }} />
//             </Avatar>
//             <Box>
//               <Typography variant="h5" fontWeight={700} color="text.primary">
//                 Electrical Infrastructure
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Real-time structural counts, line allocations, and approval milestones
//               </Typography>
//             </Box>
//           </Stack>

//           {/* Location Filter Bar */}
//           <Box sx={{ minWidth: { md: 600 } }}>
//             <LocationFilterBar filters={filters} setFilters={setFilters} />
//           </Box>
//         </Stack>
//       </Box>

//       {/* ================= LOADING & ERROR HANDLERS ================= */}
//       {loading && <LinearProgress color="secondary" sx={{ mb: 3, height: 4, borderRadius: 2 }} />}

//       {!hasData && !loading && (
//         <Paper sx={{ p: 3, mb: 3, bgcolor: "#FFF3E0", border: "1px solid #FFE0B2" }} elevation={0}>
//           <Typography color="warning.main" variant="body2" fontWeight={600}>
//             No electrical data available. Please select filters or refresh the page.
//           </Typography>
//         </Paper>
//       )}

//       {/* ================= ROW 1: TOP METRICS OVERVIEW ================= */}
//       <Grid container spacing={3} sx={{ mb: 1.5 }}>
//         {metrics.map((item, index) => (
//           <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: "flex" }}>
//             <Paper sx={{ ...cardStyle, width: "100%", minHeight: "130px" }}>
//               <Typography variant="h4" fontWeight={700} sx={{ color: item.color, mb: 0.5 }}>
//                 {item.value}
//               </Typography>
//               <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: "auto" }}>
//                 {item.label}
//               </Typography>
//               <LinearProgress
//                 variant="determinate"
//                 value={item.progress}
//                 sx={{
//                   height: 5,
//                   borderRadius: 3,
//                   bgcolor: "rgba(0,0,0,0.04)",
//                   mt: 2,
//                   "& .MuiLinearProgress-bar": { bgcolor: item.color, borderRadius: 3 },
//                 }}
//               />
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>

//       {/* ================= ROW 2: LINE STATUS & BREAKDOWNS ================= */}
//       <Grid container spacing={3} sx={{ mb: 1.5 }}>
//         {/* OPERATIONAL STATUS */}
//         <Grid item xs={12} md={4} sx={{ display: "flex" }}>
//           <Paper sx={{ ...cardStyle, width: "100%" }}>
//             <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2.5 }}>
//               Line Operational Status
//             </Typography>
//             <Stack spacing={2} sx={{ width: "100%" }}>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <Chip label="Completed" color="success" size="small" sx={{ fontWeight: 600, borderRadius: 1.5 }} />
//                 <Typography variant="body2" fontWeight={700}>{lineStatus.completed || 0}</Typography>
//               </Box>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <Chip label="In Progress" color="info" size="small" sx={{ fontWeight: 600, borderRadius: 1.5 }} />
//                 <Typography variant="body2" fontWeight={700}>{lineStatus.inprogress || 0}</Typography>
//               </Box>
//               <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                 <Chip label="Pending" color="warning" size="small" sx={{ fontWeight: 600, borderRadius: 1.5 }} />
//                 <Typography variant="body2" fontWeight={700}>{lineStatus.pending || 0}</Typography>
//               </Box>
//             </Stack>
//           </Paper>
//         </Grid>

//         {/* LINE & POLE COUNTS */}
//         <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
//           <Paper sx={{ ...cardStyle, width: "100%" }}>
//             <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
//               Lines & Infrastructure Summary
//             </Typography>
//             <Box sx={{ width: "100%" }}>
//               {Object.entries(lineSummary).map(([key, value]) => (
//                 <DataRow key={key} label={key} value={value} />
//               ))}
//               {Object.entries(poleSummary).map(([key, value]) => (
//                 <DataRow key={key} label={key} value={value} color="secondary.main" />
//               ))}
//             </Box>
//           </Paper>
//         </Grid>

//         {/* CONFIGURATIONS */}
//         <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
//           <Paper sx={{ ...cardStyle, width: "100%" }}>
//             <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
//               Tower Assertions
//             </Typography>
//             <Box sx={{ width: "100%" }}>
//               {Object.entries(towerTypeSummary).map(([key, value]) => (
//                 <DataRow key={key} label={`Tower Type ${key}`} value={value} color="primary.main" />
//               ))}
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* ================= ROW 3: SUBMISSIONS & WORK PIPELINES ================= */}
//       <Grid container spacing={3} sx={{ mb: 1.5 }}>
//         {/* SUBMISSION SUMMARY */}
//         <Grid item xs={12} md={4} sx={{ display: "flex" }}>
//           <Paper sx={{ ...cardStyle, width: "100%" }}>
//             <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
//               Submission Registry
//             </Typography>
//             <Box sx={{ width: "100%" }}>
//               {Object.entries(submissionSummary).map(([key, value]) => (
//                 <DataRow key={key} label={key} value={value} />
//               ))}
//             </Box>
//           </Paper>
//         </Grid>

//         {/* APPROVALS */}
//         <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
//           <Paper sx={{ ...cardStyle, width: "100%" }}>
//             <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
//               Approval Process
//             </Typography>
//             <Box sx={{ width: "100%" }}>
//               {Object.entries(approvalSummary).map(([key, value]) => (
//                 <DataRow key={key} label={key} value={value} color="success.main" />
//               ))}
//             </Box>
//           </Paper>
//         </Grid>

//         {/* RUNNING TASKS */}
//         <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
//           <Paper sx={{ ...cardStyle, width: "100%" }}>
//             <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
//               Task Executions
//             </Typography>
//             <Box sx={{ width: "100%" }}>
//               {Object.entries(workStatus).map(([key, value]) => (
//                 <DataRow key={key} label={key} value={value} color="info.main" />
//               ))}
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* ================= ROW 4: LINE CONFIGURATIONS BLOCK ================= */}
//       <Grid container spacing={3} sx={{ mb: 1.5 }}>
//         <Grid item xs={12} sx={{ display: "flex" }}>
//           <Paper sx={{ ...cardStyle, width: "100%", minHeight: "160px" }}>
//             <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
//               Line Configuration Specifications
//             </Typography>
//             {Object.entries(lineTypeSummary).length > 0 ? (
//               <Grid container spacing={2}>
//                 {Object.entries(lineTypeSummary).map(([key, value]) => (
//                   <Grid item xs={12} sm={6} md={3} key={key}>
//                     <Box sx={{ p: 2, bgcolor: "#FAFAFA", borderRadius: 2, border: "1px solid #E0E0E0" }}>
//                       <Typography variant="h6" fontWeight={700} color="#9C27B0">{value}</Typography>
//                       <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: "block", mt: 0.5 }}>
//                         {key}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 ))}
//               </Grid>
//             ) : (
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
//                 No line configurations available
//               </Typography>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* ================= ROW 5: LOGISTICS & CROSSINGS ================= */}
//       <Grid container spacing={3} sx={{ mb: 1.5 }}>
//         {/* CROSSING BREAKDOWNS */}
//         <Grid item xs={12} md={6} sx={{ display: "flex" }}>
//           <Paper sx={{ ...cardStyle, width: "100%" }}>
//             <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
//               Zone Crossings Summary
//             </Typography>
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//               {Object.entries(crossingSummary).length > 0 ? (
//                 Object.entries(crossingSummary).map(([key, value]) => {
//                   const labelName = !key || key === "null" ? "UNASSIGNED" : key.toUpperCase();
//                   return (
//                     <Chip key={key} label={`${labelName}: ${value}`} variant="outlined" size="small" sx={{ borderRadius: 1.5, fontWeight: 500 }} />
//                   );
//                 })
//               ) : (
//                 <Typography variant="body2" color="text.secondary">No crossings data available</Typography>
//               )}
//             </Box>
//           </Paper>
//         </Grid>

//         {/* CLEARANCE LOGISTICS */}
//         <Grid item xs={12} md={6} sx={{ display: "flex" }}>
//           <Paper sx={{ ...cardStyle, width: "100%" }}>
//             <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
//               Clearance & Land Status
//             </Typography>
//             <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//               {Object.entries(landSummary).length > 0 ? (
//                 Object.entries(landSummary).map(([key, value]) => {
//                   const labelName = !key || key === "null" ? "PENDING ASSIGNMENT" : key.toUpperCase();
//                   return (
//                     <Chip key={key} label={`${labelName}: ${value}`} color="secondary" size="small" sx={{ borderRadius: 1.5, fontWeight: 600 }} />
//                   );
//                 })
//               ) : (
//                 <Typography variant="body2" color="text.secondary">No land data available</Typography>
//               )}
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>

//       {/* ================= ROW 6: MATERIALS SUMMARY ================= */}
//       <Grid container spacing={3} sx={{ mb: 1.5 }}>
//         <Grid item xs={12} sx={{ display: "flex" }}>
//           <Paper sx={{ ...cardStyle, width: "100%" }}>
//             <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//               <Typography variant="subtitle1" fontWeight={700}>
//                 Materials Summary
//               </Typography>
//               {totalMaterials > 0 && (
//                 <Chip
//                   label={`Total: ${totalMaterials}`}
//                   size="small"
//                   color="primary"
//                   sx={{ fontWeight: 600 }}
//                 />
//               )}
//             </Box>

//             {hasMaterials ? (
//               <Grid container spacing={2}>
//                 {filteredMaterials.map(([key, value]) => (
//                   <Grid item xs={6} sm={4} md={3} lg={2} key={key}>
//                     <Paper
//                       elevation={0}
//                       sx={{
//                         p: 2,
//                         bgcolor: "#F8F9FA",
//                         borderRadius: 2,
//                         border: "1px solid #E8ECF0",
//                         textAlign: "center",
//                         transition: "all 0.2s",
//                         "&:hover": {
//                           bgcolor: "#F0F4FF",
//                           borderColor: "#9C27B0",
//                           transform: "translateY(-2px)",
//                           boxShadow: "0 4px 12px rgba(156, 39, 176, 0.1)"
//                         }
//                       }}
//                     >
//                       <Typography variant="h5" fontWeight={700} color="#9C27B0">
//                         {value}
//                       </Typography>
//                       <Typography
//                         variant="caption"
//                         color="text.secondary"
//                         sx={{
//                           display: "block",
//                           mt: 0.5,
//                           fontSize: "0.7rem",
//                           fontWeight: 600,
//                           lineHeight: 1.2
//                         }}
//                       >
//                         {formatMaterialName(key)}
//                       </Typography>
//                     </Paper>
//                   </Grid>
//                 ))}
//               </Grid>
//             ) : (
//               <Box sx={{ textAlign: "center", py: 4 }}>
//                 <Typography variant="body2" color="text.secondary">
//                   No materials data available
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
//                   All material quantities are currently zero
//                 </Typography>
//               </Box>
//             )}
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default ElectricalDashboardTab;

import React, {
    useMemo,
    useState,
    useEffect
} from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Avatar,
    Stack,
    Chip,
    LinearProgress,
    Divider,
    Fade,
    alpha,
    Skeleton,
} from "@mui/material";
import {
    ElectricalIcon,
    LineIcon,
    PoleIcon,
    ApprovalIcon,
    MaterialIcon,
    ProgressIcon,
} from "../TabIcons";
import LocationFilterBar from "../../../components/LocationFilterBar";

// ============================================================
// 1. STYLES
// ============================================================

const cardStyle = {
    p: 3,
    borderRadius: 2,
    background: "#ffffff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    border: "1px solid #eef0f2",
    height: "100%",
    transition: "all 0.2s ease",
    "&:hover": {
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        borderColor: "#d0d3d8",
    },
};

const statCardStyle = {
    p: 2.5,
    borderRadius: 2,
    background: "#ffffff",
    border: "1px solid #eef0f2",
    transition: "all 0.2s ease",
    "&:hover": {
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        borderColor: "#c5c8ce",
    },
};

// ============================================================
// 2. COMPONENTS
// ============================================================

const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
    loading
}) => {
    if (loading) {
        return ( <
            Paper sx = {
                statCardStyle
            } >
            <
            Skeleton variant = "text"
            width = "60%" / >
            <
            Skeleton variant = "text"
            width = "40%"
            height = {
                40
            }
            /> <
            Skeleton variant = "text"
            width = "80%" / >
            <
            /Paper>
        );
    }

    return ( <
        Paper sx = {
            statCardStyle
        } >
        <
        Box sx = {
            {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
            }
        } >
        <
        Box sx = {
            {
                flex: 1
            }
        } >
        <
        Typography variant = "caption"
        color = "text.secondary"
        fontWeight = {
            600
        }
        sx = {
            {
                letterSpacing: "0.5px"
            }
        } >
        {
            title
        } <
        /Typography> <
        Typography variant = "h4"
        fontWeight = {
            800
        }
        sx = {
            {
                mt: 0.5,
                color: color || "text.primary"
            }
        } >
        {
            value
        } <
        /Typography> {
            subtitle && ( <
                Typography variant = "caption"
                color = "text.secondary"
                sx = {
                    {
                        mt: 0.5,
                        display: "block"
                    }
                } >
                {
                    subtitle
                } <
                /Typography>
            )
        } <
        /Box> <
        Box sx = {
            {
                fontSize: 28,
                opacity: 0.6
            }
        } > {
            icon
        } < /Box> <
        /Box> <
        /Paper>
    );
};

const InfoCard = ({
    title,
    children,
    icon,
    loading
}) => {
    if (loading) {
        return ( <
            Paper sx = {
                cardStyle
            } >
            <
            Box sx = {
                {
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2
                }
            } >
            <
            Skeleton variant = "circular"
            width = {
                24
            }
            height = {
                24
            }
            /> <
            Skeleton variant = "text"
            width = "40%" / >
            <
            /Box> <
            Skeleton variant = "rectangular"
            height = {
                100
            }
            sx = {
                {
                    borderRadius: 1
                }
            }
            /> <
            /Paper>
        );
    }

    return ( <
        Paper sx = {
            cardStyle
        } >
        <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                mb: 2
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                fontSize: "1.1rem"
            }
        } > {
            icon
        } <
        /Typography> <
        Typography variant = "subtitle2"
        fontWeight = {
            700
        }
        color = "text.primary" > {
            title
        } <
        /Typography> <
        /Box> {
            children
        } <
        /Paper>
    );
};

const DataRow = ({
    label,
    value,
    color = "text.primary",
    percentage = null,
    bold = false,
}) => ( <
    Box sx = {
        {
            width: "100%"
        }
    } >
    <
    Box sx = {
        {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
        }
    } >
    <
    Typography variant = "body2"
    color = "text.secondary"
    fontWeight = {
        500
    } > {
        label
    } <
    /Typography> <
    Box sx = {
        {
            display: "flex",
            alignItems: "center",
            gap: 1
        }
    } > {
        percentage !== null && percentage !== undefined && ( <
            Chip label = {
                `${Number(percentage).toFixed(1)}%`
            }
            size = "small"
            sx = {
                {
                    height: 18,
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    bgcolor: alpha(color, 0.1),
                    color: color,
                }
            }
            />
        )
    } <
    Typography variant = "body2"
    fontWeight = {
        bold ? 800 : 600
    }
    color = {
        color
    } > {
        value
    } <
    /Typography> <
    /Box> <
    /Box> <
    Divider sx = {
        {
            opacity: 0.2
        }
    }
    /> <
    /Box>
);

const StatusBadge = ({
    label,
    value,
    color
}) => ( <
    Paper elevation = {
        0
    }
    sx = {
        {
            p: 1.5,
            textAlign: "center",
            bgcolor: alpha(color, 0.08),
            borderRadius: 1.5,
            border: `1px solid ${alpha(color, 0.15)}`,
        }
    } >
    <
    Typography variant = "h5"
    fontWeight = {
        800
    }
    sx = {
        {
            color: color
        }
    } > {
        value
    } <
    /Typography> <
    Typography variant = "caption"
    color = "text.secondary"
    fontWeight = {
        600
    } > {
        label
    } <
    /Typography> <
    /Paper>
);

const MaterialItem = ({
    name,
    quantity,
    color
}) => ( <
    Paper elevation = {
        0
    }
    sx = {
        {
            p: 2,
            textAlign: "center",
            bgcolor: alpha(color, 0.06),
            borderRadius: 1.5,
            border: `1px solid ${alpha(color, 0.12)}`,
            transition: "all 0.2s",
            "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            },
        }
    } >
    <
    Typography variant = "h5"
    fontWeight = {
        800
    }
    sx = {
        {
            color: color
        }
    } > {
        quantity
    } <
    /Typography> <
    Typography variant = "caption"
    color = "text.secondary"
    fontWeight = {
        600
    }
    sx = {
        {
            fontSize: "0.65rem"
        }
    } >
    {
        name
    } <
    /Typography> <
    /Paper>
);

// ============================================================
// 3. MAIN COMPONENT
// ============================================================

const ElectricalDashboardTab = ({
    electricalData,
    loading,
    filters,
    setFilters,
}) => {
    // --- State for mounted ---
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // --- Data Extraction ---
    const data = electricalData || {};
    const overview = data.overview || {};
    const approvalSummary = data.approval_summary || {};
    const levelProgress = data.level_progress || {};
    const lineTypeSummary = data.line_type_summary || {};
    const materialSummary = data.material_summary || {};
    const poleSummary = data.pole_summary || {};
    const towerSummary = data.tower_summary || {};

    // --- Derived Values ---
    const totalLines = useMemo(
        () =>
        Object.values(lineTypeSummary).reduce(
            (sum, val) => sum + (val.total_lines || 0),
            0,
        ), [lineTypeSummary],
    );

    const totalPoles = useMemo(
        () =>
        Object.values(lineTypeSummary).reduce(
            (sum, val) => sum + (val.planned_poles || 0),
            0,
        ), [lineTypeSummary],
    );

    const completionPercent =
        overview.completed_lines && overview.total_lines ?
        Math.round((overview.completed_lines / overview.total_lines) * 100) :
        0;

    // --- Status Counts ---
    const statusCounts = useMemo(() => {
        let completed = 0,
            underExecution = 0,
            notStarted = 0;
        Object.values(lineTypeSummary).forEach((val) => {
            completed += val.completed || 0;
            underExecution += val.under_execution || 0;
            notStarted += val.not_started || 0;
        });
        return {
            completed,
            underExecution,
            notStarted
        };
    }, [lineTypeSummary]);

    // --- Materials ---
    const filteredMaterials = useMemo(
        () => Object.entries(materialSummary).filter(([_, value]) => value > 0), [materialSummary],
    );

    const totalMaterials = useMemo(
        () => Object.values(materialSummary).reduce((sum, val) => sum + val, 0), [materialSummary],
    );

    // --- Tower Data ---
    const towerData = useMemo(
        () => Object.entries(towerSummary).filter(([_, data]) => data.count > 0), [towerSummary],
    );

    const hasData = data && Object.keys(data).length > 0;

    // --- Helpers ---
    const formatMaterialName = (key) => {
        const map = {
            "Disc Insulator": "Disc Insulator",
            "Earthing Wire": "Earthing Wire",
            "H Frame": "H Frame",
            "PG Clamp": "PG Clamp",
            "Pin Insulator": "Pin Insulator",
            "Stay Pole": "Stay Pole",
            "Stay Rod": "Stay Rod",
            "V Cross Arm": "V Cross Arm",
        };
        return map[key] || key;
    };

    const colors = [
        "#667eea",
        "#764ba2",
        "#43e97b",
        "#f093fb",
        "#4facfe",
        "#f5576c",
    ];

    // --- Render ---
    return ( <
        Box sx = {
            {
                p: {
                    xs: 2,
                    md: 3
                },
                bgcolor: "#f7f8fa",
                minHeight: "100vh"
            }
        } > { /* ================= HEADER ================= */ } <
        Box sx = {
            {
                mb: 4
            }
        } >
        <
        Stack direction = {
            {
                xs: "column",
                sm: "row"
            }
        }
        spacing = {
            2
        }
        alignItems = {
            {
                xs: "stretch",
                sm: "center"
            }
        } >
        <
        Stack direction = "row"
        spacing = {
            2
        }
        alignItems = "center"
        sx = {
            {
                flex: 1
            }
        } >
        <
        Avatar sx = {
            {
                width: 48,
                height: 48,
                bgcolor: "#667eea"
            }
        } >
        <
        ElectricalIcon sx = {
            {
                fontSize: 24,
                color: "#fff"
            }
        }
        /> <
        /Avatar> <
        Box >
        <
        Typography variant = "h5"
        fontWeight = {
            700
        } >
        Electrical Infrastructure <
        /Typography> <
        Typography variant = "body2"
        color = "text.secondary" >
        Real - time overview of lines, poles, approvals & materials <
        /Typography> <
        /Box> <
        /Stack> <
        Box sx = {
            {
                minWidth: {
                    sm: 800
                }
            }
        } >
        <
        LocationFilterBar filters = {
            filters
        }
        setFilters = {
            setFilters
        }
        /> <
        /Box> <
        /Stack> <
        /Box>

        { /* ================= LOADING ================= */ } {
            loading && ( <
                Box sx = {
                    {
                        mb: 3
                    }
                } >
                <
                LinearProgress sx = {
                    {
                        height: 3,
                        borderRadius: 2
                    }
                }
                /> <
                /Box>
            )
        }

        {
            !hasData && !loading && ( <
                Paper sx = {
                    {
                        p: 4,
                        mb: 3,
                        bgcolor: alpha("#FFE0B2", 0.3),
                        border: "1px solid #FFE0B2",
                    }
                } >
                <
                Typography color = "warning.main"
                variant = "body1"
                fontWeight = {
                    600
                }
                align = "center" >
                No electrical data available.Please select filters or refresh. <
                /Typography> <
                /Paper>
            )
        }

        {
            hasData && ( <
                > { /* ================= ROW 1: KEY METRICS ================= */ } <
                Grid container spacing = {
                    2.5
                }
                sx = {
                    {
                        mb: 3
                    }
                } >
                <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    3
                } >
                <
                Fade in = {
                    mounted
                }
                timeout = {
                    300
                } >
                <
                div >
                <
                StatCard title = "TOTAL LINES"
                value = {
                    overview.total_lines || totalLines || 0
                }
                subtitle = {
                    `${statusCounts.completed} completed · ${statusCounts.underExecution} in progress`
                }
                icon = "📊"
                color = "#667eea"
                loading = {
                    loading
                }
                /> <
                /div> <
                /Fade> <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    3
                } >
                <
                Fade in = {
                    mounted
                }
                timeout = {
                    400
                } >
                <
                div >
                <
                StatCard title = "TOTAL DISTANCE"
                value = {
                    `${overview.total_km || 0} KM`
                }
                subtitle = "Transmission length"
                icon = "📏"
                color = "#43e97b"
                loading = {
                    loading
                }
                /> <
                /div> <
                /Fade> <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    3
                } >
                <
                Fade in = {
                    mounted
                }
                timeout = {
                    500
                } >
                <
                div >
                <
                StatCard title = "PLANNED POLES"
                value = {
                    overview.planned_poles || totalPoles || 0
                }
                subtitle = {
                    `${overview.entered_poles || 0} entered · ${overview.entered_percentage || 0}% complete`
                }
                icon = "⚡"
                color = "#4facfe"
                loading = {
                    loading
                }
                /> <
                /div> <
                /Fade> <
                /Grid> <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    3
                } >
                <
                Fade in = {
                    mounted
                }
                timeout = {
                    600
                } >
                <
                div >
                <
                StatCard title = "COMPLETION"
                value = {
                    `${completionPercent}%`
                }
                subtitle = {
                    `${overview.completed_lines || 0} of ${overview.total_lines || totalLines || 0} lines`
                }
                icon = "🎯"
                color = "#764ba2"
                loading = {
                    loading
                }
                /> <
                /div> <
                /Fade> <
                /Grid> <
                /Grid>

                { /* ================= ROW 2: LINE STATUS + APPROVALS ================= */ } <
                Grid container spacing = {
                    3
                }
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
                    6
                } >
                <
                Fade in = {
                    mounted
                }
                timeout = {
                    700
                } >
                <
                div >
                <
                InfoCard title = "Line Status Overview"
                icon = "📈"
                loading = {
                    loading
                } >
                <
                Grid container spacing = {
                    2
                } > {
                    [{
                            label: "Under Execution",
                            value: statusCounts.underExecution,
                            color: "#4facfe",
                        },
                        {
                            label: "Completed",
                            value: statusCounts.completed,
                            color: "#43e97b",
                        },
                        {
                            label: "Not Started",
                            value: statusCounts.notStarted,
                            color: "#f093fb",
                        },
                    ].map((status, idx) => ( <
                        Grid item xs = {
                            4
                        }
                        key = {
                            idx
                        } >
                        <
                        StatusBadge { ...status
                        }
                        /> <
                        /Grid>
                    ))
                } <
                /Grid> <
                Box sx = {
                    {
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid #eef0f2"
                    }
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }
                } >
                <
                Typography variant = "body2"
                color = "text.secondary" >
                Total Lines: < strong > {
                    totalLines
                } < /strong> <
                /Typography> <
                Typography variant = "body2"
                color = "text.secondary" >
                Progress: {
                    " "
                } <
                strong style = {
                    {
                        color: "#43e97b"
                    }
                } > {
                    completionPercent
                } %
                <
                /strong> <
                /Typography> <
                /Box> <
                LinearProgress variant = "determinate"
                value = {
                    completionPercent
                }
                sx = {
                    {
                        mt: 1,
                        height: 6,
                        borderRadius: 2,
                        bgcolor: alpha("#43e97b", 0.1),
                    }
                }
                /> <
                /Box> <
                /InfoCard> <
                /div> <
                /Fade> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    6
                } >
                <
                Fade in = {
                    mounted
                }
                timeout = {
                    800
                } >
                <
                div >
                <
                InfoCard title = "Approval Summary"
                icon = "✅"
                loading = {
                    loading
                } >
                <
                Box sx = {
                    {
                        width: "100%"
                    }
                } > {
                    [{
                            label: "L1 Approved",
                            value: approvalSummary.l1_approved || 0,
                            percentage: approvalSummary.l1_percentage || 0,
                        },
                        {
                            label: "L2 Approved",
                            value: approvalSummary.l2_approved || 0,
                            percentage: approvalSummary.l2_percentage || 0,
                        },
                        {
                            label: "L3 Approved",
                            value: approvalSummary.l3_approved || 0,
                            percentage: approvalSummary.l3_percentage || 0,
                        },
                        {
                            label: "Line Approved",
                            value: approvalSummary.line_approved || 0,
                            percentage: approvalSummary.line_percentage || 0,
                        },
                    ].map((item, idx) => ( <
                        DataRow key = {
                            idx
                        }
                        label = {
                            item.label
                        }
                        value = {
                            item.value
                        }
                        color = {
                            colors[idx % colors.length]
                        }
                        percentage = {
                            item.percentage
                        }
                        />
                    ))
                } <
                /Box> <
                Box sx = {
                    {
                        mt: 1,
                        pt: 1,
                        borderTop: "1px solid #eef0f2"
                    }
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }
                } >
                <
                Typography variant = "caption"
                color = "text.secondary"
                fontWeight = {
                    600
                } >
                Overall Approval Rate <
                /Typography> <
                Typography variant = "body2"
                fontWeight = {
                    700
                }
                color = "#667eea" >
                {
                    [
                        approvalSummary.l1_percentage || 0,
                        approvalSummary.l2_percentage || 0,
                        approvalSummary.l3_percentage || 0,
                        approvalSummary.line_percentage || 0,
                    ].reduce((a, b) => a + b, 0) / 4
                } %
                <
                /Typography> <
                /Box> <
                /Box> <
                /InfoCard> <
                /div> <
                /Fade> <
                /Grid> <
                /Grid>

                { /* ================= ROW 3: POLE SUMMARY + LEVEL PROGRESS ================= */ } <
                Grid container spacing = {
                    3
                }
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
                    6
                } >
                <
                Fade in = {
                    mounted
                }
                timeout = {
                    900
                } >
                <
                div >
                <
                InfoCard title = "Pole Summary"
                icon = "⚡"
                loading = {
                    loading
                } >
                <
                Grid container spacing = {
                    2
                } > {
                    [{
                            label: "Planned Poles",
                            value: poleSummary.planned_poles || 0,
                            color: "#667eea",
                        },
                        {
                            label: "Entered Poles",
                            value: poleSummary.total_entered_poles || 0,
                            color: "#43e97b",
                        },
                        {
                            label: "Pending Poles",
                            value: poleSummary.pending_poles || 0,
                            color: "#f093fb",
                        },
                        {
                            label: "Cut Poles",
                            value: poleSummary.cut_pole_total || 0,
                            color: "#4facfe",
                        },
                        {
                            label: "Line Poles",
                            value: poleSummary.line_pole_total || 0,
                            color: "#764ba2",
                        },
                    ].map((item, idx) => ( <
                        Grid item xs = {
                            6
                        }
                        sm = {
                            4
                        }
                        key = {
                            idx
                        } >
                        <
                        Paper elevation = {
                            0
                        }
                        sx = {
                            {
                                p: 1.5,
                                textAlign: "center",
                                bgcolor: alpha(item.color, 0.06),
                                borderRadius: 1.5,
                                border: `1px solid ${alpha(item.color, 0.12)}`,
                            }
                        } >
                        <
                        Typography variant = "h5"
                        fontWeight = {
                            800
                        }
                        sx = {
                            {
                                color: item.color,
                                fontSize: "1.3rem"
                            }
                        } >
                        {
                            item.value
                        } <
                        /Typography> <
                        Typography variant = "caption"
                        color = "text.secondary"
                        fontWeight = {
                            600
                        }
                        sx = {
                            {
                                fontSize: "0.6rem"
                            }
                        } >
                        {
                            item.label
                        } <
                        /Typography> <
                        /Paper> <
                        /Grid>
                    ))
                } <
                /Grid> {
                    poleSummary.cut_pole_percentage && ( <
                        Box sx = {
                            {
                                mt: 2,
                                pt: 2,
                                borderTop: "1px solid #eef0f2"
                            }
                        } >
                        <
                        Box sx = {
                            {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 0.5,
                            }
                        } >
                        <
                        Typography variant = "caption"
                        color = "text.secondary"
                        fontWeight = {
                            600
                        } >
                        Pole Distribution <
                        /Typography> <
                        Typography variant = "caption"
                        fontWeight = {
                            700
                        }
                        color = "#4facfe" >
                        {
                            poleSummary.cut_pole_percentage
                        } % Cut· {
                            " "
                        } {
                            poleSummary.line_pole_percentage
                        } % Line <
                        /Typography> <
                        /Box> <
                        LinearProgress variant = "determinate"
                        value = {
                            poleSummary.cut_pole_percentage || 0
                        }
                        sx = {
                            {
                                height: 4,
                                borderRadius: 2,
                                bgcolor: alpha("#4facfe", 0.1),
                            }
                        }
                        /> <
                        /Box>
                    )
                } <
                /InfoCard> <
                /div> <
                /Fade> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    6
                } >
                <
                Fade in = {
                    mounted
                }
                timeout = {
                    1000
                } >
                <
                div >
                <
                InfoCard title = "Level Progress"
                icon = "📊"
                loading = {
                    loading
                } >
                <
                Box sx = {
                    {
                        width: "100%"
                    }
                } > {
                    [{
                            label: "L1 Progress",
                            value: levelProgress.l1 || 0
                        },
                        {
                            label: "L2 Progress",
                            value: levelProgress.l2 || 0
                        },
                        {
                            label: "L3 Progress",
                            value: levelProgress.l3 || 0
                        },
                        {
                            label: "Final Progress",
                            value: levelProgress.final || 0,
                        },
                    ].map((item, idx) => ( <
                        Box key = {
                            idx
                        }
                        sx = {
                            {
                                mb: idx < 3 ? 2 : 0
                            }
                        } >
                        <
                        Box sx = {
                            {
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 0.5,
                            }
                        } >
                        <
                        Typography variant = "body2"
                        color = "text.secondary"
                        fontWeight = {
                            500
                        } >
                        {
                            item.label
                        } <
                        /Typography> <
                        Typography variant = "body2"
                        fontWeight = {
                            700
                        }
                        color = "#667eea" >
                        {
                            item.value
                        } %
                        <
                        /Typography> <
                        /Box> <
                        LinearProgress variant = "determinate"
                        value = {
                            item.value
                        }
                        sx = {
                            {
                                height: 5,
                                borderRadius: 2,
                                bgcolor: alpha("#667eea", 0.1),
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 2,
                                    bgcolor: "#667eea",
                                },
                            }
                        }
                        /> <
                        /Box>
                    ))
                } <
                /Box> <
                /InfoCard> <
                /div> <
                /Fade> <
                /Grid> <
                /Grid>

                { /* ================= ROW 4: OVERVIEW + TOWERS ================= */ } <
                Grid container spacing = {
                    3
                }
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
                    6
                } >
                <
                Fade in = {
                    mounted
                }
                timeout = {
                    1100
                } >
                <
                div >
                <
                InfoCard title = "Project Overview"
                icon = "📋"
                loading = {
                    loading
                } >
                <
                Box sx = {
                    {
                        width: "100%"
                    }
                } > {
                    [{
                            label: "Total Lines",
                            value: overview.total_lines || totalLines || 0,
                            color: "#667eea",
                        },
                        {
                            label: "Total KM",
                            value: overview.total_km || 0,
                            color: "#43e97b",
                        },
                        {
                            label: "Completed Lines",
                            value: overview.completed_lines || 0,
                            color: "#43e97b",
                        },
                        {
                            label: "Under Execution",
                            value: overview.under_execution || 0,
                            color: "#4facfe",
                        },
                        {
                            label: "Not Started",
                            value: overview.not_started || 0,
                            color: "#f093fb",
                        },
                        {
                            label: "Pending Poles",
                            value: overview.pending_poles || 0,
                            color: "#764ba2",
                        },
                    ].map((item, idx) => ( <
                        DataRow key = {
                            idx
                        }
                        label = {
                            item.label
                        }
                        value = {
                            item.value
                        }
                        color = {
                            item.color
                        }
                        />
                    ))
                } <
                /Box> <
                Box sx = {
                    {
                        mt: 1,
                        pt: 1,
                        borderTop: "1px solid #eef0f2"
                    }
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }
                } >
                <
                Typography variant = "caption"
                color = "text.secondary"
                fontWeight = {
                    600
                } >
                Overall Progress <
                /Typography> <
                Typography variant = "body2"
                fontWeight = {
                    800
                }
                color = "#43e97b" >
                {
                    completionPercent
                } %
                <
                /Typography> <
                /Box> <
                LinearProgress variant = "determinate"
                value = {
                    completionPercent
                }
                sx = {
                    {
                        mt: 1,
                        height: 6,
                        borderRadius: 2,
                        bgcolor: alpha("#43e97b", 0.1),
                    }
                }
                /> <
                /Box> <
                /InfoCard> <
                /div> <
                /Fade> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    6
                } >
                <
                Fade in = {
                    mounted
                }
                timeout = {
                    1200
                } >
                <
                div >
                <
                InfoCard title = "Tower Summary"
                icon = "🏗️"
                loading = {
                    loading
                } > {
                    towerData.length > 0 ? ( <
                        Grid container spacing = {
                            2
                        } > {
                            towerData.map(([type, data], idx) => ( <
                                Grid item xs = {
                                    6
                                }
                                sm = {
                                    4
                                }
                                key = {
                                    type
                                } >
                                <
                                Paper elevation = {
                                    0
                                }
                                sx = {
                                    {
                                        p: 2,
                                        textAlign: "center",
                                        bgcolor: alpha(
                                            colors[idx % colors.length],
                                            0.06,
                                        ),
                                        borderRadius: 1.5,
                                        border: `1px solid ${alpha(colors[idx % colors.length], 0.12)}`,
                                    }
                                } >
                                <
                                Typography variant = "h5"
                                fontWeight = {
                                    800
                                }
                                sx = {
                                    {
                                        color: colors[idx % colors.length]
                                    }
                                } >
                                {
                                    data.count || 0
                                } <
                                /Typography> <
                                Typography variant = "caption"
                                color = "text.secondary"
                                fontWeight = {
                                    600
                                } >
                                Tower {
                                    type
                                } <
                                /Typography> {
                                    data.percentage !== undefined && ( <
                                        Chip label = {
                                            `${data.percentage}%`
                                        }
                                        size = "small"
                                        sx = {
                                            {
                                                mt: 1,
                                                height: 18,
                                                fontSize: "0.55rem",
                                                fontWeight: 600,
                                                bgcolor: alpha(
                                                    colors[idx % colors.length],
                                                    0.1,
                                                ),
                                                color: colors[idx % colors.length],
                                            }
                                        }
                                        />
                                    )
                                } <
                                /Paper> <
                                /Grid>
                            ))
                        } <
                        /Grid>
                    ) : ( <
                        Box sx = {
                            {
                                textAlign: "center",
                                py: 3
                            }
                        } >
                        <
                        Typography variant = "body2"
                        color = "text.secondary" >
                        No tower data available <
                        /Typography> <
                        /Box>
                    )
                } <
                /InfoCard> <
                /div> <
                /Fade> <
                /Grid> <
                /Grid>

                { /* ================= ROW 5: MATERIALS ================= */ } <
                Grid container spacing = {
                    3
                } >
                <
                Grid item xs = {
                    12
                } >
                <
                Fade in = {
                    mounted
                }
                timeout = {
                    1300
                } >
                <
                div >
                <
                InfoCard title = "Materials Inventory"
                icon = "🧱"
                loading = {
                    loading
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }
                } >
                <
                Typography variant = "caption"
                color = "text.secondary" >
                Total items: < strong > {
                    totalMaterials
                } < /strong> <
                /Typography> {
                    totalMaterials > 0 && ( <
                        Chip label = {
                            `${filteredMaterials.length} types`
                        }
                        size = "small"
                        variant = "outlined" /
                        >
                    )
                } <
                /Box> {
                    filteredMaterials.length > 0 ? ( <
                        Grid container spacing = {
                            2
                        } > {
                            filteredMaterials.map(([key, value], idx) => ( <
                                Grid item xs = {
                                    6
                                }
                                sm = {
                                    4
                                }
                                md = {
                                    3
                                }
                                lg = {
                                    2
                                }
                                key = {
                                    key
                                } >
                                <
                                MaterialItem name = {
                                    formatMaterialName(key)
                                }
                                quantity = {
                                    value
                                }
                                color = {
                                    colors[idx % colors.length]
                                }
                                /> <
                                /Grid>
                            ))
                        } <
                        /Grid>
                    ) : ( <
                        Box sx = {
                            {
                                textAlign: "center",
                                py: 4
                            }
                        } >
                        <
                        Typography variant = "body2"
                        color = "text.secondary" >
                        No materials available <
                        /Typography> <
                        /Box>
                    )
                } <
                /InfoCard> <
                /div> <
                /Fade> <
                /Grid> <
                /Grid> <
                />
            )
        } <
        /Box>
    );
};

export default ElectricalDashboardTab;