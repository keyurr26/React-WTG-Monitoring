import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import { getSecureSlug } from '../utils/slugHelper';
// Import your page components
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/login';
import Signup from '../pages/auth/signup';
// import Home from '../pages/Dashboard/Home';
import ProjectIndex from '../pages/AddmasterData';
import InventoryManagement from '../pages/Inventory/InventoryManagement';
import MainLayout from '../layout/MainLayout';
import InventoryDashboard from '../pages/Inventory/InventoryDashboard';

// import ApprovedMainTabsUI from '../pages/ApprovedReportTable/ApprovedMainTabs';
import ApprovedMainIndex from '../pages/ApprovedReportsTable/ApproveMainIndex';

import TurbineLocationForm from '../pages/TurbineMaster/TurbineMaster';
import ClusterMaster from '../pages/AddmasterData/MasterFile/ClusterMaster';
import SafetyQualityForm from '../pages/SQCheck/safetyQualityForm';

import DownloadViewReportData from '../pages/ApprovedReportsTable/ReportTemplate/overallView';
import MainTabs from '../components/MainTabs';
import MapView from '../pages/mapview/mapViewIndex';
import DashboardMainTabs from '../pages/overalldashboard/Dashboard';
import UpdateListTab from '../pages/SQCheck/UpdateListTab';

import SQRecordListAdmin from '../pages/SQCheck/SQRecordListAdmin';

import ElectricalMapView from '../pages/Electrical Section/E-Mapview/ElectricalMapView';
import DMSMainIndex from '../pages/DMS/dmsindex';

const AppRouter = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* --- ALL AUTHENTICATED USERS --- */}
      <Route element={<MainLayout />}>
      {/* ADMIN ROUTES */}
     
<Route path="/approved-reports-download" element={<DownloadViewReportData />} />
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        {/* <Route element={<MainLayout />}> */}
          <Route path="/dash-board" element={<DashboardMainTabs />} />
          <Route path="/master-project-index" element={<ProjectIndex />} />
          <Route path="/approved-reports" element={<ApprovedMainIndex />} />
          <Route path="/inventory-dashboard" element={<InventoryDashboard />} />
          <Route path="/road-map-master" element={<MapView />} />
                <Route path="/electrical-map-master" element={<ElectricalMapView/>} />

          <Route path="/safety-quality-admin" element={<SQRecordListAdmin />} />
        {/* </Route> */}
      </Route>

      {/* DMS ROUTES - ADMIN + INSPECTOR + CUSTOMER */}
<Route
  element={
    <ProtectedRoute
      allowedRoles={["admin", "customer", "inspector"]}
    />
  }
>
  <Route path="/dms-tab" element={<DMSMainIndex />} />
</Route>


      {/* INSPECTOR ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["inspector", "supervisor"]} />}>
        {/* <Route element={<MainLayout />}> */}
          <Route path="/construction-stages" element={<MainTabs />} />
          {/* <Route path="/inventory-management" element={<InventoryManagement />} /> */}
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["inspector", "supervisor", "store_keeper"]} />}>
          <Route path="/inventory-management" element={<InventoryManagement />} />
      </Route>
     
       
      {/* SHARED BY BOTH (The Fix) */}
      <Route element={<ProtectedRoute allowedRoles={["inspector"]} />}>
          <Route path="/safety-quality-record-update" element={<UpdateListTab />} />
      </Route>
       {/*Quality  INSPECTOR ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["quality_officer", "safety_officer"]} />}>
        {/* <Route element={<MainLayout />}> */}
          
          <Route path="/safety-quality" element={<SafetyQualityForm />} />
          <Route path="/safety-quality-record-update" element={<UpdateListTab />} />
        {/* </Route> */}
      </Route>
     
      {/* <Route element={<ProtectedRoute allowedRoles={["store_keeper"]} />}>
          <Route path="/inventory-management" element={<InventoryManagement />} />
      </Route> */}
      {/* SHARED ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["admin", "inspector", "supervisor", "store_keeper"]} />}>
        {/* <Route element={<MainLayout />}> */}
          <Route path="/clusters/bulk" element={<ClusterMaster />} />
          <Route path="/turbine-locations/bulk" element={<TurbineLocationForm />} />
        {/* </Route> */}
      </Route>
      </Route>
      {/* Unauthorized */}
      <Route path="/unauthorized" element={<h2>403 – Access Denied</h2>} />
    </Routes>
  );
};

export default AppRouter;

