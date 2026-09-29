import React, {
    useMemo,
    useEffect
} from "react";
import {
    Box,
    Typography,
    Grid,
    TextField,
    Paper,
    InputAdornment,
    Button,
    Alert,
    MenuItem,

    IconButton
} from "@mui/material";
import NumberTextField from "../../../components/comman/NumberTextField";
import {
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    Science as ScienceIcon
} from "@mui/icons-material";
import {
    CUBE_TEST_RESULT_DAYS,
    PASS_FAIL_OPTIONS
} from "../../../constants/choices";
import DocumentAttachmentDialog from "../../MultipleDocumentUpload/DocumentAttachmentDialog";
import useDelayHandler from "../../../hooks/useDelayHandler";
import DelayPopup from "../../../components/comman/DelayPopup";

const CubeTestResultForm = ({
    cubeTestData = {},
    turbine,
    cubeSamplesGet = [],
    rowsCubeResult = [],
    inspectors = [],
    index,
    onCubeTestChange,
    contractors = [],
    attachmentList = [],

    delayCauses,
    onDelaySubmit,
    kpiStatus,
    // loading = false,
}) => {
    const formData = cubeTestData || {};

    useEffect(() => {
        if (turbine && formData.turbine !== turbine) {
            onCubeTestChange(index, "turbine", turbine);
            // onCubeTestChange(index, "cube_id", "");
        }
    }, [turbine]);

    // ================= 1. DELAY HANDLING DEPENDENCY =================
    const {
        delayOpen,
        delayData,
        delaySaved,
        checkDelay,
        handleDelaySubmit,
        openDelayPopup,
        closeDelayPopup,
        clearDelay,
    } = useDelayHandler({
        // getActivePlan: getActivePlan,
        activityCode: "CUBE_RESULT",
        onDelaySubmit,
    });


    const selectedSample = cubeSamplesGet.find(
        (s) => Number(s.id) === Number(formData.cube_id),
    );
    // ==========================================================

    const completedDaysForSample = useMemo(() => {
        // 1. Ensure both turbine and cube_id (sample) are selected before calculating
        if (!turbine || !formData.cube_id) return [];

        return (
            rowsCubeResult
            .filter((res) => {
                // Match turbine ID
                const matchesTurbine =
                    Number(res.project_id ? res.turbine_id : res.turbine) ===
                    Number(turbine);

                // Match sample ID (handles res.cube_id or res.cube_id_id based on your API structure)
                const resSampleId = res.cube_id_id || res.cube_id;
                const matchesSample =
                    String(resSampleId) === String(formData.cube_id);

                // Match completed status
                const isCompleted = res.cr_status ? .toLowerCase() === "completed";

                return matchesTurbine && matchesSample && isCompleted;
            })
            // Extract the test days (e.g., '7 Days') to compile the disabled list
            .map((res) => res.no_of_days_test)
        );
    }, [rowsCubeResult, turbine, formData.cube_id]);

    const minCompletionDate = useMemo(() => {
        if (!turbine || !formData.cube_id || !formData.no_of_days_test) return "";

        const relatedRecords = rowsCubeResult.filter((res) => {
            const dbTurbineId = res.turbine_id || res.turbine;
            const dbSampleId = res.cube_id_id || res.cube_id;
            return (
                Number(dbTurbineId) === Number(turbine) &&
                Number(dbSampleId) === Number(formData.cube_id) &&
                res.cr_status ? .toLowerCase() === "completed"
            );
        });

        let targetPreviousDay = "";
        if (formData.no_of_days_test === "14 Days") targetPreviousDay = "7 Days";
        if (formData.no_of_days_test === "21 Days") targetPreviousDay = "14 Days";
        if (formData.no_of_days_test === "28 Days") targetPreviousDay = "21 Days";

        if (!targetPreviousDay) return "";

        const previousRecord = relatedRecords.find(
            (res) => res.no_of_days_test === targetPreviousDay,
        );

        if (previousRecord && previousRecord.completion_date) {
            const prevDate = new Date(previousRecord.completion_date);
            // Add 7 days to get the earliest allowed window
            prevDate.setDate(prevDate.getDate() + 7);

            const today = new Date();

            // IF the calculated date is greater than today, it's a future date window
            if (prevDate > today) {
                // Return a special flag string to signal the UI to block this input entirely
                return "FUTURE_RESTRICTED";
            }

            return prevDate.toISOString().split("T")[0];
        }

        return "";
    }, [rowsCubeResult, turbine, formData.cube_id, formData.no_of_days_test]);

    // ================= 3. EVENT LIFECYCLE HANDLERS =================
    // const handleChange = (e) => {
    //   const { name, value, type, files } = e.target;
    //   const val = type === "file" ? files[0] : value;

    //   onCubeTestChange(index, name, val);

    //   if (name === "turbine") {
    //     clearDelay();
    //     onCubeTestChange(index, "cube_id", ""); // Reset sample selector on location flip
    //     if (formData.completion_date) {
    //       checkDelay(formData.completion_date, val);
    //     }
    //   }

    //    if (name === "turbine") {
    //      clearDelay();

    //      onCubeTestChange(index, "cube_id", "");

    //      // If date already selected then check delay
    //      if (formData.completion_date) {
    //        const selectedTurbine = turbines.find(
    //          (t) => Number(t.id) === Number(value),
    //        );

    //        if (selectedTurbine) {
    //          checkDelay(
    //            formData.completion_date,
    //            value,
    //            selectedTurbine.project_id || selectedTurbine.project,
    //            selectedTurbine.windfarm_id || selectedTurbine.windfarm,
    //          );
    //        }
    //      }

    //      return;
    //    }

    //   // if (name === "completion_date") {
    //   //   if (!turbine) return;
    //   //   checkDelay(val, turbine);
    //   // }

    //     if (name === "completion_date") {
    //       if (!formData.turbine) {
    //         return;
    //       }

    //       const selectedTurbine = turbines.find(
    //         (t) => Number(t.id) === Number(formData.turbine),
    //       );

    //       if (selectedTurbine) {
    //         checkDelay(
    //           val,
    //           formData.turbine,
    //           selectedTurbine.project_id || selectedTurbine.project,
    //           selectedTurbine.windfarm_id || selectedTurbine.windfarm,
    //         );
    //       }
    //     }

    // };

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            files
        } = e.target;
        const val = type === "file" ? files[0] : value;

        onCubeTestChange(index, name, val);

        // Create a local helper to group the context parameters
        const getCubeDelayContext = (overrides = {}) => ({
            no_of_days_test: overrides.no_of_days_test ? ? formData.no_of_days_test,
            cube_id: overrides.cube_id ? ? formData.cube_id,
        });

        // Turbine change
        if (name === "turbine") {
            clearDelay();
            onCubeTestChange(index, "cube_id", "");

            if (formData.completion_date) {
                checkDelay(
                    formData.completion_date,
                    value,
                    formData.cr_status,
                    getCubeDelayContext({
                        cube_id: ""
                    })
                );
            }
            return;
        }

        // Cube Sample change
        if (name === "cube_id") {
            clearDelay();
            if (formData.completion_date && formData.turbine) {
                checkDelay(
                    formData.completion_date,
                    formData.turbine,
                    formData.cr_status,
                    getCubeDelayContext({
                        cube_id: val
                    })
                );
            }
            return;
        }

        // Test Interval Days change (e.g., switching between 7 Days and 14 Days)
        if (name === "no_of_days_test") {
            if (formData.completion_date && formData.turbine && formData.cube_id) {
                checkDelay(
                    formData.completion_date,
                    formData.turbine,
                    formData.cr_status,
                    getCubeDelayContext({
                        no_of_days_test: val
                    })
                );
            }
            return;
        }

        // Completion date change
        if (name === "completion_date") {
            if (!formData.turbine || !formData.cube_id || !formData.no_of_days_test) {
                return;
            }

            checkDelay(val, formData.turbine, formData.cr_status, getCubeDelayContext());
            return;
        }

        // Status change
        if (name === "cr_status") {
            if (formData.completion_date && formData.turbine && formData.cube_id) {
                checkDelay(formData.completion_date, formData.turbine, val, getCubeDelayContext());
            }
        }
    };

    const handleRemovePhoto = () => {
        onCubeTestChange(index, "evidence_photo", null);
    };

    return ( <
        Box sx = {
            {
                p: 2,
                maxWidth: "lg",
                mx: "auto"
            }
        } > {!turbine ? ( <
                Box sx = {
                    {
                        textAlign: "center",
                        py: 5,
                        border: "2px dashed #e2e8f0",
                        borderRadius: 2,
                        bgcolor: "#fcfcfc",
                    }
                } >
                <
                ScienceIcon sx = {
                    {
                        fontSize: 36,
                        mb: 1,
                        color: "text.disabled"
                    }
                }
                /> <
                Typography variant = "body2"
                color = "text.secondary" >
                Select an active location coordinate and specimen tag to execute compression testing records. <
                /Typography> <
                /Box>
            ) : ( <
                Paper variant = "outlined"
                sx = {
                    {
                        p: 3,
                        borderRadius: 2,
                        bgcolor: "#fff"
                    }
                } >
                <
                Typography variant = "body2"
                color = "text.secondary"
                mb = {
                    3
                } >
                Compressive Strength Verification & Lab Certification <
                /Typography>

                <
                Grid container spacing = {
                    2
                } >
                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth label = "Cube Sample"
                value = {
                    selectedSample ? .sample_id || ""
                }
                InputProps = {
                    {
                        readOnly: true,
                    }
                }
                size = "small" /
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
                TextField select fullWidth label = "No of Days Test"
                name = "no_of_days_test"
                placeholder = "e.g. 7, 28 days"
                value = {
                    formData.no_of_days_test || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                disabled = {!turbine
                } // Keep disabled until turbine is picked
                >
                {
                    CUBE_TEST_RESULT_DAYS.map((option) => {
                        // Check if this specific interval has already been finalized
                        const isAlreadyCompleted = completedDaysForSample.includes(
                            option.value,
                        );

                        return ( <
                            MenuItem key = {
                                option.value
                            }
                            value = {
                                option.value
                            }
                            disabled = {
                                isAlreadyCompleted
                            } // Disables the option in the dropdown list
                            sx = {
                                {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }
                            } >
                            <
                            span > {
                                option.label
                            } < /span> {
                                isAlreadyCompleted && ( <
                                    Typography variant = "caption"
                                    color = "error.main"
                                    sx = {
                                        {
                                            fontWeight: "bold",
                                            ml: 1
                                        }
                                    } >
                                    (Completed) <
                                    /Typography>
                                )
                            } <
                            /MenuItem>
                        );
                    })
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
                TextField fullWidth type = "date"
                label = "Completion Date"
                name = "completion_date"
                InputLabelProps = {
                    {
                        shrink: true
                    }
                }
                inputProps = {
                    {
                        // If it's a valid date string, use it; otherwise clear constraint
                        min: minCompletionDate !== "FUTURE_RESTRICTED" ?
                            minCompletionDate :
                            "",
                        max: new Date().toISOString().split("T")[0], // Strictly blocks future dates
                    }
                }
                // Disable if no interval selected OR if the required 7-day gap falls in the future
                disabled = {!formData.no_of_days_test ||
                    minCompletionDate === "FUTURE_RESTRICTED"
                }
                value = {
                    minCompletionDate === "FUTURE_RESTRICTED" ?
                    "" :
                        formData.completion_date || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                error = {
                    minCompletionDate === "FUTURE_RESTRICTED"
                }
                helperText = {
                    minCompletionDate === "FUTURE_RESTRICTED" ?
                    "Testing window not reached yet (Must be 7 days post previous test)." :
                        ""
                }
                /> <
                /Grid>

                { /* TEST RESULT */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                NumberTextField fullWidth required label = "Test Result"
                name = "test_result"
                value = {
                    formData.test_result || ""
                }
                onChange = {
                    handleChange
                }
                error = {!formData.test_result || isNaN(formData.test_result)
                }
                helperText = {!formData.test_result ?
                    "Test Result is required *" :
                        isNaN(formData.test_result) ?
                        "Only numbers are allowed" :
                        ""
                }
                size = "small"
                InputProps = {
                    {
                        endAdornment: ( <
                            InputAdornment position = "end" > N / mm² < /InputAdornment>
                        ),
                    }
                }
                /> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth required label = "Cube Size / Dimension"
                name = "cube_size_dimension"
                placeholder = "e.g. 150x150x150 mm"
                value = {
                    formData.cube_size_dimension || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                error = {!formData.cube_size_dimension ||
                    isNaN(formData.cube_size_dimension)
                }
                helperText = {!formData.cube_size_dimension ?
                    "Cube size is required *" :
                        isNaN(formData.cube_size_dimension) ?
                        "Only numbers are allowed" :
                        ""
                }
                /> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                NumberTextField fullWidth required type = "number"
                label = "Cube Weight"
                name = "cube_weight"
                value = {
                    formData.cube_weight || ""
                }
                onChange = {
                    handleChange
                }
                error = {!!kpiStatus ? .isError
                }
                // 3. DYNAMIC MESSAGE
                // This shows the 'msg' column directly from your database
                // helperText={
                //   kpiStatus?.isError
                //     ? `${kpiStatus.msg} (Input: ${kpiStatus.actual})`
                //     : `Accepted Range: ${kpiStatus?.min} - ${kpiStatus?.max}`
                // }
                size = "small"
                // error={!formData.cube_weight || isNaN(formData.cube_weight)}
                helperText = {!formData.cube_weight ?
                    "Cube Weight is required *" :
                        isNaN(formData.cube_weight) ?
                        "Only numbers are allowed" :
                        ""
                }
                /> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth required label = "Testing Lab Details"
                name = "testing_lab_details"
                value = {
                    formData.testing_lab_details || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                error = {!formData.testing_lab_details
                }
                helperText = {!formData.testing_lab_details ?
                    "Testing Lab Details is required *" :
                        ""
                }
                /> <
                /Grid> <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField fullWidth label = "Witness / Client Rep"
                name = "witness_client_representative"
                value = {
                    formData.witness_client_representative || ""
                }
                onChange = {
                    handleChange
                }
                size = "small" /
                >
                <
                /Grid>

                { /* PERSONNEL */ } <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth label = "Completed By"
                name = "completed_by"
                value = {
                    formData.completed_by || ""
                }
                onChange = {
                    handleChange
                }
                size = "small" >
                {
                    contractors.map((c) => ( <
                        MenuItem key = {
                            c.id
                        }
                        value = {
                            c.id
                        } > {
                            c.firm_name
                        }({
                            c.contact_person
                        }) <
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
                TextField select fullWidth required label = "Civil Engineer"
                name = "inspector"
                value = {
                    formData.inspector || ""
                }
                onChange = {
                    handleChange
                }
                size = "small"
                error = {!formData.inspector
                }
                helperText = {!formData.inspector === "" ? "Engineer is required *" : ""
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

                <
                Grid item xs = {
                    12
                }
                md = {
                    3
                } >
                <
                TextField select fullWidth label = "Acceptance Criteria"
                name = "acceptance_criteria"
                placeholder = "e.g. Min 35 N/mm²"
                value = {
                    formData.acceptance_criteria || ""
                }
                onChange = {
                    handleChange
                }
                size = "small" >
                {
                    PASS_FAIL_OPTIONS.map((opt) => ( <
                        MenuItem key = {
                            opt.value
                        }
                        value = {
                            opt.value
                        } > {
                            opt.label
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
                TextField select fullWidth label = "Status *"
                name = "cr_status"
                value = {
                    formData.cr_status || "completed"
                }
                InputProps = {
                    {
                        readOnly: true
                    }
                }
                onChange = {
                    handleChange
                }
                size = "small"
                required >
                <
                MenuItem value = "completed" > Completed < /MenuItem> <
                /TextField> <
                /Grid>

                <
                Grid item xs = {
                    12
                } >
                <
                TextField fullWidth multiline rows = {
                    2
                }
                label = "Remark"
                name = "remark"
                value = {
                    formData.remark || ""
                }
                onChange = {
                    handleChange
                }
                size = "small" /
                >
                <
                /Grid>

                { /* --- EVIDENCE PHOTO UPLOAD --- */ } <
                Grid item xs = {
                    12
                }
                md = {
                    4
                } >
                <
                Box sx = {
                    {
                        p: 2,
                        border: "1px dashed",

                        borderRadius: 1,
                    }
                } >
                <
                Button component = "label"
                variant = "outlined"
                startIcon = { < UploadIcon / >
                }
                size = "small" >
                Upload Photo <
                input type = "file"
                hidden accept = "image/*"
                name = "evidence_photo"
                onChange = {
                    handleChange
                }
                /> <
                /Button>

                { /* Preview Section */ } {
                    formData.evidence_photo && ( <
                        Box mt = {
                            2
                        }
                        sx = {
                            {
                                position: "relative",
                                width: 220,
                            }
                        } >
                        <
                        img src = {
                            typeof formData.evidence_photo === "string" ?
                            formData.evidence_photo :
                                URL.createObjectURL(formData.evidence_photo)
                        }
                        alt = "Evidence Preview"
                        style = {
                            {
                                width: "100%",
                                borderRadius: 8,
                                border: "1px solid #ccc",
                            }
                        }
                        />

                        { /* Remove Button */ } <
                        IconButton size = "small"
                        onClick = {
                            handleRemovePhoto
                        }
                        sx = {
                            {
                                position: "absolute",
                                top: -10,
                                right: -10,
                                bgcolor: "white",
                                boxShadow: 1,
                                "&:hover": {
                                    bgcolor: "error.main",
                                    color: "white"
                                },
                            }
                        } >
                        <
                        CloseIcon fontSize = "small" / >
                        <
                        /IconButton> <
                        /Box>
                    )
                } <
                /Box> <
                /Grid>

                <
                Grid item xs = {
                    12
                }
                md = {
                    8
                } > { /* REUSABLE POPUP COMPONENT */ } {
                    /* <DocumentAttachmentDialog
                                    activityCode="CUBE_RESULT"
                                    attachmentMasterList={attachmentMasterList}
                                    formData={formData}
                                    onDataChange={(field, value) =>
                                      onCubeTestChange(index, field, value)
                                    }
                                    // onDataChange={onCubeTestChange}
                                  /> */
                } <
                DocumentAttachmentDialog activityCode = "CUBE_RESULT"
                attachmentMasterList = {
                    attachmentList
                }
                formData = {
                    formData
                }
                onDataChange = {
                    (field, value) =>
                    onCubeTestChange(index, field, value)
                }
                /> <
                /Grid>

                {
                    delayData && !delayOpen && ( <
                        Grid item xs = {
                            12
                        } >
                        <
                        Alert severity = "warning"
                        action = { <
                            Button
                            color = "inherit"
                            size = "small"
                            onClick = {
                                openDelayPopup
                            }
                            sx = {
                                {
                                    border: "1px solid #f59e0b",
                                    backgroundColor: "#fff7ed",
                                }
                            } >
                            View Delay <
                            /Button>
                        } >
                        This activity is delayed by <
                        strong > {
                            delayData.delay_days
                        } < /strong>
                        days. <
                        /Alert> <
                        /Grid>
                    )
                }

                { /* INFO */ } <
                Grid item xs = {
                    12
                } >
                <
                Alert severity = {
                    Number(formData.test_result) >= 35 ? "success" : "info"
                }
                sx = {
                    {
                        mt: 1
                    }
                } >
                Strength should be verified against the design grade(M35, M40,
                    etc.) specified
                for the project. <
                /Alert> <
                /Grid> <
                /Grid> {
                    /* <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                      <Button
                                        variant="contained"
                                onClick={onSubmitCubeResult}
                                      // disabled={disabled}
                                      >
                                        Submit
                                      </Button>
                                    </Box>
                            */
                } <
                /Paper>
            )
        }

        { /* ================= CORE SYSTEM POPUPS DICTIONARY ================= */ } <
        DelayPopup open = {
            delayOpen
        }
        onClose = {
            closeDelayPopup
        }
        delayData = {
            delayData
        }
        delayCauses = {
            delayCauses
        }
        onSubmit = {
            handleDelaySubmit
        }
        /> <
        /Box>
    );
};;

export default CubeTestResultForm;