import React, {
    useState
} from "react";
import {
    Box,
    Tabs,
    Tab,
    Typography
} from "@mui/material";
import SCOH1DogL1 from "./L1.js";
// import Level2MaterialTable from "./L2.js";

import Level3Table from "./L3.js";
import FinalLevelTable from "./Final.js";
import PoleMaterialGrid from "./PoleMaterialGrid.js";
import DynamicPoleTable from "./PoleTabsindex.js";
// React Iconsf
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
            value === index && ( <
                Box sx = {
                    {
                        py: 2
                    }
                } > {
                    children
                } <
                /Box>
            )
        } <
        /div>
    );
}
const SCOH1DogSubTab = ({
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
                variant = "scrollable"
                scrollButtons = "auto"
                TabIndicatorProps = {
                    {
                        sx: {
                            display: "none"
                        }
                    }
                }
                sx = {
                    {
                        mt: -1,

                        "& .MuiTabs-flexContainer": {
                            gap: 1,
                            justifyContent: "center",
                        },
                    }
                } >
                {
                    [{
                            label: "L1",
                            icon: < MdFilter1 size = {
                                18
                            }
                            /> }, {
                                label: "L2",
                                icon: < MdFilter2 size = {
                                    18
                                }
                                /> }, {
                                    label: "L3",
                                    icon: < MdFilter3 size = {
                                        18
                                    }
                                    /> }, {
                                        label: "Final",
                                        icon: < MdCheckCircle size = {
                                            18
                                        }
                                        /> },
                                    ].map((tab, index) => {
                                        const isActive = value === index;

                                        return ( <
                                            Tab key = {
                                                tab.label
                                            }
                                            disableRipple label = { <
                                                Box
                                                sx = {
                                                    {
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }
                                                } >
                                                {
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
                                                    minHeight: 40,
                                                    minWidth: 95,
                                                    px: 2,
                                                    py: 0.8,

                                                    borderRadius: "10px",
                                                    border: "2px solid",

                                                    borderColor: isActive ?
                                                        "#3b82f6" :
                                                        "#cbd5e1",

                                                    color: isActive ?
                                                        "#abf63b" :
                                                        "#475569",

                                                    backgroundColor: isActive ?
                                                        "#eff6ff" :
                                                        "#fff",

                                                    transition: "all 0.25s ease",

                                                    "&.Mui-selected": {
                                                        transform: "translateY(-1px)",
                                                        boxShadow: "0 3px 8px rgba(59,130,246,0.18)",
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
                                SCOH1DogL1 filters = {
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
                                Level3Table filters = {
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
                                FinalLevelTable filters = {
                                    filters
                                }
                                /> <
                                /TabPanel> <
                                /Box> <
                                /Box>
                            );
                        };

                        export default SCOH1DogSubTab;