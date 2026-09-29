import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Typography,
    IconButton,

    Paper,
    Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TagIcon from '@mui/icons-material/Tag';
import CommentIcon from '@mui/icons-material/Comment';

const DynamicViewer = ({
    open,
    onClose,
    title,
    data = [],
    type
}) => {



    return ( <
        Dialog open = {
            open
        }
        onClose = {
            onClose
        }
        maxWidth = "md"
        fullWidth >
        <
        DialogTitle > {
            title
        } <
        IconButton onClick = {
            onClose
        }
        sx = {
            {
                position: "absolute",
                right: 10,
                top: 10
            }
        } >
        <
        CloseIcon / >
        <
        /IconButton> <
        /DialogTitle>

        <
        DialogContent > {
            type === "images" && ( <
                Grid container spacing = {
                    2
                } > {
                    data.map((img, i) => ( <
                        Grid item xs = {
                            4
                        }
                        key = {
                            i
                        } >
                        <
                        img src = {
                            img
                        }
                        alt = "evidence"
                        style = {
                            {
                                width: "100%",
                                borderRadius: 6
                            }
                        }
                        /> <
                        /Grid>
                    ))
                } <
                /Grid>
            )
        }

        {
            /* {type === "docs" && (
                                <>
                                    {data.map((doc, i) => (
                                        <Typography key={i}>
                                            <Link href={doc.url} target="_blank" underline="hover">
                                                Document {i + 1}
                                            </Link>
                                        </Typography>
                                    ))}
                                </>
                            )} */
        }

        { /* --- UPDATED DOCS MODE --- */ } {
            type === "docs" && ( <
                Grid container spacing = {
                    2
                } > {
                    data.map((doc, i) => {
                        // Extract actual filename from URL (e.g., FDD_Document.pdf)
                        const rawFileName = doc.url ? doc.url.split('/').pop() : "Unknown File";

                        return ( <
                            Grid item xs = {
                                12
                            }
                            key = {
                                i
                            } >
                            <
                            Paper variant = "outlined"
                            sx = {
                                {
                                    p: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    "&:hover": {
                                        bgcolor: "#f9f9f9"
                                    },
                                }
                            } >
                            <
                            Box sx = {
                                {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }
                            } >
                            <
                            InsertDriveFileIcon sx = {
                                {
                                    color: "#00416A",
                                    fontSize: 32
                                }
                            }
                            />

                            <
                            Box > {
                                doc.is_mandatory && ( <
                                    Typography variant = "caption"
                                    sx = {
                                        {
                                            color: "error.main",
                                            fontWeight: "bold",
                                            display: "block",
                                        }
                                    } >
                                    *
                                    Mandatory <
                                    /Typography>
                                )
                            } { /* User added description */ } <
                            Typography variant = "subtitle2"
                            sx = {
                                {
                                    fontWeight: 700
                                }
                            } >
                            {
                                doc.name || "Untitled Document"
                            } <
                            /Typography> { /* Actual file name */ } <
                            Typography variant = "caption"
                            color = "text.secondary" >
                            {
                                rawFileName
                            } <
                            /Typography> { /* NEW FIELDS GRID */ } <
                            Grid container spacing = {
                                1
                            } > {
                                doc.doc_no && ( <
                                    Grid item sx = {
                                        {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            mr: 2,
                                        }
                                    } >
                                    <
                                    TagIcon sx = {
                                        {
                                            fontSize: 14,
                                            color: "text.secondary",
                                        }
                                    }
                                    /> <
                                    Typography variant = "caption" >
                                    <
                                    b > No: < /b> {doc.doc_no} <
                                    /Typography> <
                                    /Grid>
                                )
                            } {
                                doc.doc_date && ( <
                                    Grid item sx = {
                                        {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                            mr: 2,
                                        }
                                    } >
                                    <
                                    CalendarMonthIcon sx = {
                                        {
                                            fontSize: 14,
                                            color: "text.secondary",
                                        }
                                    }
                                    /> <
                                    Typography variant = "caption" >
                                    <
                                    b > Date: < /b> {doc.doc_date} <
                                    /Typography> <
                                    /Grid>
                                )
                            } {
                                doc.remarks && ( <
                                    Grid item xs = {
                                        12
                                    }
                                    sx = {
                                        {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.5,
                                        }
                                    } >
                                    <
                                    CommentIcon sx = {
                                        {
                                            fontSize: 14,
                                            color: "text.secondary",
                                        }
                                    }
                                    /> <
                                    Typography variant = "caption"
                                    sx = {
                                        {
                                            fontStyle: "italic"
                                        }
                                    } >
                                    {
                                        doc.remarks
                                    } <
                                    /Typography> <
                                    /Grid>
                                )
                            } <
                            /Grid> <
                            /Box> <
                            /Box>

                            <
                            Box sx = {
                                {
                                    display: "flex",
                                    gap: 1
                                }
                            } > { /* View Link */ } <
                            IconButton component = "a"
                            href = {
                                doc.url
                            }
                            target = "_blank"
                            rel = "noopener noreferrer"
                            size = "small"
                            title = "View" >
                            <
                            VisibilityIcon fontSize = "small"
                            color = "primary" /
                            >
                            <
                            /IconButton>

                            { /* Download Link */ } <
                            IconButton component = "a"
                            href = {
                                doc.url
                            }
                            download size = "small"
                            title = "Download" >
                            <
                            DownloadIcon fontSize = "small"
                            sx = {
                                {
                                    color: "#2E7D32"
                                }
                            }
                            /> <
                            /IconButton> <
                            /Box> <
                            /Paper> <
                            /Grid>
                        );
                    })
                } <
                /Grid>
            )
        }

        {
            /* {type === "rows" && (
                                <>
                                    {data.map((row, i) => (
                                        <Typography key={i}>
                                            {JSON.stringify(row)}
                                        </Typography>
                                    ))}
                                </>
                            )} */
        }

        {
            type === "rows" && ( <
                Grid container spacing = {
                    2
                } > {
                    data.map((row, i) => ( <
                        Grid item xs = {
                            6
                        }
                        key = {
                            i
                        } >
                        <
                        Paper variant = "outlined"
                        sx = {
                            {
                                p: 2
                            }
                        } >

                        <
                        Typography variant = "subtitle1"
                        fontWeight = {
                            600
                        } >
                        Defect {
                            i + 1
                        } <
                        /Typography>

                        <
                        Typography variant = "body2" >
                        <
                        b > Location: < /b> {row.defect_location || "—"} <
                        /Typography>

                        <
                        Typography variant = "body2" >
                        <
                        b > Description: < /b> {row.defect_description || "—"} <
                        /Typography>

                        <
                        Typography variant = "body2" >
                        <
                        b > Action Taken: < /b> {row.action_taken || "—"} <
                        /Typography>

                        <
                        Typography variant = "body2" >
                        <
                        b > Created: < /b>{" "} {
                            row.created_at ?
                                new Date(row.created_at).toLocaleString() :
                                "—"
                        } <
                        /Typography>

                        { /* Photo preview */ } {
                            row.def_photo && ( <
                                Box mt = {
                                    1
                                } >
                                <
                                a href = {
                                    row.def_photo
                                }
                                target = "_blank"
                                rel = "noopener noreferrer" >
                                <
                                img src = {
                                    row.def_photo
                                }
                                alt = "Defect"
                                style = {
                                    {
                                        width: 160,
                                        borderRadius: 6,
                                        border: "1px solid #ddd",
                                        cursor: "pointer"
                                    }
                                }
                                /> <
                                /a> <
                                /Box>
                            )
                        } <
                        /Paper> <
                        /Grid>
                    ))
                } <
                /Grid>
            )
        } <
        /DialogContent> <
        /Dialog>
    );
};

export default DynamicViewer;