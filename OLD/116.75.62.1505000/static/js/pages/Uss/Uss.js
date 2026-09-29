import React, {
    useEffect,
    useState
} from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress,
    Button,
} from "@mui/material";
import {
    PhotoCamera
} from "@mui/icons-material";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetUSSMasterData,
    PatchUssMasterData,
} from "../../Redux/MasterData/masterAction";
import {
    createUssActivity
} from "../../Redux/InstallationData/UssData/UssAction";
/* =========================
   ACTIVITY TEMPLATE
========================= */
const activitiesTemplate = [
    "DP Yard Column casting",
    "DP Yard Slab Casting",
    "Delivery of electrical accessories",
    "Trafo/CSS erection",
    "Installation of electrical accessories",
    "Earth pit marking",
    "Earth boring",
    "Earth rod installation",
    "Earthing strip laying",
    "LT cable Termination",
    "Hand rail fixing on Transformer Slab",
    "DP yard Completion",
    "Service lift platform",
    "EB Commissioning",
];
/* =========================
   CREATE ACTIVITIES
========================= */
const createActivities = () =>
    activitiesTemplate.map((a) => ({
        activity_name: a,
        start_date: "",
        end_date: "",
        start_photo: null,
        end_photo: null,
        no_of_days: 0,
        remarks: "",
    }));
/* =========================
   MAIN COMPONENT
========================= */
export default function USSFormFeeding({
    filters,
    setFilters,
}) {
    const dispatch = useDispatch();
    const {
        loading: saveLoading
    } = useSelector(
        (state) => state.ussActivityData,
    );
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [savingIndex, setSavingIndex] = useState(null);

    const [approvalLoading, setApprovalLoading] = useState(false);
    // 🔥 turbine options from ElectricalFilterBar
    const [allTurbines, setAllTurbines] = useState([]);
    // 🔥 selected uss
    const [selected, setSelected] = useState(null);
    const [errors, setErrors] = useState({});
    /* =========================
       FETCH MASTER DATA
    ========================= */
    // ✅ USS master data
    const {
        getUssMaster = []
        // loading: ussMasterLoading,
    } = useSelector((state) => state.masterData);
    // console.log("getUssMaster from uss.js", getUssMaster);
    const showSnackbar = (
        message,
        severity = "success",
    ) => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };
    useEffect(() => {
        dispatch(GetUSSMasterData());
    }, [dispatch]);
    // console.log("getUssMaster data from formfeeding uss", getUssMaster);
    /* =========================
       USS OPTIONS
    ========================= */
    useEffect(() => {
        if (!selected) return;
        const latest = getUssMaster.find((u) => u.id === selected.id);
        if (!latest) return;
        const backendActivities = latest.activities || [];
        const mergedActivities = activitiesTemplate.map((activityName) => {
            const existing = backendActivities.find(
                (a) => a.activity_name === activityName,
            );
            return existing ?
                {
                    activity_name: activityName,
                    start_date: existing.start_date || "",
                    end_date: existing.end_date || "",
                    start_photo: existing.start_photo || null,
                    end_photo: existing.end_photo || null,
                    no_of_days: existing.no_of_days || 0,
                    remarks: existing.remarks || "",
                } :
                {
                    activity_name: activityName,
                    start_date: "",
                    end_date: "",
                    start_photo: null,
                    end_photo: null,
                    no_of_days: 0,
                    remarks: "",
                };
        });
        setSelected({
            ...latest,
            activities: mergedActivities,
            backendActivities,
        });
    }, [getUssMaster]);
    useEffect(() => {
        setSelected(null);
    }, [filters.project, filters.windfarm, filters.cluster]);
    const filteredUSS = filters.cluster ?
        getUssMaster.filter((u) => {
            return (
                (!filters.project || u.project === Number(filters.project)) &&
                (!filters.windfarm || u.windfarm === Number(filters.windfarm)) &&
                (!filters.cluster || u.cluster === Number(filters.cluster)) &&
                (!filters.turbine || u.turbine === Number(filters.turbine))
            );
        }) :
        [];
    /* =========================
       USS DROPDOWN OPTIONS
    ========================= */
    const ussOptions = filteredUSS;
    /* =========================
       HANDLE USS SELECT
    ========================= */
    const handleUSSChange = (ussName) => {
        const found = getUssMaster.find((u) => u.uss_name === ussName);
        if (!found) {
            setSelected(null);
            return;
        }
        // backend saved activities
        const backendActivities = found.activities || [];
        // merge template + backend data
        const mergedActivities = activitiesTemplate.map((activityName) => {
            // check backend me same activity saved hai kya
            const existing = backendActivities.find(
                (a) => a.activity_name === activityName,
            );
            // agar backend data mila
            if (existing) {
                return {
                    activity_name: activityName,
                    start_date: existing.start_date || "",
                    end_date: existing.end_date || "",
                    start_photo: existing.start_photo || null,
                    end_photo: existing.end_photo || null,
                    no_of_days: existing.no_of_days || 0,
                    remarks: existing.remarks || "",
                };
            }
            // agar backend me nahi mila
            return {
                activity_name: activityName,
                start_date: "",
                end_date: "",
                start_photo: null,
                end_photo: null,
                no_of_days: 0,
                remarks: "",
            };
        });
        const formObject = {
            ...found,
            activities: mergedActivities,
            backendActivities: backendActivities,
        };
        setSelected(formObject);
        // console.log(
        //   "✅ SELECTED USS",
        //   formObject,
        // );
    };
    /* =========================
       DAYS CALCULATION
    ========================= */
    const calcDays = (startDate, endDate) => {
        if (!startDate || !endDate) {
            return 0;
        }
        const start = new Date(startDate);
        const end = new Date(endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        if (end < start) {
            return 0;
        }
        const diffTime = end - start;
        const days = diffTime / (1000 * 60 * 60 * 24);
        return days + 1;
    };
    /* =========================
       UPDATE ACTIVITY
    ========================= */
    const update = (i, field, value) => {
        const copy = { ...selected
        };
        // update value
        copy.activities[i][field] = value;
        setErrors((prev) => ({
            ...prev,
            [`${field}_${i}`]: false,
        }));
        const startDate =
            field === "start_date" ? value : copy.activities[i].start_date;
        const endDate = field === "end_date" ? value : copy.activities[i].end_date;
        // ✅ if start date changes
        // and existing end date becomes invalid
        if (
            field === "start_date" &&
            endDate &&
            new Date(endDate) < new Date(value)
        ) {
            copy.activities[i].end_date = "";
            copy.activities[i].no_of_days = 0;
        } else {
            copy.activities[i].no_of_days = calcDays(
                startDate,
                endDate,
            );
        }
        setSelected(copy);
    };
    // validation for submit for approval button enable disable
    // =========================
    // APPROVAL VALIDATION
    // =========================
    // =========================
    // APPROVAL VALIDATION
    // =========================
    const backendActivities = selected ? .backendActivities || [];
    const completedActivities = backendActivities.filter((activity) => {
        return (
            activity.start_date &&
            activity.end_date &&
            activity.start_photo &&
            activity.end_photo
        );
    }).length;
    const canSubmitForApproval =
        backendActivities.length === activitiesTemplate.length &&
        completedActivities === activitiesTemplate.length;
    return ( <
        Box sx = {
            {
                p: 2
            }
        } > {
            /* <Typography variant="h5" fontWeight={700} sx={{ mt: -4 }}>
                    USS FORM FEEDING SYSTEM
                  </Typography> */
        } { /* ================= FILTERS ================= */ } { /* ================= MAIN LAYOUT ================= */ } <
        Grid container spacing = {
            2
        }
        sx = {
            {
                mt: -1
            }
        } > { /* LEFT USS LIST */ } <
        Grid item xs = {
            12
        }
        md = {
            2.3
        } >
        <
        Paper sx = {
            {
                p: 2,
                height: "75vh",
                overflow: "auto",
            }
        } >
        {!filters.cluster ? ( <
                Typography textAlign = "center"
                color = "text.secondary"
                sx = {
                    {
                        mt: 4
                    }
                } >
                Select Cluster <
                /Typography>
            ) : filteredUSS.length === 0 ? ( <
                Typography textAlign = "center"
                color = "text.secondary"
                sx = {
                    {
                        mt: 4
                    }
                } >
                No USS Found <
                /Typography>
            ) : (
                filteredUSS.map((u, index) => ( <
                    Box key = {
                        index
                    }
                    onClick = {
                        () => {
                            setFilters({
                                ...filters,
                                uss: u.uss_name,
                            });
                            handleUSSChange(u.uss_name);
                        }
                    }
                    sx = {
                        {
                            p: 2,
                            mb: 2,
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            cursor: "pointer",
                            bgcolor: selected ? .uss_name === u.uss_name ? "#e3f2fd" : "#fff",
                        }
                    } >
                    <
                    Typography fontWeight = {
                        700
                    } > {
                        u.uss_name
                    } < /Typography> <
                    Typography variant = "body2" > {
                        u.turbine_name
                    } < /Typography> {
                        /* <Typography
                                          variant="caption"
                                          color="text.secondary"
                        >
                                          {u.project} / {u.windfarm} /
                                          {u.cluster}
                        </Typography> */
                    } <
                    /Box>
                ))
            )
        } <
        /Paper> <
        /Grid> { /* RIGHT TABLE */ } <
        Grid item xs = {
            12
        }
        md = {
            9.7
        } >
        <
        Paper sx = {
            {
                p: 2,
                height: "75vh",
                overflow: "auto",
            }
        } >
        {!selected ? ( <
                Typography > Select USS < /Typography>
            ) : ( <
                >
                <
                Typography variant = "h6"
                fontWeight = {
                    700
                }
                mb = {
                    2
                } > {
                    selected.uss_name
                } <
                /Typography> {
                    selected.referred_diagram && ( <
                        Box sx = {
                            {
                                mb: 2
                            }
                        } >
                        <
                        Typography variant = "body2"
                        fontWeight = {
                            600
                        } >
                        Referred Diagram <
                        /Typography> <
                        Button variant = "outlined"
                        size = "small"
                        href = {
                            selected.referred_diagram
                        }
                        target = "_blank"
                        rel = "noopener noreferrer" >
                        View Diagram <
                        /Button> <
                        /Box>
                    )
                } <
                Table size = "small"
                sx = {
                    {
                        minWidth: 650
                    }
                }
                border = {
                    1
                } >
                <
                TableHead >
                <
                TableRow sx = {
                    {
                        bgcolor: "#1976d2"
                    }
                } >
                <
                TableCell sx = {
                    {
                        color: "#fff",
                        fontWeight: 700,
                        borderRight: "1px solid rgba(255,255,255,0.3)",
                    }
                } >
                Activity <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "#fff",
                        fontWeight: 700,
                        borderRight: "1px solid rgba(255,255,255,0.3)",
                    }
                } >
                Start Date <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "#fff",
                        fontWeight: 700,
                        borderRight: "1px solid rgba(255,255,255,0.3)",
                    }
                } >
                Start Photo <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "#fff",
                        fontWeight: 700,
                        borderRight: "1px solid rgba(255,255,255,0.3)",
                    }
                } >
                End Date <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "#fff",
                        fontWeight: 700,
                        borderRight: "1px solid rgba(255,255,255,0.3)",
                    }
                } >
                End Photo <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "#fff",
                        fontWeight: 700,
                        textAlign: "center",
                        borderRight: "1px solid rgba(255,255,255,0.3)",
                    }
                } >
                Days <
                /TableCell> <
                TableCell sx = {
                    {
                        color: "#fff",
                        fontWeight: 700,
                        textAlign: "center",
                    }
                } >
                Action <
                /TableCell> <
                /TableRow> <
                /TableHead> <
                TableBody > {
                    selected.activities.map((a, i) => ( <
                        TableRow key = {
                            i
                        }
                        hover >
                        <
                        TableCell sx = {
                            {
                                fontWeight: 600,
                                py: 1,
                                borderRight: "1px solid #e0e0e0",
                            }
                        } >
                        {
                            a.activity_name
                        } <
                        /TableCell> <
                        TableCell sx = {
                            {
                                py: 1,
                                borderRight: "1px solid #e0e0e0"
                            }
                        } >
                        <
                        TextField type = "date"
                        size = "small"
                        value = {
                            a.start_date
                        }
                        error = {
                            errors[`start_date_${i}`]
                        }
                        onChange = {
                            (e) =>
                            update(i, "start_date", e.target.value)
                        }
                        sx = {
                            {
                                width: 140
                            }
                        }
                        /> <
                        /TableCell> <
                        TableCell sx = {
                            {
                                py: 1,
                                borderRight: "1px solid #e0e0e0"
                            }
                        } >
                        <
                        IconButton component = "label"
                        size = "small"
                        sx = {
                            {
                                bgcolor: "#e3f2fd",
                                border: errors[`end_photo_${i}`] ?
                                    "2px solid red" :
                                    "1px solid transparent",
                            }
                        } >
                        <
                        PhotoCamera fontSize = "small"
                        color = "primary" / >
                        <
                        input hidden type = "file"
                        onChange = {
                            (e) =>
                            update(i, "start_photo", e.target.files[0])
                        }
                        /> <
                        /IconButton> {
                            a.start_photo && ( <
                                Typography variant = "caption"
                                display = "block"
                                sx = {
                                    {
                                        fontSize: "10px",
                                        maxWidth: 100,
                                        wordBreak: "break-all",
                                    }
                                } >
                                {
                                    typeof a.start_photo === "string" ?
                                    a.start_photo.split("/").pop() :
                                        a.start_photo.name
                                } <
                                /Typography>
                            )
                        } <
                        /TableCell> <
                        TableCell sx = {
                            {
                                py: 1,
                                borderRight: "1px solid #e0e0e0"
                            }
                        } >
                        <
                        TextField type = "date"
                        size = "small"
                        value = {
                            a.end_date
                        }
                        error = {
                            errors[`end_date_${i}`]
                        }
                        inputProps = {
                            {
                                min: a.start_date || undefined,
                            }
                        }
                        onChange = {
                            (e) =>
                            update(i, "end_date", e.target.value)
                        }
                        sx = {
                            {
                                width: 140
                            }
                        }
                        /> <
                        /TableCell> <
                        TableCell sx = {
                            {
                                py: 1,
                                borderRight: "1px solid #e0e0e0"
                            }
                        } >
                        <
                        IconButton component = "label"
                        size = "small"
                        sx = {
                            {
                                bgcolor: "#f3e5f5",
                                border: errors[`start_photo_${i}`] ?
                                    "2px solid red" :
                                    "1px solid transparent",
                            }
                        } >
                        <
                        PhotoCamera fontSize = "small"
                        color = "secondary" / >
                        <
                        input hidden type = "file"
                        onChange = {
                            (e) =>
                            update(i, "end_photo", e.target.files[0])
                        }
                        /> <
                        /IconButton> {
                            a.end_photo && ( <
                                Typography variant = "caption"
                                display = "block"
                                sx = {
                                    {
                                        fontSize: "10px",
                                        maxWidth: 100,
                                        wordBreak: "break-all",
                                    }
                                } >
                                {
                                    typeof a.end_photo === "string" ?
                                    a.end_photo.split("/").pop() :
                                        a.end_photo.name
                                } <
                                /Typography>
                            )
                        } <
                        /TableCell> <
                        TableCell align = "center"
                        sx = {
                            {
                                fontWeight: 700,
                                py: 1,
                                borderRight: "1px solid #e0e0e0",
                            }
                        } >
                        {
                            a.no_of_days
                        } <
                        /TableCell> <
                        TableCell align = "center"
                        sx = {
                            {
                                py: 1
                            }
                        } >
                        <
                        Box component = "button"
                        // disabled={savingIndex === i}
                        disabled = {
                            savingIndex === i ||
                            selected.backendActivities ? .some(
                                (item) =>
                                item.activity_name === a.activity_name,
                            )
                        }
                        // sx={{
                        //   border: "none",
                        //   px: 1.5,
                        //   py: 0.5,
                        //   borderRadius: 1.5,
                        //   cursor:
                        //     savingIndex === i ? "not-allowed" : "pointer",
                        //   opacity: savingIndex === i ? 0.7 : 1,
                        //   fontWeight: 600,
                        //   fontSize: "12px",
                        //   bgcolor: "#1976d2",
                        //   color: "#fff",
                        //   minWidth: 80,
                        //   "&:hover": {
                        //     bgcolor: "#1565c0",
                        //   },
                        //   display: "flex",
                        //   alignItems: "center",
                        //   justifyContent: "center",
                        //   gap: 1,
                        // }}
                        sx = {
                            {
                                border: "none",
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1.5,
                                fontWeight: 600,
                                fontSize: "12px",
                                minWidth: 80,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                                // cursor:
                                //   savingIndex === i ||
                                //   selected.backendActivities?.some(
                                //     (item) => item.activity_name === a.activity_name
                                //   )
                                //     ? "not-allowed"
                                //     : "pointer",
                                bgcolor: selected.backendActivities ? .some(
                                        (item) =>
                                        item.activity_name === a.activity_name,
                                    ) ?
                                    "#9e9e9e" // muted green
                                    :
                                    "#1976d2",
                                color: "#fff",
                                "&:hover": {
                                    bgcolor: selected.backendActivities ? .some(
                                            (item) =>
                                            item.activity_name === a.activity_name,
                                        ) ?
                                        "#9e9e9e" :
                                        "#1565c0",
                                },
                                "&.Mui-disabled": {
                                    bgcolor: "#9e9e9e",
                                    color: "#fff",
                                    opacity: 0.75, // looks disabled
                                },
                            }
                        }
                        onClick = {
                            async () => {
                                const validationErrors = {};
                                if (!a.start_date) {
                                    validationErrors[`start_date_${i}`] = true;
                                }
                                if (!a.end_date) {
                                    validationErrors[`end_date_${i}`] = true;
                                }
                                if (!a.start_photo) {
                                    validationErrors[`start_photo_${i}`] = true;
                                }
                                if (!a.end_photo) {
                                    validationErrors[`end_photo_${i}`] = true;
                                }
                                setErrors(validationErrors);
                                if (Object.keys(validationErrors).length > 0) {
                                    showSnackbar(
                                        "Please fill all required fields",
                                        "error",
                                    );
                                    return;
                                }
                                try {
                                    setSavingIndex(i);
                                    const formData = new FormData();
                                    formData.append(
                                        "uss_master",
                                        selected.id,
                                    );
                                    formData.append(
                                        "activity_name",
                                        a.activity_name,
                                    );
                                    formData.append(
                                        "start_date",
                                        a.start_date || "",
                                    );
                                    formData.append(
                                        "end_date",
                                        a.end_date || "",
                                    );
                                    formData.append(
                                        "remarks",
                                        a.remarks || "",
                                    );
                                    if (
                                        a.start_photo &&
                                        typeof a.start_photo !== "string"
                                    ) {
                                        formData.append(
                                            "start_photo",
                                            a.start_photo,
                                        );
                                    }
                                    if (
                                        a.end_photo &&
                                        typeof a.end_photo !== "string"
                                    ) {
                                        formData.append(
                                            "end_photo",
                                            a.end_photo,
                                        );
                                    }
                                    await dispatch(createUssActivity(formData));
                                    showSnackbar(
                                        "Activity Saved Successfully",
                                        "success",
                                    );
                                    await dispatch(GetUSSMasterData());
                                } catch (error) {
                                    console.error(error);
                                    showSnackbar(
                                        "Failed To Save Activity",
                                        "error",
                                    );
                                } finally {
                                    setSavingIndex(null);
                                }
                            }
                        } >
                        {
                            savingIndex === i ? ( <
                                >
                                <
                                CircularProgress size = {
                                    14
                                }
                                color = "inherit" / >
                                Saving...
                                <
                                />
                            ) : selected.backendActivities ? .some(
                                (item) =>
                                item.activity_name === a.activity_name,
                            ) ? (
                                "Saved"
                            ) : (
                                "Save"
                            )
                        } <
                        /Box> <
                        /TableCell> <
                        /TableRow>
                    ))
                } <
                /TableBody> <
                /Table>{" "} <
                Box sx = {
                    {
                        display: "flex",
                        justifyContent: "center", // Changed from "flex-end" to "center"
                        alignItems: "center",
                        gap: 2,
                        mt: 3, // margin top
                        mb: 1, // margin bottom
                        pt: 2, // padding top
                        borderTop: "1px solid #e0e0e0", // optional separator line
                    }
                } >
                <
                Button variant = "contained"
                color = "success"
                // disabled={
                //   !selected ||
                //   selected.status === "Submitted" ||
                //   selected.status === "Approved"
                // }
                // disabled={!selected || !!selected.submitted_at}
                disabled = {
                    approvalLoading ||
                    !selected ||
                    !!selected ? .submitted_at ||
                    !canSubmitForApproval
                }
                onClick = {
                    async () => {
                        try {

                            setApprovalLoading(true);
                            const formData = new FormData();
                            // formData.append("status", "Submitted");
                            formData.append(
                                "submitted_at",
                                new Date().toISOString(),
                            );
                            await dispatch(
                                PatchUssMasterData(
                                    selected.id,
                                    formData,
                                ),
                            );
                            // 👇 Isko yaha add karo
                            setSelected((prev) => ({
                                ...prev,
                                submitted_at: new Date().toISOString(),
                            }));
                            showSnackbar(
                                "Sent for Approval Successfully",
                                "success",
                            );
                            await dispatch(GetUSSMasterData());
                        } catch (error) {
                            // console.error(error);
                            showSnackbar(
                                "Failed to Send for Approval",
                                "error",
                            );
                        } finally {

                            setApprovalLoading(false);

                        }
                    }
                }
                sx = {
                    {
                        px: 4, // increased horizontal padding for better appearance
                        py: 1.2, // increased vertical padding
                        fontWeight: 600,
                        fontSize: "0.9rem", // slightly larger font
                        textTransform: "none",
                        boxShadow: 2,
                        borderRadius: 2, // added border radius
                        minWidth: 180, // minimum width for better centering
                        "&:hover": {
                            boxShadow: 4,
                            transform: "translateY(-1px)",
                            transition: "all 0.2s ease",
                        },
                        "&:disabled": {
                            opacity: 2,
                            cursor: "not-allowed",
                        },
                    }
                } >
                { /* Send For Approval */ } {
                    approvalLoading ? ( <
                        >
                        <
                        CircularProgress size = {
                            18
                        }
                        color = "inherit"
                        sx = {
                            {
                                mr: 1
                            }
                        }
                        />
                        Sending...

                        <
                        />
                    ) : selected ? .approved_at ? (
                        "Approved"
                    ) : selected ? .submitted_at ? (
                        "Submitted For Approval"
                    ) : (
                        "Send For Approval"
                    )
                } <
                /Button> <
                /Box> <
                />
            )
        } { /* Action Buttons Section */ } <
        /Paper> <
        /Grid> <
        /Grid> <
        Snackbar open = {
            snackbar.open
        }
        autoHideDuration = {
            3000
        }
        onClose = {
            () =>
            setSnackbar((prev) => ({
                ...prev,
                open: false,
            }))
        }
        anchorOrigin = {
            {
                vertical: "top",
                horizontal: "right",
            }
        } >
        <
        Alert severity = {
            snackbar.severity
        }
        variant = "filled"
        onClose = {
            () =>
            setSnackbar((prev) => ({
                ...prev,
                open: false,
            }))
        } >
        {
            snackbar.message
        } <
        /Alert> <
        /Snackbar> <
        /Box>
    );
}