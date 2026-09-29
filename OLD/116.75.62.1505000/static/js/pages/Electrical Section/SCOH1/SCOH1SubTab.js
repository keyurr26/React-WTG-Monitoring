import React, {
    useState
} from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography
} from "@mui/material";
import SCOHL1 from "./SCOHL1.js";

import PoleMaterialGrid from "./SCOHPoleMaterialGrid.js";
import DynamicPoleTable from "./SCOHPoleTabsindex.js";
import SCOHL3 from "./SCOHL3.js";
import SCOHFinal from "./SCOHFinal.js";

import {
    MdFilter1,
    MdFilter2,
    MdFilter3,
    MdCheckCircle
} from "react-icons/md";

function TabPanel({
    children,
    value,
    index
}) {
    return ( <
        div role = "tabpanel"
        hidden = {
            value !== index
        } > {
            value === index && < Box sx = {
                {
                    py: 2
                }
            } > {
                children
            } < /Box>} <
            /div>
        );
    }
    const SCOH1SubTab = ({
            filters
        }) => {
            const [value, setValue] = useState(0);

            const handleChange = (event, newValue) => {
                setValue(newValue);
            };

            return ( <
                    Box sx = {
                        {
                            width: "100%"
                        }
                    } >
                    <
                    Tabs value = {
                        value
                    }
                    onChange = {
                        handleChange
                    }
                    centered aria - label = "sub-level electrical tabs"
                    sx = {
                        {
                            "& .MuiTabs-flexContainer": {
                                gap: "4px",
                            },
                            "& .MuiTab-root": {
                                minHeight: 40,
                                fontWeight: 600,
                                textTransform: "none",
                                border: "1px solid #d1d1d1",
                                borderRadius: "16px", // Your requested 16px radius
                                margin: "4px",
                                padding: "6px 16px",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: "8px", // Space between icon and text
                                transition: "0.2s",
                                color: "text.secondary",
                                "& .MuiTab-iconWrapper": {
                                    margin: 0,
                                },
                            },

                            "& .Mui-selected": {
                                backgroundColor: "#e3f2fd",
                                border: "1px solid #1976d2",
                                color: "#1976d2 !important",
                            },

                            "& .MuiTab-root:hover": {
                                backgroundColor: "#f5f5f5",
                            },

                            "& .MuiTabs-indicator": {
                                display: "none",
                            },
                        }
                    } >
                    <
                    Tab label = "L1"
                    icon = { < MdFilter1 size = {
                            18
                        }
                        />} iconPosition="start" / >
                        <
                        Tab label = "L2"
                        icon = { < MdFilter2 size = {
                                18
                            }
                            />} iconPosition="start" / >
                            <
                            Tab label = "L3"
                            icon = { < MdFilter3 size = {
                                    18
                                }
                                />} iconPosition="start" / >
                                <
                                Tab
                                label = "Final"
                                icon = { < MdCheckCircle size = {
                                        18
                                    }
                                    />}
                                    iconPosition = "start" /
                                    >
                                    <
                                    /Tabs>

                                    <
                                    Box sx = {
                                        {
                                            mt: 1
                                        }
                                    } >
                                    <
                                    TabPanel value = {
                                        value
                                    }
                                    index = {
                                        0
                                    } >
                                    <
                                    SCOHL1 filters = {
                                        filters
                                    }
                                    /> <
                                    /TabPanel>

                                    <
                                    TabPanel value = {
                                        value
                                    }
                                    index = {
                                        1
                                    } >
                                    <
                                    PoleMaterialGrid / >
                                    <
                                    DynamicPoleTable filters = {
                                        filters
                                    }
                                    /> <
                                    /TabPanel>

                                    <
                                    TabPanel value = {
                                        value
                                    }
                                    index = {
                                        2
                                    } >
                                    <
                                    SCOHL3 filters = {
                                        filters
                                    }
                                    /> <
                                    /TabPanel>

                                    <
                                    TabPanel value = {
                                        value
                                    }
                                    index = {
                                        3
                                    } >
                                    <
                                    SCOHFinal filters = {
                                        filters
                                    }
                                    /> <
                                    /TabPanel> <
                                    /Box> <
                                    /Box>
                                );
                            };

                            export default SCOH1SubTab;