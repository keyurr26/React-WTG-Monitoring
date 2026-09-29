import React, {
    useEffect
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {

    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import {
    GetMaterialIssueData
} from "../../Redux/MasterData/masterAction";

function MaterialReturnTable({
    selectedProject,
    selectedWindfarm,
    selectedMaterial,
    onRowSelect
}) {
    const dispatch = useDispatch();
    const {
        MaterialIssueData
    } = useSelector((state) => state.masterData);

    useEffect(() => {
        dispatch(GetMaterialIssueData());
    }, [dispatch]);

    // -------------------- FILTER LOGIC --------------------
    const filteredIssues = (MaterialIssueData || [])
        .filter((item) =>
            selectedProject ? Number(item.project) === Number(selectedProject) : true
        )
        .filter((item) =>
            selectedWindfarm ? Number(item.windfarm) === Number(selectedWindfarm) : true
        )
        .filter((item) =>
            selectedMaterial ? Number(item.material) === Number(selectedMaterial) : true
        );

    return ( <
        Card sx = {
            {
                mt: 3
            }
        } >
        <
        CardContent >
        <
        Typography variant = "h6"
        sx = {
            {
                color: "#00416A",
                fontWeight: 700
            }
        } > Issued Material List < /Typography>

        <
        TableContainer component = {
            Paper
        }
        sx = {
            {
                mt: 2,
                maxHeight: 300
            }
        } >
        <
        Table stickyHeader >
        <
        TableHead >
        <
        TableRow >
        <
        TableCell sx = {
            {
                background: "#00416A",
                color: "#fff"
            }
        } > ID < /TableCell> <
        TableCell sx = {
            {
                background: "#00416A",
                color: "#fff"
            }
        } > Material < /TableCell> <
        TableCell sx = {
            {
                background: "#00416A",
                color: "#fff"
            }
        } > Qty < /TableCell> <
        TableCell sx = {
            {
                background: "#00416A",
                color: "#fff"
            }
        } > WO No < /TableCell> <
        TableCell sx = {
            {
                background: "#00416A",
                color: "#fff"
            }
        } > Issue Date < /TableCell> <
        /TableRow> <
        /TableHead>

        <
        TableBody > {
            filteredIssues.length > 0 ? (
                filteredIssues.map((item) => ( <
                    TableRow key = {
                        item.id
                    }
                    hover sx = {
                        {
                            cursor: "pointer"
                        }
                    }
                    onClick = {
                        () => onRowSelect(item)
                    } >
                    <
                    TableCell > {
                        item.id
                    } < /TableCell> <
                    TableCell > {
                        item.material_name
                    } < /TableCell> <
                    TableCell > {
                        item.quantity
                    } < /TableCell> <
                    TableCell > {
                        item.work_order_no
                    } < /TableCell> <
                    TableCell > {
                        item.issued_date
                    } < /TableCell> <
                    /TableRow>
                ))
            ) : ( <
                TableRow >
                <
                TableCell colSpan = {
                    5
                }
                align = "center" >
                No data available <
                /TableCell> <
                /TableRow>
            )
        } <
        /TableBody> <
        /Table> <
        /TableContainer> <
        /CardContent> <
        /Card>
    );
}

export default MaterialReturnTable;