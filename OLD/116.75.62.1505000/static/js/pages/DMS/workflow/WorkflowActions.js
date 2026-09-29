import React from "react";
import {
    Button,
    Stack
} from "@mui/material";
import {
    useSelector
} from "react-redux";

const btnSx = {
    fontSize: "0.7rem",
    px: 1,
    py: 0.2,
    minHeight: 24,
    lineHeight: 1,
    textTransform: "none",
    borderRadius: "4px",
};

const WorkflowActions = ({
    doc,
    onSubmit,
    onSubmitReview,
    onSubmitAction,
    onApprove,
    onReject,
    onUpload,
}) => {
    const user = useSelector((state) => state.auth ? .user);
    const role = user ? .role;
    const isAdmin = role === "admin";
    const isInspector = role === "inspector";
    const isCustomer = role === "customer";


    // Normalize status
    const status = String(doc ? .status || "").toLowerCase();

    //  INSPECTOR
    const renderInspector = () => {
        switch (status) {

            // Inspector can inward only in pending
            case "pending":
                return ( <
                    Stack direction = "row"
                    spacing = {
                        0.5
                    }
                    justifyContent = "center" >
                    <
                    Button size = "small"
                    variant = "contained"
                    color = "primary"
                    sx = {
                        btnSx
                    }
                    onClick = {
                        () => onSubmit ? .(doc)
                    } >
                    Inward <
                    /Button> <
                    /Stack>
                );

                // After inward disable button
            case "pm_review":
            case "action_required":
            case "consultant_review":
            case "technical_approval":
            case "approved_for_estimate":
            case "approved":
            case "rejected":
                // case "rejected":
                return ( <
                    Stack direction = "row"
                    spacing = {
                        0.5
                    }
                    justifyContent = "center" >
                    <
                    Button size = "small"
                    variant = "contained"
                    disabled sx = {
                        btnSx
                    } >
                    Inwarded <
                    /Button> <
                    /Stack>
                );

                // Revision upload
            case "revision_required":
                if (doc ? .is_revision_uploaded) {
                    return ( <
                        Stack direction = "row"
                        spacing = {
                            0.5
                        }
                        justifyContent = "center" >
                        <
                        Button size = "small"
                        variant = "contained"
                        disabled sx = {
                            btnSx
                        } >
                        Uploaded <
                        /Button> <
                        /Stack>
                    );
                }

                return ( <
                    Stack direction = "row"
                    spacing = {
                        0.5
                    }
                    justifyContent = "center" >
                    <
                    Button size = "small"
                    variant = "contained"
                    color = "warning"
                    sx = {
                        btnSx
                    }
                    onClick = {
                        () => onUpload ? .(doc)
                    } >
                    Upload Revision <
                    /Button> <
                    /Stack>
                );

            default:
                return null;
        }
    };

    /* -------------------------------------------------
       ADMIN / PM
    ------------------------------------------------- */
    const renderAdmin = () => {

        // PM REVIEW
        if (status === "pm_review") {
            return ( <
                Stack direction = "row"
                spacing = {
                    0.5
                }
                justifyContent = "center" >
                <
                Button size = "small"
                variant = "contained"
                sx = {
                    btnSx
                }
                onClick = {
                    () => onSubmitReview ? .(doc)
                } >
                Submit For Review <
                /Button> <
                /Stack>
            );
        }

        // CONSULTANT REVIEW
        if (status === "consultant_review") {
            return ( <
                Stack direction = "row"
                spacing = {
                    0.5
                }
                justifyContent = "center" >
                <
                Button size = "small"
                variant = "contained"
                disabled sx = {
                    btnSx
                } >
                Submitted <
                /Button> <
                /Stack>
            );
        }

        // ------------------------------------------------
        // ACTION REQUIRED
        // ------------------------------------------------
        if (status === "action_required" ||
            status === "rejected") {

            return ( <
                Stack direction = "row"
                spacing = {
                    0.5
                }
                justifyContent = "center" >
                <
                Button size = "small"
                variant = "contained"
                color = "warning"
                sx = {
                    btnSx
                }
                onClick = {
                    () => onSubmitReview ? .(doc)
                } >
                Submit For Action <
                /Button> <
                /Stack>
            );
        }

        // ------------------------------------------------
        // REVISION REQUIRED
        // ------------------------------------------------
        if (status === "revision_required" ||
            status === "approved"
        ) {

            return ( <
                Stack direction = "row"
                spacing = {
                    0.5
                }
                justifyContent = "center" >
                <
                Button size = "small"
                variant = "contained"
                disabled sx = {
                    btnSx
                } >
                Submitted <
                /Button> <
                /Stack>
            );
        }

        return null;
    };
    /* -------------------------------------------------
       CUSTOMER / CONSULTANT
    ------------------------------------------------- */
    const renderCustomer = () => {

        // ------------------------------------------------
        // CONSULTANT ALREADY REVIEWED
        // ------------------------------------------------
        if (
            doc ? .consultant_reviewed ||
            status === "revision_required" ||
            status === "action_required" ||
            status === "pm_review" ||
            status === "approved" ||
            status === "rejected"
        ) {
            return ( <
                Stack direction = "row"
                spacing = {
                    0.5
                }
                alignItems = "center" >
                <
                Button size = "small"
                variant = "contained"
                disabled sx = {
                    btnSx
                } >
                Reviewed <
                /Button> <
                /Stack>
            );
        }

        // ------------------------------------------------
        // ACTIVE CONSULTANT REVIEW
        // ------------------------------------------------
        if (status === "consultant_review") {
            return ( <
                Stack direction = "row"
                spacing = {
                    0.5
                }
                alignItems = "center" >
                <
                Button size = "small"
                variant = "contained"
                color = "primary"
                sx = {
                    btnSx
                }
                onClick = {
                    () => onApprove ? .(doc)
                } >
                Review <
                /Button> <
                /Stack>
            );
        }

        return null;
    };

    /* -------------------------------------------------
       MAIN
    ------------------------------------------------- */
    return ( <
        Stack direction = "row"
        spacing = {
            0.5
        }
        alignItems = "center"
        justifyContent = "center"
        sx = {
            {
                height: "100%",
                lineHeight: 1,
                width: "100%",
            }
        } >
        {
            isInspector && renderInspector()
        } {
            isAdmin && renderAdmin()
        } {
            isCustomer && renderCustomer()
        } <
        /Stack>
    );
};

export default WorkflowActions;