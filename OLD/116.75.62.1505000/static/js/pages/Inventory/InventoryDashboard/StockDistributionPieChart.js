import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from "recharts";
import {
    Paper,
    Typography
} from "@mui/material";

const COLORS = [
    "#5B8FF9",
    "#61DDAA",
    "#65789B",
    "#F6BD16",
    "#7262FD",
    "#78D3F8",
    "#9661BC",
    "#F6903D",
    "#008685"
];

const StockDistributionPieChart = ({
    data
}) => {
    return ( <
        Paper sx = {
            {
                p: 2,
                borderRadius: 3,
                boxShadow: 3
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                mb: 2,
                color: '#00416A',
                fontWeight: 'bold',
                borderBottom: '2px solid #1976d2',
                pb: 1
            }
        } >
        Stock Distribution <
        /Typography>




        <
        ResponsiveContainer width = "100%"
        height = {
            350
        } >
        <
        PieChart >
        <
        Pie data = {
            data
        }
        dataKey = "balance_qty"
        nameKey = "project__project_name"
        cx = "50%"
        cy = "50%"
        innerRadius = {
            70
        }
        outerRadius = {
            120
        }
        label = {
            ({
                name,
                percent
            }) => {
                if (percent < 0.04) return "";
                return `${name} (${(percent * 100).toFixed(0)}%)`;
            }
        } >
        {
            data.map((entry, index) => ( <
                Cell key = {
                    `cell-${index}`
                }
                fill = {
                    COLORS[index % COLORS.length]
                }
                />
            ))
        } <
        /Pie> <
        /PieChart> <
        /ResponsiveContainer> <
        /Paper>
    );
};

export default StockDistributionPieChart;