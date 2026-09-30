import React from 'react';
import TurbinePlannedSchedules from './pages/TurbinePlannedSchedules';
import WeeklyActivityDashboard from './pages/WeeklyActivityDashboard';


function App() {
  return (
    <div>
      {/* 1st UI (Previously 2nd UI) */}
      <WeeklyActivityDashboard />

      <div style={{ height: '40px', backgroundColor: '#e2e8f0' }}></div>

      {/* 2nd UI (Previously 1st UI) */}
      <TurbinePlannedSchedules />

    </div>
  );
}

export default App;
