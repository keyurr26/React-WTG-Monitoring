import React, {
    useEffect,
    useMemo,
    useState
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetMaterialRecivedData,
    GetMaterialIssueData,
    GetMaterialReturnNotes,
    GetMaterialRejectNoteData,
} from "../../../Redux/MasterData/masterAction";
import {
    DataGrid
} from "@mui/x-data-grid";
import {
    Box,
    Paper,
    Typography
} from "@mui/material";
import {
    calculateMaterialStock
} from "../../../utils/calcMaterialStock";

const MaterialStockTable = ({
    selectedProject,
    selectedWindfarm,
    selectedMaterial,
    onIssuedChange,
}) => {
    const dispatch = useDispatch();
    const [rows, setRows] = useState([]);
    const [warning, setWarning] = useState("");

    const {
        FetchMaterialRecivedData = [],
            MaterialIssueData = [],
            materialReturnNotes = [],
            MaterialRejectList = [],
            loading = false,
    } = useSelector((state) => state.masterData || {});

    //  Fetch all required API data once
    useEffect(() => {
        dispatch(GetMaterialRecivedData());
        dispatch(GetMaterialIssueData());
        dispatch(GetMaterialReturnNotes());
        dispatch(GetMaterialRejectNoteData());
    }, [dispatch]);

    //  PRE-PROCESS: Create hash maps (FAST lookup)
    // const indexedData = useMemo(() => {
    //     const issueMap = {};
    //     const rejectMap = {};
    //     const returnMap = {};

    //     MaterialIssueData.forEach((i) => {
    //         if (!issueMap[i.received]) issueMap[i.received] = [];
    //         issueMap[i.received].push(i);
    //     });

    //     MaterialRejectList.forEach((r) => {
    //         if (!rejectMap[r.issue]) rejectMap[r.issue] = [];
    //         rejectMap[r.issue].push(r);
    //     });

    //     materialReturnNotes.forEach((r) => {
    //         if (!returnMap[r.issue]) returnMap[r.issue] = [];
    //         returnMap[r.issue].push(r);
    //     });

    //     return { issueMap, rejectMap, returnMap };
    // }, [MaterialIssueData, MaterialRejectList, materialReturnNotes]);

    //  FINAL STOCK CALCULATION (FAST)
    const mergedRows = useMemo(() => {
        const filtered = FetchMaterialRecivedData.filter((row) => {
            if (selectedProject && row.project !== selectedProject) return false;
            if (selectedWindfarm && row.windfarm !== selectedWindfarm) return false;
            if (selectedMaterial && row.material !== Number(selectedMaterial))
                return false;
            return true;
        })
        return calculateMaterialStock(
            filtered,
            MaterialIssueData,
            materialReturnNotes,
            MaterialRejectList
        );
        // .map((row) => {
        //     const issues = indexedData.issueMap[row.id] || [];

        //     const totalIssued = issues.reduce(
        //         (sum, i) => sum + Number(i.quantity || 0),
        //         0
        //     );

        //     const totalRejected = issues.reduce((sum, i) => {
        //         const rejects = indexedData.rejectMap[i.id] || [];
        //         return (
        //             sum +
        //             rejects.reduce((s, r) => s + Number(r.reject_qty || 0), 0)
        //         );
        //     }, 0);

        //     const totalReturned = issues.reduce((sum, i) => {
        //         const returns = indexedData.returnMap[i.id] || [];
        //         return (
        //             sum +
        //             returns.reduce((s, r) => s + Number(r.return_qty || 0), 0)
        //         );
        //     }, 0);

        //     const balance =
        //         Number(row.quantity || 0) -
        //         totalIssued -
        //         totalRejected +
        //         totalReturned;

        //     return {
        //         ...row,
        //         received_id: row.id,
        //         issues,
        //         total_issued: totalIssued,
        //         total_rejected: totalRejected,
        //         total_returned: totalReturned,
        //         balance_qty: balance,
        //         new_issue: 0,
        //     };
        // });
    }, [
        FetchMaterialRecivedData,
        MaterialIssueData,
        MaterialRejectList,
        materialReturnNotes,
        selectedProject,
        selectedWindfarm,
        selectedMaterial,

    ]);

    // push to state
    useEffect(() => {
        setRows(mergedRows.filter((r) => r.balance_qty > 0));
    }, [mergedRows]);

    // 🔵 NEW ISSUE EDIT LOGIC
    const handleRowEdit = (params) => {
        const {
            id,
            field,
            value
        } = params;
        if (field !== "new_issue") return;

        setRows((prevRows) => {
            const updated = prevRows.map((r) => {
                if (r.received_id === id) {
                    const newIssue = Number(value);
                    const originalBalance =
                        Number(r.quantity || 0) -
                        Number(r.total_issued || 0) -
                        Number(r.total_rejected || 0) +
                        Number(r.total_returned || 0);

                    if (newIssue > originalBalance) {
                        setWarning(
                            `⚠ Cannot issue ${newIssue}. Only ${originalBalance} available.`
                        );
                        return r;
                    }

                    setWarning("");

                    const newTotalIssued = Number(r.total_issued || 0) + newIssue;

                    return {
                        ...r,
                        new_issue: newIssue,
                        total_issued: newTotalIssued,
                        balance_qty: Number(r.quantity || 0) -
                            newTotalIssued -
                            Number(r.total_rejected || 0) +
                            Number(r.total_returned || 0),
                    };
                }
                return r;
            });

            onIssuedChange &&
                onIssuedChange(
                    updated,
                    updated.reduce((s, r) => s + Number(r.total_issued || 0), 0)
                );

            return updated;
        });
    };

    const columns = [
        //   { field: "received_id", headerName: "Sr No", width: 90 },
        {
            field: "new_issue",
            headerName: "New Issue",
            width: 120,
            editable: true,
            cellClassName: "new-issue-cell",
        },
        {
            field: "balance_qty",
            headerName: "Balance Qty",
            width: 130
        },
        {
            field: "material_name",
            headerName: "Material",
            width: 130
        },
        {
            field: "project_name",
            headerName: "Project",
            width: 130
        },
        {
            field: "windfarm_name",
            headerName: "Windfarm",
            width: 130
        },

        {
            field: "quantity",
            headerName: "Received Qty",
            width: 130
        },
        {
            field: "received_date",
            headerName: "Received Date",
            width: 130
        },
        {
            field: "total_issued",
            headerName: "Issued",
            width: 110
        },
        {
            field: "total_returned",
            headerName: "Returned",
            width: 110
        },
        {
            field: "total_rejected",
            headerName: "Rejected",
            width: 110
        },
    ];

    return ( <
        Paper elevation = {
            2
        }
        sx = {
            {
                p: 3,
                mt: 3,
                borderRadius: 2,
                border: "1px solid #00416A"
            }
        } >
        <
        Typography variant = "h6"
        marginBottom = {
            1
        }
        marginTop = {-1.5
        }
        fontWeight = "bold"
        color = "#00416A" >
        Material Stock Summary <
        /Typography>

        <
        Box mt = {
            1
        } > {
            warning && ( <
                div style = {
                    {
                        background: "#ff9800",
                        color: "white",
                        padding: "20px",
                        marginTop: "2px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }
                } >
                {
                    warning
                } <
                /div>
            )
        }

        <
        DataGrid rows = {
            rows
        }
        columns = {
            columns
        }
        loading = {
            loading
        }
        pageSize = {
            10
        }
        getRowId = {
            (r) => r.received_id
        }
        onCellEditCommit = {
            handleRowEdit
        }
        sx = {
            {
                height: "450px",
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#0f52ba',
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "14px",
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                    // color: 'white',
                    fontWeight: 600,
                    // fontSize: '0.875rem',
                },
                // '& .MuiDataGrid-iconSeparator': {
                //     color: 'white',
                // },
                // '& .MuiDataGrid-sortIcon': {
                //     color: 'white',
                // },
                // '& .MuiDataGrid-menuIcon': {
                //     color: 'white',
                // },
                // '& .MuiDataGrid-columnHeader:focus': {
                //     outline: 'none',
                // },
                // '& .MuiDataGrid-cell:focus': {
                //     outline: 'none',
                // },
            }
        }
        /> <
        /Box> <
        /Paper>
    );
};

export default MaterialStockTable;