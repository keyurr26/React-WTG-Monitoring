import React, {
    useState,
    useEffect,
    useMemo
} from "react";
import {
    useSearchParams
} from "react-router-dom";
import {
    useSelector
} from "react-redux";
import {
    GetMyProjectsData
} from "../../../Redux/DmsData/AssignTask/AssignTaskAction";
import {
    GetWindFarmMasterData
} from "../../../Redux/MasterData/masterAction";
import {
    GetDocumentsData
} from "../../../Redux/DmsData/Document/DocumentAction";
import {
    useDispatch
} from "react-redux";
import DocumentToolbar from "./components/DocumentToolbar";
import {
    Box,
    Typography,
} from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import DocumentTable from "./table/DocumentTable";

const DocumentsContainer = () => {
    const dispatch = useDispatch();

    const documents = useSelector(
        (state) => state.document ? .documents ? ? []
    );

    const assignedProjects = useSelector(
        (state) => state.assignTask ? .projects ? ? []
    );

    const windFarms = useSelector(
        (state) => state.masterData.windFarms
    );

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    dispatch(GetDocumentsData()),
                    dispatch(GetMyProjectsData()),
                    dispatch(GetWindFarmMasterData()),
                ]);
            } catch (error) {
                console.error(error);
            }
        };

        loadData();
    }, [dispatch]);


    const [searchParams] = useSearchParams();

    const projectIdFromURL = searchParams.get("projectId");
    const windfarmIdFromURL = searchParams.get("windfarmId");

    const assignedProjectIds = useMemo(() => {
        return assignedProjects.map((project) => Number(project.id));
    }, [assignedProjects]);

    const filteredWindFarms = useMemo(() => {
        if (!Array.isArray(windFarms)) return [];

        return windFarms.filter((wf) =>
            assignedProjectIds.includes(Number(wf.project || wf.project_id)),
        );
    }, [windFarms, assignedProjectIds]);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [filterProject, setFilterProject] = useState(projectIdFromURL || "All");
    const [filterWindfarm, setFilterWindfarm] = useState(
        windfarmIdFromURL || "All",
    );

    useEffect(() => {
        setFilterProject(projectIdFromURL || "All");
        setFilterWindfarm(windfarmIdFromURL || "All");
    }, [projectIdFromURL, windfarmIdFromURL]);

    const filteredDocs = documents.filter((doc) => {
        // ================= SEARCH FILTER =================
        const matchesSearch = (doc.title || "")
            .toLowerCase()
            .includes(search.toLowerCase());

        // ================= STATUS FILTER =================
        const matchesStatus =
            statusFilter === "All" ||
            (doc.status || "").toLowerCase() === statusFilter.toLowerCase();

        // ================= PROJECT FILTER =================
        const docProjectId = doc.project ? .id || doc.project || doc.projectId;

        const matchesProject =
            filterProject === "All" || Number(docProjectId) === Number(filterProject);

        // ================= WINDFARM FILTER =================
        const docWindfarmId = doc.windfarm ? .id || doc.windfarm || doc.windfarmId;

        const matchesWindfarm =
            filterWindfarm === "All" ||
            Number(docWindfarmId) === Number(filterWindfarm);

        // ================= FINAL RESULT =================
        return matchesSearch && matchesStatus && matchesProject && matchesWindfarm;
    });

    // Edit Dialog States
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);


    return ( <
        >
        <
        Box sx = {
            {
                px: 5,
                py: 2,
                backgroundColor: "#f4f6f8",
                minHeight: "100vh",
            }
        } >
        <
        Box sx = {
            {
                position: "relative",
                mb: 2
            }
        } > { /* Page Title */ } <
        Typography variant = "h5"
        fontWeight = {
            700
        }
        textAlign = "center"
        color = "#00416A"
        sx = {
            {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
            }
        } >
        <
        AssignmentTurnedInIcon sx = {
            {
                fontSize: 32
            }
        }
        />
        Document Master <
        /Typography> <
        /Box>

        <
        Box sx = {
            {
                maxWidth: "100%",
                mx: "auto"
            }
        } >
        <
        DocumentToolbar
        // Search
        search = {
            search
        }
        setSearch = {
            setSearch
        }
        // Status Filter
        statusFilter = {
            statusFilter
        }
        setStatusFilter = {
            setStatusFilter
        }
        // Project Filter
        filterProject = {
            filterProject
        }
        setFilterProject = {
            setFilterProject
        }
        // Windfarm Filter
        filterWindfarm = {
            filterWindfarm
        }
        setFilterWindfarm = {
            setFilterWindfarm
        }
        // Assigned projects only
        projects = {
            assignedProjects
        }
        windfarms = {
            filteredWindFarms
        }

        documents = {
            documents
        }
        // Edit Mode
        editData = {
            openEdit ? selectedDoc : null
        }
        // Refresh after create
        onAdd = {
            async () => {
                await dispatch(GetDocumentsData());
            }
        }
        // Refresh after update
        onUpdate = {
            async () => {
                await dispatch(GetDocumentsData());
                setOpenEdit(false);
                setSelectedDoc(null);
            }
        }
        />


        <
        DocumentTable
        // data={documents}
        data = {
            filteredDocs
        }
        onEdit = {
            (doc) => {
                setSelectedDoc(doc);
                setOpenEdit(true);
            }
        }
        onView = {
            (doc) => {
                setSelectedDoc(doc);
                // setOpenView(true);
            }
        }
        onDelete = {
            (doc) => {
                setSelectedDoc(doc);
                // setOpenDelete(true);
            }
        }
        /> <
        /Box> <
        /Box> <
        />
    );
};

export default DocumentsContainer;