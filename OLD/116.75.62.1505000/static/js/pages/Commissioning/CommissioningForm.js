import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
} from "react";

import {
    Grid,
    TextField,
    Typography,
    Box,
    Button,
    Paper,
    Divider,
    MenuItem
} from "@mui/material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DynamicDataTable from "../../components/comman/DynamicDataTable";
import LocationFilterBar from "../../components/LocationFilterBar";
import {
    useTableViewer
} from "../../hooks/useTableViewer";
import {
    GetCommissioningDetails,
    PostCommissioningDetails
} from "../../Redux/InstallationData/WtgInstallationData/wtgInstallationAction";
import {
    getEligibleTurbines
} from "../../Redux/TurbineMasterData/turbineAction";
// import { useOutletContext } from "react-router-dom";
// import { getAttachmentsForActivity } from "../../utils/documentHelpers";

const CommissioningForm = (

    {
        filters,
        setFilters,
        showSnackbar,
    }
) => {
    const dispatch = useDispatch();
    const hasFetched = useRef(false);
    const lastFetchRef = useRef("");
    const [submittedWtgTabs, setSubmittedWtgTabs] = useState({});
    const {
        commissioning = []
    } = useSelector((state) => state.wtgInstallationData || {});
    const {
        viewer,
        closeViewer,
        buildColumns
    } = useTableViewer();
    const {
        eligibleTurbines
    } = useSelector(state => state.turbineData);
    //  const { filters, setFilters, showSnackbar,  } = useOutletContext();

    const {
        //  GETmaterialMaster=[],
        //  MaterialIssueData = [], 
        //  MaterialRecivedData = [], 
        //  ContractorData: contractors = [], 
        inspectors = [],
            //  vendorData: supplier = [], 
            //  kpiList = [],
            //  attachmentList = [], 
            //  documentList = [],
            componentTypesList = [],
            activityPlannedDates = [],
    } = useSelector((state) => state.masterData || {});

    const intialCommissioningData = useMemo(() => ({
        project: "",
        windfarm: "",
        cluster: "",
        turbine: "",
        mechanical_inspection_date: "",
        electrical_inspection_date: "",
        test_run_date: "",
        commissioning_date: "",
        sign_off_date: "",
        grid_synchronization_date: "",
        noise_vibration_test_results: "",
        scada_connectivity_verified: "",
        commissioning_engineer: "",
        witnessed_by: "",
        open_points_punch_list: "",
        status: "",
        document: null,
        performance_reports: null,
        selected_items: []
    }), []);
    const [commissioningData, setCommissioningData] = useState(intialCommissioningData);

    const resetCommissioning = useCallback(() => {
        setCommissioningData(intialCommissioningData);
        // setEditId(null);
    }, [intialCommissioningData]);

    const handleCommissioningChange = useCallback((field, value) => {
        setCommissioningData((prev) => ({ ...prev,
            [field]: value
        }));
    }, []);

    // 1. Activity mapping (Static definition)
    const commissioningActivities = ["COMMISSION"];

    // 2. Memoized activityCode (Kept for architectural symmetry across screens)
    const activityCode = useMemo(() => {
        return commissioningActivities[0]; // Resolves cleanly to "COMMISSION"
    }, []);


    // 2.  REAL-TIME WORKFLOW SYNC VIA POLLING (Path A)
    useEffect(() => {
        // Relaxed Guard Clause: Requires a Project baseline to safely execute polling loops
        if (!filters ? .project) return;

        const fetchFreshWorkflowMatrix = () => {
            dispatch(
                getEligibleTurbines(
                    filters.project,
                    filters.windfarm || '',
                    filters.cluster || '',
                    null,
                    'COMMISSIONING'
                )
            );
        };

        fetchFreshWorkflowMatrix();

        const pollingIntervalId = setInterval(fetchFreshWorkflowMatrix, 30000);

        return () => clearInterval(pollingIntervalId);
    }, [filters.project, filters.windfarm, filters.cluster, dispatch]);

    const commissionTurbines = useMemo(() => eligibleTurbines ? .COMMISSION || [], [eligibleTurbines]);

    const COMMISSIONING_HEADER_MAP = useMemo(() => ({
        turbine_name: "Turbine Location",
        mechanical_inspection_date: "Mechanical Insp. Date",
        electrical_inspection_date: "Electrical Insp. Date",
        test_run_date: "Test Run Date",
        commissioning_date: "Commissioning Date",
        sign_off_date: "Final Sign-off Date",
        grid_synchronization_date: "Grid Synchronization Date",
        noise_vibration_test_results: "Noise & Vibration Results",
        scada_connectivity_verified: "SCADA Verified",
        commissioning_engineer: "Commissioning Engineer",
        witnessed_by: "Witnessed By",
        open_points_punch_list: "Open Points / Punch List",
        attachments_list: "Commissioning Document",
        performance_reports: "Performance Report",
    }), []);


    const commissioningColumns = useMemo(
        () => buildColumns(COMMISSIONING_HEADER_MAP, true), [buildColumns, COMMISSIONING_HEADER_MAP]
    );

    useEffect(() => {

        if (!hasFetched.current) {

            dispatch(GetCommissioningDetails());

            hasFetched.current = true;
        }
    }, [dispatch]);


    const commissioningRows = useMemo(() => {
        return commissioning.map((row) => ({
            ...row,
            turbine_name: row.turbine_name,
            contractor_name: row.contractor_name,
            commissioning_engineer: row.commissioning_engineer,
            canEdit: !row.approve_date,
            approved_status: row.approve_date ? "Approved" : "Pending",

            // attachments_list: getAttachmentsForActivity("COMMISSION", row.turbine, documentList),
        }));
    }, [commissioning]);

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            files
        } = e.target;
        handleCommissioningChange(name, type === "file" ? files[0] : value);
    };

    const toFormData = (data) => {
        const fd = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                fd.append(key, value);
            }
        });
        return fd;
    };

    // Commissioning Submission
    const handleSubmitCommissioning = useCallback(async () => {
        try {

            const selectedTurbine = commissionTurbines.find(
                (t) => Number(t.id) === Number(commissioningData.turbine)
            );

            const finalData = {
                ...commissioningData,
                project: filters.project, // Adding the ID from your filter state
                windfarm: filters.windfarm,
                cluster: selectedTurbine ? .cluster || null,
            };
            await dispatch(PostCommissioningDetails(toFormData(finalData)));

            setSubmittedWtgTabs(prev => ({ ...prev,
                1: true
            })); // tab index
            showSnackbar("Commissioning details submitted successfully", "success");
            resetCommissioning();

        } catch (err) {
            showSnackbar("Commissioning submission failed", "error");
        }
    }, [commissioningData, commissionTurbines, filters, dispatch, resetCommissioning, showSnackbar]);



    return ( <
        Box sx = {
            {
                maxWidth: "lg",
                mx: "auto",
            }
        } >

        <
        Paper sx = {
            {
                p: 3,
                border: "1px solid #e0e0e0",
                borderRadius: 2
            }
        } >
        <
        Typography variant = "h5"
        fontWeight = {
            600
        }
        color = "primary.main"
        mb = {
            1
        } >
        Commissioning Details <
        /Typography> <
        Divider sx = {
            {
                mb: 3
            }
        }
        />

        <
        Grid container spacing = {
            2
        } > { /* Turbine */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        TextField select fullWidth size = "small"
        label = "Turbine"
        name = "turbine"
        value = {
            commissioningData.turbine
        }
        onChange = {
            handleChange
        } >
        {
            commissionTurbines.map((t) => ( <
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

        <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        TextField select fullWidth size = "small"
        label = "Commissioning Engineer"
        name = "commissioning_engineer"
        value = {
            commissioningData.commissioning_engineer
        }
        onChange = {
            handleChange
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

        { /* Dates */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField fullWidth type = "date"
        size = "small"
        label = "Mechanical Inspection Date"
        name = "mechanical_inspection_date"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        value = {
            commissioningData.mechanical_inspection_date
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField fullWidth type = "date"
        size = "small"
        label = "Electrical Inspection Date"
        name = "electrical_inspection_date"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        value = {
            commissioningData.electrical_inspection_date
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField fullWidth type = "date"
        size = "small"
        label = "Test Run Date"
        name = "test_run_date"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        value = {
            commissioningData.test_run_date
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField fullWidth type = "date"
        size = "small"
        label = "Commissioning Date"
        name = "commissioning_date"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        value = {
            commissioningData.commissioning_date
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField fullWidth type = "date"
        size = "small"
        label = "Grid Synchronization Date"
        name = "grid_synchronization_date"
        InputLabelProps = {
            {
                shrink: true
            }
        }
        value = {
            commissioningData.grid_synchronization_date
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        { /* Results */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        TextField fullWidth size = "small"
        label = "Noise / Vibration Test Results"
        name = "noise_vibration_test_results"
        value = {
            commissioningData.noise_vibration_test_results
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        TextField fullWidth size = "small"
        label = "SCADA Connectivity Verified"
        name = "scada_connectivity_verified"
        value = {
            commissioningData.scada_connectivity_verified
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        { /* Witness / Punch List */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        TextField fullWidth size = "small"
        label = "Witnessed By"
        name = "witnessed_by"
        value = {
            commissioningData.witnessed_by
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        <
        Grid item xs = {
            12
        } >
        <
        TextField fullWidth multiline rows = {
            2
        }
        size = "small"
        label = "Open Points / Punch List"
        name = "open_points_punch_list"
        value = {
            commissioningData.open_points_punch_list
        }
        onChange = {
            handleChange
        }
        /> <
        /Grid>

        { /* File Uploads */ } <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        Button variant = "outlined"
        component = "label"
        fullWidth startIcon = { < CloudUploadIcon / >
        } >
        Upload Commissioning Document <
        input type = "file"
        hidden name = "document"
        onChange = {
            handleChange
        }
        /> <
        /Button> {
            commissioningData.document && ( <
                Typography variant = "caption" > {
                    commissioningData.document.name
                } <
                /Typography>
            )
        } <
        /Grid>

        <
        Grid item xs = {
            12
        }
        md = {
            6
        } >
        <
        Button variant = "outlined"
        component = "label"
        fullWidth startIcon = { < CloudUploadIcon / >
        } >
        Upload Performance Report <
        input type = "file"
        hidden name = "performance_reports"
        onChange = {
            handleChange
        }
        /> <
        /Button> {
            commissioningData.performance_reports && ( <
                Typography variant = "caption" > {
                    commissioningData.performance_reports.name
                } <
                /Typography>
            )
        } <
        /Grid> <
        /Grid> <
        Box sx = {
            {
                display: "flex",
                justifyContent: "center",
                mt: 3
            }
        } >
        <
        Button variant = "contained"
        onClick = {
            handleSubmitCommissioning
        }
        // disabled={disabled}
        >
        Submit Commissioning <
        /Button> <
        /Box> <
        /Paper> <
        Box sx = {
            {
                display: "flex",
                justifyContent: "center",
                mt: 3
            }
        } >
        <
        DynamicDataTable columns = {
            commissioningColumns
        }
        rows = {
            commissioningRows
        }
        // onEdit={
        //   (row) => {

        //     if (row.approve_date) return;
        //     onEditPcc(row);
        //   }}
        // onDelete={onDelete}
        /> <
        /Box> <
        /Box>
    );
};

export default CommissioningForm;