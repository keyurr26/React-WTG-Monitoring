// src/reducers/index.js
import {
    combineReducers
} from 'redux';
import authReducer from './Authentication/authReducer';
import {
    MasterDataReducer
} from './MasterData/masterReducer';
import {
    InventaryDataReducer
} from './InventaryData/inventaryReducer';
import {
    CartRoadReducer
} from './InstallationData/CartRoadData/cartroadReducer';
import TurbineReducer from './TurbineMasterData/turbineReducer';
import {
    foundationReducer
} from './InstallationData/FoundationData/foundationReducer';
import {
    feederReducer
} from './InstallationData/FeederData/feederReducer';
import wtgInstallationReducer from './InstallationData/WtgInstallationData/wtgInstallationReducer';
import sqReducer from './SafetyQualityData/SafetyQualityReducer';
import mapReducer from './InstallationData/plannedmapData/mapReducer';
import {
    dashboardDataReducer
} from './DashboardData/dashboardReducer';
import {
    platformReducer
} from './InstallationData/PlateformData/plateformReducer';
import {
    ElectricalDataReducer
} from '../Redux/InstallationData/ElectricalLinesData/ElectricalReducer'
import {
    UssActivityReducer
} from './InstallationData/UssData/UssReducer';
import documentReducer from './DmsData/Document/DocumentReducer';
import assignTaskReducer from "./DmsData/AssignTask/AssignTaskReducer";
import projectNestedTemplateReducer from './TemplateView/TemplateReducer';


const rootReducer = combineReducers({
    auth: authReducer,
    masterData: MasterDataReducer,
    inventaryData: InventaryDataReducer,
    cardRoad: CartRoadReducer,
    turbineData: TurbineReducer,
    foundationData: foundationReducer,
    platformData: platformReducer,
    // other reducers can go here
    wtgInstallationData: wtgInstallationReducer,
    feederData: feederReducer,
    sqData: sqReducer,

    mapData: mapReducer,
    dashboardData: dashboardDataReducer,
    electricalData: ElectricalDataReducer,
    ussActivityData: UssActivityReducer,

    //  dms root
    assignTask: assignTaskReducer,
    document: documentReducer,
    projectNestedTemplate: projectNestedTemplateReducer,

});

export default rootReducer;