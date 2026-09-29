// ElectricalSidebar.js
import {
    useState
} from "react";
import {
    ELECTRICAL_CONFIG
} from "./electricalConfig";
import "./Sidebar.css";

function ElectricalSidebar({
    selectedRoad,
    setSelectedRoad,
    roadNames,
    setRoadNames,
    allData,
    setAllData,
    onShowTable,
    clusters,
    selectedProject,
    setSelectedProject,

    selectedWindfarm,
    setSelectedWindfarm,

    selectedCluster,
    setSelectedCluster,
    inputName,
    setInputName,


    selectedModule, // ✅ New prop
    setSelectedModule, // ✅ New prop


}) {


    const [validationError, setValidationError] = useState("");

    const handleSelect = (key) => {
        if (!selectedCluster) {
            setValidationError("⚠️ Please select a cluster first");
            return;
        }
        setInputName("");
        setSelectedRoad(key);
        // setInputName(roadNames[key] || ""); 
        // 🔥 CHANGE HERE: Always set to empty string for new selection




    };

    const handleNameChange = () => {
        if (!selectedCluster) {
            setValidationError("⚠️ Please select a cluster first");
            return;
        }
        if (!selectedRoad) {
            setValidationError("⚠️ Please select an electrical feature");
            return;
        }
        if (!inputName.trim()) {
            setValidationError("⚠️ Please enter name first");
            return;
        }

        // Store name
        const updatedNames = {
            ...roadNames,
            [selectedRoad]: inputName,
        };
        setRoadNames(updatedNames);

        // Store electrical data
        const updatedData = [
            ...allData,
            {
                type: selectedRoad,
                label: ELECTRICAL_CONFIG[selectedRoad].label,
                name: inputName,
                drawType: ELECTRICAL_CONFIG[selectedRoad].drawType,
                color: ELECTRICAL_CONFIG[selectedRoad].color,
                cluster_id: selectedCluster,
                module: "electrical" // 🔴 Module identifier
            },
        ];

        // setAllData(updatedData);
        alert(`${ELECTRICAL_CONFIG[selectedRoad].label} name set to: ${inputName}`);
    };

    const isNameEntered = inputName.trim().length > 0;

    const projects = [...new Set(clusters.map(c => c.project_name))];

    // windfarms based on project
    const windfarms = [...new Set(
        clusters
        .filter(c => c.project_name === selectedProject)
        .map(c => c.windfarm_name)
    )];

    // clusters based on project + windfarm
    const filteredClusters = clusters.filter(
        c =>
        c.project_name === selectedProject &&
        c.windfarm_name === selectedWindfarm
    );



    return ( <
        div className = "sidebar" > { /* ✅ Module Switcher - TOP OF SIDEBAR */ } <
        div style = {
            {
                display: "flex",
                gap: "5px",
                marginBottom: "15px",
                background: "#f5f5f5",
                padding: "8px",
                borderRadius: "6px"
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
                fontWeight: selectedModule === "civil" ? "bold" : "normal"
            }
        } >
        Civil <
        /button> <
        button onClick = {
            () => setSelectedModule("electrical")
        }
        style = {
            {
                flex: 1,
                padding: "8px",
                background: selectedModule === "electrical" ? "#4CAF50" : "#e0e0e0",
                color: selectedModule === "electrical" ? "white" : "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: selectedModule === "electrical" ? "bold" : "normal"
            }
        } >
        Electrical <
        /button> <
        /div> <
        h3 > Electrical Module < /h3> <
        h4 style = {
            {
                margin: "6px 0 4px"
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
                marginBottom: "10px"
            }
        } >
        <
        option value = "" > --Select Project-- < /option> {
            projects.map(p => ( <
                option key = {
                    p
                }
                value = {
                    p
                } > {
                    p
                } < /option>
            ))
        } <
        /select>

        <
        h4 style = {
            {
                margin: "6px 0 4px"
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
                marginBottom: "10px"
            }
        } >
        <
        option value = "" > --Select Windfarm-- < /option> {
            windfarms.map(wf => ( <
                option key = {
                    wf
                }
                value = {
                    wf
                } > {
                    wf
                } < /option>
            ))
        } <
        /select>

        <
        h4 style = {
            {
                margin: "6px 0 4px"
            }
        } > Select Cluster < /h4>

        <
        select value = {
            selectedCluster
        }
        onChange = {
            (e) => {
                setSelectedCluster(e.target.value);
                setValidationError("");
            }
        }
        disabled = {!selectedWindfarm
        }
        style = {
            {
                width: "100%",
                padding: "6px",
                marginBottom: "10px"
            }
        } >
        <
        option value = "" > --Select Cluster-- < /option> {
            filteredClusters.map(cluster => ( <
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
                        fontSize: "12px"
                    }
                } > {
                    validationError
                } < /p>
            )
        }

        <
        h4 > Select Electrical Feature < /h4>

        {
            Object.keys(ELECTRICAL_CONFIG).map((key) => {
                const feature = ELECTRICAL_CONFIG[key];
                const Icon = feature.icon;

                return ( <
                    button key = {
                        key
                    }
                    onClick = {
                        () => handleSelect(key)
                    }
                    style = {
                        {
                            background: feature.color,
                            color: "white",
                            border: selectedRoad === key ? "3px solid yellow" : "none",
                            marginBottom: "6px",
                            width: "100%",
                            padding: "8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                        }
                    } >
                    <
                    Icon / > {
                        feature.label
                    } <
                    /button>
                );
            })
        }

        <
        div style = {
            {
                marginTop: "10px"
            }
        } >
        <
        input type = "text"
        placeholder = "Enter electrical feature name"
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
            }
        } >
        Set Electrical Name <
        /button> <
        button className = "show-table-btn"
        onClick = {
            onShowTable
        } >
        Show Electrical Table <
        /button> <
        /div> <
        /div>
    );
}

export default ElectricalSidebar;