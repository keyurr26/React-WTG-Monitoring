import React, {
    useState,
    useEffect
} from "react";

export const STAGE_OPTIONS = [{
        label: "Soil Evaluation",
        value: "soil"
    },
    {
        label: "Excavation",
        value: "excavation"
    },
    {
        label: "PCC Layer",
        value: "pcc"
    },
    {
        label: "Conduct Laying",
        value: "conduct"
    },
    {
        label: "Anchor Cage",
        value: "anchor"
    },
    {
        label: "Reinforcement",
        value: "reinforcement"
    },
    {
        label: "Foundation",
        value: "foundation"
    },
    {
        label: "Pouring Card",
        value: "pouring"
    },
    {
        label: "Deshuttering",
        value: "deshutter"
    }, // matches backend
    {
        label: "Cube Test",
        value: "cube"
    },
    {
        label: "Backfilling",
        value: "backfill"
    }, // matches backend
    {
        label: "Platform DPR",
        value: "platform"
    },
    {
        label: "T1 Installation",
        value: "t1"
    },
    {
        label: "Tower Installation",
        value: "tower"
    },
    {
        label: "Nacelle Installation",
        value: "nacelle"
    },
    {
        label: "Rotor Hub",
        value: "rotor"
    },
    {
        label: "Blade Installation",
        value: "blade"
    },
    {
        label: "USS",
        value: "uss"
    },
    {
        label: "Commissioning",
        value: "commissioning"
    },
];

export default function StageFilterWidget({
    model,
    triggerModelUpdate
}) {
    const [selectedStages, setSelectedStages] = useState(model ? .selectedStages || []);

    useEffect(() => {
        if (model ? .selectedStages) {
            setSelectedStages(model.selectedStages);
        }
    }, [model ? .selectedStages]);

    const handleToggle = (value) => {
        const updated = selectedStages.includes(value) ?
            selectedStages.filter((item) => item !== value) :
            [...selectedStages, value];

        setSelectedStages(updated);
        if (triggerModelUpdate) triggerModelUpdate({
            selectedStages: updated
        });
    };

    const handleClear = () => {
        setSelectedStages([]);
        if (triggerModelUpdate) triggerModelUpdate({
            selectedStages: []
        });
    };

    return ( <
        div style = {
            {
                padding: "16px 20px",
                fontFamily: "Inter, sans-serif",
                background: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }
        } >
        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12
            }
        } >
        <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }
        } >
        <
        strong style = {
            {
                fontSize: "14px",
                color: "#1e293b"
            }
        } > Select a stage to apply the filter and download the selected stage data. < /strong> {
            selectedStages.length > 0 && ( <
                span style = {
                    {
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#00308a",
                        background: "#e3f2fd",
                        padding: "2px 8px",
                        borderRadius: "12px"
                    }
                } > {
                    selectedStages.length
                }
                active <
                /span>
            )
        } <
        /div> <
        button onClick = {
            handleClear
        }
        style = {
            {
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: "500",
                cursor: "pointer",
                background: "#f8fafc",
                color: "#64748b",
                border: "1px solid #b3b3b3ff",
                borderRadius: "6px",
                transition: "all 0.2s",
            }
        } >
        Clear All <
        /button> <
        /div>

        { /* 8-Column Grid Layout with Check Ticks */ } <
        div style = {
            {
                display: "grid",
                gridTemplateColumns: "repeat(10, minmax(0, 1fr))",
                gap: "8px",
            }
        } >
        {
            STAGE_OPTIONS.map((opt) => {
                const isSelected = selectedStages.includes(opt.value);
                return ( <
                    div key = {
                        opt.value
                    }
                    onClick = {
                        () => handleToggle(opt.value)
                    }
                    style = {
                        {
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: isSelected ? "600" : "500",
                            cursor: "pointer",
                            padding: "10px 6px",
                            background: isSelected ? "#e3f2fd" : "#f8fafc",
                            border: "1px solid",
                            borderColor: isSelected ? "#00308a" : "#e2e8f0",
                            color: isSelected ? "#00308a" : "#1d2531ff",
                            fontWeight: "600",
                            borderRadius: "6px",
                            userSelect: "none",
                            transition: "all 0.15s ease-in-out",
                            boxShadow: isSelected ? "0 2px 4px rgba(0,48,138,0.08)" : "none",
                        }
                    } >
                    {
                        isSelected && ( <
                            span style = {
                                {
                                    fontSize: "11px",
                                    fontWeight: "bold",
                                    lineHeight: 1
                                }
                            } > ✓
                            <
                            /span>
                        )
                    } <
                    span style = {
                        {
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }
                    } > {
                        opt.label
                    } <
                    /span> <
                    /div>
                );
            })
        } <
        /div> <
        /div>
    );
}