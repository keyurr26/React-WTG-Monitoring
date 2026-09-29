import React, {
    useState,
    useMemo,
    useEffect,
    useCallback,
    useRef,
} from "react";
import {
    Box,
    Grid,
    TextField,
    Typography,
    MenuItem,
    Button,
    Paper,
    Card,
    CardContent,
    Divider,
    Chip,
    Alert,
    FormControl,
    InputLabel,
    Select,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    LinearProgress,
    CircularProgress,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import {
    AddCircleOutline as AddIcon,
    DeleteOutline as DeleteIcon,
    ExpandMore as ExpandMoreIcon,
    PlaylistAdd as PlaylistAddIcon,
} from "@mui/icons-material";
import {
    useSelector,
    useDispatch
} from "react-redux";
import {
    GetElectricalMasterData,
    PatchElectricalMasterData,
    fetchContractors,
} from "../../../Redux/MasterData/masterAction";

import polelineImg from "../../../assets/poleline.png";
import SCOHPoleDataTable from "./SCOHPoleDataTable";
import {
    GetPoleLinesData
} from "../../../Redux/InstallationData/ElectricalLinesData/ElectricalActions";

// ==================== CONSTANTS ====================
const CONSTANTS = {
    POLE_TYPES: ["Line Pole", "Cut Pole"],
    CROSSING_TYPES: ["Road", "Rail", "River", "Canal", "Building", "Line"],
    MATERIAL_TYPES: ["11 meter Pole", "13 meter Pole"],
    DEFAULT_SPAN: 75,
    SPAN_MIN: 40,
    SPAN_MAX: 120,
    BATCH_SIZE: 50,
};

// ==================== HELPER FUNCTIONS ====================
const calculateTotalMeters = (km) => km * 1000;
const calculateTotalSpan = (rows) =>
    rows.reduce((sum, r) => sum + Number(r.span || 0), 0);
const calculateRequiredPoles = (totalMeters, span) =>
    span && totalMeters > 0 ? Math.ceil(totalMeters / span) : 0;
const validateSpan = (span) => span < 40 || span > 120;
const calculateProgress = (used, total) =>
    total > 0 ? Math.round((used / total) * 100) : 0;

// ==================== MAIN COMPONENT ====================
const SCOHL1_Dog = ({
    filters
}) => {
    const dispatch = useDispatch();

    const [fileKey, setFileKey] = useState(0);

    const {
        getElectricalMaster = [],
            ContractorData = [],
            loading: dataLoading,
    } = useSelector((state) => state.masterData);

    const {
        getpoLineData = [], loading
    } = useSelector(
        (state) => state.electricalData,
    );

    // ==================== STATE ====================
    const [selectedLineId, setSelectedLineId] = useState(null);

    const [span, setSpan] = useState(CONSTANTS.DEFAULT_SPAN);
    const [rows, setRows] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);

    // ✅ CHANGE 1: Bulk Land aur Selected Poles State
    const [bulkLand, setBulkLand] = useState({
        village: "",
        surveyNo: "",
        landType: "",
        contractorId: "", // NEW
        agreementAttachment: null,
    });
    const [selectedPoles, setSelectedPoles] = useState([]);

    const previousSavedCount = useRef(-1);

    const bulkLandCacheRef = useRef({});

    const rowsRef = useRef([]);

    useEffect(() => {
        rowsRef.current = rows;
    }, [rows]);


    const clearBulkCache = (selectedLineId, poleNo) => {
        const key = `${selectedLineId}_${poleNo}`;
        delete bulkLandCacheRef.current[key];
    };

    // Fetch data on mount
    useEffect(() => {
        dispatch(GetElectricalMasterData());
        dispatch(fetchContractors());
    }, [dispatch]);

    // ==================== FILTER DATA BASED ON CLUSTER ====================
    // ✅ FIXED: Filter for SCOH lines (not SCOH-Dog)
    const clusterData = useMemo(() => {
        if (!filters ? .cluster || !getElectricalMaster.length) return null;

        return getElectricalMaster.filter(
            (item) =>
            item.cluster === parseInt(filters.cluster) &&
            item.line_type === "SCOH (Single Circuit Overhead Line)", // ✅ SCOH lines only
        );
    }, [filters, getElectricalMaster]);

    const electricalContractors = useMemo(() => {
        return ContractorData.filter((c) => c.contractor_type === "electrical");
    }, [ContractorData]);

    // ==================== PROCESS LINES DATA ====================
    const lines = useMemo(() => {
        if (!clusterData) return [];

        return clusterData.map((item) => ({
            id: item.id,
            name: item.line_name || `Line ${item.id}`,
            line_name: item.line_name,
            km: item.km || 0,
            type: item.line_type || "SCOH Line",
            turbineIds: item.turbine_ids || [],
            turbineLocations: item.turbine_locations || [],
            circuits: item.no_of_line || 0,
            project: item.project_name,
            windfarm: item.windfarm_name,
            cluster: item.cluster_name,
            totalCircuit: item.total_circuit,

            // ✅ NEW
            submitted_at: item.submitted_at,
            approved_at: item.approved_at,
            scoh_dog: item.scoh_dog || null, // Keep this for reference
            approved_final_at: item.approved_final_at || "",
            approved_l1_at: item.approved_l1_at || "",
            approved_l2_at: item.approved_l2_at || "",
            approved_l3_at: item.approved_l3_at || "",

            submitted_final_at: item.submitted_final_at || "",
            submitted_l1_at: item.submitted_l1_at || "",
            submitted_l2_at: item.submitted_l2_at || "",
            submitted_l3_at: item.submitted_l3_at || "",

            // isL1Submitted: !!item.submitted_l1_at,
        }));
    }, [clusterData]);

    // useEffect(() => {
    //   if (lines.length > 0 && selectedLineId == null) {
    //     setSelectedLineId(lines[0].id);
    //   }
    // }, [lines, selectedLineId]);

    useEffect(() => {
        setRows([]);
        setSelectedPoles([]);
        setSelectedLineId(null);
    }, [filters ? .cluster]);

    // Fetch pole data when line changes
    useEffect(() => {
        if (!filters ? .cluster || !selectedLineId) return;

        dispatch(
            GetPoleLinesData({
                cluster: filters.cluster,
                line_id: selectedLineId,
            }),
        );
    }, [dispatch, filters ? .cluster, selectedLineId]);

    // Reset rows when selected line changes
    useEffect(() => {
        if (selectedLineId) {
            rowsRef.current = [];
            setRows([]);
            setSelectedPoles([]); // ✅ Reset selected poles when line changes
        }
    }, [selectedLineId]);

    // Get current selected line
    const selectedLine = useMemo(() => {
        if (!selectedLineId) return null;
        return lines.find((line) => line.id === selectedLineId) || null;
    }, [lines, selectedLineId]);

    const isLineLocked = !!selectedLine ? .submitted_at;

    const refreshPoleLineData = useCallback(async () => {
        if (filters ? .cluster && selectedLineId) {
            dispatch(
                GetPoleLinesData({
                    cluster: filters.cluster,
                    line_id: selectedLineId,
                }),
            );
        }
    }, [dispatch, filters, selectedLineId]);

    const turbinesForSelectedLine = useMemo(() => {
        if (!selectedLine) return [];

        const locations = selectedLine.turbineLocations || [];
        const ids = selectedLine.turbineIds || [];

        return locations.map((loc, index) => ({
            id: ids[index],
            name: loc,
        }));
    }, [selectedLine]);

    // ==================== CALCULATIONS ====================
    const totalMeters = calculateTotalMeters(selectedLine ? .km || 0);
    const totalSpanUsed = calculateTotalSpan(rows);
    const requiredPoles = calculateRequiredPoles(totalMeters, span);
    const isSpanInvalid = validateSpan(span);
    const isLengthExceeded = totalSpanUsed > totalMeters && totalMeters > 0;
    const progress = calculateProgress(totalSpanUsed, totalMeters);

    // Check if span is valid for create button
    const isSpanValidForCreate = !isSpanInvalid && span > 0 && totalMeters > 0 && requiredPoles <= 500;

    // ==================== HANDLERS ====================
    const updateRow = useCallback((index, field, value) => {
        setRows((prevRows) => {
            const updated = [...prevRows];
            updated[index][field] = value;
            return updated;
        });
    }, []);

    // const addRow = useCallback(async () => {
    //   const newRows = [
    //     ...rows,
    //     {
    //       id: null,
    //       poleNo: `P${rows.length + 1}`,
    //       easting: "",
    //       northing: "",
    //       type: "",
    //       material: "",
    //       span: span,
    //       crossing: "",
    //       date: "",
    //       details: "",
    //       photo: "",
    //       turbineId: "",
    //       landType: "",
    //       surveyNo: "",
    //       village: "",
    //       contractorId: "",
    //       contractorName: "",
    //       agreementAttachment: null,
    //     },
    //   ];

    //   setRows(newRows);

    //   await dispatch(
    //     PatchElectricalMasterData(selectedLine.id, {
    //       total_poles: newRows.length,
    //     }),
    //   );
    // }, [rows, span, dispatch, selectedLine]);


    const addRow = useCallback(async () => {
        if (!selectedLine ? .id) return;

        setRows((prevRows) => {
            const maxPoleNo = Math.max(
                0,
                ...prevRows.map(
                    (row) => parseInt(String(row.poleNo || "").replace("P", ""), 10) || 0,
                ),
            );

            const nextPoleNumber = maxPoleNo + 1;
            const poleNo = `P${nextPoleNumber}`;

            const newRow = {
                id: `local_${selectedLine.id}_${poleNo}_${Date.now()}`,

                poleNo,

                easting: "",
                northing: "",
                type: "",
                material: "",

                span: prevRows.length === 0 ? 0 : span,

                crossing: "",
                date: "",
                details: "",
                photo: null,
                turbineId: "",

                landType: "",
                surveyNo: "",
                village: "",

                contractorId: "",
                contractorName: "",

                agreementAttachment: null,

                saved_l1_at: null,
                submitted_l1_at: null,
                approved_l1_at: null,
            };

            const newRows = [...prevRows, newRow];

            // Ref ko immediately sync rakho
            rowsRef.current = newRows;

            return newRows;
        });

        // Backend me planned pole count update karo
        const newCount = rowsRef.current.length;

        await dispatch(
            PatchElectricalMasterData(selectedLine.id, {
                total_poles: newCount,
            }),
        );
    }, [span, dispatch, selectedLine]);

    const removeRow = useCallback(
        async (index) => {
            if (rows.length === 1) return;

            const newRows = rows.filter((_, i) => i !== index);

            setRows(newRows);

            await dispatch(
                PatchElectricalMasterData(selectedLine.id, {
                    total_poles: newRows.length,
                }),
            );
        }, [rows, dispatch, selectedLine],
    );

    // Generate poles in batches
    const generatePolesInBatches = useCallback(
        async (totalPoles) => {
            setIsGenerating(true);
            setGenerationProgress(0);

            const newRows = [];
            const batchSize = CONSTANTS.BATCH_SIZE;
            const batches = Math.ceil(totalPoles / batchSize);

            for (let batch = 0; batch < batches; batch++) {
                await new Promise((resolve) => setTimeout(resolve, 0));

                const start = batch * batchSize;
                const end = Math.min(start + batchSize, totalPoles);

                for (let i = start; i < end; i++) {
                    newRows.push({
                        id: `${Date.now()}_${i}`,
                        poleNo: `P${i + 1}`,
                        easting: "",
                        northing: "",
                        type: "",
                        material: "",
                        span: i === 0 ? 0 : span,
                        crossing: "",
                        date: "",
                        details: "",
                        photo: "",
                        turbineId: "",
                        landType: "",
                        surveyNo: "",
                        village: "",
                        agreementAttachment: null,
                    });
                }

                setGenerationProgress(((batch + 1) / batches) * 100);
                setRows([...newRows]);
            }

            setIsGenerating(false);
            setGenerationProgress(100);
        }, [span],
    );

    // useEffect(() => {
    //   if (!selectedLineId || !selectedLine?.km || !span) return;

    //   // Calculate required poles
    //   const totalMeters = calculateTotalMeters(selectedLine.km);
    //   const requiredPolesCount = calculateRequiredPoles(totalMeters, span);

    //   if (requiredPolesCount === 0) return;

    //   // Filter data for selected line
    //   const existingPoleData = getpoLineData.filter(
    //     (item) => item.electrical_line === selectedLineId,
    //   );

    //   const maxPoleNo = Math.max(
    //     0,
    //     ...existingPoleData.map(
    //       (p) => parseInt((p.pole_number || "").replace("P", ""), 10) || 0,
    //     ),
    //   );

    //   // Create complete rows array with required number of poles
    //   const completeRows = [];

    //   // required poles vs highest pole number
    //   const totalRows = Math.max(requiredPolesCount, maxPoleNo);

    //   for (let i = 0; i < totalRows; i++) {
    //     const poleNumber = `P${i + 1}`;

    //     const bulkCache = bulkLandCacheRef.current[poleNumber];

    //     const existingPole = existingPoleData.find(
    //       (p) => p.pole_number === poleNumber,
    //     );

    //     if (existingPole) {
    //       // Use existing data if available
    //       completeRows.push({
    //         id: existingPole.id,
    //         poleNo: existingPole.pole_number,
    //         easting: existingPole.easting || "",
    //         northing: existingPole.northing || "",
    //         type: existingPole.pole_type || "",
    //         material: existingPole.pole_height || "",
    //         span: existingPole.span || (i === 0 ? 0 : span),
    //         crossing: existingPole.crossing_type || "",
    //         date: existingPole.start_date || "",
    //         details: existingPole.line_crossing_details || "",
    //         photo: existingPole.photo || null,
    //         turbineId: existingPole.turbine_interconnected || "",
    //         // ✅ NEW FIELDS
    //         landType: existingPole.land_type || bulkCache?.landType || "",

    //         surveyNo: existingPole.survey_no || bulkCache?.surveyNo || "",

    //         village: existingPole.village || bulkCache?.village || "",

    //         contractorId:
    //           existingPole.contractor || bulkCache?.contractorId || "",
    //         contractorName: existingPole.contractor_name || "",
    //         saved_l1_at: existingPole.saved_l1_at || null,
    //         submitted_l1_at: existingPole.submitted_l1_at || null,

    //         approved_l1_at: existingPole.approved_l1_at || null,

    //         agreementAttachment:
    //           existingPole.file || bulkCache?.agreementAttachment || null,
    //       });
    //     } else {
    //       completeRows.push(
    //         //  localRow ||

    //         {
    //           id: `${Date.now()}_${i}`,
    //           poleNo: poleNumber,
    //           easting: "",
    //           northing: "",
    //           type: "",
    //           material: "",
    //           span: i === 0 ? 0 : span,
    //           crossing: "",
    //           date: "",
    //           details: "",
    //           photo: null,
    //           turbineId: "",
    //           // ✅ NEW FIELDS
    //           landType: bulkCache?.landType || "",

    //           surveyNo: bulkCache?.surveyNo || "",
    //           village: bulkCache?.village || "",
    //           contractorId: bulkCache?.contractorId || "",
    //           contractorName: "",

    //           agreementAttachment: bulkCache?.agreementAttachment || null,
    //         },
    //       );
    //     }
    //   }

    //   setRows(completeRows);

    //   if (previousSavedCount.current !== completeRows.length) {
    //     previousSavedCount.current = completeRows.length;

    //     dispatch(
    //       PatchElectricalMasterData(selectedLineId, {
    //         total_poles: completeRows.length,
    //       }),
    //     );
    //   }
    // }, [getpoLineData, selectedLineId, selectedLine?.km, span]);



    useEffect(() => {
        if (!selectedLineId || !selectedLine ? .km || !span) return;

        const totalMeters = calculateTotalMeters(selectedLine.km);
        const requiredPolesCount = calculateRequiredPoles(totalMeters, span);

        if (requiredPolesCount === 0) return;

        const existingPoleData = getpoLineData.filter(
            (item) => item.electrical_line === selectedLineId,
        );

        // Current UI rows:
        // saved + unsaved dono ho sakte hain.
        const currentRows = rowsRef.current || [];

        // API data ko pole number se map karo
        const apiPoleMap = new Map(
            existingPoleData.map((pole) => [pole.pole_number, pole]),
        );

        // Local rows ko pole number se map karo
        const localRowMap = new Map(currentRows.map((row) => [row.poleNo, row]));

        const maxApiPoleNo = Math.max(
            0,
            ...existingPoleData.map(
                (p) => parseInt(String(p.pole_number || "").replace("P", ""), 10) || 0,
            ),
        );

        const maxLocalPoleNo = Math.max(
            0,
            ...currentRows.map(
                (r) => parseInt(String(r.poleNo || "").replace("P", ""), 10) || 0,
            ),
        );

        // Required poles + API poles + local poles
        // tino preserve karo.
        const totalRows = Math.max(
            requiredPolesCount,
            maxApiPoleNo,
            maxLocalPoleNo,
        );

        const completeRows = [];

        for (let i = 0; i < totalRows; i++) {
            const poleNumber = `P${i + 1}`;

            const existingPole = apiPoleMap.get(poleNumber);
            const localRow = localRowMap.get(poleNumber);

            const bulkCache = bulkLandCacheRef.current[poleNumber];

            if (existingPole) {
                // ==========================================
                // SAVED POLE
                // API is source of truth
                // ==========================================
                completeRows.push({
                    id: existingPole.id,

                    poleNo: existingPole.pole_number,

                    easting: existingPole.easting || "",
                    northing: existingPole.northing || "",

                    type: existingPole.pole_type || "",

                    material: existingPole.pole_height || "",

                    span: existingPole.span || localRow ? .span || (i === 0 ? 0 : span),

                    crossing: existingPole.crossing_type || "",

                    date: existingPole.start_date || "",

                    details: existingPole.line_crossing_details || "",

                    photo: existingPole.photo || null,

                    turbineId: existingPole.turbine_interconnected || "",

                    landType: existingPole.land_type ||
                        localRow ? .landType ||
                        bulkCache ? .landType ||
                        "",

                    surveyNo: existingPole.survey_no ||
                        localRow ? .surveyNo ||
                        bulkCache ? .surveyNo ||
                        "",

                    village: existingPole.village ||
                        localRow ? .village ||
                        bulkCache ? .village ||
                        "",

                    contractorId: existingPole.contractor ||
                        localRow ? .contractorId ||
                        bulkCache ? .contractorId ||
                        "",

                    contractorName: existingPole.contractor_name || "",

                    // ======================================
                    // L1 STATUS FIELDS
                    // ======================================
                    saved_l1_at: existingPole.saved_l1_at || null,

                    submitted_l1_at: existingPole.submitted_l1_at || null,

                    approved_l1_at: existingPole.approved_l1_at || null,

                    agreementAttachment: existingPole.file ||
                        localRow ? .agreementAttachment ||
                        bulkCache ? .agreementAttachment ||
                        null,
                });
            } else if (localRow) {
                // ==========================================
                // UNSAVED LOCAL POLE
                // ==========================================
                completeRows.push({
                    ...localRow,

                    span: i === 0 ? 0 : localRow.span || span,
                });
            } else {
                // ==========================================
                // NEW GENERATED POLE
                // ==========================================
                completeRows.push({
                    id: `${selectedLineId}_${poleNumber}`,

                    poleNo: poleNumber,

                    easting: "",
                    northing: "",

                    type: "",
                    material: "",

                    span: i === 0 ? 0 : span,

                    crossing: "",
                    date: "",
                    details: "",
                    photo: null,
                    turbineId: "",

                    landType: bulkCache ? .landType || "",

                    surveyNo: bulkCache ? .surveyNo || "",

                    village: bulkCache ? .village || "",

                    contractorId: bulkCache ? .contractorId || "",

                    contractorName: "",

                    agreementAttachment: bulkCache ? .agreementAttachment || null,

                    saved_l1_at: null,
                    submitted_l1_at: null,
                    approved_l1_at: null,
                });
            }
        }

        // ==========================================
        // SAFETY: duplicate pole numbers remove karo
        // ==========================================
        const uniqueRows = Array.from(
            new Map(completeRows.map((row) => [row.poleNo, row])).values(),
        );

        setRows((prevRows) => {
            // ==========================================
            // IMPORTANT FIX
            //
            // Sirf id + poleNo compare nahi karna.
            // Status fields bhi compare karne hain.
            // ==========================================
            const rowsAreSame =
                prevRows.length === uniqueRows.length &&
                prevRows.every((row, index) => {
                    const nextRow = uniqueRows[index];

                    return (
                        row.id === nextRow.id &&
                        row.poleNo === nextRow.poleNo &&
                        // L1 status changes detect karo
                        row.saved_l1_at === nextRow.saved_l1_at &&
                        row.submitted_l1_at === nextRow.submitted_l1_at &&
                        row.approved_l1_at === nextRow.approved_l1_at
                    );
                });

            if (rowsAreSame) {
                return prevRows;
            }

            // Ref ko bhi immediately sync rakho
            rowsRef.current = uniqueRows;

            return uniqueRows;
        });

        // ==========================================
        // TOTAL POLES UPDATE
        // ==========================================
        if (previousSavedCount.current !== uniqueRows.length) {
            previousSavedCount.current = uniqueRows.length;

            dispatch(
                PatchElectricalMasterData(selectedLineId, {
                    total_poles: uniqueRows.length,
                }),
            );
        }
    }, [getpoLineData, selectedLineId, selectedLine ? .km, span, dispatch]);





    const handleCreatePoles = useCallback(async () => {
        if (!isSpanValidForCreate) return;

        if (requiredPoles > 200) {
            if (
                window.confirm(
                    `This will create ${requiredPoles} poles which may take a few seconds. Continue?`,
                )
            ) {
                generatePolesInBatches(requiredPoles);
            }
        } else {
            const newRows = [];
            for (let i = 0; i < requiredPoles; i++) {
                newRows.push({
                    id: `${Date.now()}_${i}`,
                    poleNo: `P${i + 1}`,
                    easting: "",
                    northing: "",
                    type: "",
                    material: "",
                    span: i === 0 ? 0 : span,
                    crossing: "",
                    date: "",
                    photo: "",
                    details: "",
                    // turbineId: "",
                    landType: "",
                    surveyNo: "",
                    village: "",
                    contractorId: "",
                    contractorName: "",
                    agreementAttachment: null,
                });
            }
            setRows(newRows);
        }
    }, [isSpanValidForCreate, requiredPoles, span, generatePolesInBatches]);

    const handleResetPoles = useCallback(() => {
        if (
            rows.length > 0 &&
            window.confirm("Are you sure you want to reset all poles?")
        ) {
            setRows([]);
            setSelectedPoles([]);
        }
    }, [rows.length]);

    // ✅ Handler for Apply to Selected Poles
    const handleApplyToSelectedPoles = () => {
        if (selectedPoles.length === 0) {
            alert("Please select at least one pole");
            return;
        }

        selectedPoles.forEach((poleNo) => {
            bulkLandCacheRef.current[poleNo] = {
                village: bulkLand.village,
                surveyNo: bulkLand.surveyNo,
                landType: bulkLand.landType,
                contractorId: bulkLand.contractorId,
                agreementAttachment: bulkLand.agreementAttachment,
            };
        });

        setRows((prev) =>
            prev.map((row) =>
                selectedPoles.includes(row.poleNo) ?
                {
                    ...row,
                    village: bulkLand.village,
                    surveyNo: bulkLand.surveyNo,
                    landType: bulkLand.landType,
                    contractorId: bulkLand.contractorId, // NEW
                    agreementAttachment: bulkLand.agreementAttachment,
                } :
                row,
            ),
        );

        // Clear bulk form
        setBulkLand({
            village: "",
            surveyNo: "",
            landType: "",
            contractorId: "", // NEW
            agreementAttachment: null,
        });

        // IMPORTANT:
        // File input DOM ko forcefully remount karke clear karo
        setFileKey((prev) => prev + 1);

        // Optional: uncheck all selected poles
        setSelectedPoles([]);

        // Optional: Show success message
        alert(`Applied bulk details to ${selectedPoles.length} pole(s)`);
    };

    const handleApplyToAllPoles = () => {
        rows.forEach((row) => {
            bulkLandCacheRef.current[row.poleNo] = {
                village: bulkLand.village,
                surveyNo: bulkLand.surveyNo,
                landType: bulkLand.landType,
                contractorId: bulkLand.contractorId,
                agreementAttachment: bulkLand.agreementAttachment,
            };
        });
        setRows((prev) =>
            prev.map((row) => ({
                ...row,
                village: bulkLand.village,
                surveyNo: bulkLand.surveyNo,
                landType: bulkLand.landType,
                contractorId: bulkLand.contractorId, // NEW
                agreementAttachment: bulkLand.agreementAttachment,
            })),
        );

        setBulkLand({
            village: "",
            surveyNo: "",
            landType: "",
            contractorId: "",
            agreementAttachment: null,
        });

        // File input clear
        setFileKey((prev) => prev + 1);

        setSelectedPoles([]);
    };

    // ==================== RENDER HELPERS ====================
    const renderEmptyState = () => ( <
        Card sx = {
            {
                textAlign: "center",
                py: 8
            }
        } >
        <
        CardContent >
        <
        Typography variant = "h6"
        color = "textSecondary"
        gutterBottom >
        No Cluster Selected <
        /Typography> <
        Typography variant = "body2"
        color = "textSecondary" >
        Please select a cluster from the filter to view and configure SCOH - Panther line details. <
        /Typography> <
        /CardContent> <
        /Card>
    );

    // const renderTurbineChips = (turbines, color = "primary") => (
    //   <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
    //     {turbines?.length > 0 ? (
    //       turbines.map((t, i) => (
    //         <Chip
    //           key={i}
    //           label={t}
    //           size="small"
    //           color={color}
    //           variant="outlined"
    //         />
    //       ))
    //     ) : (
    //       <Typography variant="caption" color="textSecondary">
    //         No turbines assigned
    //       </Typography>
    //     )}
    //   </Box>
    // );

    // Show loading state
    // if (dataLoading) {
    //   return (
    //     <Box p={4} sx={{ bgcolor: "#f4f6f8", minHeight: "100vh" }}>
    //       <Card sx={{ textAlign: "center", py: 8 }}>
    //         <CardContent>
    //           <CircularProgress size={40} />
    //           <Typography sx={{ mt: 2 }}>Loading SCOH lines data...</Typography>
    //         </CardContent>
    //       </Card>
    //     </Box>
    //   );
    // }


    // Show loading state
    if (dataLoading) {
        return ( <
            Box p = {
                4
            }
            sx = {
                {
                    bgcolor: "#f4f6f8",
                    minHeight: "100vh"
                }
            } >
            <
            Card sx = {
                {
                    textAlign: "center",
                    py: 8
                }
            } >
            <
            CardContent >
            <
            Typography > Loading data... < /Typography> <
            /CardContent> <
            /Card> <
            /Box>
        );
    }




    // Show empty state if no cluster selected or no data
    // if (!filters?.cluster) {
    //   return (
    //     <Card sx={{ textAlign: "center", py: 8, m: 4 }}>
    //       <CardContent>
    //         <Typography variant="h6" color="textSecondary" gutterBottom>
    //           No Cluster Selected
    //         </Typography>
    //         <Typography variant="body2" color="textSecondary">
    //           Please select a cluster from the filter to view and configure SCOH-Panther
    //         line details.
    //         </Typography>
    //       </CardContent>
    //     </Card>
    //   );
    // }

    // if (!clusterData || clusterData.length === 0) {
    //   return renderEmptyState();
    // }


    // Show empty state if no cluster selected or no data
    if (!filters ? .cluster || !clusterData || clusterData.length === 0) {
        return renderEmptyState();
    }




    // ==================== MAIN RENDER ====================
    return ( <
        Box p = {
            4
        }
        sx = {
            {
                bgcolor: "#f4f6f8",
                minHeight: "100vh"
            }
        } > { /* 1. CLUSTER OVERVIEW */ } <
        Card sx = {
            {
                mb: 3,
                bgcolor: "#e3f2fd"
            }
        } >
        <
        CardContent >
        <
        Typography variant = "h5"
        gutterBottom color = "primary" > {
            clusterData[0] ? .cluster_name || `Cluster ${filters.cluster}`
        } -
        Cluster Overview <
        /Typography> <
        Grid container spacing = {
            2
        } >
        <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        Typography variant = "subtitle2"
        color = "textSecondary" >
        Project <
        /Typography> <
        Typography variant = "body1"
        fontWeight = "bold" > {
            clusterData[0] ? .project_name || "N/A"
        } <
        /Typography> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        Typography variant = "subtitle2"
        color = "textSecondary" >
        Windfarm <
        /Typography> <
        Typography variant = "body1"
        fontWeight = "bold" > {
            clusterData[0] ? .windfarm_name || "N/A"
        } <
        /Typography> <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        Typography variant = "subtitle2"
        color = "textSecondary" >
        Total Lines <
        /Typography> <
        Typography variant = "body1"
        fontWeight = "bold" > {
            lines.length
        }
        Lines <
        /Typography> <
        /Grid> <
        /Grid> <
        /CardContent> <
        /Card>

        { /* 2. LINE SELECTOR */ } <
        Card sx = {
            {
                mb: 3
            }
        } >
        <
        CardContent >
        <
        Typography variant = "h6"
        gutterBottom >
        Select Line
        for Pole Configuration <
        /Typography> <
        Grid container spacing = {
            2
        } >
        <
        Grid item xs = {
            12
        }
        md = {
            8
        } >
        <
        FormControl fullWidth size = "small" >
        <
        InputLabel > Select Line < /InputLabel> <
        Select value = {
            selectedLineId || ""
        }
        onChange = {
            (e) => setSelectedLineId(Number(e.target.value))
        }
        label = "Select Line" >
        {
            lines.map((line) => ( <
                MenuItem key = {
                    line.id
                }
                value = {
                    line.id
                } > {
                    line.name ? .toUpperCase()
                } - {
                    line.km
                }
                km - {
                    " "
                } {
                    line.turbineLocations ? .length || 0
                }
                Turbines <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            4
        }
        sx = {
            {
                mt: -3
            }
        } >
        <
        Box sx = {
            {
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                bgcolor: "#e3f2fd",
                p: 1.5,
                borderRadius: 2,
            }
        } >
        { /* Text */ } <
        Typography variant = "body2"
        fontWeight = {
            500
        } > {
            selectedLine ? .id ?
            `Line: ${selectedLine.name || "-"} | Turbines: ${selectedLine.turbineLocations?.length || 0} | Locations:` :
            "Select a line"
        } <
        /Typography>

        { /* Chips */ } {
            selectedLine ? .turbineLocations ? .map((t, i) => ( <
                Chip key = {
                    i
                }
                label = {
                    t
                }
                size = "small"
                sx = {
                    {
                        borderRadius: "50px",
                        height: 24,
                    }
                }
                />
            ))
        } <
        /Box> <
        /Grid> <
        /Grid> <
        /CardContent> <
        /Card>

        { /* 3. SELECTED LINE DETAILS */ } {
            selectedLine && ( <
                Card sx = {
                    {
                        mb: 3,
                        textAlign: "center"
                    }
                } >
                <
                CardContent >
                <
                img src = {
                    polelineImg
                }
                alt = "Banner"
                style = {
                    {
                        width: "100%",
                        maxHeight: 120,
                        objectFit: "contain"
                    }
                }
                /> <
                Typography variant = "h6"
                sx = {
                    {
                        mt: 2,
                        color: "#1976d2",
                        fontWeight: 500
                    }
                } >
                {
                    `${selectedLine?.name?.toUpperCase() || "-"} | ${selectedLine?.type || "-"} | ${selectedLine?.project || "-"} • ${selectedLine?.windfarm || "-"} • ${selectedLine?.cluster || "-"}`
                } <
                /Typography>

                { /* Stats Grid */ } <
                Grid container spacing = {
                    2
                }
                sx = {
                    {
                        mt: 2,
                        mb: 2
                    }
                }
                justifyContent = "center" >
                <
                Grid item xs = {
                    4
                } >
                <
                Paper sx = {
                    {
                        p: 1,
                        bgcolor: "#f5f5f5"
                    }
                } >
                <
                Typography variant = "caption"
                color = "textSecondary" >
                Line Length <
                /Typography> <
                Typography variant = "h6" > {
                    selectedLine.km
                }
                km < /Typography> <
                /Paper> <
                /Grid> <
                Grid item xs = {
                    4
                } >
                <
                Paper sx = {
                    {
                        p: 1,
                        bgcolor: "#f5f5f5"
                    }
                } >
                <
                Typography variant = "caption"
                color = "textSecondary" >
                Turbines <
                /Typography> <
                Typography variant = "h6" > {
                    selectedLine.turbineLocations ? .length || 0
                } <
                /Typography> <
                /Paper> <
                /Grid> <
                Grid item xs = {
                    4
                } >
                <
                Paper sx = {
                    {
                        p: 1,
                        bgcolor: "#f5f5f5"
                    }
                } >
                <
                Typography variant = "caption"
                color = "textSecondary" >
                Circuit <
                /Typography> <
                Typography variant = "h6" > {
                    1
                } < /Typography> <
                /Paper> <
                /Grid> <
                /Grid> <
                /CardContent> <
                /Card>
            )
        }

        { /* 4. POLE CONFIGURATION */ } <
        Grid container spacing = {
            2
        }
        mb = {
            3
        } >
        <
        Grid item xs = {
            12
        }
        md = {
            8
        } >
        <
        Card sx = {
            {
                p: 2
            }
        } >
        <
        Typography variant = "subtitle1"
        fontWeight = "bold" >
        Pole Configuration - {
            " "
        } {
            selectedLine ? .name ? .toUpperCase() || "Line"
        } <
        /Typography> <
        Divider sx = {
            {
                my: 1
            }
        }
        />

        {
            isGenerating && ( <
                Box sx = {
                    {
                        mb: 2
                    }
                } >
                <
                Typography variant = "caption" >
                Generating poles...{
                    Math.round(generationProgress)
                } %
                <
                /Typography> <
                LinearProgress variant = "determinate"
                value = {
                    generationProgress
                }
                /> <
                /Box>
            )
        }

        <
        Grid container spacing = {
            2
        } >
        <
        Grid item xs = {
            6
        }
        md = {
            3
        } >
        <
        TextField label = "Line Name"
        value = {
            selectedLine ? .line_name || ""
        }
        fullWidth disabled size = "small" /
        >
        <
        /Grid> <
        Grid item xs = {
            6
        }
        md = {
            3
        } >
        <
        TextField label = "Line Length"
        value = {
            `${selectedLine?.km || 0} km (${totalMeters} m)`
        }
        fullWidth disabled size = "small" /
        >
        <
        /Grid> <
        Grid item xs = {
            6
        }
        md = {
            3
        } >
        <
        TextField label = "Avg Span (m)"
        type = "number"
        value = {
            span
        }
        onChange = {
            (e) => {
                setSpan(parseInt(e.target.value) || 0);
            }
        }
        fullWidth error = {
            isSpanInvalid
        }
        helperText = {
            isSpanInvalid ? "Span must be between 40-120m" : ""
        }
        size = "small"
        inputProps = {
            {
                min: CONSTANTS.SPAN_MIN,
                max: CONSTANTS.SPAN_MAX,
            }
        }
        required
        // disabled={isGenerating}
        disabled = {
            isGenerating || isLineLocked
        }
        /> <
        /Grid> <
        Grid item xs = {
            6
        }
        md = {
            3
        } >
        <
        TextField label = "Required Poles"
        value = {
            requiredPoles > 500 ?
            `${requiredPoles} (Max 500 recommended)` :
                requiredPoles
        }
        fullWidth disabled size = "small"
        error = {
            requiredPoles > 500
        }
        helperText = {
            requiredPoles > 500 ?
            "Large number may affect performance" :
                ""
        }
        /> <
        /Grid> <
        Grid item xs = {
            12
        } >
        <
        Box sx = {
            {
                display: "flex",
                gap: 2,
                justifyContent: "flex-end"
            }
        } >
        <
        Button variant = "contained"
        startIcon = { < PlaylistAddIcon / >
        }
        onClick = {
            handleCreatePoles
        }
        disabled = {!isSpanValidForCreate ||
            isGenerating ||
            requiredPoles > 500 ||
            rows.length > 0
        }
        sx = {
            {
                mt: 1
            }
        } >
        { /* Create {requiredPoles} Poles */ }

        {
            rows.length > 0 ?
                "Poles Generated" :
                `Create ${requiredPoles} Poles`
        } <
        /Button> {
            rows.length > 0 && !isGenerating && ( <
                Button variant = "outlined"
                color = "error"
                onClick = {
                    handleResetPoles
                }
                disabled = {
                    isLineLocked
                }
                sx = {
                    {
                        mt: 1
                    }
                } >
                Reset Poles <
                /Button>
            )
        } <
        /Box> <
        /Grid> <
        /Grid> <
        /Card> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        Card sx = {
            {
                textAlign: "center",
                p: 2,
                bgcolor: isLengthExceeded ? "#fff1f1" : "white",
                height: "82%",
            }
        } >
        <
        Typography variant = "subtitle2" > Span Usage < /Typography> <
        Typography variant = "h4"
        color = {
            isLengthExceeded ? "error" : "primary"
        }
        sx = {
            {
                fontWeight: "bold"
            }
        } >
        {
            totalSpanUsed
        }
        / {totalMeters} m <
        /Typography> <
        Typography variant = "body2"
        color = {
            isLengthExceeded ? "error" : "textSecondary"
        } >
        {
            progress
        } % Complete <
        /Typography> {
            rows.length > 0 && ( <
                Typography variant = "caption"
                color = "info"
                sx = {
                    {
                        mt: 1,
                        display: "block"
                    }
                } >
                Poles Configured: {
                    rows.length
                } <
                /Typography>
            )
        } {
            !isSpanValidForCreate && span > 0 && ( <
                Typography variant = "caption"
                color = "warning"
                sx = {
                    {
                        mt: 1,
                        display: "block"
                    }
                } >
                ⚠Please enter a valid span(40 - 120 m) <
                /Typography>
            )
        } {
            requiredPoles > 500 && ( <
                Typography variant = "caption"
                color = "warning"
                sx = {
                    {
                        mt: 1,
                        display: "block"
                    }
                } >
                ⚠Large number of poles(max 500 recommended) <
                /Typography>
            )
        } {
            isLengthExceeded && ( <
                Typography variant = "caption"
                color = "error"
                sx = {
                    {
                        mt: 1,
                        display: "block"
                    }
                } >
                ⚠Total span exceeds line length <
                /Typography>
            )
        } <
        /Card> <
        /Grid> <
        /Grid>

        { /* ✅ CHANGE 2: Bulk Land Details Card - Table ke upar */ } {
            rows.length > 0 && ( <
                Card sx = {
                    {
                        p: 2,
                        mb: 2
                    }
                } >
                <
                Typography variant = "h6"
                mb = {
                    1
                } >
                Bulk Land Details <
                /Typography>

                <
                Grid container spacing = {
                    1.5
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
                TextField select fullWidth label = "Contractor Name"
                size = "small"
                value = {
                    bulkLand.contractorId
                }
                onChange = {
                    (e) =>
                    setBulkLand({
                        ...bulkLand,
                        contractorId: e.target.value,
                    })
                }
                disabled = {
                    isLineLocked
                } >
                <
                MenuItem value = "" > Select Contractor < /MenuItem>

                {
                    electricalContractors.map((contractor) => ( <
                        MenuItem key = {
                            contractor.id
                        }
                        value = {
                            contractor.id
                        } > {
                            contractor.firm_name
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
                }
                md = {
                    3
                } >
                <
                TextField fullWidth label = "Village"
                size = "small"
                value = {
                    bulkLand.village
                }
                onChange = {
                    (e) =>
                    setBulkLand({
                        ...bulkLand,
                        village: e.target.value,
                    })
                }
                disabled = {
                    isLineLocked
                }
                /> <
                /Grid>

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
                TextField fullWidth label = "Survey No"
                size = "small"
                value = {
                    bulkLand.surveyNo
                }
                onChange = {
                    (e) =>
                    setBulkLand({
                        ...bulkLand,
                        surveyNo: e.target.value,
                    })
                }
                disabled = {
                    isLineLocked
                }
                /> <
                /Grid>

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
                TextField select fullWidth label = "Land Type"
                size = "small"
                value = {
                    bulkLand.landType
                }
                onChange = {
                    (e) =>
                    setBulkLand({
                        ...bulkLand,
                        landType: e.target.value,
                    })
                }
                disabled = {
                    isLineLocked
                } >
                <
                MenuItem value = "Private" > Private < /MenuItem> <
                MenuItem value = "Government" > Government < /MenuItem> <
                MenuItem value = "Forest" > Forest < /MenuItem> <
                MenuItem value = "Leasehold" > Leasehold < /MenuItem> <
                MenuItem value = "Other" > Other < /MenuItem> <
                /TextField> <
                /Grid>

                <
                Grid item xs = {
                    12
                } >
                <
                Typography variant = "body2"
                sx = {
                    {
                        mb: 1,
                        fontWeight: 600
                    }
                } > {
                    bulkLand.landType === "Private" ||
                    bulkLand.landType === "Leasehold" ?
                    "Agreement with Owner" :
                        bulkLand.landType === "Government" ||
                        bulkLand.landType === "Forest" ?
                        "Approval Letter" :
                        "File Upload"
                } <
                /Typography>

                <
                input key = {
                    fileKey
                }
                type = "file"
                onChange = {
                    (e) =>
                    setBulkLand({
                        ...bulkLand,
                        agreementAttachment: e.target.files[0] || null,
                    })
                }
                disabled = {
                    isLineLocked
                }
                style = {
                    {
                        width: "100%",
                        padding: "8px",
                        border: "1px dashed #CBD5E1",
                        borderRadius: "6px",
                        backgroundColor: "#F8FAFC",
                        cursor: isLineLocked ? "not-allowed" : "pointer",
                    }
                }
                /> <
                /Grid>

                { /* Buttons */ } <
                Grid item xs = {
                    12
                } >
                <
                Box sx = {
                    {
                        display: "flex",
                        gap: 1.5,
                        mt: 0.5
                    }
                } >
                <
                Button variant = "contained"
                onClick = {
                    handleApplyToSelectedPoles
                }
                disabled = {
                    isLineLocked || selectedPoles.length === 0
                }
                sx = {
                    {
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 600,
                    }
                } >
                Apply to Selected Poles({
                    selectedPoles.length
                }) <
                /Button>

                <
                Button variant = "contained"
                color = "success"
                onClick = {
                    handleApplyToAllPoles
                }
                disabled = {
                    isLineLocked
                }
                sx = {
                    {
                        px: 3,
                        py: 1,
                        textTransform: "none",
                        fontWeight: 600,
                    }
                } >
                Apply to All <
                /Button> <
                /Box> <
                /Grid> <
                /Grid> <
                /Card>
            )
        }

        { /* 5. POLE DATA TABLE */ } {
            rows.length > 0 ? ( <
                SCOHPoleDataTable rows = {
                    rows
                }
                onUpdateRow = {
                    updateRow
                }
                onAddRow = {
                    addRow
                }
                onRemoveRow = {
                    removeRow
                }
                isLengthExceeded = {
                    isLengthExceeded
                }
                totalMeters = {
                    totalMeters
                }
                span = {
                    span
                }
                loading = {
                    false
                }
                turbines = {
                    turbinesForSelectedLine
                }
                selectedLineData = {
                    selectedLine
                }
                selectedLineId = {
                    selectedLine ? .id
                }
                onRefreshData = {
                    refreshPoleLineData
                }
                // ✅ CHANGE 4: Props pass kiye
                selectedPoles = {
                    selectedPoles
                }
                setSelectedPoles = {
                    setSelectedPoles
                }
                electricalContractors = {
                    electricalContractors
                }
                clearBulkCache = {
                    clearBulkCache
                }
                isLineLocked = {
                    isLineLocked
                }
                />
            ) : ( <
                Card sx = {
                    {
                        textAlign: "center",
                        py: 4,
                        bgcolor: "#fafafa"
                    }
                } >
                <
                CardContent >
                <
                Typography variant = "body1"
                color = "textSecondary" >
                No poles configured yet. <
                /Typography> <
                /CardContent> <
                /Card>
            )
        } <
        /Box>
    );
};

export default SCOHL1_Dog;