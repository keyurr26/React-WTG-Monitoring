import React, {
    useState
} from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography,
    Paper
} from "@mui/material";

import {
    FaGripLinesVertical
} from "react-icons/fa6";
import {
    MdLineWeight,
    MdLinearScale
} from "react-icons/md";
import {
    GiWindTurbine
} from "react-icons/gi";

import SCOH1DogSubTab from "./Scoh1dog/SCOH1DogSubTab";
import SCOH1SubTab from "./SCOH1/SCOH1SubTab";
import DCOHSubTab from "./DCOH1/DCOHSubTab";
import MCOH1SubTab from "./MCOH1/MCOH1SubTab";

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
                    py: 3
                }
            } > {
                children
            } < /Box>} <
            /div>
        );
    }

    const ElectricalTabPage = ({
            filters,
            setFilters,
            electricalSubTab,
            setElectricalSubTab,
        }) => {
            const handleChange = (event, newValue) => {
                setElectricalSubTab(newValue);
            };

            return ( <
                    Box sx = {
                        {
                            width: "100%"
                        }
                    } > { /* Tabs */ }

                    <
                    Tabs value = {
                        electricalSubTab
                    }
                    onChange = {
                        handleChange
                    }
                    variant = "scrollable"
                    scrollButtons = "auto"
                    TabIndicatorProps = {
                        {
                            sx: {
                                height: 0
                            }
                        }
                    }
                    sx = {
                        {
                            mt: -1.5,
                            "& .MuiTabs-flexContainer": {
                                gap: 1,
                                justifyContent: "center",
                            },
                        }
                    } >
                    {
                        [{
                                label: "SCOH Dog",
                                icon: < GiWindTurbine size = {
                                    20
                                }
                                /> }, {
                                    label: "SCOH Panther",
                                    icon: < MdLinearScale size = {
                                        20
                                    }
                                    /> }, {
                                        label: "DCOH",
                                        icon: < FaGripLinesVertical size = {
                                            18
                                        }
                                        /> }, {
                                            label: "MCOH",
                                            icon: < MdLineWeight size = {
                                                20
                                            }
                                            /> },
                                        ].map((tab, index) => {
                                            const isActive = electricalSubTab === index;

                                            return ( <
                                                Tab key = {
                                                    tab.label
                                                }
                                                disableRipple label = { <
                                                    Box sx = {
                                                        {
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1
                                                        }
                                                    } > {
                                                        tab.icon
                                                    } {
                                                        tab.label
                                                    } <
                                                    /Box>
                                                }
                                                sx = {
                                                    {
                                                        textTransform: "none",
                                                        fontWeight: 600,
                                                        fontSize: "0.85rem",
                                                        borderRadius: 8,
                                                        border: "2px solid",
                                                        borderColor: isActive ? "#3b82f6" : "#3954b7ff",
                                                        color: isActive ? "#3b82f6" : "#f34500ff",
                                                        px: 2.5,
                                                        py: 1,
                                                        minHeight: 40,
                                                        transition: "all 0.3s ease",

                                                        "&.Mui-selected": {
                                                            transform: "translateY(-1px)",
                                                        },

                                                        "&:hover": {
                                                            borderColor: "#3b82f6",
                                                            backgroundColor: "#f8fafc",
                                                        },
                                                    }
                                                }
                                                />
                                            );
                                        })
                                    } <
                                    /Tabs>

                                    { /* Content */ } <
                                    Box sx = {
                                        {
                                            px: {
                                                xs: 2,
                                                md: 4
                                            }
                                        }
                                    } >
                                    <
                                    TabPanel value = {
                                        electricalSubTab
                                    }
                                    index = {
                                        0
                                    } >
                                    <
                                    SCOH1DogSubTab filters = {
                                        filters
                                    }
                                    /> {/ * optional pass * /} <
                                    /TabPanel>

                                    <
                                    TabPanel value = {
                                        electricalSubTab
                                    }
                                    index = {
                                        1
                                    } >
                                    <
                                    SCOH1SubTab filters = {
                                        filters
                                    }
                                    /> <
                                    /TabPanel>

                                    <
                                    TabPanel value = {
                                        electricalSubTab
                                    }
                                    index = {
                                        2
                                    } >
                                    <
                                    DCOHSubTab filters = {
                                        filters
                                    }
                                    /> <
                                    /TabPanel>

                                    <
                                    TabPanel value = {
                                        electricalSubTab
                                    }
                                    index = {
                                        3
                                    } >
                                    <
                                    MCOH1SubTab filters = {
                                        filters
                                    }
                                    /> <
                                    /TabPanel> <
                                    /Box> <
                                    /Box>
                                );
                            };

                            export default ElectricalTabPage;