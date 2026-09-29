import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    LinearProgress,
    styled
} from '@mui/material';

// Custom styled progress bar that accepts a dynamic color prop
const ProgressBar = styled(LinearProgress)(({
    theme,
    barcolor
}) => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.palette.grey[200],
    [`& .MuiLinearProgress-bar`]: {
        borderRadius: 5,
        backgroundColor: barcolor || '#00416A', // Fallback to navy if no color provided
    },
}));

const WTGActivityBarChart = ({
    data
}) => {
    return ( <
        Paper sx = {
            {
                p: 3,
                borderRadius: 3,
                minHeight: 450,
                boxShadow: '0px 8px 24px rgba(0,0,0,0.12)'
            }
        } >
        <
        Typography variant = "h6"
        fontWeight = {
            700
        }
        sx = {
            {
                color: '#00416A',
                mb: 3
            }
        } >
        Installation Analysis <
        /Typography>

        <
        Stack spacing = {
            4
        } > {
            data && data.map((stage) => {
                // Calculate percentage for the progress bar
                const progressValue = stage.total > 0 ? (stage.completed / stage.total) * 100 : 0;

                return ( <
                    Box key = {
                        stage.title
                    } > { /* Label and Quantity Section */ } <
                    Box display = "flex"
                    justifyContent = "space-between"
                    alignItems = "center"
                    mb = {
                        1
                    } >
                    <
                    Typography variant = "body2"
                    sx = {
                        {
                            color: 'text.secondary',
                            fontWeight: 500
                        }
                    } > {
                        stage.title
                    } <
                    /Typography>

                    <
                    Box sx = {
                        {
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 0.5
                        }
                    } >
                    <
                    Typography variant = "h6"
                    sx = {
                        {
                            color: stage.color, // Uses the specific color from your API
                            fontWeight: 800,
                            lineHeight: 1,
                            fontSize: '1.1rem'
                        }
                    } >
                    {
                        stage.completed
                    }
                    /{stage.total} <
                    /Typography>

                    <
                    /Box> <
                    /Box>

                    { /* Linear Bar using color from backend */ } <
                    ProgressBar variant = "determinate"
                    value = {
                        progressValue
                    }
                    barcolor = {
                        stage.color
                    } // Passing the API color here
                    /> <
                    /Box>
                );
            })
        } <
        /Stack> <
        /Paper>
    );
};

export default WTGActivityBarChart;