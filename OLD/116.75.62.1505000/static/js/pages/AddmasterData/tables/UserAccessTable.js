import React, {
    useState,
    useEffect,
    useMemo
} from "react";
import {
    DataGrid
} from "@mui/x-data-grid";
import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Typography,
    Box
} from "@mui/material";
import {
    Snackbar,
    Alert
} from "@mui/material";
import {
    GetProjectsData,
    GetWindFarmMasterData,
    GetUserMasterData,
    getUserAccessData,
    createUserAccess
} from "../../../Redux/MasterData/masterAction";


// -------------------- GRID COLUMNS --------------------
const columns = [{
        field: "client",
        headerName: "Client",
        flex: 1,
        minWidth: 150
    },
    {
        field: "project",
        headerName: "Project",
        flex: 1,
        minWidth: 150
    },
    {
        field: "windfarm",
        headerName: "Windfarm",
        flex: 1,
        minWidth: 150,
        valueGetter: (params) => params.row.windfarm || "—"
    }
];


export default function UserAccessTable() {
    const dispatch = useDispatch();

    // -------------------- STATE --------------------
    const [selectedUser, setSelectedUser] = useState("");
    const [userRole, setUserRole] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedWindfarm, setSelectedWindfarm] = useState("");
    const [selectionModel, setSelectionModel] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    // console.log("selectedUser:", selectedUser);
    // console.log("selectionModel:", selectionModel);

    const {
        FetchUsermasterData = [],
            projects = [],
            WindfarmData = [],
            accesses = [],
    } = useSelector((state) => state.masterData || {});

    const windfarms = WindfarmData;

    // -------------------- FETCH MASTER DATA --------------------
    useEffect(() => {
        dispatch(GetUserMasterData());
        dispatch(GetProjectsData());
        dispatch(GetWindFarmMasterData());
        dispatch(getUserAccessData());
    }, [dispatch]);

    // -------------------- BUILD TABLE ROWS --------------------
    const tableRows = useMemo(() => {
        let rows = [];

        projects.forEach((project) => {
            const relatedWindfarms = windfarms.filter(
                (w) => w.project === project.id,
            );

            // Project level row
            rows.push({
                id: `p-${project.id}`,
                client: project.client_name,
                project: project.project_name,
                windfarm: "—",
                projectId: project.id,
                windfarmId: null,
            });

            // Windfarm level rows
            relatedWindfarms.forEach((wf) => {
                rows.push({
                    id: `${project.id}-${wf.id}`,
                    client: project.client_name,
                    project: project.project_name,
                    windfarm: wf.windfarm_name,
                    projectId: project.id,
                    windfarmId: wf.id,
                });
            });
        });

        return rows;
    }, [projects, windfarms]);

    // -------------------- UPDATE ROLE --------------------

    const projectLevelAccess = useMemo(() => {
        if (!selectedUser) return [];

        return accesses
            .filter(
                (a) =>
                Number(a.user) === Number(selectedUser) && !a.windfarm && a.is_active,
            )
            .map((a) => a.project);
    }, [accesses, selectedUser]);

    // Update Role
    useEffect(() => {
        const user = FetchUsermasterData.find(
            (u) => Number(u.id) === Number(selectedUser),
        );

        setUserRole(user ? .role || "");
    }, [selectedUser, FetchUsermasterData]);

    // Reset Selection When User Changes
    useEffect(() => {
        setSelectionModel([]);
    }, [selectedUser]);

    // Auto Tick Existing Access
    useEffect(() => {
        if (!selectedUser || !accesses ? .length) return;

        let userAccess = accesses.filter(
            (access) => Number(access.user) === Number(selectedUser),
        );

        // Filter by selected project
        if (selectedProject) {
            userAccess = userAccess.filter(
                (access) => Number(access.project) === Number(selectedProject),
            );
        }

        // Filter by selected windfarm
        if (selectedWindfarm) {
            userAccess = userAccess.filter(
                (access) => Number(access.windfarm) === Number(selectedWindfarm),
            );
        }

        const selectedIds = userAccess.flatMap((access) => {
            // Project level
            if (!access.windfarm) {
                const windfarmRows = tableRows
                    .filter((row) => row.projectId === access.project && row.windfarmId)
                    .map((row) => row.id);

                return [`p-${access.project}`, ...windfarmRows];
            }

            // Windfarm level
            return [`${access.project}-${access.windfarm}`];
        });

        setSelectionModel(selectedIds);
    }, [selectedUser, selectedProject, selectedWindfarm, accesses]);

    // useEffect(() => {

    //     let rows = tableRows;

    //     if (selectedProject) {
    //         rows = rows.filter(r => r.projectId === selectedProject);
    //     }

    //     if (selectedWindfarm) {
    //         rows = rows.filter(r => r.windfarmId === selectedWindfarm);
    //     }

    //     setFilteredRows(rows);

    // }, [selectedProject, selectedWindfarm, tableRows]);


    // -------------------- FILTER GRID --------------------

    useEffect(() => {
        let rows = tableRows;

        if (selectedWindfarm) {
            // Show only the specific windfarm row
            rows = rows.filter((r) => r.windfarmId === selectedWindfarm);
        } else if (selectedProject) {
            // Show only the project-level row (where windfarmId is null) for that project
            rows = rows.filter(
                (r) => r.projectId === selectedProject && r.windfarmId === null,
            );
        }

        setFilteredRows(rows);
    }, [selectedProject, selectedWindfarm, tableRows]);

    // -------------------- WIND FARM FILTER --------------------
    const availableWindfarms = selectedProject ?
        windfarms.filter((w) => w.project === selectedProject) :
        windfarms;

    // -------------------- SUBMIT ACCESS --------------------
    const handleSubmit = async () => {
        if (!selectedUser) return;

        const rowMap = Object.fromEntries(
            filteredRows.map((r) => [String(r.id), r]),
        );

        const payload = selectionModel
            .map((rowId) => rowMap[String(rowId)])
            .filter(Boolean)
            .reduce((acc, row) => {
                if (row.windfarmId && selectionModel.includes(`p-${row.projectId}`))
                    return acc;

                acc.push({
                    user: Number(selectedUser),
                    project: Number(row.projectId),
                    windfarm: row.windfarmId || null,
                    access_level: row.windfarmId ? "windfarm" : "project",
                });

                return acc;
            }, []);

        try {
            await dispatch(createUserAccess(payload));

            setSnackbar({
                open: true,
                message: "Access assigned successfully",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: error || "Failed to assign access",
                severity: "error",
            });
        }
    };

    // -------------------- UI --------------------
    return ( <
        >
        <
        Paper elevation = {
            1
        }
        sx = {
            {
                p: 3,
                mt: -2,
                px: 4,
                borderRadius: 2,
                border: "1px solid #00416A",
            }
        } >
        <
        Typography variant = "h6"
        sx = {
            {
                fontWeight: 700,
                color: "#00416A",
                mb: 2,
                mt: 1.4
            }
        } >
        User Access Manager <
        /Typography>

        { /* USER */ } <
        FormControl sx = {
            {
                mr: 2,
                minWidth: 200
            }
        } >
        <
        InputLabel shrink > User < /InputLabel> <
        Select value = {
            selectedUser
        }
        label = "User"
        displayEmpty onChange = {
            (e) => {
                setSelectedUser(Number(e.target.value));
                setSelectedProject("");
                setSelectedWindfarm("");
                setSelectionModel([]);
            }
        }
        // onChange={(e) => setSelectedUser(Number(e.target.value))}
        >
        <
        MenuItem value = "" > --Select User-- < /MenuItem> {
            FetchUsermasterData.map((u) => ( <
                MenuItem key = {
                    u.id
                }
                value = {
                    u.id
                } > {
                    u.full_name
                } <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl>

        { /* ROLE */ } <
        FormControl sx = {
            {
                mr: 2,
                minWidth: 150
            }
        } >
        <
        InputLabel > Role < /InputLabel> <
        Select value = {
            userRole
        }
        label = "Role"
        disabled >
        <
        MenuItem value = {
            userRole
        } > {
            userRole
        } < /MenuItem> <
        /Select> <
        /FormControl>

        { /* PROJECT */ } <
        FormControl sx = {
            {
                mr: 2,
                minWidth: 200
            }
        } >
        <
        InputLabel shrink > Project < /InputLabel> <
        Select value = {
            selectedProject
        }
        label = "Project"
        displayEmpty onChange = {
            (e) => {
                setSelectedProject(Number(e.target.value));
                setSelectedWindfarm("");
            }
        } >
        <
        MenuItem value = "" > --Select Project-- < /MenuItem> {
            projects.map((p) => ( <
                MenuItem key = {
                    p.id
                }
                value = {
                    p.id
                } > {
                    p.project_name
                } <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl>

        { /* WIND FARM */ } <
        FormControl sx = {
            {
                mr: 2,
                minWidth: 200
            }
        } >
        <
        InputLabel shrink > Windfarm < /InputLabel> <
        Select value = {
            selectedWindfarm
        }
        label = "Windfarm"
        displayEmpty onChange = {
            (e) =>
            setSelectedWindfarm(
                e.target.value === "" ? "" : Number(e.target.value),
            )
        } >
        <
        MenuItem value = "" > --Select Windfarm-- < /MenuItem>

        {
            availableWindfarms.map((w) => ( <
                MenuItem key = {
                    w.id
                }
                value = {
                    w.id
                } > {
                    w.windfarm_name
                } <
                /MenuItem>
            ))
        } <
        /Select> <
        /FormControl> <
        /Paper>

        { /* GRID */ } <
        Paper sx = {
            {
                height: 400,
                width: "100%",
                mt: 3
            }
        } >
        <
        DataGrid rows = {
            filteredRows
        }
        columns = {
            columns
        }
        checkboxSelection disableRowSelectionOnClick selectionModel = {
            selectionModel
        }
        // onSelectionModelChange={(newSelection) =>
        //     setSelectionModel(newSelection)
        // }
        // onSelectionModelChange={(newSelection) => {

        //     let updatedSelection = [...newSelection];

        //     // Find all selected project rows
        //     newSelection.forEach((id) => {

        //         if (String(id).startsWith("p-")) {

        //             const projectId = Number(String(id).replace("p-", ""));

        //             // Get all windfarms under that project
        //             const windfarmRows = tableRows
        //                 .filter(row => row.projectId === projectId && row.windfarmId)
        //                 .map(row => row.id);

        //             updatedSelection = [
        //                 ...new Set([...updatedSelection, ...windfarmRows])
        //             ];
        //         }
        //     });

        //     setSelectionModel(updatedSelection);
        // }}

        onSelectionModelChange = {
            (newSelection) => {
                const cleanedSelection = newSelection.filter((id) => {
                    if (!String(id).includes("-")) return true;

                    const [projectId] = String(id).split("-");

                    return !projectLevelAccess.includes(Number(projectId));
                });

                setSelectionModel(cleanedSelection);
            }
        }
        isRowSelectable = {
            (params) => {
                const row = params.row;

                // If backend says project level access exists
                if (row.windfarmId && projectLevelAccess.includes(row.projectId)) {
                    return false;
                }

                // UI selection case
                if (
                    row.windfarmId &&
                    selectionModel.includes(`p-${row.projectId}`)
                ) {
                    return false;
                }

                return true;
            }
        }
        pageSizeOptions = {
            [5, 10]
        }
        sx = {
            {
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#0f52ba",
                    color: "#fff",
                    fontWeight: "bold",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 600,
                },
            }
        }
        /> <
        Snackbar open = {
            snackbar.open
        }
        autoHideDuration = {
            3000
        }
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        } >
        <
        Alert severity = {
            snackbar.severity
        }
        variant = "filled"
        onClose = {
            () => setSnackbar({ ...snackbar,
                open: false
            })
        } >
        {
            snackbar.message
        } <
        /Alert> <
        /Snackbar> <
        /Paper>

        { /* SUBMIT */ } <
        Box sx = {
            {
                textAlign: "center"
            }
        } >
        <
        Button variant = "contained"
        sx = {
            {
                mt: 2,
                textTransform: "none"
            }
        }
        size = "small"
        disabled = {!selectedUser || selectionModel.length === 0
        }
        onClick = {
            handleSubmit
        } >
        Submit Access <
        /Button> <
        /Box> <
        />
    );
}