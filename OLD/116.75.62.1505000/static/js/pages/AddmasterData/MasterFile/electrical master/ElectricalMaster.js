import React, {
    useState,
    useEffect
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import {
    Box,
    Card,
    CardContent,
    Typography
} from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import LineTypeSelector from "./LineTypeSelector";
import LineCreationForm from "./LineCreationForm";
import ElectricalDataTable from "./ElectricalDataTable";
import ElectricalLogsTable from "./ElectricalLogsTable";
import {
    CreateElectricalMasterData,
    GetElectricalMasterData,
} from "../../../../Redux/MasterData/masterAction";

export default function ElectricalMaster() {
    const dispatch = useDispatch();

    const [createLine, setCreateLine] = useState("");
    const [lineType, setLineType] = useState("");
    const [noOfLine, setNoOfLine] = useState("");
    const [tables, setTables] = useState({});
    const isLineTypeSelected = !!lineType;

    const [submitLoading, setSubmitLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const {
        getElectricalMaster = [], loading
    } = useSelector(
        (state) => state.masterData,
    );

    const [filters, setFilters] = useState({
        project: "",
        windfarm: "",
        cluster: "",
        turbine: "",
    });

    const [availableTurbines, setAvailableTurbines] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await dispatch(GetElectricalMasterData());
            } catch (err) {
                console.error("GET API Error:", err);
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {}, [getElectricalMaster]);

    //helper function for dcoh and mcoh line numbering

    const getNextLineNumber = (type) => {
        const prefix = shortNames[type];

        const existing = getElectricalMaster.filter(
            (item) =>
            item.line_type === type &&
            item.project === Number(filters.project) &&
            item.windfarm === Number(filters.windfarm),
        );

        if (!existing.length) return 1;

        const nums = existing
            .map((item) => {
                const match = item.line_name.match(/\d+/);
                return match ? Number(match[0]) : 0;
            })
            .filter((n) => !isNaN(n));

        return nums.length ? Math.max(...nums) + 1 : 1;
    };

    const getLogsByType = (type) => {
        return getElectricalMaster.filter(
            (item) =>
            item.line_type === type &&
            item.project === Number(filters.project) &&
            item.windfarm === Number(filters.windfarm),
        );
    };

    const handleTurbinesChange = (turbines) => {
        setAvailableTurbines(turbines);
    };

    const handleCreateTable = () => {
        const value = Number(noOfLine);

        const prefix = shortNames[lineType] || "LINE";

        const startNumber =
            lineType === "DCOH (Double Circuit Overhead Line)" ||
            lineType === "MCOH (Multi Circuit Overhead Line)" ?
            getNextLineNumber(lineType) :
            1;

        const newRows = Array.from({
            length: value
        }, (_, i) => ({
            id: i + 1,
            name: `${prefix}${startNumber + i}`,
            km: "",
            cluster: "",
            turbine: [],

            totalMW: 0,
            maxTurbines: 0,
            selectedTurbines: 0,
            remainingTurbines: 0,

            // scohDog: "",
            scohDog: [],
            scohLine: [],
            linkedLines: [],
            totalCircuit: "",
            calculated: null,
            status: "",
            statusColor: "default",
        }));

        setTables((prev) => ({
            ...prev,
            [lineType]: newRows,
        }));

        setCreateLine("");
        setNoOfLine("");
    };

    const handleAddRow = (type) => {
        const existingRows = tables[type] || [];

        const prefix = shortNames[type] || "LINE";

        let nextNumber;

        if (
            type === "DCOH (Double Circuit Overhead Line)" ||
            type === "MCOH (Multi Circuit Overhead Line)"
        ) {
            const numbers = existingRows
                .map((r) => {
                    const match = r.name.match(/\d+/);
                    return match ? Number(match[0]) : 0;
                })
                .filter(Boolean);

            nextNumber =
                numbers.length > 0 ? Math.max(...numbers) + 1 : getNextLineNumber(type);
        } else {
            nextNumber = existingRows.length + 1;
        }

        const newRow = {
            id: Date.now(),
            // name: `${prefix}${existingRows.length + 1}`,
            name: `${prefix}${nextNumber}`,

            km: "",
            cluster: "",
            turbine: [],
            totalMW: 0,
            maxTurbines: 0,
            selectedTurbines: 0,
            remainingTurbines: 0,
            // scohDog: "",
            scohDog: [],
            scohLine: [],
            linkedLines: [],
            totalCircuit: "",
            calculated: null,
            status: "",
            statusColor: "default",
        };

        setTables((prev) => ({
            ...prev,
            [type]: [...existingRows, newRow],
        }));
    };

    const handleRemoveRow = (type, index) => {
        const updated = [...(tables[type] || [])];
        updated.splice(index, 1);

        // Sirf SCOH aur SCOH-DOG ko renumber karo
        if (
            type !== "DCOH (Double Circuit Overhead Line)" &&
            type !== "MCOH (Multi Circuit Overhead Line)"
        ) {
            const prefix = shortNames[type] || "LINE";

            updated.forEach((row, i) => {
                // old name se cluster part nikaalo
                const clusterPart = row.name.match(/\(.*\)$/) ? .[0] || "";
                // row.name = `${prefix}${i + 1}`;

                row.name = `${prefix}${i + 1}${clusterPart ? ` ${clusterPart}` : ""}`;
            });
        }

        setTables((prev) => ({
            ...prev,
            [type]: updated,
        }));
    };

    const handleRowChange = (type, index, field, value) => {
        const updated = [...tables[type]];
        updated[index][field] = value;

        if (field === "cluster") {
            const clusterObj = availableTurbines.find((t) => t.cluster_id === value);

            const clusterName = clusterObj ? .cluster_name || "Cluster";

            const prefix = shortNames[type] || "LINE";

            if (
                type === "SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)" ||
                type === "SCOH (Single Circuit Overhead Line)"
            ) {
                updated[index].name = `${prefix}${index + 1} (${clusterName})`;
            }
        }

        if (
            (type === "DCOH (Double Circuit Overhead Line)" ||
                type === "MCOH (Multi Circuit Overhead Line)") &&
            field !== "name"
        ) {
            const windfarmObj = getElectricalMaster.find(
                (item) =>
                item.project === Number(filters.project) &&
                item.windfarm === Number(filters.windfarm),
            );
            const windfarmName = windfarmObj ? .windfarm_name || "";
            // updated[index].name = `${shortNames[type]}${index + 1}${
            //   windfarmName ? ` (${windfarmName}) ` : ""
            // }`;

            const existingNumber = updated[index].name.match(/\d+/) ? .[0] || "";

            updated[index].name = `${shortNames[type]}${existingNumber}${
        windfarmName ? ` (${windfarmName})` : ""
      }`;
        }

        if (type.includes("MCOH")) {
            const row = updated[index];
            const calculated = calculateMCOH(row);
            row.calculated = calculated;

            let status = "";
            let statusColor = "default";

            if (!row.totalCircuit) {
                status = "⚠ Select Total";
                statusColor = "warning";
            } else if (calculated === Number(row.totalCircuit)) {
                status = "✅VALID";
                statusColor = "success";
            } else if (calculated > row.totalCircuit) {
                status = "❌ Exceeded";
                statusColor = "error";
            } else {
                status = "⚠ Incomplete";
                statusColor = "warning";
            }

            row.status = status;
            row.statusColor = statusColor;
        }

        if (type === "SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)") {
            const row = updated[index];

            let selectedTurbines = availableTurbines.filter((t) =>
                row.turbine ? .includes(t.id),
            );

            const totalMW = selectedTurbines.reduce(
                (sum, t) => sum + Number(t.wtg_capacity_mw || 0),
                0,
            );

            row.totalMW = totalMW;

            // row.maxTurbines = maxTurbines;

            row.selectedTurbines = row.turbine ? .length || 0;

            // row.remainingTurbines = maxTurbines - row.selectedTurbines;

            if (totalMW < 15) {
                row.status = "⚠ UNDERLOAD";
                row.statusColor = "warning";
            } else if (totalMW === 15) {
                row.status = "✅ VALID";
                row.statusColor = "success";
            } else {
                row.status = "❌ OVERLOAD (Exceeds 15 MW)";
                row.statusColor = "error";
            }
        }

        if (type === "SCOH (Single Circuit Overhead Line)") {
            const row = updated[index];

            let selectedTurbines = availableTurbines.filter((t) =>
                row.turbine ? .includes(t.id),
            );

            const selectedDogLines = getElectricalMaster.filter(
                (item) =>
                item.line_type ===
                "SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)" &&
                row.scohDog ? .includes(item.line_name) &&
                item.project === Number(filters.project) &&
                item.windfarm === Number(filters.windfarm) &&
                item.cluster === Number(row.cluster),
            );

            const dogLineTurbineIds = [
                ...new Set(selectedDogLines.flatMap((item) => item.turbine_ids || [])),
            ];

            const dogLineTurbines = availableTurbines.filter((t) =>
                dogLineTurbineIds.includes(t.id),
            );

            const allTurbines = [...selectedTurbines, ...dogLineTurbines];

            const uniqueTurbines = Array.from(
                new Map(allTurbines.map((t) => [t.id, t])).values(),
            );

            const totalMW = uniqueTurbines.reduce(
                (sum, t) => sum + Number(t.wtg_capacity_mw || 0),
                0,
            );

            const firstCapacity = Number(uniqueTurbines ? .[0] ? .wtg_capacity_mw || 0);

            const maxTurbines =
                firstCapacity > 0 ? Math.floor(24 / firstCapacity) : 0;

            const totalSelectedTurbines = uniqueTurbines.length;

            row.totalMW = totalMW;
            // row.maxTurbines = maxTurbines;
            row.selectedTurbines = totalSelectedTurbines;
            // row.remainingTurbines = maxTurbines - totalSelectedTurbines;

            if (totalMW < 24) {
                row.status = "⚠ UNDERLOAD";
                row.statusColor = "warning";
            } else if (totalMW === 24) {
                row.status = "✅ VALID";
                row.statusColor = "success";
            } else {
                row.status = "❌ OVERLOAD (Exceeds 24 MW)";
                row.statusColor = "error";
            }
        }

        setErrors((prev) => ({
            ...prev,
            [index]: {
                ...prev[index],
                [field]: false,
            },
        }));

        setTables((prev) => ({
            ...prev,
            [type]: updated,
        }));
    };

    const calculateMCOH = (row) => {
        let total = 0;

        // Use apiLines for calculation (same as dropdown)
        const apiLines = getElectricalMaster
            .filter(
                (item) =>
                (item.line_type === "SCOH (Single Circuit Overhead Line)" ||
                    item.line_type === "DCOH (Double Circuit Overhead Line)") &&
                item.project === Number(filters.project) &&
                item.windfarm === Number(filters.windfarm),
            )
            .map((item) => ({
                name: item.line_name,
                type: item.line_type.includes("DCOH") ? "DCOH" : "SCOH",
            }));

        row.linkedLines.forEach((name) => {
            const line = apiLines.find((l) => l.name === name);
            if (line ? .type === "DCOH") {
                total += 2;
            } else if (line ? .type === "SCOH") {
                total += 1;
            }
        });
        return total;
    };
    const handleSubmit = async (type) => {
        const data = tables[type] || [];
        if (!data.length) return;


        // ===========================
        // REQUIRED FIELD VALIDATION
        // ===========================

        const newErrors = {};

        data.forEach((row, index) => {
            newErrors[index] = {};

            // Common
            if (!row.km) {
                newErrors[index].km = true;
            }

            // SCOH DOG
            if (type === "SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)") {
                if (!row.cluster) newErrors[index].cluster = true;
                if (!row.turbine ? .length) newErrors[index].turbine = true;
            }

            // SCOH Panther
            if (type === "SCOH (Single Circuit Overhead Line)") {
                if (!row.cluster) newErrors[index].cluster = true;
                if (!row.scohDog ? .length) newErrors[index].scohDog = true;
            }

            // DCOH
            if (type === "DCOH (Double Circuit Overhead Line)") {
                if (!row.scohLine ? .length) newErrors[index].scohLine = true;
            }

            // MCOH
            if (type === "MCOH (Multi Circuit Overhead Line)") {
                if (!row.totalCircuit) newErrors[index].totalCircuit = true;
                if (!row.linkedLines ? .length) newErrors[index].linkedLines = true;
            }
        });

        const hasError = Object.values(newErrors).some((row) =>
            Object.values(row).some(Boolean)
        );

        setErrors(newErrors);

        if (hasError) {
            return;
        }




        // ✅ MCOH validation
        if (type === "MCOH (Multi Circuit Overhead Line)") {
            const hasIncomplete = data.some((row) => row.status !== "✅VALID");

            if (hasIncomplete) {
                alert(
                    "Please complete all MCOH rows before submitting. Status should be VALID.",
                );
                return;
            }
        }

        setSubmitLoading(true);
        try {
            const payload = data.map((row) => ({
                turbine_ids: row.turbine || [],

                line_name: row.name,
                km: row.km,
                line_type: type,
                no_of_line: data.length,
                scoh_dog: row.scohDog || [],

                assign_scoh: row.scohLine || [],
                assign_lines: row.linkedLines || [],

                total_circuit: type === "SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)" ?
                    1 :
                    type === "SCOH (Single Circuit Overhead Line)" ?
                    1 :
                    type === "DCOH (Double Circuit Overhead Line)" ?
                    2 :
                    row.totalCircuit || null,


                calculated: row.totalCircuit && row.calculated !== null ?
                    row.calculated === Number(row.totalCircuit) :
                    null,
                status: row.status ? .replace(/[⚠✅❌]/g, "") ? .trim() || "",

                project: filters.project,
                windfarm: filters.windfarm,
                cluster: row.cluster,
            }));

            const response = await dispatch(CreateElectricalMasterData(payload));
            setTables((prev) => ({
                ...prev,
                [type]: (prev[type] || []).map((row, index) => ({
                    ...row,
                    name: "",
                    km: "",
                    cluster: "",
                    turbine: [],
                    // scohDog: "",
                    scohDog: [],
                    scohLine: [],
                    linkedLines: [],
                    totalCircuit: "",
                    calculated: null,

                    totalMW: "",
                    maxTurbines: "",
                    selectedTurbines: "",
                    remainingTurbines: "",
                    status: "",
                    statusColor: "default",
                })),
            }));

            await dispatch(GetElectricalMasterData());
        } catch (err) {} finally {
            setSubmitLoading(false);
        }
    };

    const shortNames = {
        "SCOH-Dog (Single Circuit Overhead Line - Dog Conductor)": "SCOH-Dog",
        "SCOH (Single Circuit Overhead Line)": "SCOH-Panther",
        "DCOH (Double Circuit Overhead Line)": "DCOH",
        "MCOH (Multi Circuit Overhead Line)": "MCOH",
    };

    const getDisplayName = (name) => {
        if (name === "SCOH (Single Circuit Overhead Line)") {
            return "SCOH Panther (Single Circuit Overhead Line)";
        }
        return name;
    };

    const currentRows = tables[lineType] || [];
    const isMCOH = lineType.includes("MCOH");
    const isSCOHDog = lineType.includes("SCOH-Dog");
    const isSCOH = lineType === "SCOH (Single Circuit Overhead Line)";
    const isDCOH = lineType === "DCOH (Double Circuit Overhead Line)";

    return ( <
        Box sx = {
            {
                mt: -4,
                background: "#fff",
                minHeight: "100vh"
            }
        } > { /* Header */ } <
        Card sx = {
            {
                mb: 3,
                background: "#fff",
                color: "#00416A"
            }
        } >
        <
        CardContent sx = {
            {
                display: "flex",
                alignItems: "center",
                gap: 1
            }
        } >
        <
        ElectricBoltIcon / >
        <
        Typography variant = "h5" > Create Electrical Master Data < /Typography> <
        /CardContent> <
        /Card>

        <
        LineTypeSelector lineType = {
            lineType
        }
        setLineType = {
            setLineType
        }
        getDisplayName = {
            getDisplayName
        }
        />

        <
        LineCreationForm createLine = {
            createLine
        }
        setCreateLine = {
            setCreateLine
        }
        lineType = {
            lineType
        }
        noOfLine = {
            noOfLine
        }
        setNoOfLine = {
            setNoOfLine
        }
        handleCreateTable = {
            handleCreateTable
        }
        isSCOHDog = {
            isSCOHDog
        }
        isDCOH = {
            isDCOH
        }
        isMCOH = {
            isMCOH
        }
        isSCOH = {
            isSCOH
        }
        filters = {
            filters
        }
        setFilters = {
            setFilters
        }
        onTurbinesChange = {
            handleTurbinesChange
        }
        isLineTypeSelected = {!!lineType
        }
        getDisplayName = {
            getDisplayName
        }
        />

        {
            currentRows.length > 0 && ( <
                ElectricalDataTable lineType = {
                    lineType
                }
                currentRows = {
                    currentRows
                }
                tables = {
                    tables
                }
                availableTurbines = {
                    availableTurbines
                }
                handleRowChange = {
                    handleRowChange
                }
                handleSubmit = {
                    handleSubmit
                }
                shortNames = {
                    shortNames
                }
                isSCOHDog = {
                    isSCOHDog
                }
                isSCOH = {
                    isSCOH
                }
                isDCOH = {
                    isDCOH
                }
                isMCOH = {
                    isMCOH
                }
                getElectricalMaster = {
                    getElectricalMaster
                }
                filters = {
                    filters
                }
                submitLoading = {
                    submitLoading
                }
                handleAddRow = {
                    handleAddRow
                }
                handleRemoveRow = {
                    handleRemoveRow
                }
                errors = {
                    errors
                }
                />
            )
        }

        <
        ElectricalLogsTable data = {
            getLogsByType(lineType)
        }
        lineType = {
            shortNames[lineType]
        }
        getDisplayName = {
            getDisplayName
        }
        /> <
        /Box>
    );
}