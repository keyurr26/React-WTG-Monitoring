import {
    Grid,
    Box,
    Skeleton
} from "@mui/material";

const DashboardLoader = () => ( <
    Box sx = {
        {
            p: 1
        }
    } > { /* Header Skeleton */ } <
    Box sx = {
        {
            mb: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    } >
    <
    Box >
    <
    Skeleton variant = "text"
    width = {
        300
    }
    height = {
        40
    }
    sx = {
        {
            mb: 1
        }
    }
    /> <
    Skeleton variant = "text"
    width = {
        200
    }
    height = {
        20
    }
    /> <
    /Box> <
    Skeleton variant = "rectangular"
    width = {
        400
    }
    height = {
        45
    }
    sx = {
        {
            borderRadius: 2
        }
    }
    /> <
    /Box>

    { /* Top 4 Tiles Skeleton */ } <
    Grid container spacing = {
        3
    }
    sx = {
        {
            mb: 4
        }
    } > {
        [1, 2, 3, 4].map((i) => ( <
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
                i
            } >
            <
            Skeleton variant = "rectangular"
            height = {
                100
            }
            sx = {
                {
                    borderRadius: 4
                }
            }
            /> <
            /Grid>
        ))
    } <
    /Grid>

    <
    Grid container spacing = {
        3
    } > { /* Left Radial Chart Skeleton */ } <
    Grid item xs = {
        12
    }
    md = {
        5
    } >
    <
    Skeleton variant = "rectangular"
    height = {
        400
    }
    sx = {
        {
            borderRadius: 3
        }
    }
    /> <
    /Grid>

    { /* Right Grid Cards Skeleton */ } <
    Grid item xs = {
        12
    }
    md = {
        7
    } >
    <
    Grid container spacing = {
        2
    } > {
        [1, 2, 3, 4, 5, 6].map((i) => ( <
            Grid item xs = {
                12
            }
            sm = {
                6
            }
            key = {
                i
            } >
            <
            Skeleton variant = "rectangular"
            height = {
                140
            }
            sx = {
                {
                    borderRadius: 3
                }
            }
            /> <
            /Grid>
        ))
    } <
    /Grid> <
    /Grid> <
    /Grid> <
    /Box>
);

export default DashboardLoader;