import React from "react";
import {
    CardContent,
    Typography,
    Box,
    TextField,
    InputAdornment,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Paper,
    Chip,
} from "@mui/material";
import {
    Search as SearchIcon,
    CheckCircle as CompletedIcon,
    Pending as PendingIcon,
    TableChart as TableIcon
} from "@mui/icons-material";
import {
    styled
} from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

// --- Styled Components ---
const StyledCard = styled(Paper)(({
    theme
}) => ({
    borderRadius: '12px',
    boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
    overflow: 'hidden'
}));

const ProgressBar = styled(LinearProgress)(({
    theme,
    barcolor
}) => ({
    height: 8,
    borderRadius: 5,
    backgroundColor: theme.palette.grey[200],
    [`& .MuiLinearProgress-bar`]: {
        borderRadius: 5,
        backgroundColor: barcolor || '#1A237E',
    },
}));

const WTGInstallationTable = ({
    turbineList, // Pass apiData.turbineList here
    page,
    rowsPerPage,
    searchTerm,
    setSearchTerm,
    handleChangePage,
    handleChangeRowsPerPage,
    handleRowClick
}) => {

    // Search Logic
    const filteredTurbines = turbineList.filter(t =>
        t.location_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.cluster_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return ( <
        StyledCard >
        <
        CardContent >
        <
        Box display = "flex"
        justifyContent = "space-between"
        alignItems = "center"
        mb = {
            2
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
        WTG Installation Turbine Status <
        /Typography> <
        Box display = "flex"
        gap = {
            1
        } >
        <
        TextField size = "small"
        placeholder = "Search location..."
        value = {
            searchTerm
        }
        onChange = {
            (e) => setSearchTerm(e.target.value)
        }
        sx = {
            {
                width: 220
            }
        }
        InputProps = {
            {
                startAdornment: ( <
                    InputAdornment position = "start" >
                    <
                    SearchIcon sx = {
                        {
                            fontSize: '1rem'
                        }
                    }
                    /> <
                    /InputAdornment>
                ),
            }
        }
        /> <
        /Box> <
        /Box>

        {
            filteredTurbines.length > 0 ? ( <
                >
                <
                TableContainer >
                <
                Table size = "small" >
                <
                TableHead >
                <
                TableRow sx = {
                    {
                        backgroundColor: '#f8f9fa'
                    }
                } >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "700" > Location < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "700" > T1 Base < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "700" > Tower < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "700" > Nacelle < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "700" > Rotor < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "700" > Blades < /Typography></TableCell >
                <
                TableCell > < Typography variant = "body2"
                fontWeight = "700" > Overall Progress < /Typography></TableCell >
                <
                TableCell align = "center" > < Typography variant = "body2"
                fontWeight = "700" > Actions < /Typography></TableCell >
                <
                /TableRow> <
                /TableHead> <
                TableBody > {
                    filteredTurbines
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((turbine) => {

                        // Status mapping from your JSON
                        const hasT1 = turbine.t1_status === 1;
                        const hasTower = turbine.tw_status === 1;
                        const hasNacelle = turbine.nc_status === 1;
                        const hasRotor = turbine.rt_status === 1;
                        const bladeCount = turbine.bl_count || 0;

                        const isBladesComplete = bladeCount === 3;

                        // Calculation for Progress (Blades count as 1 set if 3/3)
                        const steps = [hasT1, hasTower, hasNacelle, hasRotor, isBladesComplete];
                        const completedSteps = steps.filter(Boolean).length;
                        const progress = (completedSteps / 5) * 100;

                        return ( <
                            TableRow key = {
                                turbine.turbine_id
                            }
                            hover >
                            <
                            TableCell >
                            <
                            Typography variant = "body2"
                            fontWeight = "600"
                            color = "#00416A" > {
                                turbine.location_no
                            } <
                            /Typography> <
                            Typography variant = "caption"
                            color = "textSecondary" > {
                                turbine.cluster_name
                            } <
                            /Typography> <
                            /TableCell>

                            <
                            TableCell > < StatusChip done = {
                                hasT1
                            }
                            color = "#667eea" / > < /TableCell> <
                            TableCell > < StatusChip done = {
                                hasTower
                            }
                            color = "#4CAF50" / > < /TableCell> <
                            TableCell > < StatusChip done = {
                                hasNacelle
                            }
                            color = "#FF9800" / > < /TableCell> <
                            TableCell > < StatusChip done = {
                                hasRotor
                            }
                            color = "#2196f3" / > < /TableCell> <
                            TableCell > < StatusChip done = {
                                isBladesComplete
                            }
                            color = "#00ACC1" / > < /TableCell> { /* BLADES COLUMN: Shows Done only if count is 3 */ } {
                                /* <TableCell>
                                             <Box display="flex" flexDirection="column" gap={0.5}>
                                                <StatusChip 
                                                  done={isBladesComplete} 
                                                  color="#00ACC1" 
                                                  label={isBladesComplete ? "Done" : `${bladeCount}/3`} 
                                                />
                                                {!isBladesComplete && (
                                                   <Box sx={{ width: '100%', height: 4, bgcolor: '#eee', borderRadius: 2, mt: 0.5 }}>
                                                      <Box sx={{ 
                                                          width: `${(bladeCount/3)*100}%`, 
                                                          height: '100%', 
                                                          bgcolor: '#00ACC1', 
                                                          borderRadius: 2 
                                                      }} />
                                                   </Box>
                                                )}
                                             </Box>
                                          </TableCell> */
                            }

                            <
                            TableCell >
                            <
                            Box sx = {
                                {
                                    minWidth: 100
                                }
                            } >
                            <
                            ProgressBar variant = "determinate"
                            value = {
                                progress
                            }
                            barcolor = {
                                progress === 100 ? "#4CAF50" : "#1A237E"
                            }
                            /> <
                            Typography variant = "caption"
                            sx = {
                                {
                                    fontWeight: 700
                                }
                            } > {
                                Math.round(progress)
                            } % Complete <
                            /Typography> <
                            /Box> <
                            /TableCell>

                            <
                            TableCell align = "center" >
                            <
                            Button size = "small"
                            variant = "outlined"
                            startIcon = { < TableIcon / >
                            }
                            onClick = {
                                () => handleRowClick(turbine)
                            }
                            sx = {
                                {
                                    textTransform: 'none',
                                    borderRadius: '8px'
                                }
                            } >
                            View <
                            /Button> <
                            /TableCell> <
                            /TableRow>
                        );
                    })
                } <
                /TableBody> <
                /Table> <
                /TableContainer>

                <
                TablePagination rowsPerPageOptions = {
                    [5, 10, 25]
                }
                component = "div"
                count = {
                    filteredTurbines.length
                }
                rowsPerPage = {
                    rowsPerPage
                }
                page = {
                    page
                }
                onPageChange = {
                    handleChangePage
                }
                onRowsPerPageChange = {
                    handleChangeRowsPerPage
                }
                /> <
                />
            ) : ( <
                Paper sx = {
                    {
                        p: 3,
                        textAlign: 'center',
                        bgcolor: '#f8f9fa'
                    }
                } >
                <
                Typography variant = "body1"
                color = "textSecondary" >
                No WTG data found
                for "{searchTerm}" <
                /Typography> <
                /Paper>
            )
        } <
        /CardContent> <
        /StyledCard>
    );
};

// Simplified Status Chip for WTG
const StatusChip = ({
    done,
    color
}) => ( <
    Chip size = "small"
    icon = {
        done ? < CompletedIcon style = {
            {
                color: '#fff',
                fontSize: '0.8rem'
            }
        }
        /> : <PendingIcon style={{ fontSize: '0.8rem' }} / >
    }
    label = {
        done ? "Done" : "Pending"
    }
    sx = {
        {
            height: 22,
            fontSize: '0.65rem',
            fontWeight: 700,
            bgcolor: done ? color : 'transparent',
            color: done ? '#fff' : 'text.secondary',
            border: done ? 'none' : '1px solid #ddd',
            '& .MuiChip-icon': {
                color: done ? '#fff !important' : 'inherit'
            }
        }
    }
    />
);

export default WTGInstallationTable;