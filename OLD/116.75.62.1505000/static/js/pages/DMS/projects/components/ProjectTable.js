import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Chip,
} from '@mui/material';

const ProjectTable = ({
    data,
    onRowClick
}) => {

    return ( <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                borderRadius: 1,
                overflowX: "auto",
                boxShadow: "0px 4px 15px rgba(0,0,0,0.05)",
                "&::-webkit-scrollbar": {
                    height: "6px", // horizontal scrollbar
                    width: "6px", // vertical scrollbar
                },
                "&::-webkit-scrollbar-track": {
                    background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                    background: "linear-gradient(135deg, #cbd5e1, #94a3b8)",
                    borderRadius: "10px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                    background: "linear-gradient(135deg, #94a3b8, #64748b)",
                },

                // Firefox support
                scrollbarWidth: "thin",
                scrollbarColor: "#cbd5e1 transparent",
            }
        } >
        <
        Table size = "small"
        sx = {
            {
                maxWidth: '100%',
                '& th, & td': {
                    whiteSpace: 'nowrap', // STOP line break
                    overflow: 'hidden', // hide extra text
                    textOverflow: 'ellipsis', // show ...
                },
            }
        } >
        <
        TableHead >
        <
        TableRow sx = {
            {
                background: 'linear-gradient(90deg, #1e3c72, #2a5298)',
                '& .MuiTableCell-root': {
                    fontSize: '0.72rem',
                    py: 0.9, // smaller height
                    fontWeight: 600,
                    letterSpacing: '0.4px',
                    color: '#fff',
                },
            }
        } >
        <
        TableCell sx = {
            {
                color: '#fff',
                fontWeight: 600
            }
        } >
        Project Name <
        /TableCell> <
        TableCell sx = {
            {
                color: '#fff',
                fontWeight: 600
            }
        } >
        Client <
        /TableCell> <
        TableCell sx = {
            {
                color: '#fff',
                fontWeight: 600
            }
        } >
        Location <
        /TableCell> <
        TableCell sx = {
            {
                color: '#fff',
                fontWeight: 600
            }
        } >
        Status <
        /TableCell> <
        /TableRow> <
        /TableHead> <
        TableBody > {
            data.length === 0 ?
            < TableRow >
            <
            TableCell
            colSpan = {
                4
            }
            align = "center"
            sx = {
                {
                    py: 3,
                    color: '#94a3b8',
                    fontSize: '14px',
                }
            } >
            No records available <
            /TableCell> <
            /TableRow> :
                data.map((row, index) => ( <
                TableRow key = {
                    row.id
                }
                onClick = {
                    () => onRowClick(row)
                }
                sx = {
                    {
                        cursor: 'pointer',
                        backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc',
                        '&:hover': {
                            backgroundColor: '#e0f2fe',
                            transform: 'scale(1.001)',
                        },
                    }
                } >
                <
                TableCell sx = {
                    {
                        fontWeight: 500
                    }
                } > {
                    row.name
                } < /TableCell>

                <
                TableCell > {
                    row.client
                } < /TableCell> <
                TableCell > {
                    row.location
                } < /TableCell>

                <
                TableCell >
                <
                Chip label = {
                    row.status
                }
                size = "small"
                sx = {
                    {
                        bgcolor: row.status === 'Active' ?
                            '#dcfce7' :
                            row.status === 'Pending' ? '#fef3c7' : '#e2e8f0',
                    }
                }
                /> <
                /TableCell> <
                /TableRow>
            ))
        } <
        /TableBody> <
        /Table> <
        /TableContainer>
    );
};

export default ProjectTable;