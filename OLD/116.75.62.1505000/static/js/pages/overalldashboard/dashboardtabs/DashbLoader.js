import React from 'react';
import {
    Box,
    Grid,
    Paper,
    Skeleton,
    Stack
} from "@mui/material";

const DashbLoader = () => {
    return ( <
        Box sx = {
            {
                width: '100%',
                animation: 'fadeIn 0.5s ease-in'
            }
        } > { /* 1. Header Skeleton */ } <
        Stack direction = "row"
        alignItems = "center"
        spacing = {
            2
        }
        sx = {
            {
                mb: 4
            }
        } >
        <
        Skeleton variant = "circular"
        width = {
            64
        }
        height = {
            64
        }
        animation = "wave"
        sx = {
            {
                bgcolor: 'rgba(33, 150, 243, 0.08)'
            }
        }
        /> <
        Box >
        <
        Skeleton variant = "text"
        width = {
            280
        }
        height = {
            45
        }
        animation = "wave" / >
        <
        Skeleton variant = "text"
        width = {
            200
        }
        height = {
            25
        }
        animation = "wave" / >
        <
        /Box> <
        /Stack>

        { /* 2. Top Metric Cards Skeletons */ } <
        Grid container spacing = {
            3
        }
        sx = {
            {
                mb: 4
            }
        } > {
            [1, 2, 3, 4].map((item) => ( <
                Grid item xs = {
                    12
                }
                sm = {
                    6
                }
                md = {
                    3
                }
                key = {
                    item
                } >
                <
                Paper sx = {
                    {
                        p: 3,
                        borderRadius: 3,
                        boxShadow: 'none',
                        border: '1px solid #f0f0f0'
                    }
                } >
                <
                Skeleton variant = "text"
                width = "50%"
                height = {
                    60
                }
                animation = "wave" / >
                <
                Skeleton variant = "text"
                width = "80%"
                height = {
                    25
                }
                sx = {
                    {
                        mb: 2
                    }
                }
                /> <
                Skeleton variant = "rounded"
                height = {
                    8
                }
                sx = {
                    {
                        borderRadius: 3
                    }
                }
                animation = "wave" / >
                <
                /Paper> <
                /Grid>
            ))
        } <
        /Grid>

        { /* 3. Main Content Area Skeletons */ } <
        Grid container spacing = {
            3
        } > { /* Activity List Skeleton (Left) */ } <
        Grid item xs = {
            12
        }
        md = {
            4
        } >
        <
        Paper sx = {
            {
                p: 3,
                borderRadius: 3,
                height: 520,
                boxShadow: 'none',
                border: '1px solid #f0f0f0'
            }
        } >
        <
        Skeleton variant = "text"
        width = "70%"
        height = {
            35
        }
        sx = {
            {
                mb: 4
            }
        }
        /> {
            [1, 2, 3, 4, 5, 6].map((i) => ( <
                Stack key = {
                    i
                }
                direction = "row"
                spacing = {
                    2
                }
                sx = {
                    {
                        mb: 3
                    }
                } >
                <
                Skeleton variant = "rounded"
                width = {
                    36
                }
                height = {
                    36
                }
                sx = {
                    {
                        borderRadius: '10px'
                    }
                }
                animation = "wave" / >
                <
                Box sx = {
                    {
                        flexGrow: 1
                    }
                } >
                <
                Skeleton variant = "text"
                width = "95%"
                height = {
                    20
                }
                /> <
                Skeleton variant = "text"
                width = "40%"
                height = {
                    15
                }
                /> <
                /Box> <
                /Stack>
            ))
        } <
        /Paper> <
        /Grid>

        { /* Bar Chart Skeleton (Right) */ } <
        Grid item xs = {
            12
        }
        md = {
            8
        } >
        <
        Paper sx = {
            {
                p: 3,
                borderRadius: 3,
                height: 520,
                boxShadow: 'none',
                border: '1px solid #f0f0f0'
            }
        } >
        <
        Skeleton variant = "text"
        width = "30%"
        height = {
            35
        }
        sx = {
            {
                mb: 5
            }
        }
        /> <
        Box sx = {
            {
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-around',
                height: 380,
                px: 4,
                borderLeft: '2px solid #f5f5f5',
                borderBottom: '2px solid #f5f5f5',
                ml: 2
            }
        } > { /* Vertical Bars simulation */ } {
            [70, 45, 90, 60, 85, 50, 75].map((height, i) => ( <
                Skeleton key = {
                    i
                }
                variant = "rectangular"
                width = "10%"
                height = {
                    `${height}%`
                }
                animation = "wave"
                sx = {
                    {
                        borderRadius: '6px 6px 0 0',
                        bgcolor: 'rgba(33, 150, 243, 0.05)'
                    }
                }
                />
            ))
        } <
        /Box> <
        /Paper> <
        /Grid> <
        /Grid> <
        /Box>
    );
};

export default DashbLoader;