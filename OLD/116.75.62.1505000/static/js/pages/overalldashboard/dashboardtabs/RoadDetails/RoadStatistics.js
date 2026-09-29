import React, {
    useMemo
} from "react";
import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box,
    LinearProgress
} from "@mui/material";

const SummaryCard = ({
    title,
    value,
    subtext,
    color = "default",
    progress = null
}) => ( <
    Card sx = {
        {
            height: "100%",
            border: "1px solid #c0c0c0ff",
            bgcolor: color === "success" ?
                "#e8f5e9" :
                color === "warning" ?
                "#fff3e0" :
                "inherit",
        }
    } >
    <
    CardContent >
    <
    Typography variant = "subtitle2"
    color = "textSecondary" > {
        title
    } <
    /Typography> <
    Typography variant = "h4"
    color = {
        color !== "default" ? `${color}.main` : "inherit"
    } >
    {
        value
    } <
    /Typography> {
        subtext && ( <
            Typography variant = "caption"
            color = "textSecondary" > {
                subtext
            } <
            /Typography>
        )
    } {
        progress !== null && ( <
            Box sx = {
                {
                    mt: 1
                }
            } >
            <
            LinearProgress variant = "determinate"
            value = {
                Math.min(progress, 100)
            }
            sx = {
                {
                    height: 8,
                    borderRadius: 4
                }
            }
            /> <
            /Box>
        )
    } <
    /CardContent> <
    /Card>
);

const RoadStatistics = ({
    data
}) => {
    // Calculate statistics with proper number conversion
    const stats = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                totalRoads: 0,
                planned: 0,
                completed: 0,
                remaining: 0,
                completedRoads: 0,
                inProgressRoads: 0,
                notStartedRoads: 0,
                overallProgress: 0,
            };
        }

        const result = data.reduce(
            (acc, row) => {
                // Parse values as numbers, handling string inputs
                const planned = parseFloat(row.plan_distance_km) || 0;
                const completed = parseFloat(row.actual_completed_qty) || 0;
                const remaining = parseFloat(row.remaining_qty) || 0;
                const progress = parseFloat(row.progress_percent) || 0;

                acc.planned += planned;
                acc.completed += completed;
                acc.remaining += remaining;

                // Count road status
                if (progress >= 100) acc.completedRoads++;
                else if (progress > 0) acc.inProgressRoads++;
                else acc.notStartedRoads++;

                return acc;
            }, {
                planned: 0,
                completed: 0,
                remaining: 0,
                completedRoads: 0,
                inProgressRoads: 0,
                notStartedRoads: 0,
            }
        );

        result.totalRoads = data.length;
        result.overallProgress = result.planned > 0 ?
            (result.completed / result.planned) * 100 :
            0;

        return result;
    }, [data]);

    return ( <
        Grid container spacing = {
            3
        }
        sx = {
            {
                mb: 4
            }
        } >
        <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        SummaryCard title = "TOTAL ROADS"
        value = {
            stats.totalRoads
        }
        subtext = {
            `Planned: ${stats.planned.toFixed(2)} km`
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
        SummaryCard title = "COMPLETED"
        value = {
            `${stats.completed.toFixed(2)} km`
        }
        subtext = {
            `${stats.completedRoads} roads completed`
        }
        color = "success" /
        >
        <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        SummaryCard title = "REMAINING"
        value = {
            `${stats.remaining.toFixed(2)} km`
        }
        subtext = {
            `${stats.inProgressRoads} in progress, ${stats.notStartedRoads} not started`
        }
        color = "warning" /
        >
        <
        /Grid> <
        Grid item xs = {
            12
        }
        md = {
            3
        } >
        <
        SummaryCard title = "OVERALL PROGRESS"
        value = {
            `${stats.overallProgress.toFixed(1)}%`
        }
        progress = {
            stats.overallProgress
        }
        /> <
        /Grid> <
        /Grid>
    );
};

export default RoadStatistics;