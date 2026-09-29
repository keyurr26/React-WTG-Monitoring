import {
    useState
} from "react";
import {
    ROAD_CONFIG
} from "./roadConfig";

import "./Sidebar.css";

function Sidebar({
    selectedRoad,
    setSelectedRoad,
    roadNames,
    setRoadNames,
    allData, // 👈 new
    setAllData,
    onShowTable, // 👈 new
    selectedProject,
    setSelectedProject,
    selectedWindfarm,
    setSelectedWindfarm,

    clusters,
    selectedCluster, // ✅ RECEIVE FROM PARENT
    setSelectedCluster, // ✅ RECEIVE SETTER
    inputName, // ✅ RECEIVE FROM PARENT
    setInputName, // ✅ RECEIVE SETTER
    selectedModule, // ✅ New prop
    setSelectedModule, // ✅ New prop
}) {


    const [validationError, setValidationError] = useState(""); // ✅ REQUIRED



    const handleSelect = (key) => {
        if (!selectedCluster) {
            setValidationError("⚠️ Please select a cluster first");
            return;
        }

        setInputName("");

        setSelectedRoad(key);
        // setInputName(roadNames[key] || "");
    };

    const handleNameChange = () => {
        if (!selectedCluster) {
            setValidationError("⚠️ Please select a cluster first");
            return;
        }

        if (!selectedRoad) {
            setValidationError("⚠️ Please select a road type");
            return;
        }

        // ✅ NAME JARURI HAI - YAHI VALIDATION
        if (!inputName.trim()) {
            setValidationError("⚠️ Please enter name first");
            return;
        }

        if (!selectedRoad) return;

        // store name
        const updatedNames = {
            ...roadNames,
            [selectedRoad]: inputName,
        };
        setRoadNames(updatedNames);

        // store full data
        const updatedData = [
            ...allData,
            {
                type: selectedRoad,
                label: ROAD_CONFIG[selectedRoad].label,
                name: inputName,
                drawType: ROAD_CONFIG[selectedRoad].drawType,
                color: ROAD_CONFIG[selectedRoad].color,
                cluster_id: selectedCluster, // ✅ DIRECTLY ADD HERE
            },
        ];

        // setAllData(updatedData);



        alert(`${ROAD_CONFIG[selectedRoad].label} name set to: ${inputName}`);
    };

    // ✅ Set Name button ke liye condition
    const isNameEntered = inputName.trim().length > 0;

    // unique projects
    const projects = [...new Set(clusters.map((c) => c.project_name))];

    // windfarms based on project
    const windfarms = [
        ...new Set(
            clusters
            .filter((c) => c.project_name === selectedProject)
            .map((c) => c.windfarm_name),
        ),
    ];

    // clusters based on project + windfarm
    const filteredClusters = clusters.filter(
        (c) =>
        c.project_name === selectedProject &&
        c.windfarm_name === selectedWindfarm,
    );

    return ( <
        div className = "sidebar"
        style = {
            {
                height: "100vh", // Full viewport height
                overflowY: "auto", // Enable vertical scrolling
                display: "flex",
                flexDirection: "column",
                padding: "15px",
                boxSizing: "border-box",
                // Optional: add scrollbar styling for better appearance
                scrollbarWidth: "thin",
                scrollbarColor: "#c1c1c1 #f5f5f5",
            }
        } >
        { /* Custom scrollbar styling for WebKit browsers (Chrome, Safari, Edge) */ } <
        style > {
            `
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 3px;
        }
        .sidebar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `
        } <
        /style>

        { /* ✅ Module Switcher - TOP OF SIDEBAR */ } <
        div style = {
            {
                display: "flex",
                gap: "5px",
                marginBottom: "15px",
                background: "#f5f5f5",
                padding: "8px",
                borderRadius: "6px",
                flexShrink: 0, // Prevent shrinking
            }
        } >
        <
        button onClick = {
            () => setSelectedModule("civil")
        }
        style = {
            {
                flex: 1,
                padding: "8px",
                background: selectedModule === "civil" ? "#4CAF50" : "#e0e0e0",
                color: selectedModule === "civil" ? "white" : "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: selectedModule === "civil" ? "bold" : "normal",
            }
        } >
        Civil <
        /button> {
            /* <button
                    onClick={() => setSelectedModule("electrical")}
                    style={{
                      flex: 1,
                      padding: "8px",
                      background: selectedModule === "electrical" ? "#4CAF50" : "#e0e0e0",
                      color: selectedModule === "electrical" ? "white" : "black",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: selectedModule === "electrical" ? "bold" : "normal",
                    }}
                  >
                    Electrical
                  </button> */
        } <
        /div>

        <
        h3 style = {
            {
                flexShrink: 0,
                margin: "0 0 10px 0"
            }
        } > Civil Module < /h3>

        <
        h4 style = {
            {
                margin: "6px 0 4px",
                flexShrink: 0
            }
        } > Select Project < /h4> <
        select value = {
            selectedProject
        }
        onChange = {
            (e) => {
                setSelectedProject(e.target.value);
                setSelectedWindfarm("");
                setSelectedCluster("");
                setValidationError("");
            }
        }
        style = {
            {
                width: "100%",
                padding: "6px",
                marginBottom: "10px",
                flexShrink: 0
            }
        } >
        <
        option value = "" > --Select Project-- < /option> {
            projects.map((p) => ( <
                option key = {
                    p
                }
                value = {
                    p
                } > {
                    p
                } <
                /option>
            ))
        } <
        /select>

        <
        h4 style = {
            {
                margin: "6px 0 4px",
                flexShrink: 0
            }
        } > Select Windfarm < /h4> <
        select value = {
            selectedWindfarm
        }
        onChange = {
            (e) => {
                setSelectedWindfarm(e.target.value);
                setSelectedCluster("");
                setValidationError("");
            }
        }
        disabled = {!selectedProject
        }
        style = {
            {
                width: "100%",
                padding: "6px",
                marginBottom: "10px",
                flexShrink: 0
            }
        } >
        <
        option value = "" > --Select Windfarm-- < /option> {
            windfarms.map((wf) => ( <
                option key = {
                    wf
                }
                value = {
                    wf
                } > {
                    wf
                } <
                /option>
            ))
        } <
        /select>

        <
        h4 style = {
            {
                margin: "6px 0 4px",
                flexShrink: 0
            }
        } > Select Cluster < /h4> <
        select value = {
            selectedCluster
        }
        onChange = {
            (e) => {
                setSelectedCluster(e.target.value);
                setValidationError(""); // ✅ clear error
            }
        }
        disabled = {!selectedWindfarm
        }
        style = {
            {
                width: "100%",
                padding: "6px",
                marginBottom: "10px",
                flexShrink: 0
            }
        } >
        <
        option value = "" > --Select Cluster-- < /option> {
            filteredClusters.map((cluster) => ( <
                option key = {
                    cluster.id
                }
                value = {
                    cluster.id
                } > {
                    cluster.cluster_name
                } <
                /option>
            ))
        } <
        /select>

        {
            validationError && ( <
                p style = {
                    {
                        color: "red",
                        fontSize: "12px",
                        flexShrink: 0,
                        margin: "0 0 10px 0"
                    }
                } > {
                    validationError
                } <
                /p>
            )
        }

        <
        h3 style = {
            {
                flexShrink: 0,
                margin: "10px 0 10px 0"
            }
        } > Select Feature < /h3>

        { /* Feature buttons container - this will scroll */ } <
        div style = {
            {
                flex: 1, // Take remaining space
                overflowY: "auto", // Enable scrolling for buttons if many
                marginBottom: "10px",
                minHeight: "100px", // Minimum height to ensure visibility
            }
        } > {
            Object.keys(ROAD_CONFIG).map((key) => {
                const road = ROAD_CONFIG[key];
                const Icon = road.icon;

                return ( <
                    button key = {
                        key
                    }
                    title = {
                        road.tooltip || road.label
                    } // 👈 Add tooltip here

                    onClick = {
                        () => handleSelect(key)
                    }
                    style = {
                        {
                            background: road.color,
                            color: "white",
                            border: selectedRoad === key ? "3px solid yellow" : "none",
                            marginBottom: "6px",
                            width: "100%",
                            padding: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            flexShrink: 0,
                        }
                    } >
                    <
                    Icon / > {
                        road.label
                    } <
                    /button>
                );
            })
        } <
        /div>

        { /* Bottom section - fixed at bottom */ } <
        div style = {
            {
                marginTop: "auto", // Push to bottom
                paddingTop: "10px",
                borderTop: "1px solid #e0e0e0",
                flexShrink: 0,
            }
        } >
        <
        input type = "text"
        placeholder = "Enter name (Required)"
        value = {
            inputName
        }
        onChange = {
            (e) => setInputName(e.target.value)
        }
        disabled = {!selectedCluster
        }
        style = {
            {
                width: "100%",
                padding: "6px",
                marginBottom: "6px",
                background: !selectedCluster ? "#f0f0f0" : "white",
                cursor: !selectedCluster ? "not-allowed" : "text",
            }
        }
        />

        <
        button onClick = {
            handleNameChange
        }
        disabled = {!selectedCluster || !isNameEntered
        }
        style = {
            {
                width: "100%",
                padding: "6px",
                opacity: !selectedCluster ? 0.6 : 1,
                cursor: !selectedCluster ? "not-allowed" : "pointer",
                marginBottom: "6px",
            }
        } >
        Set Name <
        /button>

        <
        button className = "show-table-btn"
        onClick = {
            onShowTable
        }
        style = {
            {
                width: "100%",
                padding: "6px",
                cursor: "pointer",
            }
        } >
        Show Table <
        /button> <
        /div> <
        /div>
    );
}

export default Sidebar;