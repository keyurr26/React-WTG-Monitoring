import React, {
    useEffect
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    GetMaterialRecivedData
} from "../../Redux/MasterData/masterAction";
import {
    DataGrid
} from "@mui/x-data-grid";
import {
    Typography,
    Paper
} from "@mui/material";

function MaterialReceivedTable({
    selectedProject,
    selectedWindfarm
}) {
    const dispatch = useDispatch();

    const {
        FetchMaterialRecivedData = []
    } = useSelector(
        (state) => state.masterData || {}
    );

    useEffect(() => {
        dispatch(GetMaterialRecivedData());
    }, [dispatch]);

    // 🔥 Filter by project + windfarm
    const filteredData = FetchMaterialRecivedData.filter(item =>
        item.project === selectedProject &&
        item.windfarm === selectedWindfarm
    );

    // 🔥 Sort and take latest 10
    const latestEntries = [...filteredData]
        .sort((a, b) => new Date(b.received_date) - new Date(a.received_date))
        .slice(0, 10);

    const columns = [{
            field: "id",
            headerName: "ID",
            width: 70
        },
        {
            field: "material_name",
            headerName: "Material",
            width: 160
        },
        {
            field: "project_name",
            headerName: "Project",
            width: 160
        },
        {
            field: "windfarm_name",
            headerName: "Windfarm",
            width: 160
        },
        {
            field: "quantity",
            headerName: "Qty",
            width: 100
        },
        {
            field: "grn_entry",
            headerName: "GR No.",
            width: 100
        },
        {
            field: "received_by",
            headerName: "Received By",
            width: 140
        },
        {
            field: "received_date",
            headerName: "Received Date",
            width: 140
        },
    ];

    return ( <
        Paper elevation = {
            1
        }
        style = {
            {
                padding: "20px",
                marginTop: "20px",
                borderRadius: "10px"
            }
        } >
        <
        Typography variant = "h6"

        style = {
            {
                marginBottom: "10px",
                fontWeight: 700,
                color: "#00416A"
            }
        } >
        Latest 10 Received Materials <
        /Typography>

        <
        div >
        <
        DataGrid rows = {
            latestEntries
        }
        columns = {
            columns
        }
        pageSize = {
            10
        }
        rowsPerPageOptions = {
            [10]
        }
        getRowId = {
            (row) => row.id
        }
        sx = {
            {
                height: 400,
            }
        }

        /> <
        /div> <
        /Paper>
    );
}

export default MaterialReceivedTable;