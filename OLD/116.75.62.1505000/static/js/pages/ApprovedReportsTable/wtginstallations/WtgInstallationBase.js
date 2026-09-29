import {
    useEffect,
    useMemo,
    useRef
} from "react";
import {
    useDispatch,
    useSelector
} from "react-redux";
import DynamicTablesRenderer from "../commoncomponents/DynamicTablesRenderer";
import {
    useLocation
} from "react-router-dom";
import {
    GetT1InstalltionData,
    GetTowerInstallations,
    GetNacelleInstallation,
    GetRotorHubInstallations,
    GetBladeInstallations,
    patchT1Installation,
    patchTowerInstallations,
    patchNacelleInstallation,
    patchRotorHubInstallations,
    patchBladeInstallations,
} from "../../../Redux/InstallationData/WtgInstallationData/wtgInstallationAction";

const COMMON_COLUMNS = [{
        label: "Status",
        key: "status",
        type: "status"
    },
    {
        label: "View",
        key: "view",
        type: "view"
    },
];


// ✅ Table grouping configuration for WTG Installation (like Foundation)
const TABLE_GROUPING_CONFIG = {
    "t1 installation": {
        groupBy: "turbine_sr_no",
        statusField: "t1_status",
    },
    "tower installation": {
        groupBy: "turbine_sr_no",
        statusField: "tower_status",
    },
    "nacelle installation": {
        groupBy: "turbine_sr_no",
        statusField: "nacelle_status",
    },
    "rotor hub installation": {
        groupBy: "turbine_sr_no",
        statusField: "rotor_status",
    },
    "blade installation": {
        groupBy: "turbine_sr_no",
        statusField: "blade_status",
    }
};



// ✅ Group records function (EXACT same as Foundation)
const groupRecordsByConfig = (rows, tableId) => {
    if (!rows ? .length) return rows;

    const config = TABLE_GROUPING_CONFIG[tableId];
    if (!config) return rows;

    const {
        groupBy,
        statusField
    } = config;

    const groups = {};

    rows.forEach(row => {
        const key = row[groupBy];
        if (!key) return;

        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
    });

    const finalRows = [];

    Object.keys(groups).forEach(key => {
        const groupRecords = groups[key];

        // Single record → show as it is
        if (groupRecords.length === 1) {
            finalRows.push(groupRecords[0]);
            return;
        }

        // 🔥 If statusField exists → find completed record
        if (statusField) {
            const completedRecord = groupRecords.find(
                r => r[statusField] ? .toLowerCase() === "completed"
            );

            if (completedRecord) {
                finalRows.push({
                    ...completedRecord,
                    _groupedRecords: groupRecords,
                    _groupKey: key,
                    _groupCount: groupRecords.length
                });
                return;
            }
        }

        // ❗ If no completed record → show latest record
        const latestRecord = groupRecords.sort((a, b) => {
            const dateA = new Date(a.submitted_at || 0);
            const dateB = new Date(b.submitted_at || 0);
            return dateB - dateA;
        })[0];

        finalRows.push({
            ...latestRecord,
            _groupedRecords: groupRecords,
            _groupKey: key,
            _groupCount: groupRecords.length
        });
    });

    return finalRows;
};


function WtgInstallationBase({
    tableIds,
    filters
}) {
    const fetchedRef = useRef({});
    const dispatch = useDispatch();
    const location = useLocation();
    const targetRecordId = location.state ? .recordId;
    const targetTableId = location.state ? .tableId;

    const {
        loading,
        t1installation = [],
        towersInstallations = [],
        nacelleInstallation = [],
        rotorHubInstallations = [],
        bladeInstallations = [],
        error,
    } = useSelector((state) => state.wtgInstallationData || {});


    // console.log("t1installation",t1installation)
    //  console.log("towersInstallations",towersInstallations)
    //   console.log("nacelleInstallation",nacelleInstallation)
    //    console.log("rotorHubInstallations",rotorHubInstallations)
    //     console.log("bladeInstallations",bladeInstallations)



    // 🔹 Fetch only active tabs (SAME AS FOUNDATION)
    // useEffect(() => {
    //   tableIds.forEach((id) => {
    //     if (fetchedRef.current[id]) return;
    //     fetchedRef.current[id] = true;

    //     switch (id) {
    //       case "t1 installation":
    //         dispatch(GetT1InstalltionData());
    //         break;
    //       case "tower installation":
    //         dispatch(GetTowerInstallations());
    //         break;
    //       case "nacelle installation":
    //         dispatch(GetNacelleInstallation());
    //         break;
    //       case "rotor hub installation":
    //         dispatch(GetRotorHubInstallations());
    //         break;
    //       case "blade installation":
    //         dispatch(GetBladeInstallations());
    //         break;
    //       default:
    //         break;
    //     }
    //   });
    // }, [dispatch, tableIds]);

    useEffect(() => {
        // Whenever filters change, reset the 'fetched' cache so we can fetch new data
        fetchedRef.current = {};
    }, [filters]); // Assuming 'filters' is passed as a prop

    useEffect(() => {

        if (!filters ? .project) return;

        tableIds.forEach((id) => {
            if (fetchedRef.current[id]) return;
            fetchedRef.current[id] = true;

            // Pass the filter object to your Redux actions
            switch (id) {
                case "t1 installation":
                    dispatch(GetT1InstalltionData(filters));
                    break;
                case "tower installation":
                    dispatch(GetTowerInstallations(filters));
                    break;
                case "nacelle installation":
                    dispatch(GetNacelleInstallation(filters));
                    break;
                case "rotor hub installation":
                    dispatch(GetRotorHubInstallations(filters));
                    break;
                case "blade installation":
                    dispatch(GetBladeInstallations(filters));
                    break;
                default:
                    break;
            }
        });
    }, [dispatch, tableIds, filters]);

    // 🔹 Row transformers (simple & fast)
    const t1Rows = useMemo(
        () =>
        t1installation.map((item) => ({
            id: item.id,
            turbine_sr_no: item.turbine_name,
            leveling: item.leveling,
            grouting: item.grouting,
            grouting_curing: item.grouting_curing,
            alignment_check: item.alignment_check,
            no_of_bolts: item.no_of_bolts,
            torque_value: item.torque_value,
            instrument_used: item.instrument_used,
            // material: item.material,
            batch_no: item.batch_no,
            grout_material_type: item.grout_material_type,
            curing_days: item.grouting_curing_days,
            lifting_start: item.lifting_start,
            lifting_end: item.lifting_end,
            bolt_size: item.bolt_size,
            weather: item.weather_conditions,
            supervisor: item.supervisor_name,
            contractor: item.contractor_name,
            remarks: item.remarks,
            t1_status: item.t1_status,
            submitted_at: item.submitted_at, // ✅ For sorting

            view: true,
            status: item.approve_date ? "Approved" : "Pending",
            evidence_photo: item.evidence_photo, // The daily photo
            attachments: item.attachments || [],
            // file: item.torque_calibration_certificate
            //   ? [item.torque_calibration_certificate]
            //   : [],
        })), [t1installation],
    );

    const towerRows = useMemo(
        () =>
        towersInstallations.map((item) => ({
            id: item.id,
            turbine_sr_no: item.turbine_name,
            tower_no: item.tower_no,
            no_of_bolts: item.no_of_bolts,
            torque_value: item.torque_value,
            instrument_used: item.instrument_used,
            manufacturer: item.manufacturer,
            alignment_check: item.alignment_check,
            crane_id_model: item.crane_id_model,
            crane_capacity: item.crane_capacity,
            torqueing_sequence_ref: item.torqueing_sequence_reference,
            lifting_start: item.lifting_start,
            lifting_end: item.lifting_end,
            contractor: item.contractor_name,
            supervisor: item.supervisor_name,
            weather: item.weather,
            remarks: item.remarks,
            tower_status: item.tower_status,
            submitted_at: item.submitted_at, // ✅ For sorting
            view: true,
            status: item.approve_date ? "Approved" : "Pending",
            evidence_photo: item.evidence_photo, // The daily photo
            attachments: item.attachments || [],
        })), [towersInstallations],
    );

    const nacelleRows = useMemo(
        () =>
        nacelleInstallation.map((item) => ({
            id: item.id,
            nacelle: item.nacelle_name,
            turbine_sr_no: item.turbine_name,
            generator: item.generator_name,
            gear_box: item.gear_box_name,
            lift: item.lift_name,
            bolt: item.bolt_name,
            slewing_rim: item.sleving_rim,
            no_of_bolts: item.no_of_bolt,
            alignment_check: item.alignment_check,
            yaw_drive_details: item.yaw_drive_details,
            torque_value: item.torque_value,
            instrument_used: item.instrument_used,
            electrical_connection: item.electrical_connection_with_tower,
            lifting_start: item.lifting_start,
            lifting_end: item.lifting_end,
            weather: item.weather,
            contractor: item.contractor_name,
            supervisor: item.supervisor_name,
            nacelle_status: item.nacelle_status,
            submitted_at: item.submitted_at, // ✅ For sorting
            view: true,
            status: item.approve_date ? "Approved" : "Pending",
            evidence_photo: item.evidence_photo, // The daily photo
            attachments: item.attachments || [],
        })), [nacelleInstallation],
    );

    const rotorHubRows = useMemo(
        () =>
        rotorHubInstallations.map((item) => ({
            id: item.id,

            turbine_sr_no: item.turbine_name,
            nacelle: item.nacelle_name,
            bolt: item.bolt_name,
            no_of_bolts: item.no_of_bolt,
            torque_value: item.torque_value,

            bolt_size_grade: item.bolt_size_grade,
            lubricant_used: item.lubricant_used,
            instrument_used: item.instrument_used,
            hub_serial_no: item.hub_serial_number,
            material_grade: item.material_grade,
            weight: item.weight,
            pitch_type: item.pitch_type,
            lifting_start: item.lifting_start,
            lifting_end: item.lifting_end,
            weather: item.weather,
            contractor: item.contractor_name,
            supervisor: item.supervisor_name,
            remarks: item.remarks,
            rotor_status: item.rotor_status,
            submitted_at: item.submitted_at, // ✅ For sorting
            view: true,
            status: item.approve_date ? "Approved" : "Pending",
            evidence_photo: item.evidence_photo, // The daily photo
            attachments: item.attachments || [],
        })), [rotorHubInstallations],
    );

    const bladeRows = useMemo(
        () =>
        bladeInstallations.map((item) => ({
            id: item.id,

            turbine_sr_no: item.turbine_name,

            blade: item.blade_no,
            bolt: item.bolt_name,
            no_of_bolts: item.no_of_bolt,

            torque_value: item.torque_value,
            instrument_used: item.instrument_used,
            weather: item.weather,
            lifting_start: item.lifting_start,
            lifting_end: item.lifting_end,
            contractor: item.contractor_name,
            supervisor: item.supervisor_name,
            blade_status: item.blade_status,
            submitted_at: item.submitted_at, // ✅ For sorting

            view: true,
            status: item.approve_date ? "Approved" : "Pending",
            evidence_photo: item.evidence_photo, // The daily photo
            attachments: item.attachments || [],
        })), [bladeInstallations],
    );


    // ✅ Apply grouping to rows (like Foundation)
    const t1RowsGrouped = useMemo(() => groupRecordsByConfig(t1Rows, "t1 installation"), [t1Rows]);
    const towerRowsGrouped = useMemo(() => groupRecordsByConfig(towerRows, "tower installation"), [towerRows]);
    const nacelleRowsGrouped = useMemo(() => groupRecordsByConfig(nacelleRows, "nacelle installation"), [nacelleRows]);
    const rotorHubRowsGrouped = useMemo(() => groupRecordsByConfig(rotorHubRows, "rotor hub installation"), [rotorHubRows]);
    const bladeRowsGrouped = useMemo(() => groupRecordsByConfig(bladeRows, "blade installation"), [bladeRows]);



    const tables = useMemo(
        () => [{
                id: "t1 installation",
                title: "T1 Installation",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Sr No",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Leveling",
                        key: "leveling",
                        editable: true
                    },
                    {
                        label: "Grouting",
                        key: "grouting",
                        editable: true
                    },
                    {
                        label: "Grouting Curing",
                        key: "grouting_curing",
                        editable: true
                    },
                    {
                        label: "Alignment Check",
                        key: "alignment_check",
                        editable: true
                    },
                    {
                        label: "No of Bolts",
                        key: "no_of_bolts",
                        editable: false
                    },
                    {
                        label: "Torque Value",
                        key: "torque_value",
                        editable: true
                    },
                    {
                        label: "Instrument Used",
                        key: "instrument_used",
                        editable: true
                    },
                    {
                        label: "Batch No",
                        key: "batch_no",
                        editable: true
                    },
                    {
                        label: "Grout Material Type",
                        key: "grout_material_type",
                        editable: true,
                    },
                    {
                        label: "Curing Days",
                        key: "curing_days",
                        editable: true
                    },
                    {
                        label: "Lifting Start",
                        key: "lifting_start",
                        editable: true
                    },
                    {
                        label: "Lifting End",
                        key: "lifting_end",
                        editable: true
                    },
                    {
                        label: "Bolt Size",
                        key: "bolt_size",
                        editable: true
                    },
                    {
                        label: "Weather",
                        key: "weather",
                        editable: true
                    },
                    {
                        label: "Supervisor",
                        key: "supervisor",
                        editable: false
                    },
                    {
                        label: "Contractor",
                        key: "contractor",
                        editable: false
                    },
                    {
                        label: "Remarks",
                        key: "remarks",
                        editable: true
                    },
                    {
                        label: "T1 Status",
                        key: "t1_status",
                        editable: true
                    },
                ],
                rows: t1RowsGrouped,
            },
            {
                id: "tower installation",
                title: "Tower Installation",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Sr No",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Tower No",
                        key: "tower_no",
                        editable: false
                    },
                    {
                        label: "No of Bolts",
                        key: "no_of_bolts",
                        editable: false
                    },
                    {
                        label: "Torque Value",
                        key: "torque_value",
                        editable: true
                    },
                    {
                        label: "Instrument Used",
                        key: "instrument_used",
                        editable: true
                    },
                    {
                        label: "Manufacturer",
                        key: "manufacturer",
                        editable: true
                    },
                    {
                        label: "Alignment Check",
                        key: "alignment_check",
                        editable: true
                    },
                    {
                        label: "Crane ID / Model",
                        key: "crane_id_model",
                        editable: false
                    },
                    {
                        label: "Crane Capacity",
                        key: "crane_capacity",
                        editable: true
                    },
                    {
                        label: "Torqueing Sequence Ref",
                        key: "torqueing_sequence_ref",
                        editable: false,
                    },
                    {
                        label: "Lifting Start",
                        key: "lifting_start",
                        editable: true
                    },
                    {
                        label: "Lifting End",
                        key: "lifting_end",
                        editable: true
                    },
                    {
                        label: "Contractor",
                        key: "contractor",
                        editable: false
                    },
                    {
                        label: "Supervisor",
                        key: "supervisor",
                        editable: false
                    },
                    {
                        label: "Weather",
                        key: "weather",
                        editable: true
                    },
                    {
                        label: "Remarks",
                        key: "remarks",
                        editable: true
                    },
                    {
                        label: "Tower Status",
                        key: "tower_status",
                        editable: true
                    },
                ],
                rows: towerRowsGrouped, // Filled dynamically from API
            },

            {
                id: "nacelle installation",
                title: "Nacelle Installation",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Nacelle",
                        key: "nacelle",
                        editable: false
                    },
                    {
                        label: "Turbine Sr No",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Generator",
                        key: "generator",
                        editable: false
                    },
                    {
                        label: "Gear Box",
                        key: "gear_box",
                        editable: false
                    },
                    {
                        label: "Lift",
                        key: "lift",
                        editable: false
                    },
                    {
                        label: "Bolt",
                        key: "bolt",
                        editable: false
                    },
                    {
                        label: "Slewing Rim",
                        key: "sleving_rim",
                        editable: true
                    },
                    {
                        label: "No of Bolts",
                        key: "no_of_bolts",
                        editable: false
                    },
                    {
                        label: "Alignment Check",
                        key: "alignment_check",
                        editable: true
                    },
                    {
                        label: "Yaw Drive Details",
                        key: "yaw_drive_details",
                        editable: true,
                    },
                    {
                        label: "Torque Value",
                        key: "torque_value",
                        editable: true
                    },
                    {
                        label: "Instrument Used",
                        key: "instrument_used",
                        editable: true
                    },
                    // { label: "Electrical Connection", key: "electrical_connection", editable: true },
                    {
                        label: "Lifting Start",
                        key: "lifting_start",
                        editable: true
                    },
                    {
                        label: "Lifting End",
                        key: "lifting_end",
                        editable: true
                    },
                    {
                        label: "Weather",
                        key: "weather",
                        editable: true
                    },
                    {
                        label: "Contractor",
                        key: "contractor",
                        editable: false
                    },
                    {
                        label: "Supervisor",
                        key: "supervisor",
                        editable: false
                    },
                    {
                        label: "Necelle Status",
                        key: "nacelle_status",
                        editable: true
                    },
                ],
                rows: nacelleRowsGrouped, // Filled dynamically from API
            },

            {
                id: "rotor hub installation",
                title: "Rotor Hub Installation",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Sr No",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Nacelle",
                        key: "nacelle",
                        editable: false
                    },
                    {
                        label: "Bolt",
                        key: "bolt",
                        editable: false
                    },
                    {
                        label: "No of Bolts",
                        key: "no_of_bolts",
                        editable: false
                    },
                    {
                        label: "Torque Value",
                        key: "torque_value",
                        editable: true
                    },
                    {
                        label: "Bolt Size / Grade",
                        key: "bolt_size_grade",
                        editable: true
                    },
                    {
                        label: "Lubricant Used",
                        key: "lubricant_used",
                        editable: true
                    },
                    {
                        label: "Instrument Used",
                        key: "instrument_used",
                        editable: true
                    },
                    {
                        label: "Hub Serial No",
                        key: "hub_serial_no",
                        editable: false
                    },
                    {
                        label: "Material Grade",
                        key: "material_grade",
                        editable: true
                    },
                    {
                        label: "Weight",
                        key: "weight",
                        editable: true
                    },
                    {
                        label: "Pitch Type",
                        key: "pitch_type",
                        editable: true
                    },
                    {
                        label: "Lifting Start",
                        key: "lifting_start",
                        editable: true
                    },
                    {
                        label: "Lifting End",
                        key: "lifting_end",
                        editable: true
                    },
                    {
                        label: "Weather",
                        key: "weather",
                        editable: true
                    },
                    {
                        label: "Contractor",
                        key: "contractor",
                        editable: false
                    },
                    {
                        label: "Supervisor",
                        key: "supervisor",
                        editable: false
                    },
                    {
                        label: "Remarks",
                        key: "remarks",
                        editable: true
                    },
                    {
                        label: "Rotor Hub Status",
                        key: "rotor_status",
                        editable: true
                    },
                ],
                rows: rotorHubRowsGrouped,
            },

            {
                id: "blade installation",
                title: "Blade Installation",
                columns: [
                    ...COMMON_COLUMNS,
                    {
                        label: "Turbine Sr No",
                        key: "turbine_sr_no",
                        editable: false
                    },
                    {
                        label: "Blade",
                        key: "blade",
                        editable: false
                    },
                    {
                        label: "Bolt",
                        key: "bolt",
                        editable: false
                    },
                    {
                        label: "No of Bolts",
                        key: "no_of_bolts",
                        editable: false
                    },
                    {
                        label: "Torque Value",
                        key: "torque_value",
                        editable: true
                    },
                    {
                        label: "Instrument Used",
                        key: "instrument_used",
                        editable: true
                    },
                    {
                        label: "Weather",
                        key: "weather",
                        editable: true
                    },
                    {
                        label: "Lifting Start",
                        key: "lifting_start",
                        editable: true
                    },
                    {
                        label: "Lifting End",
                        key: "lifting_end",
                        editable: true
                    },
                    {
                        label: "Contractor",
                        key: "contractor",
                        editable: false
                    },
                    {
                        label: "Supervisor",
                        key: "supervisor",
                        editable: false
                    },
                    {
                        label: "Blade Installation Status",
                        key: "blade_status",
                        editable: true,
                    },
                ],
                rows: bladeRowsGrouped,
            },
        ], [
            t1RowsGrouped,
            towerRowsGrouped,
            nacelleRowsGrouped,
            rotorHubRowsGrouped,
            bladeRowsGrouped,
        ],
    );

    const handleUpdate = async (tableId, rowId, updatedData) => {
        try {
            // 1. Find the table config
            const tableConfig = tables.find((t) => t.id === tableId);
            if (!tableConfig) throw new Error(`Table config not found for ${tableId}`);

            // 2. Automatically build payload using ONLY columns marked 'editable: true'
            const payload = {};
            tableConfig.columns.forEach((col) => {
                if (col.editable === true && updatedData[col.key] !== undefined) {
                    payload[col.key] = updatedData[col.key];
                }
            });

            // We use a switch only for the Action names, not for building the payload
            switch (tableId) {
                case "t1 installation":
                    await dispatch(patchT1Installation(rowId, payload));
                    dispatch(GetT1InstalltionData());
                    break;
                case "tower installation":
                    await dispatch(patchTowerInstallations(rowId, payload));
                    dispatch(GetTowerInstallations());
                    break;
                case "nacelle installation":
                    await dispatch(patchNacelleInstallation(rowId, payload));
                    dispatch(GetNacelleInstallation());
                    break;
                case "rotor hub installation":
                    await dispatch(patchRotorHubInstallations(rowId, payload));
                    dispatch(GetRotorHubInstallations());
                    break;
                case "blade installation":
                    await dispatch(patchBladeInstallations(rowId, payload));
                    dispatch(GetBladeInstallations());
                    break;

                default:
                    console.warn(`No update handler for table: ${tableId}`);
            }

            return {
                success: true
            };
        } catch (err) {
            console.error(`Update failed for ${tableId}:`, err);
            return {
                success: false,
                error: err
            };
        }
    };

    const handleApprove = async (tableId, rowId) => {
        const payload = {
            status: "approved"
        };

        switch (tableId) {
            case "t1 installation":
                await dispatch(patchT1Installation(rowId, payload));
                dispatch(GetT1InstalltionData());
                break;
            case "tower installation":
                await dispatch(patchTowerInstallations(rowId, payload));
                dispatch(GetTowerInstallations());
                break;
            case "nacelle installation":
                await dispatch(patchNacelleInstallation(rowId, payload));
                dispatch(GetNacelleInstallation());
                break;
            case "rotor hub installation":
                await dispatch(patchRotorHubInstallations(rowId, payload));
                dispatch(GetRotorHubInstallations());
                break;
            case "blade installation":
                await dispatch(patchBladeInstallations(rowId, payload));
                dispatch(GetBladeInstallations());
                break;
            default:
                console.warn("Unknown approve table:", tableId);
        }
    };

    // 🔹 Filter active tables
    const filteredTables = useMemo(
        () => tables.filter((t) => tableIds.includes(t.id)), [tables, tableIds],
    );

    return ( <
        DynamicTablesRenderer tables = {
            filteredTables
        }
        onApprove = {
            handleApprove
        }
        loading = {
            loading
        }
        error = {
            error
        }
        onUpdate = {
            handleUpdate
        }
        />
    );
}

export default WtgInstallationBase;