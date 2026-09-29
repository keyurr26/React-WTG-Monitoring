import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    LabelList
} from "recharts";

const MaterialBarChart = ({
    data
}) => {

    // ⭐ Custom Tooltip
    const CustomTooltip = ({
        active,
        payload,
        label
    }) => {
        if (active && payload && payload.length) {
            return ( <
                div style = {
                    {
                        background: "#fff",
                        padding: 10,
                        borderRadius: 8,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                    }
                } >
                <
                strong > {
                    label
                } < /strong>

                {
                    payload.map((entry, index) => ( <
                        div key = {
                            index
                        }
                        style = {
                            {
                                color: entry.color
                            }
                        } > {
                            entry.name
                        }: {
                            entry.value
                        } <
                        /div>
                    ))
                } <
                /div>
            );
        }
        return null;
    };

    return ( <
        ResponsiveContainer width = "100%"
        height = {
            420
        } >
        <
        BarChart data = {
            data
        }
        margin = {
            {
                top: 20,
                right: 20,
                left: 20,
                bottom: 90
            }
        } >

        { /* ⭐ Gradient Colors */ } <
        defs >
        <
        linearGradient id = "receivedGradient"
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
        /linearGradient>

        <
        linearGradient id = "issuedGradient"
        x1 = "0"
        y1 = "0"
        x2 = "0"
        y2 = "1" >
        <
        stop offset = "0%"
        stopColor = "#fa709a" / >
        <
        stop offset = "100%"
        stopColor = "#fee140" / >
        <
        /linearGradient>

        <
        linearGradient id = "balanceGradient"
        x1 = "0"
        y1 = "0"
        x2 = "0"
        y2 = "1" >
        <
        stop offset = "0%"
        stopColor = "#43e97b" / >
        <
        stop offset = "100%"
        stopColor = "#38f9d7" / >
        <
        /linearGradient> <
        /defs>

        <
        CartesianGrid strokeDasharray = "3 3" / >

        { /* ⭐ X Axis 60 Degree Rotation */ } <
        XAxis dataKey = "material_name"
        interval = {
            0
        }
        angle = {-60
        }
        textAnchor = "end"
        height = {
            90
        }
        />

        <
        YAxis / >
        <
        Tooltip content = { < CustomTooltip / >
        }
        /> <
        Legend verticalAlign = "top"
        align = "right"
        layout = "vertical" /
        >

        { /* ⭐ Received */ } <
        Bar dataKey = "total_received"
        name = "Received Qty"
        fill = "url(#receivedGradient)"
        barSize = {
            28
        } >
        <
        LabelList dataKey = "total_received"
        position = "top"
        style = {
            {
                fontSize: 11,
                fontWeight: "bold"
            }
        }
        /> <
        /Bar>

        { /* ⭐ Issued */ } <
        Bar dataKey = "total_issued"
        name = "Issued Qty"
        fill = "url(#issuedGradient)"
        barSize = {
            28
        } >
        <
        LabelList dataKey = "total_issued"
        position = "top"
        style = {
            {
                fontSize: 11,
                fontWeight: "bold"
            }
        }
        /> <
        /Bar>

        { /* ⭐ Balance */ } <
        Bar dataKey = "balance_qty"
        name = "Balance Qty"
        fill = "url(#balanceGradient)"
        barSize = {
            28
        } >
        <
        LabelList dataKey = "balance_qty"
        position = "top"
        style = {
            {
                fontSize: 11,
                fontWeight: "bold"
            }
        }
        /> <
        /Bar>

        <
        /BarChart> <
        /ResponsiveContainer>
    );
};

export default MaterialBarChart;