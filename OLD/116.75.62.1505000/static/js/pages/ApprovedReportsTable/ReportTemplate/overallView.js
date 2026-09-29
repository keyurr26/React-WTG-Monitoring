import React, {
    useState,
    useEffect
} from "react";
import {
    useNavigate
} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
    IconButton,
    Tooltip,
    CircularProgress
} from "@mui/material";
import {
    useSelector,
    useDispatch
} from "react-redux";
import LogoUges from "../../../assets/logo1bg.png";
import styles from "./overAllView.module.css";
import LocationFilterBar from "../../../components/LocationFilterBar";

import bladeinstallationImg from "../../../assets/WTG Construction/blade installation.jpg";
import nacelleImg from "../../../assets/WTG Construction/installation.jpg";
import EngineersImg from "../../../assets/WTG Construction/engineers2.jpg";
import FoundationImg from "../../../assets/WTG Construction/foundation.jpg";
import truckImg from "../../../assets/WTG Construction/truck.jpg";
import anotherinstallationImg from "../../../assets/WTG Construction/installationanother.jpg";
import RELogo from "../../../assets/WTG Construction/RE LOGO.png";
import {
    GetProjectNestedTemplate
} from "../../../Redux/TemplateView/TemplateAction";
import {
    preloadSectionImages
} from "./imagePreloader";
import {
    getActivitySections
} from "./ActivitySections";
import {
    useMemo
} from "react";
import StageOptions from "./stageoptions";
import ReportPdf from "./ReportPdf/ReportPdf";
export default function DownloadViewReportData() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [processedSections, setProcessedSections] = useState([]);
    const [preparingPdf, setPreparingPdf] = useState(false);
    const [filters, setFilters] = useState({
        project: "",
        windfarm: "",
        cluster: "",
    });
    const [dateFilters, setDateFilters] = useState({
        month: "",
        from_date: "",
        to_date: "",
    });

    const [selectedStages, setSelectedStages] = useState([]); // ✅ Array of selected stages
    const handleStageToggle = (stage) => {
        setSelectedStages((prev) =>
            prev.includes(stage) ?
            prev.filter((s) => s !== stage) // Remove if already selected
            :
            [...prev, stage] // Add if not selected
        );
    };
    const handleBack = () => {
        navigate("/approved-reports");
    };

    const {
        loading,
        TemplateNestedData,
        error
    } = useSelector(
        (state) => state.projectNestedTemplate,
    );

    useEffect(() => {
        if (filters.project && filters.windfarm && filters.cluster) {
            const apiFilters = {
                project_id: filters.project,
                windfarm_id: filters.windfarm,
                cluster_id: filters.cluster,
            };
            if (dateFilters.month) apiFilters.month = dateFilters.month;
            if (dateFilters.from_date && dateFilters.to_date) {
                apiFilters.from_date = dateFilters.from_date;
                apiFilters.to_date = dateFilters.to_date;
            }
            // ✅ NEW: Pass selected stages as array
            if (selectedStages.length > 0) {
                apiFilters.stage = selectedStages; // Redux action will convert to comma-separated
            }
            dispatch(GetProjectNestedTemplate(apiFilters));
        }
    }, [
        dispatch,
        filters.project,
        filters.windfarm,
        filters.cluster,
        dateFilters.month,
        dateFilters.from_date,
        dateFilters.to_date,
        selectedStages, // ✅ Add this
    ]);
    // ========== DATA EXTRACTION ==========
    const projectData =
        Array.isArray(TemplateNestedData) && TemplateNestedData.length > 0 ?
        TemplateNestedData[0] :
        null;
    const windfarmData =
        projectData ? .windfarms && projectData.windfarms.length > 0 ?
        projectData.windfarms[0] :
        null;
    const clusterData =
        windfarmData ? .clusters && windfarmData.clusters.length > 0 ?
        windfarmData.clusters[0] :
        null;
    const turbines = clusterData ? .turbines || [];

    const isFiltersSelected =
        filters.project && filters.windfarm && filters.cluster;

    // ========== HELPER: SORT BY LOCATION NO ==========
    const sortByLocationNo = (data) => {
        return data.sort((a, b) => {
            const locA = a.location_no || "N/A";
            const locB = b.location_no || "N/A";
            const numA = parseInt(locA.replace(/\D/g, "")) || 0;
            const numB = parseInt(locB.replace(/\D/g, "")) || 0;
            return numA - numB;
        });
    };

    // ========== HELPER: EXTRACT ACTIVITY DATA WITH SORTING AND EVIDENCE PHOTO ==========
    const extractActivityData = (
        turbines,
        activityKey,
        statusField,
        dateField,
        activityName,
        evidenceField = "evidence_photo",
    ) => {
        const data = [];
        turbines.forEach((turbine) => {
            if (turbine[activityKey] && Array.isArray(turbine[activityKey])) {
                turbine[activityKey].forEach((item) => {
                    if (item) {
                        data.push({
                            turbine_id: turbine.id,
                            turbine_code: turbine.code || turbine.location_no || "N/A",
                            location_no: turbine.location_no || "N/A",
                            status: item[statusField] || "N/A",
                            date: item[dateField] || item.approve_date || "N/A",
                            approve_date: item.approve_date,
                            evidence_photo: item[evidenceField] || null, // ✅ Added evidence_photo
                            ...item,
                        });
                    }
                });
            }
        });
        return sortByLocationNo(data);
    };

    // ========== SECTION 1: SOIL EVALUATION ==========
    const soilData = [];
    turbines.forEach((turbine) => {
        if (turbine.soil_evaluations) {
            const data = Array.isArray(turbine.soil_evaluations) ?
                turbine.soil_evaluations :
                [turbine.soil_evaluations];
            data.forEach((item) => {
                if (item) {
                    soilData.push({
                        turbine_id: turbine.id,
                        turbine_code: turbine.code || turbine.location_no || "N/A",
                        location_no: turbine.location_no || "N/A",
                        date_of_sampling: item.date_of_sampling,
                        submitted_at: item.submitted_at,
                        approve_date: item.approve_date,
                        soil_status: item.soil_status,
                        remarks: item.remarks,
                        prepared_by: item.prepared_by,
                        evidence_photo: item.evidence_photo || null, // ✅ Added evidence_photo
                    });
                }
            });
        }
    });
    sortByLocationNo(soilData);

    // ========== SECTION 2: EXCAVATION ==========
    const excavationData = extractActivityData(
        turbines,
        "excavations",
        "excavation_status",
        "start_date",
        "Excavation",
        "evidence_photo",
    );

    // ========== SECTION 3: PCC LAYER ==========
    const pccData = extractActivityData(
        turbines,
        "pcc_layers",
        "pcc_status",
        "start_date",
        "PCC Layer",
        "evidence_photo",
    );

    // ========== SECTION 4: CONDUCT LAYING ==========
    const conductData = extractActivityData(
        turbines,
        "conduct_laying",
        "conduct_status",
        "start_date",
        "Conduct Laying",
        "evidence_photo",
    );

    // ========== SECTION 5: ANCHOR CAGE PLACEMENT ==========
    const anchorData = extractActivityData(
        turbines,
        "anchor_placements",
        "anchor_status",
        "start_date",
        "Anchor Cage",
        "evidence_photo",
    );

    // ========== SECTION 6: REINFORCEMENT ==========
    const reinforcementData = extractActivityData(
        turbines,
        "reinforcements",
        "reinforcement_status",
        "start_date",
        "Reinforcement",
        "evidence_photo",
    );

    // ========== SECTION 7: FOUNDATION ==========
    const foundationData = extractActivityData(
        turbines,
        "foundations",
        "foundation_status",
        "start_date",
        "Foundation",
        "evidence_photo",
    );

    // ========== SECTION 8: POURING CARD ==========
    const pouringData = extractActivityData(
        turbines,
        "pouring_cards",
        "pouring_status",
        "pouring_start_time",
        "Pouring Card",
        "evidence_photo",
    );

    // ========== SECTION 9: DESHUTTERING ==========
    const deshutteringData = extractActivityData(
        turbines,
        "deshutter",
        "desh_status",
        "deshuttering_date",
        "Deshuttering",
        "evidence_photo",
    );

    // ========== SECTION 10: CUBE TEST RESULT ==========
    const cubeData = extractActivityData(
        turbines,
        "cube_result",
        "cr_status",
        "submitted_at",
        "Cube Test",
        "evidence_photo",
    );

    // ========== SECTION 11: BACKFILLING ==========
    const backfillingData = extractActivityData(
        turbines,
        "backfilling_turbine",
        "backfill_status",
        "backfilling_date",
        "Backfilling",
        "evidence_photo",
    );

    // ========== SECTION 12: PLATFORM DPR ==========
    const platformData = extractActivityData(
        turbines,
        "platform_dpr",
        "activity_status",
        "work_date",
        "Platform DPR",
        "evidence_photo",
    );

    // ========== SECTION 13: T1 INSTALLATION ==========
    const t1Data = extractActivityData(
        turbines,
        "t1_installations",
        "t1_status",
        "lifting_start",
        "T1 Installation",
        "evidence_photo",
    );

    // ========== SECTION 14: TOWER INSTALLATION ==========
    const towerData = extractActivityData(
        turbines,
        "tower_installations",
        "tower_status",
        "lifting_start",
        "Tower Installation",
        "evidence_photo",
    );

    // ========== SECTION 15: NACELLE INSTALLATION ==========
    const nacelleData = extractActivityData(
        turbines,
        "nacelle_installations",
        "nacelle_status",
        "submitted_at",
        "Nacelle Installation",
        "evidence_photo",
    );

    // ========== SECTION 16: ROTOR HUB INSTALLATION ==========
    const rotorData = extractActivityData(
        turbines,
        "rotor_hubs",
        "rotor_status",
        "submitted_at",
        "Rotor Hub",
        "evidence_photo",
    );

    // ========== SECTION 17: BLADE INSTALLATION ==========
    const bladeData = extractActivityData(
        turbines,
        "blade_installations",
        "blade_status",
        "submitted_at",
        "Blade Installation",
        "evidence_photo",
    );
    // ========== SECTION 18: ELECTRICAL LINES ==========
    // ========== SECTION 18: ELECTRICAL LINES ==========
    const extractElectricalLineData = (electricalLines) => {
        const data = [];

        electricalLines.forEach((line) => {
            // Get turbine location numbers from turbine_ids
            const turbineLocations = line.turbine_locations || [];
            const locationNos = turbineLocations.map((t) => t.location_no).join(", ");

            // Get L1, L2, L3 approval dates from pole_details
            let l1ApprovedAt = null;
            let l2ApprovedAt = null;
            let l3ApprovedAt = null;
            let l1Photo = null;
            let l2Photo = null;
            let l3Photo = null;

            const poleDetails = line.pole_details || [];

            // Find the latest approved dates and photos for each level
            poleDetails.forEach((pole) => {
                if (pole.approved_l1_at) {
                    if (!l1ApprovedAt ||
                        new Date(pole.approved_l1_at) > new Date(l1ApprovedAt)
                    ) {
                        l1ApprovedAt = pole.approved_l1_at;
                        l1Photo = pole.photo || null;
                    }
                }
                if (pole.approved_l2_at) {
                    if (!l2ApprovedAt ||
                        new Date(pole.approved_l2_at) > new Date(l2ApprovedAt)
                    ) {
                        l2ApprovedAt = pole.approved_l2_at;
                        l2Photo = pole.fab_mounting_photo || null;
                    }
                }
                if (pole.approved_l3_at) {
                    if (!l3ApprovedAt ||
                        new Date(pole.approved_l3_at) > new Date(l3ApprovedAt)
                    ) {
                        l3ApprovedAt = pole.approved_l3_at;
                        l3Photo = pole.stringing_photo || null;
                    }
                }
            });

            data.push({
                line_id: line.id,
                line_name: line.line_name || "N/A",
                line_type: line.line_type || "N/A",
                turbine_locations: locationNos || "N/A",
                total_poles: line.total_poles || 0,
                start_date: line.start_date || null,
                line_photo: line.photo || null,
                // status: line.status || "N/A",
                // L1 Details
                l1_approved_at: l1ApprovedAt,
                l1_photo: l1Photo,
                // L2 Details
                l2_approved_at: l2ApprovedAt,
                l2_photo: l2Photo,
                // L3 Details
                l3_approved_at: l3ApprovedAt,
                l3_photo: l3Photo,
            });
        });

        // Sort by line name
        return data.sort((a, b) => {
            const numA = parseInt(a.line_name.replace(/\D/g, "")) || 0;
            const numB = parseInt(b.line_name.replace(/\D/g, "")) || 0;
            return numA - numB;
        });
    };

    // Extract electrical lines data from cluster
    const electricalLinesData = clusterData ? .electrical_lines || [];
    const electricalData = extractElectricalLineData(electricalLinesData);

    const extractUSSData = (turbines) => {
        const data = [];

        turbines.forEach((turbine) => {
            if (turbine.uss_masters && Array.isArray(turbine.uss_masters)) {
                turbine.uss_masters.forEach((uss) => {
                    if (uss) {
                        const activities = uss.activities || [];

                        const activityDetails = activities.map((activity) => ({
                            name: activity.activity_name || "N/A",
                            start_date: activity.start_date || null,
                            end_date: activity.end_date || null,
                            start_photo: activity.start_photo || null,
                            end_photo: activity.end_photo || null,
                            no_of_days: activity.no_of_days || 0,
                            remarks: activity.remarks || "N/A",
                            submitted_at: activity.submitted_at || null,
                            approved_at: activity.approved_at || null,
                        }));

                        const firstActivity = activities.length > 0 ? activities[0] : null;
                        const lastActivity =
                            activities.length > 0 ? activities[activities.length - 1] : null;

                        data.push({
                            turbine_id: turbine.id,
                            turbine_code: turbine.code || turbine.location_no || "N/A",
                            location_no: turbine.location_no || "N/A",
                            uss_name: uss.uss_name || "N/A",
                            uss_id: uss.id,

                            approved_at: uss.approved_at || null,
                            submitted_at: uss.submitted_at || null,
                            activities_count: activities.length,
                            activity_details: activityDetails,
                            start_photo: firstActivity ? .start_photo || null,
                            end_photo: lastActivity ? .end_photo || null,
                            activity_names: activities.map((a) => a.activity_name).join(", ") || "N/A",
                            created_at: uss.created_at || null,
                            created_by: uss.created_by || null,
                            approved_by: uss.approved_by || null,
                        });
                    }
                });
            }
        });

        return sortByLocationNo(data);
    };

    const ussData = extractUSSData(turbines);

    const activitySections = getActivitySections({
        soilData,
        excavationData,
        pccData,
        conductData,
        anchorData,
        reinforcementData,
        foundationData,
        pouringData,
        deshutteringData,
        cubeData,
        backfillingData,
        platformData,
        t1Data,
        towerData,
        nacelleData,
        rotorData,
        bladeData,
        electricalData,
        ussData,
        // roadData,
    });
    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            // Only preload when there's actual data
            if (!visibleSections || visibleSections.length === 0) {
                setProcessedSections([]);
                return;
            }

            // Skip sections with no data to save time
            const sectionsWithData = visibleSections.filter(
                (s) => s.data && s.data.length > 0
            );

            if (sectionsWithData.length === 0) {
                setProcessedSections(visibleSections);
                return;
            }

            setPreparingPdf(true);
            try {
                const withBase64 = await preloadSectionImages(sectionsWithData);

                // Map back — keep empty sections as-is
                const result = visibleSections.map((s) => {
                    const found = withBase64.find((p) => p.key === s.key);
                    return found || s;
                });

                if (!cancelled) setProcessedSections(result);
            } catch (e) {
                console.error("PDF image preload failed", e);
                if (!cancelled) setProcessedSections(visibleSections);
            } finally {
                if (!cancelled) setPreparingPdf(false);
            }
        };

        run();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TemplateNestedData, selectedStages]);
    const visibleSections = activitySections.filter((section) => {
        if (selectedStages.length === 0) return true;
        if (section.key === "electrical" || section.key === "road") return true;
        return selectedStages.includes(section.key);
    });

    // ⬇️ EFFECT GOES HERE (after visibleSections is declared)
    useEffect(() => {
        let cancelled = false;

        const run = async () => {
            if (!visibleSections || visibleSections.length === 0) {
                setProcessedSections([]);
                return;
            }

            const sectionsWithData = visibleSections.filter(
                (s) => s.data && s.data.length > 0
            );

            if (sectionsWithData.length === 0) {
                setProcessedSections(visibleSections);
                return;
            }

            setPreparingPdf(true);
            try {
                const withBase64 = await preloadSectionImages(sectionsWithData);

                const result = visibleSections.map((s) => {
                    const found = withBase64.find((p) => p.key === s.key);
                    return found || s;
                });

                if (!cancelled) setProcessedSections(result);
            } catch (e) {
                console.error("PDF image preload failed", e);
                if (!cancelled) setProcessedSections(visibleSections);
            } finally {
                if (!cancelled) setPreparingPdf(false);
            }
        };

        run();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TemplateNestedData, selectedStages]);

    const months = [{
            value: "",
            label: "All Months"
        },
        {
            value: "jan",
            label: "January"
        },
        {
            value: "feb",
            label: "February"
        },
        {
            value: "mar",
            label: "March"
        },
        {
            value: "apr",
            label: "April"
        },
        {
            value: "may",
            label: "May"
        },
        {
            value: "jun",
            label: "June"
        },
        {
            value: "jul",
            label: "July"
        },
        {
            value: "aug",
            label: "August"
        },
        {
            value: "sep",
            label: "September"
        },
        {
            value: "oct",
            label: "October"
        },
        {
            value: "nov",
            label: "November"
        },
        {
            value: "dec",
            label: "December"
        },
    ];

    const handleMonthChange = (e) =>
        setDateFilters({ ...dateFilters,
            month: e.target.value
        });
    const handleDateChange = (e) => {
        const {
            name,
            value
        } = e.target;
        setDateFilters({ ...dateFilters,
            [name]: value
        });
    };

    const gridImages = [{
            src: FoundationImg,
            alt: "Foundation"
        },
        {
            src: bladeinstallationImg,
            alt: "Blade Installation"
        },
        {
            src: nacelleImg,
            alt: "Nacelle Installation"
        },
        {
            src: EngineersImg,
            alt: "Engineers"
        },
        {
            src: truckImg,
            alt: "Truck Transport"
        },
        {
            src: anotherinstallationImg,
            alt: "Alternative Installation"
        },
    ];

    const ROWS_PER_PAGE = 25;
    const chunkData = (data, size) => {
        const chunks = [];
        for (let i = 0; i < data.length; i += size) {
            chunks.push(data.slice(i, i + size));
        }
        return chunks;
    };

    let totalActivityPages = 0;
    visibleSections.forEach((section) => {
        totalActivityPages += Math.ceil(section.data.length / ROWS_PER_PAGE) || 1;
    });
    const totalPages = 1 + totalActivityPages + 1 + 2;

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .toUpperCase();
    };

    const getStatusBadgeStyle = (status) => {
        const s = status ? .toLowerCase() || "";
        if (s === "completed")
            return {
                backgroundColor: "#d4edda",
                border: "1px solid #b8daff",
                color: "#005724ff",
            };
        if (s === "in_progress" || s === "inprogress")
            return {
                backgroundColor: "#ffc107",
                color: "#333"
            };
        if (s === "pending") return {
            backgroundColor: "#dc3545",
            color: "white"
        };
        return {
            backgroundColor: "#6c757d",
            color: "white"
        };
    };

    const RenderHeader = () => ( <
        div className = {
            styles.headerContainer
        } >
        <
        div className = {
            styles.logoBox
        } >
        <
        img src = {
            LogoUges
        }
        alt = "UGES Logo" / >
        <
        /div> <
        div className = {
            styles.titleBox
        } >
        <
        h1 > Project Progress Report < /h1> <
        p > (An ISO 9001: 2015 and ISO 45001: 2018 Certified Company) < /p> <
        /div> <
        /div>
    );

    const RenderFooter = ({
        pageNum,
        totalPages
    }) => ( <
        div className = {
            styles.footerContainer
        } >
        <
        hr className = {
            styles.dividerLine
        }
        /> <
        div className = {
            styles.footerContent
        } >
        <
        span className = {
            styles.reportReference
        } >
        UGES– 2026 - 2027 / {
            projectData ? .client_name || "N/A"
        } <
        /span> <
        span className = {
            styles.pageNumber
        } >
        Page {
            pageNum
        } of {
            totalPages
        } <
        /span> <
        /div> <
        /div>
    );

    // ========== RENDER EVIDENCE PHOTO ==========

    const renderEvidencePhoto = (photoUrl) => {
        if (!photoUrl) {
            return <span style = {
                {
                    color: "#999",
                    fontSize: "11px"
                }
            } > No Photo < /span>;
        }
        return ( <
            img src = {
                photoUrl
            }
            alt = "Evidence"
            style = {
                {
                    width: "240px",
                    height: "190px",
                    objectFit: "cover",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                }
            }
            onError = {
                (e) => {
                    // Safe error handling - check if element is still in DOM
                    const parent = e.target.parentElement;
                    if (parent && parent.isConnected) {
                        // Create a replacement span
                        const span = document.createElement("span");
                        span.style.color = "#999";
                        span.style.fontSize = "11px";
                        span.textContent = "Invalid Image";
                        parent.replaceChild(span, e.target);
                    }
                }
            }
            />
        );
    };

    // ========== RENDER ACTIVITY TABLE ==========
    const renderActivityTable = (section, chunk, chunkIdx, startPage) => {
        const currentPageNum = startPage + chunkIdx;
        const globalStartIndex = chunkIdx * ROWS_PER_PAGE;

        // Helper to render status badge with different styles
        const renderStatusBadge = (status) => {
            const s = status ? .toLowerCase() || "";
            let className = styles.statusBadgeDefault;
            if (s === "completed") className = styles.statusBadgeCompleted;
            else if (s === "in_progress" || s === "inprogress")
                className = styles.statusBadgeInProgress;
            else if (s === "pending") className = styles.statusBadgePending;
            return className;
        };

        return ( <
            div key = {
                `${section.key}-${chunkIdx}`
            }
            className = {
                styles.pageContainer
            } >
            <
            div className = {
                styles.contentWrapper
            } >
            <
            RenderHeader / >
            <
            div className = {
                styles.pageSection
            } >
            <
            h2 className = {
                styles.sectionTitle
            } > {
                section.title
            } < /h2> <
            p className = {
                styles.sectionNote
            } >
            Total: {
                section.data.length
            }
            records | Page {
                chunkIdx + 1
            } of {
                " "
            } {
                Math.ceil(section.data.length / ROWS_PER_PAGE)
            } <
            /p> <
            table className = {
                styles.activityTable
            } >
            <
            thead >
            <
            tr >
            <
            th className = {
                styles.snoHeader
            } > S.No < /th> {
                section.columns.map((col, idx) => {
                    // Determine CSS class based on column name
                    let headerClass = "";
                    let textAlign = "textLeft";

                    if (col === "S.No") {
                        headerClass = styles.snoHeader;
                        textAlign = "textCenter";
                    } else if (col === "Line Name") {
                        headerClass = styles.lineNameHeader;
                    } else if (col === "Line Type") {
                        headerClass = styles.lineTypeHeader;
                    } else if (col === "Turbine Locations") {
                        headerClass = styles.turbineLocHeader;
                    } else if (col === "Total Poles") {
                        headerClass = styles.totalPolesHeader;
                        textAlign = "textCenter";
                    } else if (
                        col === "Start Date" ||
                        col === "Submitted At" ||
                        col === "Approved Date" ||
                        col === "Sampling Date"
                    ) {
                        headerClass = styles.dateHeader;
                    }
                    // else if (col === 'Status') {
                    //   headerClass = styles.statusHeader;
                    // }
                    else if (
                        col === "L1 Approval" ||
                        col === "L2 Approval" ||
                        col === "L3 Approval"
                    ) {
                        headerClass = styles.approvalHeader;
                    } else if (col.includes("Photo")) {
                        headerClass = styles.photoColumnHeader;
                        textAlign = "textCenter";
                    }

                    return ( <
                        th key = {
                            idx
                        }
                        className = {
                            `${headerClass} ${styles[textAlign]}`
                        } >
                        {
                            col
                        } <
                        /th>
                    );
                })
            } <
            /tr> <
            /thead> <
            tbody > {
                chunk.map((item, index) => {
                    const srNo = globalStartIndex + index + 1;
                    return ( <
                        tr key = {
                            srNo
                        } >
                        <
                        td className = {
                            `${styles.textCenter} ${styles.fontBold}`
                        } > {
                            srNo
                        } <
                        /td>

                        { /* ===== ROAD PROGRESS ===== */ } {
                            section.key === "road" && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.road_name || "N/A"
                                } <
                                /td> <
                                td > {
                                    item.road_label || "N/A"
                                } < /td> <
                                td > {
                                    item.road_type || "N/A"
                                } < /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    item.distance_km || 0
                                } <
                                /td> <
                                td >
                                <
                                span className = {
                                    renderStatusBadge(item.progress_level)
                                } >
                                {
                                    item.progress_level || "N/A"
                                } <
                                /span> <
                                /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    item.completed_qty || "0"
                                }
                                Km <
                                /td> <
                                td > {
                                    formatDate(item.date)
                                } < /td> <
                                td > {
                                    formatDate(item.approve_date)
                                } < /td> <
                                td className = {
                                    styles.fontSmall
                                } > {
                                    item.remarks || "N/A"
                                } <
                                /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    renderEvidencePhoto(item.photo)
                                } <
                                /td> <
                                />
                            )
                        } { /* ===== SOIL EVALUATION ===== */ } {
                            section.key === "soil" && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.turbine_code || "N/A"
                                } <
                                /td> <
                                td > {
                                    item.location_no || "N/A"
                                } < /td> <
                                td > {
                                    formatDate(item.date_of_sampling)
                                } < /td> <
                                td > {
                                    formatDate(item.submitted_at)
                                } < /td> <
                                td > {
                                    formatDate(item.approve_date)
                                } < /td> <
                                td >
                                <
                                span className = {
                                    renderStatusBadge(item.soil_status)
                                } >
                                {
                                    item.soil_status || "N/A"
                                } <
                                /span> <
                                /td> <
                                td className = {
                                    styles.fontSmall
                                } > {
                                    item.remarks || "N/A"
                                } <
                                /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    renderEvidencePhoto(item.evidence_photo)
                                } <
                                /td> <
                                />
                            )
                        }

                        { /* ===== EXCAVATION, PCC, CONDUCT, ANCHOR, REINFORCEMENT, FOUNDATION ===== */ } {
                            [
                                "excavation",
                                "pcc",
                                "conduct",
                                "anchor",
                                "reinforcement",
                                "foundation",
                            ].includes(section.key) && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.turbine_code || "N/A"
                                } <
                                /td> <
                                td > {
                                    item.location_no || "N/A"
                                } < /td> <
                                td > {
                                    formatDate(item.start_date || item.date)
                                } < /td> <
                                td > {
                                    formatDate(item.approve_date)
                                } < /td> <
                                td >
                                <
                                span className = {
                                    renderStatusBadge(item.status)
                                } > {
                                    item.status || "N/A"
                                } <
                                /span> <
                                /td> {
                                    section.key === "pcc" && ( <
                                        td className = {
                                            styles.fontSmall
                                        } > {
                                            item.work_description || "N/A"
                                        } <
                                        /td>
                                    )
                                } {
                                    section.key === "conduct" && ( <
                                        td className = {
                                            styles.fontSmall
                                        } > {
                                            item.work_description || "N/A"
                                        } <
                                        /td>
                                    )
                                } {
                                    section.key === "reinforcement" && ( <
                                        td className = {
                                            styles.fontSmall
                                        } > {
                                            item.observations || "N/A"
                                        } <
                                        /td>
                                    )
                                } {
                                    section.key === "foundation" && ( <
                                        td > {
                                            item.foundation_type || "N/A"
                                        } < /td>
                                    )
                                } <
                                td className = {
                                    styles.textCenter
                                } > {
                                    renderEvidencePhoto(item.evidence_photo)
                                } <
                                /td> <
                                />
                            )
                        }

                        { /* ===== POURING CARD ===== */ } {
                            section.key === "pouring" && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.turbine_code || "N/A"
                                } <
                                /td> <
                                td > {
                                    item.location_no || "N/A"
                                } < /td> <
                                td > {
                                    formatDate(item.pouring_start_time)
                                } < /td> <
                                td > {
                                    formatDate(item.pouring_end_time)
                                } < /td> <
                                td > {
                                    formatDate(item.approve_date)
                                } < /td> <
                                td >
                                <
                                span className = {
                                    renderStatusBadge(item.pouring_status)
                                } >
                                {
                                    item.pouring_status || "N/A"
                                } <
                                /span> <
                                /td> <
                                td > {
                                    item.quantity_delivered || "N/A"
                                } < /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    renderEvidencePhoto(item.evidence_photo)
                                } <
                                /td> <
                                />
                            )
                        }

                        { /* ===== DESHUTTERING ===== */ } {
                            section.key === "deshuttering" && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.turbine_code || "N/A"
                                } <
                                /td> <
                                td > {
                                    item.location_no || "N/A"
                                } < /td> <
                                td > {
                                    formatDate(item.deshuttering_date)
                                } < /td> <
                                td > {
                                    formatDate(item.approve_date)
                                } < /td> <
                                td >
                                <
                                span className = {
                                    renderStatusBadge(item.desh_status)
                                } >
                                {
                                    item.desh_status || "N/A"
                                } <
                                /span> <
                                /td> <
                                td > {
                                    item.defect_found ? "Yes" : "No"
                                } < /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    renderEvidencePhoto(item.evidence_photo)
                                } <
                                /td> <
                                />
                            )
                        }

                        { /* ===== CUBE TEST RESULT ===== */ } {
                            section.key === "cube" && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.turbine_code || "N/A"
                                } <
                                /td> <
                                td > {
                                    item.location_no || "N/A"
                                } < /td> <
                                td > {
                                    item.no_of_days_test || "N/A"
                                } < /td> <
                                td > {
                                    formatDate(item.submitted_at)
                                } < /td> <
                                td > {
                                    formatDate(item.approve_date)
                                } < /td> <
                                td >
                                <
                                span className = {
                                    renderStatusBadge(item.cr_status)
                                } > {
                                    item.cr_status || "N/A"
                                } <
                                /span> <
                                /td> <
                                td > {
                                    item.acceptance_criteria || "N/A"
                                } < /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    renderEvidencePhoto(item.evidence_photo)
                                } <
                                /td> <
                                />
                            )
                        }

                        { /* ===== BACKFILLING ===== */ } {
                            section.key === "backfilling" && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.turbine_code || "N/A"
                                } <
                                /td> <
                                td > {
                                    item.location_no || "N/A"
                                } < /td> <
                                td > {
                                    formatDate(item.backfilling_date)
                                } < /td> <
                                td > {
                                    formatDate(item.approve_date)
                                } < /td> <
                                td >
                                <
                                span className = {
                                    renderStatusBadge(
                                        item.backfill_status,
                                    )
                                } >
                                {
                                    item.backfill_status || "N/A"
                                } <
                                /span> <
                                /td> <
                                td > {
                                    item.compaction_percentage || "N/A"
                                } % < /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    renderEvidencePhoto(item.evidence_photo)
                                } <
                                /td> <
                                />
                            )
                        }

                        { /* ===== PLATFORM DPR ===== */ } {
                            section.key === "platform" && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.turbine_code || "N/A"
                                } <
                                /td> <
                                td > {
                                    item.location_no || "N/A"
                                } < /td> <
                                td > {
                                    formatDate(item.work_date)
                                } < /td> <
                                td > {
                                    formatDate(item.approve_date)
                                } < /td> <
                                td >
                                <
                                span className = {
                                    renderStatusBadge(
                                        item.activity_status,
                                    )
                                } >
                                {
                                    item.activity_status || "N/A"
                                } <
                                /span> <
                                /td> <
                                td > {
                                    item.compaction_achieved || "N/A"
                                } % < /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    renderEvidencePhoto(item.evidence_photo)
                                } <
                                /td> <
                                />
                            )
                        }

                        { /* ===== T1 INSTALLATION & TOWER INSTALLATION ===== */ } {
                            ["t1", "tower"].includes(section.key) && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.turbine_code || "N/A"
                                } <
                                /td> <
                                td > {
                                    item.location_no || "N/A"
                                } < /td> <
                                td > {
                                    formatDate(item.lifting_start)
                                } < /td> <
                                td > {
                                    formatDate(item.lifting_end)
                                } < /td> <
                                td > {
                                    formatDate(item.approve_date)
                                } < /td> <
                                td >
                                <
                                span className = {
                                    renderStatusBadge(item.status)
                                } > {
                                    item.status || "N/A"
                                } <
                                /span> <
                                /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    renderEvidencePhoto(item.evidence_photo)
                                } <
                                /td> <
                                />
                            )
                        }

                        { /* ===== NACELLE INSTALLATION & ROTOR HUB INSTALLATION ===== */ } {
                            ["nacelle", "rotor"].includes(section.key) && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.turbine_code || "N/A"
                                } <
                                /td> <
                                td > {
                                    item.location_no || "N/A"
                                } < /td> <
                                td > {
                                    formatDate(item.submitted_at)
                                } < /td> <
                                td > {
                                    formatDate(item.approve_date)
                                } < /td> <
                                td >
                                <
                                span className = {
                                    renderStatusBadge(item.status)
                                } > {
                                    item.status || "N/A"
                                } <
                                /span> <
                                /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    renderEvidencePhoto(item.evidence_photo)
                                } <
                                /td> <
                                />
                            )
                        }

                        { /* ===== BLADE INSTALLATION ===== */ } {
                            section.key === "blade" && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.turbine_code || "N/A"
                                } <
                                /td> <
                                td > {
                                    item.location_no || "N/A"
                                } < /td> <
                                td > {
                                    formatDate(item.submitted_at)
                                } < /td> <
                                td > {
                                    formatDate(item.approve_date)
                                } < /td> <
                                td >
                                <
                                span className = {
                                    renderStatusBadge(item.blade_status)
                                } >
                                {
                                    item.blade_status || "N/A"
                                } <
                                /span> <
                                /td> <
                                td > {
                                    item.blade_no || "N/A"
                                } < /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    renderEvidencePhoto(item.evidence_photo)
                                } <
                                /td> <
                                />
                            )
                        }

                        { /* ===== ELECTRICAL LINES ===== */ } {
                            section.key === "electrical" && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.line_name
                                } < /td> <
                                td className = {
                                    styles.fontSmall
                                } > {
                                    item.line_type
                                } < /td> <
                                td className = {
                                    styles.turbineLocCell
                                } > {
                                    item.turbine_locations
                                } <
                                /td> <
                                td className = {
                                    `${styles.textCenter} ${styles.fontBold}`
                                } >
                                {
                                    item.total_poles
                                } <
                                /td> <
                                td > {
                                    formatDate(item.start_date)
                                } < /td> {
                                    /* <td>
                                                              <span className={renderStatusBadge(item.status)}>
                                                                {item.status || "N/A"}
                                                              </span>
                                                            </td> */
                                } <
                                td > {
                                    formatDate(item.l1_approved_at)
                                } < /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    item.l1_photo ? ( <
                                        img src = {
                                            item.l1_photo
                                        }
                                        alt = "L1 Evidence"
                                        className = {
                                            styles.photoThumbnail
                                        }
                                        onClick = {
                                            () =>
                                            window.open(item.l1_photo, "_blank")
                                        }
                                        onError = {
                                            (e) => {
                                                const parent = e.target.parentElement;
                                                if (parent && parent.isConnected) {
                                                    const span = document.createElement("span");
                                                    span.className = styles.noPhotoText;
                                                    span.textContent = "N/A";
                                                    parent.replaceChild(span, e.target);
                                                }
                                            }
                                        }
                                        />
                                    ) : ( <
                                        span className = {
                                            styles.noPhotoText
                                        } > N / A < /span>
                                    )
                                } <
                                /td> <
                                td > {
                                    formatDate(item.l2_approved_at)
                                } < /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    item.l2_photo ? ( <
                                        img src = {
                                            item.l2_photo
                                        }
                                        alt = "L2 Evidence"
                                        className = {
                                            styles.photoThumbnail
                                        }
                                        onClick = {
                                            () =>
                                            window.open(item.l2_photo, "_blank")
                                        }
                                        onError = {
                                            (e) => {
                                                const parent = e.target.parentElement;
                                                if (parent && parent.isConnected) {
                                                    const span = document.createElement("span");
                                                    span.className = styles.noPhotoText;
                                                    span.textContent = "N/A";
                                                    parent.replaceChild(span, e.target);
                                                }
                                            }
                                        }
                                        />
                                    ) : ( <
                                        span className = {
                                            styles.noPhotoText
                                        } > N / A < /span>
                                    )
                                } <
                                /td> <
                                td > {
                                    formatDate(item.l3_approved_at)
                                } < /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    item.l3_photo ? ( <
                                        img src = {
                                            item.l3_photo
                                        }
                                        alt = "L3 Evidence"
                                        className = {
                                            styles.photoThumbnail
                                        }
                                        onClick = {
                                            () =>
                                            window.open(item.l3_photo, "_blank")
                                        }
                                        onError = {
                                            (e) => {
                                                const parent = e.target.parentElement;
                                                if (parent && parent.isConnected) {
                                                    const span = document.createElement("span");
                                                    span.className = styles.noPhotoText;
                                                    span.textContent = "N/A";
                                                    parent.replaceChild(span, e.target);
                                                }
                                            }
                                        }
                                        />
                                    ) : ( <
                                        span className = {
                                            styles.noPhotoText
                                        } > N / A < /span>
                                    )
                                } <
                                /td> <
                                td > {
                                    formatDate(item.approved_at)
                                } < /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    item.photo ? ( <
                                        img src = {
                                            item.photo
                                        }
                                        alt = "Final Evidence"
                                        className = {
                                            styles.photoThumbnail
                                        }
                                        onClick = {
                                            () =>
                                            window.open(item.photo, "_blank")
                                        }
                                        onError = {
                                            (e) => {
                                                const parent = e.target.parentElement;
                                                if (parent && parent.isConnected) {
                                                    const span = document.createElement("span");
                                                    span.className = styles.noPhotoText;
                                                    span.textContent = "N/A";
                                                    parent.replaceChild(span, e.target);
                                                }
                                            }
                                        }
                                        />
                                    ) : ( <
                                        span className = {
                                            styles.noPhotoText
                                        } > N / A < /span>
                                    )
                                } <
                                /td> <
                                />
                            )
                        } {
                            section.key === "uss" && ( <
                                >
                                <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.turbine_code || "N/A"
                                } <
                                /td> <
                                td > {
                                    item.location_no || "N/A"
                                } < /td> <
                                td className = {
                                    styles.fontBold
                                } > {
                                    item.uss_name
                                } < /td> <
                                td >
                                <
                                div className = {
                                    styles.activityList
                                } >
                                <
                                span className = {
                                    styles.activityCount
                                } > {
                                    item.activities_count
                                }
                                activities <
                                /span> {
                                    item.activity_details &&
                                        item.activity_details.length > 0 && ( <
                                            div className = {
                                                styles.activityTooltip
                                            } > {
                                                item.activity_details.map(
                                                    (activity, idx) => ( <
                                                        div key = {
                                                            idx
                                                        }
                                                        className = {
                                                            styles.activityItem
                                                        } >
                                                        <
                                                        span className = {
                                                            styles.activityName
                                                        } > {
                                                            activity.name
                                                        } <
                                                        /span> {
                                                            activity.no_of_days > 0 && ( <
                                                                span className = {
                                                                    styles.activityDays
                                                                } >
                                                                ({
                                                                        activity.no_of_days
                                                                    }
                                                                    days) <
                                                                /span>
                                                            )
                                                        } <
                                                        /div>
                                                    ),
                                                )
                                            } <
                                            /div>
                                        )
                                } <
                                /div> <
                                /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    item.start_photo ? ( <
                                        img src = {
                                            item.start_photo
                                        }
                                        alt = "Start Photo"
                                        className = {
                                            styles.ussPhotoThumbnail
                                        }
                                        onClick = {
                                            () =>
                                            window.open(item.start_photo, "_blank")
                                        }
                                        onError = {
                                            (e) => {
                                                const parent = e.target.parentElement;
                                                if (parent && parent.isConnected) {
                                                    const span = document.createElement("span");
                                                    span.className = styles.noPhotoText;
                                                    span.textContent = "N/A";
                                                    parent.replaceChild(span, e.target);
                                                }
                                            }
                                        }
                                        />
                                    ) : ( <
                                        span className = {
                                            styles.noPhotoText
                                        } > N / A < /span>
                                    )
                                } <
                                /td> <
                                td className = {
                                    styles.textCenter
                                } > {
                                    item.end_photo ? ( <
                                        img src = {
                                            item.end_photo
                                        }
                                        alt = "End Photo"
                                        className = {
                                            styles.ussPhotoThumbnail
                                        }
                                        onClick = {
                                            () =>
                                            window.open(item.end_photo, "_blank")
                                        }
                                        onError = {
                                            (e) => {
                                                const parent = e.target.parentElement;
                                                if (parent && parent.isConnected) {
                                                    const span = document.createElement("span");
                                                    span.className = styles.noPhotoText;
                                                    span.textContent = "N/A";
                                                    parent.replaceChild(span, e.target);
                                                }
                                            }
                                        }
                                        />
                                    ) : ( <
                                        span className = {
                                            styles.noPhotoText
                                        } > N / A < /span>
                                    )
                                } <
                                /td> <
                                td > {
                                    formatDate(item.submitted_at)
                                } < /td> <
                                td >
                                <
                                span className = {
                                    item.approved_at ?
                                    styles.statusBadgeCompleted :
                                        styles.statusBadgePending
                                } >
                                {
                                    item.approved_at ?
                                    formatDate(item.approved_at) :
                                        "Pending"
                                } <
                                /span> <
                                /td> <
                                />
                            )
                        } <
                        /tr>
                    );
                })
            } <
            /tbody> <
            /table> {
                section.data.length === 0 && ( <
                    div className = {
                        styles.noDataMessage
                    } >
                    No {
                        section.title
                    }
                    records found. <
                    /div>
                )
            } <
            /div> <
            /div> <
            RenderFooter pageNum = {
                currentPageNum
            }
            totalPages = {
                totalPages
            }
            /> <
            /div>
        );
    };
    let currentPage = 2;

    return ( <
        div >
        <
        LocationFilterBar filters = {
            filters
        }
        setFilters = {
            setFilters
        }
        /> <
        StageOptions model = {
            {
                selectedStages
            }
        }
        triggerModelUpdate = {
            ({
                selectedStages: next
            }) => setSelectedStages(next)
        }
        />


        { /* DATE FILTERS */ } <
        div className = {
            styles.filterContainer
        } > {
            /* <div className={styles.filterGroup}>
                      <label className={styles.filterLabel}>Month:</label>
                      <select
                        value={dateFilters.month}
                        onChange={handleMonthChange}
                        className={styles.filterSelect}
                      >
                        {months.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div> */
        } <
        div className = {
            styles.filterGroup
        } >
        <
        label className = {
            styles.filterLabel
        } > From: < /label> <
        input type = "date"
        name = "from_date"
        value = {
            dateFilters.from_date
        }
        onChange = {
            handleDateChange
        }
        className = {
            styles.filterInput
        }
        /> <
        /div> <
        div className = {
            styles.filterGroup
        } >
        <
        label className = {
            styles.filterLabel
        } > To: < /label> <
        input type = "date"
        name = "to_date"
        value = {
            dateFilters.to_date
        }
        onChange = {
            handleDateChange
        }
        className = {
            styles.filterInput
        }
        /> <
        /div> <
        button onClick = {
            () =>
            setDateFilters({
                month: "",
                from_date: "",
                to_date: ""
            })
        }
        className = {
            styles.clearButton
        } >
        Clear Dates <
        /button> {
            (dateFilters.month || (dateFilters.from_date && dateFilters.to_date)) && ( <
                span className = {
                    styles.activeFilters
                } > { /* Show Month only if date range is NOT fully active */ } {
                    dateFilters.month && !(dateFilters.from_date && dateFilters.to_date) && (
                        `Month: ${months.find((m) => m.value === dateFilters.month)?.label}`
                    )
                }

                { /* Show Date Range when both from and to are present */ } {
                    dateFilters.from_date && dateFilters.to_date && ( <
                        > {
                            dateFilters.month && !(dateFilters.from_date && dateFilters.to_date) && " | "
                        } {
                            `Date: ${dateFilters.from_date} to ${dateFilters.to_date}`
                        } <
                        />
                    )
                } <
                /span>
            )
        } <
        /div>

        <
        div style = {
            {
                padding: "20px",
                fontFamily: "sans-serif"
            }
        } >
        <
        Tooltip title = "Back to Approved Reports" >
        <
        IconButton onClick = {
            handleBack
        }
        sx = {
            {
                position: "fixed",
                top: 15,
                left: 15,
                color: "#fff",
                backgroundColor: "#00308aff",
                boxShadow: 2,
                zIndex: 100,
                "&:hover": {
                    backgroundColor: "#e8eaf6",
                    color: "#00308aff"
                },
            }
        } >
        <
        ArrowBackIcon / >
        <
        /IconButton> <
        /Tooltip>

        {
            !isFiltersSelected && ( <
                div className = {
                    styles.noDataMessage
                } >
                <
                div className = {
                    styles.messageBox
                } >
                <
                h2 > Please Select Project, Windfarm, and Cluster < /h2> <
                p >
                Use the filter bar above to select the required filters to view the report. <
                /p> <
                /div> <
                /div>
            )
        }

        {
            isFiltersSelected && turbines.length === 0 && ( <
                div className = {
                    styles.noDataMessage
                } >
                <
                div className = {
                    styles.messageBox
                } >
                <
                h2 > No Data Available < /h2> <
                p >
                No data found
                for the selected filters.Please
                try different filters. <
                /p> <
                /div> <
                /div>
            )
        }

        {
            isFiltersSelected && turbines.length > 0 && ( <
                > { /* ========== PAGE 1: COVER PAGE ========== */ } <
                div className = {
                    styles.pageContainer
                } >
                <
                div className = {
                    styles.contentWrapper
                } >
                <
                RenderHeader / >
                <
                div className = {
                    styles.imageGridContainer
                } > {
                    gridImages.map((img, index) => ( <
                        div key = {
                            index
                        }
                        className = {
                            styles.gridItem
                        } >
                        <
                        img src = {
                            img.src
                        }
                        alt = {
                            img.alt
                        }
                        /> <
                        /div>
                    ))
                } <
                /div> <
                div className = {
                    styles.reLogoContainer
                } >
                <
                img src = {
                    RELogo
                }
                alt = "RE Logo"
                className = {
                    styles.reLogoImg
                }
                /> <
                /div> <
                div className = {
                    styles.detailsSection
                } >
                <
                table className = {
                    styles.detailsTable
                } >
                <
                tbody >
                <
                tr >
                <
                td className = {
                    styles.labelCell
                } > Project: < /td> <
                td > {
                    projectData ? .project_name || "N/A"
                } < /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCell
                } > Windfarm: < /td> <
                td > {
                    windfarmData ? .windfarm_name || "N/A"
                } < /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCell
                } > Cluster: < /td> <
                td > {
                    clusterData ? .cluster_name || "N/A"
                } < /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCell
                } > Client: < /td> <
                td > {
                    projectData ? .client_name || "N/A"
                } < /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCell
                } > Report: < /td> <
                td > {
                    formatDate(projectData ? .created_at)
                } < /td> <
                /tr> <
                /tbody> <
                /table> <
                /div> <
                table className = {
                    styles.revisionTable
                } >
                <
                thead >
                <
                tr >
                <
                th > Revision < /th> <
                th > Date < /th> <
                th > Page < /th> <
                th > Short Description < /th> <
                /tr> <
                /thead> <
                tbody >
                <
                tr >
                <
                td > A < /td> <
                td > 18 < /td> <
                td > ALL < /td> <
                td className = {
                    styles.descCell
                } > Project2018 < /td> <
                /tr> <
                /tbody> <
                /table> <
                /div> <
                RenderFooter pageNum = {
                    1
                }
                totalPages = {
                    totalPages
                }
                /> <
                /div>

                { /* ========== PROJECT DETAILS PAGE ========== */ } <
                div className = {
                    styles.pageContainer
                } >
                <
                div className = {
                    styles.contentWrapper
                } >
                <
                RenderHeader / >
                <
                div className = {
                    styles.pageSection
                } >
                <
                h2 className = {
                    styles.sectionTitle
                } > Project Details < /h2> <
                p className = {
                    styles.sectionNote
                } >
                Summary of our Understanding of The Project <
                /p>

                <
                h3 className = {
                    styles.subTableTitle
                } >
                Table 1: Project Details & Proposed Scope Summary <
                /h3> <
                table className = {
                    styles.twoColumnTable
                } >
                <
                thead >
                <
                tr >
                <
                th style = {
                    {
                        width: "30%"
                    }
                } > Item < /th> <
                th style = {
                    {
                        width: "70%"
                    }
                } > Description < /th> <
                /tr> <
                /thead> <
                tbody >
                <
                tr >
                <
                td className = {
                    styles.labelCellBold
                } > Project Name < /td> <
                td className = {
                    styles.descCell
                } > {
                    projectData ? .project_name || "N/A"
                } <
                /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCellBold
                } >
                Location Coordinates <
                /td> <
                td className = {
                    styles.descCell
                } > {
                    windfarmData ? .coordinates || "N/A"
                } <
                /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCellBold
                } > Project Status < /td> <
                td className = {
                    styles.descCell
                } > {
                    windfarmData ? .windfarm_status ?
                    windfarmData.windfarm_status
                    .charAt(0)
                    .toUpperCase() +
                    windfarmData.windfarm_status.slice(1) :
                    "N/A"
                } <
                /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCellBold
                } > Proposed WTG < /td> <
                td className = {
                    styles.descCell
                } > {
                    windfarmData ? .no_of_locations ?
                    `${windfarmData.no_of_locations} WTG Units` :
                    "N/A"
                } <
                /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCellBold
                } >
                Total Rated Power <
                /td> <
                td className = {
                    styles.descCell
                } > {
                    windfarmData ? .capacity_mw ?
                    `${windfarmData.capacity_mw} MW` :
                    "N/A"
                } <
                /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCellBold
                } >
                Project Background <
                /td> <
                td className = {
                    styles.descCell
                } > {
                    windfarmData ? .windfarm_name ?
                    `${windfarmData.windfarm_name} - ${windfarmData.village}, ${windfarmData.district}, ${windfarmData.state}` :
                    "N/A"
                } <
                /td> <
                /tr> <
                /tbody> <
                /table>

                <
                h3 className = {
                    styles.subTableTitle
                } >
                Table 2: Project Contact Details <
                /h3> <
                table className = {
                    styles.twoColumnTable
                } >
                <
                thead >
                <
                tr >
                <
                th style = {
                    {
                        width: "30%"
                    }
                } > Item < /th> <
                th style = {
                    {
                        width: "70%"
                    }
                } > Description < /th> <
                /tr> <
                /thead> <
                tbody >
                <
                tr >
                <
                td className = {
                    styles.labelCellBold
                } > UGES Client < /td> <
                td className = {
                    styles.descCell
                } > {
                    projectData ? .client_name || "N/A"
                } <
                /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCellBold
                } > Address < /td> <
                td className = {
                    styles.descCell
                } > {
                    projectData ? .address || "N/A"
                } <
                /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCellBold
                } > Contact Person < /td> <
                td className = {
                    styles.descCell
                } > {
                    projectData ? .contact_person || "N/A"
                } <
                /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCellBold
                } > Contact Phone < /td> <
                td className = {
                    styles.descCell
                } > {
                    projectData ? .contact_phone || "N/A"
                } <
                /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCellBold
                } > Email < /td> <
                td className = {
                    styles.descCell
                } > {
                    projectData ? .email || "N/A"
                } <
                /td> <
                /tr> <
                tr >
                <
                td className = {
                    styles.labelCellBold
                } >
                Wind Farm Location <
                /td> <
                td className = {
                    styles.descCell
                } > {
                    windfarmData ?
                    `${windfarmData.village}, ${windfarmData.taluka}, ${windfarmData.district}, ${windfarmData.state}, ${windfarmData.country}` :
                        "N/A"
                } <
                /td> <
                /tr> <
                /tbody> <
                /table> <
                /div> <
                /div> <
                RenderFooter pageNum = {
                    currentPage
                }
                totalPages = {
                    totalPages
                }
                /> <
                /div> {
                    (currentPage += 1)
                }

                { /* ========== WTG SUMMARY ========== */ } <
                div className = {
                    styles.pageContainer
                } >
                <
                div className = {
                    styles.contentWrapper
                } >
                <
                RenderHeader / >
                <
                div className = {
                    styles.pageSection
                } >
                <
                h2 className = {
                    styles.sectionTitle
                } >
                A.WTG Location Specific Activities Summary <
                /h2> <
                table className = {
                    styles.activityTable
                } >
                <
                thead >
                <
                tr >
                <
                th style = {
                    {
                        width: "20%",
                        textAlign: "center"
                    }
                } >
                Activity / Milestone <
                /th> <
                th style = {
                    {
                        width: "15%"
                    }
                } > Total Location(Nos) < /th> <
                th style = {
                    {
                        width: "15%"
                    }
                } > Completed < /th> <
                th style = {
                    {
                        width: "15%"
                    }
                } > Percentage < /th> <
                /tr> <
                /thead> <
                tbody >

                { /* Existing activity sections */ } {
                    visibleSections.map((section, index) => {
                        // Skip road section in summary if already added above
                        if (section.key === "road") return null;

                        const total = section.data.length;
                        let completed = 0;

                        if (section.key === "electrical") {
                            completed = section.data.filter(
                                (item) =>
                                item.l1_approved_at &&
                                item.l2_approved_at &&
                                item.l3_approved_at,
                            ).length;
                        } else {
                            completed = section.data.filter(
                                (item) =>
                                item.status ? .toLowerCase() === "completed" ||
                                item.soil_status ? .toLowerCase() === "completed" ||
                                item.pouring_status ? .toLowerCase() ===
                                "completed" ||
                                item.desh_status ? .toLowerCase() === "completed" ||
                                item.cr_status ? .toLowerCase() === "completed" ||
                                item.backfill_status ? .toLowerCase() ===
                                "completed" ||
                                item.activity_status ? .toLowerCase() ===
                                "completed" ||
                                item.t1_status ? .toLowerCase() === "completed" ||
                                item.tower_status ? .toLowerCase() ===
                                "completed" ||
                                item.nacelle_status ? .toLowerCase() ===
                                "completed" ||
                                item.rotor_status ? .toLowerCase() ===
                                "completed" ||
                                item.blade_status ? .toLowerCase() === "completed",
                            ).length;
                        }

                        const percentage =
                            total > 0 ? Math.round((completed / total) * 100) : 0;

                        return ( <
                            tr key = {
                                index
                            } >
                            <
                            td style = {
                                {
                                    fontWeight: 600,
                                    textAlign: "left"
                                }
                            } > {
                                section.title
                            } <
                            /td> <
                            td style = {
                                {
                                    textAlign: "center"
                                }
                            } > {
                                total
                            } < /td> <
                            td style = {
                                {
                                    color: "#145824ff",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }
                            } >
                            {
                                completed
                            } <
                            /td> <
                            td style = {
                                {
                                    fontWeight: "bold",
                                    color: "#00308a",
                                    textAlign: "center",
                                }
                            } >
                            {
                                percentage
                            } %
                            <
                            /td> <
                            /tr>
                        );
                    })
                } <
                /tbody> <
                /table> <
                /div> <
                /div> <
                RenderFooter pageNum = {
                    currentPage
                }
                totalPages = {
                    totalPages
                }
                /> <
                /div> {
                    (currentPage += 1)
                }

                { /* ========== ALL ACTIVITY SECTIONS ========== */ } {
                    visibleSections.map((section) => {
                        const chunks = chunkData(section.data, ROWS_PER_PAGE);
                        const sectionStartPage = currentPage;
                        const sectionPages = chunks.length > 0 ? chunks.length : 1;

                        const renderedChunks =
                            chunks.length > 0 ? (
                                chunks.map((chunk, idx) => {
                                    const pageNum = sectionStartPage + idx;
                                    return renderActivityTable(
                                        section,
                                        chunk,
                                        idx,
                                        sectionStartPage,
                                    );
                                })
                            ) : ( <
                                div key = {
                                    `${section.key}-empty`
                                }
                                className = {
                                    styles.pageContainer
                                } >
                                <
                                div className = {
                                    styles.contentWrapper
                                } >
                                <
                                RenderHeader / >
                                <
                                div className = {
                                    styles.pageSection
                                } >
                                <
                                h2 className = {
                                    styles.sectionTitle
                                } > {
                                    section.title
                                } < /h2> <
                                p className = {
                                    styles.sectionNote
                                } > No records found < /p> <
                                div style = {
                                    {
                                        textAlign: "center",
                                        padding: "40px",
                                        color: "#666",
                                    }
                                } >
                                No {
                                    section.title
                                }
                                records found
                                for the selected filters. <
                                /div> <
                                /div> <
                                /div> <
                                RenderFooter pageNum = {
                                    sectionStartPage
                                }
                                totalPages = {
                                    totalPages
                                }
                                /> <
                                /div>
                            );

                        currentPage += sectionPages;
                        return renderedChunks;
                    })
                } <
                div style = {
                    {
                        marginBottom: 20,
                        display: "flex",
                        justifyContent: "flex-end",
                    }
                } >
                <
                ReportPdf projectData = {
                    projectData
                }
                windfarmData = {
                    windfarmData
                }
                clusterData = {
                    clusterData
                }
                activitySections = {
                    processedSections.length > 0 ? processedSections : visibleSections
                } // ← was activitySections

                gridImages = {
                    gridImages
                }
                totalPages = {
                    totalPages
                }
                fileName = {
                    `Report_${projectData?.project_name || "Project"}.pdf`
                }
                /> <
                /div> <
                />
            )
        } <
        /div> <
        /div>
    );
}