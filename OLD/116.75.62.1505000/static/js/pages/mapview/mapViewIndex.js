import {
    useState,
    useEffect
} from "react";
import Sidebar from "./sidebar";
import ElectricalSidebar from "./ElectricalSidebar"; // नया sidebar

import MapWithDraw from "./mapWithDraw";

import DataTable from "./DataTable";
import ElectricalDataTable from "./ElectricalDataTable"; // नया table
import {
    GetProjectsData,
    GetWindFarmMasterData
} from "../../Redux/MasterData/masterAction";

// import { getClusters } from "../../Redux/InstallationData/CartRoadData/cartroadAction";
import {
    getClusters
} from "../../Redux/InstallationData/CartRoadData/cartroadAction";
import {
    useDispatch,
    useSelector
} from "react-redux";

import "./mapview.css";

function MapView() {
    const [selectedRoad, setSelectedRoad] = useState(null);
    // const [roadNames, setRoadNames] = useState({});
    const [mapData, setMapData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedWindfarm, setSelectedWindfarm] = useState("");
    const [selectedCluster, setSelectedCluster] = useState(null);
    // const [inputName, setInputName] = useState("");

    const [civilRoadNames, setCivilRoadNames] = useState({});
    const [civilInputName, setCivilInputName] = useState("");
    const [electricalRoadNames, setElectricalRoadNames] = useState({});
    const [electricalInputName, setElectricalInputName] = useState("");


    // new module selection state

    const [selectedModule, setSelectedModule] = useState("civil"); // "civil" or "electrical"
    const [electricalData, setElectricalData] = useState([]);





    // 🔴 Electrical data के लिए अलग state

    // ✅ Get current module's states
    const getCurrentStates = () => {
        if (selectedModule === "civil") {
            return {
                roadNames: civilRoadNames,
                setRoadNames: setCivilRoadNames,
                inputName: civilInputName,
                setInputName: setCivilInputName,
                data: mapData,
                setData: setMapData
            };
        } else {
            return {
                roadNames: electricalRoadNames,
                setRoadNames: setElectricalRoadNames,
                inputName: electricalInputName,
                setInputName: setElectricalInputName,
                data: electricalData,
                setData: setElectricalData
            };
        }
    };

    const currentStates = getCurrentStates();

    const dispatch = useDispatch();




    const {
        projects,
        WindfarmData,


    } = useSelector((state) => state.masterData);


    // ✅ Get clusters from redux
    const {
        clusters = [],
            loading,
            error,
    } = useSelector((state) => state.cardRoad);


    // ✅ Tab close pe alert ke liye - CORRECT PLACE (inside component)
    useEffect(() => {
        const warningMessage = "⚠️ Unsaved data will be lost. Save before leaving?";
        // Tab close/refresh pe
        const handleBeforeUnload = (e) => {
            const hasData = mapData.length > 0 || electricalData.length > 0;
            if (hasData) {
                e.preventDefault();
                e.returnValue = "";
                return warningMessage;
            }
        };

        // Back/forward button pe
        const handlePopState = (e) => {
            const hasData = mapData.length > 0 || electricalData.length > 0;
            if (hasData) {
                e.preventDefault();
                if (window.confirm(warningMessage)) {
                    setShowTable(true);
                } else {
                    window.history.pushState(null, "", window.location.pathname);
                }
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);

        // Initial history state
        window.history.pushState(null, "", window.location.pathname);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [mapData, electricalData]); // ✅ Correct

    // ✅ Module के according data pass करो
    const currentData = selectedModule === "civil" ? mapData : electricalData;
    const currentSetData =
        selectedModule === "civil" ? setMapData : setElectricalData;

    // ✅ CALL API HERE
    useEffect(() => {
        dispatch(GetProjectsData());
        dispatch(GetWindFarmMasterData());
        dispatch(getClusters());
    }, [dispatch]);

    return ( <
        div className = "app"
        style = {
            {
                position: "relative",
                display: "flex",
                height: "100vh"
            }
        } >
        { /* Conditional Sidebar */ } {
            selectedModule === "civil" ? ( <
                Sidebar selectedRoad = {
                    selectedRoad
                }
                setSelectedRoad = {
                    setSelectedRoad
                }
                roadNames = {
                    civilRoadNames
                }
                setRoadNames = {
                    setCivilRoadNames
                }
                allData = {
                    mapData
                }
                setAllData = {
                    setMapData
                }
                onShowTable = {
                    () => setShowTable(true)
                }
                clusters = {
                    clusters
                }
                selectedCluster = {
                    selectedCluster
                } // ✅ PASS TO SIDEBAR
                setSelectedCluster = {
                    setSelectedCluster
                } // ✅ PASS SETTER
                inputName = {
                    civilInputName
                } // ✅ PASS TO SIDEBAR
                setInputName = {
                    setCivilInputName
                } // ✅ PASS SETTER
                selectedProject = {
                    selectedProject
                }
                setSelectedProject = {
                    setSelectedProject
                }
                selectedWindfarm = {
                    selectedWindfarm
                }
                setSelectedWindfarm = {
                    setSelectedWindfarm
                }
                // ✅ Add module switcher props
                selectedModule = {
                    selectedModule
                }
                setSelectedModule = {
                    setSelectedModule
                }
                />
            ) : ( <
                ElectricalSidebar selectedRoad = {
                    selectedRoad
                }
                setSelectedRoad = {
                    setSelectedRoad
                }
                roadNames = {
                    electricalRoadNames
                }
                setRoadNames = {
                    setElectricalRoadNames
                }
                allData = {
                    electricalData
                }
                setAllData = {
                    setElectricalData
                }
                onShowTable = {
                    () => setShowTable(true)
                }
                selectedProject = {
                    selectedProject
                }
                setSelectedProject = {
                    setSelectedProject
                }
                selectedWindfarm = {
                    selectedWindfarm
                }
                setSelectedWindfarm = {
                    setSelectedWindfarm
                }

                clusters = {
                    clusters
                }
                selectedCluster = {
                    selectedCluster
                }
                setSelectedCluster = {
                    setSelectedCluster
                }
                inputName = {
                    electricalInputName
                }
                setInputName = {
                    setElectricalInputName
                }
                // ✅ Add module switcher props
                selectedModule = {
                    selectedModule
                }
                setSelectedModule = {
                    setSelectedModule
                }
                />
            )
        }

        <
        div style = {
            {
                flex: 1
            }
        } >
        <
        MapWithDraw selectedRoad = {
            selectedRoad
        }
        roadNames = {
            currentStates.roadNames
        } // ✅ Fixed: Use currentStates.roadNames
        setMapData = {
            currentStates.setData
        } // ✅ Fixed: Use currentStates.setData
        mapData = {
            currentStates.data
        } // ✅ Fixed: Use currentStates.data
        selectedCluster = {
            selectedCluster
        } // ✅ PASS TO MAPWITHDRAW
        selectedProject = {
            selectedProject
        }
        selectedWindfarm = {
            selectedWindfarm
        }
        inputName = {
            currentStates.inputName
        } // ✅ Fixed: Use currentStates.inputName
        moduleType = {
            selectedModule
        } // 🔴 Module type pass करो
        /> <
        /div>

        { /* 🔴 Conditional Table Popup */ } {
            showTable && ( <
                div className = "popup" >
                <
                div className = "popup-content" > {
                    selectedModule === "civil" ? ( <
                        DataTable data = {
                            mapData
                        }
                        roadNames = {
                            civilRoadNames
                        }
                        setMapData = {
                            setMapData
                        }
                        onClose = {
                            () => setShowTable(false)
                        }
                        />
                    ) : ( <
                        ElectricalDataTable data = {
                            electricalData
                        }
                        roadNames = {
                            electricalRoadNames
                        }
                        setMapData = {
                            setElectricalData
                        }
                        onClose = {
                            () => setShowTable(false)
                        }
                        />
                    )
                } <
                /div> <
                /div>

                //! optional added part below for table

                //         <div className="popup" style={{
                //   position: 'fixed',
                //   top: '50%',
                //   left: '50%',
                //   transform: 'translate(-50%, -50%)',
                //   width: '80%',
                //   height: '80%',
                //   background: 'white',
                //   zIndex: 9999,
                //   boxShadow: '0 0 30px rgba(0,0,0,0.5)',
                //   borderRadius: '10px',
                //   overflow: 'auto'
                // }}>
                //       <button onClick={() => setShowTable(false)}>Close</button>
                //               <DataTable
                //            data={mapData}
                //          roadNames={roadNames}
                //          setMapData={setMapData}

                //           />

                // </div>
            )
        } <
        /div>
    );
}

export default MapView;