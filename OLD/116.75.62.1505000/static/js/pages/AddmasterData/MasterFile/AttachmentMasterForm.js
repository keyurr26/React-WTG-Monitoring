import React, {
    useState,
    useEffect
} from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Switch,
    FormControlLabel,
    Button,
    Grid,
    Paper,
    Typography,
    Divider,
    Stack,
    Checkbox,
    ListItemText,
    OutlinedInput,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    useDispatch,
    useSelector
} from 'react-redux';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import {
    CreateAttachmentMasterData,
    GetComponentTypesList
} from '../../../Redux/MasterData/masterAction';
import AdminAttachmentTable from '../tables/AdminAttachmentTable';

const AttachmentMasterForm = () => {
    const dispatch = useDispatch();
    const {
        componentTypesList = []
    } = useSelector((state) => state.masterData);

    const initialFormState = {
        activities: [], // Changed to array for multiple selection
        file_type: '',
        file_name: '',
        is_active: true,
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (e) => {
        const {
            name,
            value,
            checked,
            type
        } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Special handler for the multi-select activities
    const handleActivityChange = (event) => {
        const {
            value
        } = event.target;
        setFormData(prev => ({
            ...prev,
            activities: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    useEffect(() => {

        dispatch(GetComponentTypesList());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validation: Ensure at least one activity is selected
            if (formData.activities.length === 0) {
                alert("Please select at least one activity.");
                return;
            }

            // Loop through each selected activity and create a separate entry
            const submissionPromises = formData.activities.map((activityValue) => {
                const payload = {
                    activity: activityValue,
                    file_type: formData.file_type,
                    file_name: formData.file_name,
                    is_active: formData.is_active,
                };
                return dispatch(CreateAttachmentMasterData(payload));
            });

            // Wait for all requests to finish
            const results = await Promise.all(submissionPromises);

            // Check if all were successful
            const allSuccessful = results.every(res => res.success);

            if (allSuccessful) {
                alert(`Successfully saved ${formData.activities.length} configurations!`);
                setFormData(initialFormState);
            } else {
                alert("Some configurations failed to save. Please check the table.");
            }
        } catch (err) {
            console.error('Submission Fail', err);
            alert("An error occurred during submission.");
        }
    };

    const filteredComponentTypes = componentTypesList
        .filter((item) => item.type === "Attachment type");

    const filteredActivityTypes = componentTypesList
        .filter((item) => item.type === "ACTIVITY");

    return ( <
        Stack spacing = {
            4
        }
        sx = {
            {
                p: 4,
                maxWidth: 1200,
                mx: 'auto'
            }
        } >
        <
        Paper elevation = {
            3
        }
        sx = {
            {
                p: 4,
                borderRadius: 2
            }
        } >
        <
        Box display = "flex"
        alignItems = "center"
        mb = {
            2
        } >
        <
        CloudUploadIcon color = "primary"
        sx = {
            {
                mr: 1,
                fontSize: 30
            }
        }
        /> <
        Typography variant = "h5"
        fontWeight = "600" >
        Attachment Configuration <
        /Typography> <
        /Box>

        <
        Typography variant = "body2"
        color = "textSecondary"
        mb = {
            3
        } >
        Define required document types and link them to multiple site activities. <
        /Typography>

        <
        Divider sx = {
            {
                mb: 4
            }
        }
        />

        <
        Box component = "form"
        onSubmit = {
            handleSubmit
        } >
        <
        Grid container spacing = {
            3
        } >

        { /* File Type Dropdown (Format) */ } <
        Grid item xs = {
            12
        }
        sm = {
            3
        } >
        <
        TextField select fullWidth label = "Type of Document"
        name = "file_type"
        value = {
            formData.file_type
        }
        onChange = {
            handleChange
        }
        required >
        {
            filteredComponentTypes.map((option) => ( <
                MenuItem key = {
                    option.id
                }
                value = {
                    option.name
                } > {
                    option.name
                } <
                /MenuItem>
            ))
        } <
        /TextField> <
        /Grid>

        { /* Display Name (File Type Name) */ } <
        Grid item xs = {
            12
        }
        sm = {
            4
        } >
        <
        TextField fullWidth label = "File Type Name"
        name = "file_name"
        placeholder = "e.g., Concrete Pour Card"
        value = {
            formData.file_name
        }
        onChange = {
            handleChange
        }
        required helperText = "Label users see when uploading." /
        >
        <
        /Grid>

        { /* Multiple Activity Dropdown with Checkbox */ } {
            /* <Grid item xs={12} sm={5}>
                                        <FormControl fullWidth required>
                                            <InputLabel id="multiple-activity-label">Link to Activities</InputLabel>
                                            <Select
                                                labelId="multiple-activity-label"
                                                multiple
                                                name="activities"
                                                value={formData.activities}
                                                onChange={handleActivityChange}
                                                input={<OutlinedInput label="Link to Activities" />}
                                                renderValue={(selected) => {
                                                    // Map IDs back to Labels for display
                                                    return selected
                                                        .map(val => filteredActivityTypes.find(c => c.value === val)?.label)
                                                        .join(', ');
                                                }}
                                            >
                                                {filteredActivityTypes.map((option) => (
                                                    <MenuItem key={option.id} value={option.name}>
                                                        <Checkbox checked={formData.activities.indexOf(option.name) > -1} />
                                                        <ListItemText primary={option.label} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid> */
        }

        { /* Multiple Activity Dropdown with Checkbox */ } <
        Grid item xs = {
            12
        }
        sm = {
            5
        } >
        <
        FormControl fullWidth required >
        <
        InputLabel id = "multiple-activity-label" > Link to Activities < /InputLabel> <
        Select labelId = "multiple-activity-label"
        multiple name = "activities"
        value = {
            formData.activities
        }
        onChange = {
            handleActivityChange
        }
        input = { < OutlinedInput label = "Link to Activities" / >
        }
        renderValue = {
            (selected) => {
                // ✅ FIXED: Maps the selected code strings (e.g. 'SOIL') to UI display labels (e.g. 'Soil Testing')
                return selected
                    .map(val => {
                        const matchedObj = filteredActivityTypes.find(c => c.name === val);
                        return matchedObj ? matchedObj.label : val;
                    })
                    .join(', ');
            }
        } >
        {
            filteredActivityTypes.map((option) => ( <
                MenuItem key = {
                    option.id
                }
                value = {
                    option.name
                } > { /* ✅ FIXED: Correct check index reference matching key name string matching properties */ } <
                Checkbox checked = {
                    formData.activities.indexOf(option.name) > -1
                }
                /> <
                ListItemText primary = {
                    option.label
                }
                /> <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl> <
        /Grid>

        { /* Status Switch */ } <
        Grid item xs = {
            12
        } >
        <
        Box sx = {
            {
                bgcolor: 'action.hover',
                p: 1,
                borderRadius: 1,
                pl: 2
            }
        } >
        <
        FormControlLabel control = { <
            Switch
            name = "is_active"
            checked = {
                formData.is_active
            }
            onChange = {
                handleChange
            }
            color = "success" /
            >
        }
        label = {
            formData.is_active ? "Configuration Active" : "Configuration Inactive"
        }
        /> <
        /Box> <
        /Grid>

        { /* Action Buttons */ } <
        Grid item xs = {
            12
        }
        display = "flex"
        gap = {
            2
        }
        mt = {
            2
        } >
        <
        Button type = "submit"
        variant = "contained"
        size = "large"
        sx = {
            {
                px: 4,
                fontWeight: 'bold'
            }
        } >
        Save Configuration <
        /Button> <
        Button variant = "outlined"
        color = "inherit"
        onClick = {
            () => setFormData(initialFormState)
        } >
        Reset <
        /Button> <
        /Grid> <
        /Grid> <
        /Box> <
        /Paper>


        <
        AdminAttachmentTable filteredActivityTypes = {
            filteredActivityTypes
        }
        />

        <
        /Stack>
    );
};

export default AttachmentMasterForm;