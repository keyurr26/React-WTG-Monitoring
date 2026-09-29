import React from 'react';
import TurbinePlannedSchedules from './pages/TurbinePlannedSchedules';
import WeeklyActivityDashboard from './pages/WeeklyActivityDashboard';
import GroupedBarChartUI from './pages/GroupedBarChartUI';

function App() {
  return (
    <div>
      <TurbinePlannedSchedules />
      
      <div style={{ padding: '40px 24px', backgroundColor: '#e2e8f0', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: '#334155', fontSize: '24px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          --- 2nd UI ---
        </h2>
      </div>

      <WeeklyActivityDashboard />

      <div style={{ padding: '40px 24px', backgroundColor: '#e2e8f0', textAlign: 'center' }}>
        <h2 style={{ margin: 0, color: '#334155', fontSize: '24px', letterSpacing: '2px', textTransform: 'uppercase' }}>
          --- 3rd UI ---
        </h2>
      </div>

      <GroupedBarChartUI />
    </div>
  );
}

export default App;
