import React, {
    useMemo
} from "react";
import {
    Box,
    Typography
} from "@mui/material";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Label
} from "recharts";

const MaterialAgingDashboard = ({
    data
}) => {


    const chartData = useMemo(() => {
        return data.map(item => ({
            unique_label: `${item.material_name}__${item.fifo_batch_id}`, // internal uniqueness
            name: item.material_name, // UI only shows material name
            aging_days: Number(item.aging_days),
            balance_qty: Number(item.balance_qty)
        }));
    }, [data]);

    // ⭐ Dynamic width for horizontal scroll
    const chartWidth = Math.max(chartData.length * 130, 900);

    // ⭐ Dynamic Y Axis max (adds headroom)
    const maxAging = Math.max(...chartData.map(d => d.aging_days || 0));
    const yAxisMax = Math.ceil(maxAging * 1.2);

    return ( <
        Box sx = {
            {
                overflowX: "auto"
            }
        } >
        <
        Box sx = {
            {
                width: chartWidth
            }
        } >

        <
        ResponsiveContainer width = "100%"
        height = {
            420
        } >
        <
        BarChart data = {
            chartData
        }
        margin = {
            {
                top: 30,
                bottom: 110,
                left: 20,
                right: 0
            }
        }
        barCategoryGap = "25%" >

        { /* ⭐ Gradient */ } <
        defs >
        <
        linearGradient id = "agingGradient"
        x1 = "0"
        y1 = "0"
        x2 = "0"
        y2 = "1" >
        <
        stop offset = "0%"
        stopColor = "#4facfe" / >
        <
        stop offset = "100%"
        stopColor = "#00f2fe" / >
        <
        /linearGradient> <
        /defs>

        <
        CartesianGrid strokeDasharray = "3 3"
        opacity = {
            0.3
        }
        />

        { /* ⭐ X Axis */ } <
        XAxis dataKey = "unique_label"
        tickFormatter = {
            (value) => value.split("__")[0]
        }
        angle = {-55
        }
        textAnchor = "end"
        interval = {
            0
        }
        // tick={{ fontSize: 12 }}
        >
        <
        Label value = "Material Name"
        position = "insideBottom"
        offset = {-90
        }
        style = {
            {
                fontWeight: 600
            }
        }
        /> <
        /XAxis>

        { /* ⭐ Y Axis */ } <
        YAxis domain = {
            [0, yAxisMax]
        }
        tick = {
            {
                fontSize: 12
            }
        } >
        <
        Label value = "Aging Days"
        angle = {-90
        }
        position = "insideLeft"
        style = {
            {
                textAnchor: "middle",
                fontWeight: 600
            }
        }
        /> <
        /YAxis>

        { /* ⭐ Tooltip */ } <
        Tooltip content = {
            ({
                active,
                payload,
                label
            }) => {
                if (!active || !payload || !payload.length) return null;

                const item = payload[0].payload;

                return ( <
                    Box sx = {
                        {
                            background: "white",
                            p: 1.5,
                            borderRadius: 2,
                            boxShadow: 3
                        }
                    } >
                    <
                    Typography fontWeight = {
                        600
                    } > {
                        label
                    } <
                    /Typography>

                    <
                    Typography variant = "body2" >
                    Aging: {
                        item.aging_days
                    }
                    Days <
                    /Typography>

                    <
                    Typography variant = "body2" >
                    Balance Qty: {
                        item.balance_qty
                    } <
                    /Typography> <
                    /Box>
                );
            }
        }
        />

        { /* ⭐ Bars */ } <
        Bar dataKey = "aging_days"
        fill = "url(#agingGradient)"
        barSize = {
            38
        }
        radius = {
            [8, 8, 0, 0]
        }
        />

        <
        /BarChart> <
        /ResponsiveContainer>

        <
        /Box> <
        /Box>
    );
};

export default MaterialAgingDashboard;