import React from 'react';
import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Chip,
    alpha
} from "@mui/material";

const WTGRecentActivityList = ({
    recentActivities
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
            }
        } >
        Last 5 Recent Activity <
        /Typography> <
        List sx = {
            {
                flexGrow: 1,
                overflowY: 'auto'
            }
        } > {
            recentActivities.map((item, index) => {
                // 1. Define colors based on status
                const isCompleted = item.status === 'completed';
                const statusColor = isCompleted ? '#4CAF50' : '#2196F3'; // Green or Blue

                return ( <
                    ListItem key = {
                        index
                    }
                    sx = {
                        {
                            px: 1,
                            py: 1.5,
                            borderRadius: 2,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            transition: 'background-color 0.2s ease', // Smooth color change only
                            '&:last-child': {
                                borderBottom: 'none'
                            },

                            // 2. DYNAMIC HOVER: Uses the status color with low opacity
                            '&:hover': {
                                bgcolor: alpha(statusColor, 0.12), // Same color as the chip/bar
                                cursor: 'default', // Keeps it feeling like a list, not a button
                            }
                        }
                    } >
                    { /* ... rest of your list item content ... */ } <
                    ListItemIcon sx = {
                        {
                            minWidth: 45
                        }
                    } >
                    <
                    Box sx = {
                        {
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(13, 71, 161, 0.08)',
                            border: '1px solid rgba(13, 71, 161, 0.2)'
                        }
                    } >
                    <
                    Typography variant = "caption"
                    fontWeight = {
                        800
                    }
                    color = "#0D47A1" > {
                        index + 1
                    } <
                    /Typography> <
                    /Box> <
                    /ListItemIcon>

                    <
                    ListItemText primary = { <
                        Stack direction = "row"
                        justifyContent = "space-between"
                        alignItems = "center" >
                        <
                        Typography variant = "body2"
                        fontWeight = {
                            700
                        }
                        color = "text.primary" > {
                            item.activity
                        } <
                        /Typography> <
                        Chip
                        label = {
                            isCompleted ? 'Completed' : 'In Progress'
                        }
                        size = "small"
                        sx = {
                            {
                                height: 18,
                                fontSize: '0.6rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                bgcolor: isCompleted ? 'rgba(76, 175, 80, 0.12)' : 'rgba(33, 150, 243, 0.12)',
                                color: isCompleted ? '#2E7D32' : '#1976D2',
                                border: `1px solid ${statusColor}`,
                            }
                        }
                        /> <
                        /Stack>
                    }
                    secondary = { <
                        Stack direction = "row"
                        justifyContent = "space-between"
                        alignItems = "center"
                        sx = {
                            {
                                mt: 0.5
                            }
                        } >
                        <
                        Typography variant = "caption"
                        color = "text.secondary" > {
                            new Date(item.date).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                        } <
                        /Typography> <
                        Typography variant = "caption"
                        fontWeight = {
                            700
                        }
                        sx = {
                            {
                                color: '#1976D2',
                                bgcolor: '#E3F2FD',
                                px: 1,
                                borderRadius: 1
                            }
                        } > {
                            item.location_no
                        } <
                        /Typography> <
                        /Stack>
                    }
                    /> <
                    /ListItem>
                );
            })
        } <
        /List> <
        /Paper>
    );
};

export default WTGRecentActivityList;