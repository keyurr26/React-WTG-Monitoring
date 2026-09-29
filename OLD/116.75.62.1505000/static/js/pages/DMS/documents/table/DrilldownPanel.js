import React, {
    useState
} from "react";
import {
    Box,
    Tabs,
    Tab
} from "@mui/material";

import OverviewTab from "./tabs/OverviewTab";
import ApprovalFlowTab from "./tabs/ApprovalFlowTab";
import CommentSheet from "./tabs/CommentSheet";

import {
    GetReviewCommentsData
} from "../../../../Redux/DmsData/Document/DocumentAction";


const TABS = ["Overview", "Approval flow", "Comment Sheet"];

const DrilldownPanel = ({
        doc,
        fetchVersions,
        fetchApprovalFlow
    }) => {
        const [tab, setTab] = useState(0);

        return ( <
            Box > { /* ================= TAB HEADER ================= */ } <
            Box sx = {
                {
                    borderBottom: "0.5px solid",
                    borderColor: "divider",
                    bgcolor: "grey.50",
                    px: 1.5,
                }
            } >
            <
            Tabs value = {
                tab
            }
            onChange = {
                (_, v) => setTab(v)
            }
            sx = {
                {
                    minHeight: 36,

                    "& .MuiTab-root": {
                        minHeight: 36,
                        py: 0,
                        px: 1.5,
                        fontSize: "0.75rem",
                        textTransform: "none",
                        fontWeight: 400,
                        color: "text.secondary",

                        "&.Mui-selected": {
                            fontWeight: 500,
                            color: "primary.main",
                        },
                    },

                    "& .MuiTabs-indicator": {
                        height: 2,
                    },
                }
            } >
            {
                TABS.map((t) => ( <
                    Tab key = {
                        t
                    }
                    label = {
                        t
                    }
                    disableRipple / >
                ))
            } <
            /Tabs> <
            /Box>

            { /* ================= TAB BODY ================= */ } <
            Box sx = {
                {
                    p: 1.5
                }
            } > {
                tab === 0 && < OverviewTab doc = {
                    doc
                }
                />}

                {
                    tab === 1 && ( <
                        ApprovalFlowTab doc = {
                            doc
                        }
                        fetchApprovalFlow = {
                            fetchApprovalFlow
                        }
                        />
                    )
                }

                {
                    tab === 2 && ( <
                        CommentSheet doc = {
                            doc
                        }
                        fetchComments = {
                            GetReviewCommentsData
                        }
                        />
                    )
                } <
                /Box> <
                /Box>
            );
        };

        export default DrilldownPanel;