// utils/kpiFieldConfigs.js

export const getFormKpiFields = (activityType, formData = {}, rows = []) => {
    switch (activityType) {
        case "EXC": // Excavation Form
            return [{
                    id: "exc_vol",
                    field: "volume_m3",
                    state: formData.volume_m3,
                    rows: rows,
                    type: "cumulative",
                },
                {
                    id: "exc_depth",
                    field: "depth_meters",
                    state: formData.depth_meters,
                    rows: rows,
                    type: "progressive",
                },
            ];

        case "SOIL": // Soil Form
            return [{
                    id: "soil_sbc",
                    field: "soil_bearing_capacity",
                    state: formData.soil_bearing_capacity,
                    rows: rows,
                    type: "max",
                },
                {
                    id: "soil_water_t_depth",
                    field: "water_table_depth",
                    state: formData.water_table_depth,
                    rows: rows,
                    type: "max",
                },
            ];

        case "REINF": // Reinforcement Form
            return [{
                id: "reinf_qty",
                field: "quantity_reinforcement",
                state: formData.quantity_reinforcement,
                rows: rows,
                type: "cumulative",
            }, ];

        case "POUR": // Pouring Card Form
            return [{
                id: "pour_qty",
                field: "quantity_delivered",
                state: formData.quantity_delivered,
                rows: rows,
                type: "max",
            }, ];

        case "ANCHOR": // Anchor Cage Form
            return [{
                id: "anchor_torque",
                field: "torquing",
                state: formData.torquing,
                rows: rows,
                type: "min",
            }, ];

        case "CASTING": // Foundation Casting Form
            return [{
                id: "found_vol",
                field: "foundation_volume",
                state: formData.foundation_volume,
                rows: rows,
                type: "cumulative",
            }, ];

        default:
            return [];
    }
};