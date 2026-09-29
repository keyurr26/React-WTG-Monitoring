import React from 'react';
import '../styles/TurbinePlannedSchedules.css';

const rawData = {
  "week_start": "2026-09-28",
  "week_end": "2026-10-04",
  "turbines": [
    {
      "turbine": "ANC04",
      "planned_master_id": 68,
      "total_week_activities": 5,
      "activities": [
        { "id": 1135, "activity_id": 26, "activity_name": "SOIL (2 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-09-28", "act_planned_end_date": "2026-09-29", "status": "Pending" },
        { "id": 1136, "activity_id": 27, "activity_name": "EXC (3 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-09-30", "act_planned_end_date": "2026-10-02", "status": "Pending" },
        { "id": 1137, "activity_id": 28, "activity_name": "PCC (1 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-03", "act_planned_end_date": "2026-10-03", "status": "Pending" },
        { "id": 1138, "activity_id": 29, "activity_name": "CONDUIT (1 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-03", "act_planned_end_date": "2026-10-03", "status": "Pending" },
        { "id": 1139, "activity_id": 30, "activity_name": "ANCHOR (2 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-04", "act_planned_end_date": "2026-10-05", "status": "Pending" }
      ]
    },
    {
      "turbine": "ANC07",
      "planned_master_id": 69,
      "total_week_activities": 5,
      "activities": [
        { "id": 1141, "activity_id": 26, "activity_name": "SOIL (2 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-09-28", "act_planned_end_date": "2026-09-29", "status": "Pending" },
        { "id": 1142, "activity_id": 27, "activity_name": "EXC (3 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-09-30", "act_planned_end_date": "2026-10-02", "status": "Pending" },
        { "id": 1143, "activity_id": 28, "activity_name": "PCC (1 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-03", "act_planned_end_date": "2026-10-03", "status": "Pending" },
        { "id": 1144, "activity_id": 29, "activity_name": "CONDUIT (1 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-03", "act_planned_end_date": "2026-10-03", "status": "Pending" },
        { "id": 1145, "activity_id": 30, "activity_name": "ANCHOR (2 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-04", "act_planned_end_date": "2026-10-05", "status": "Pending" }
      ]
    },
    {
      "turbine": "LOC-0044",
      "planned_master_id": 70,
      "total_week_activities": 2,
      "activities": [
        { "id": 1147, "activity_id": 26, "activity_name": "SOIL (2 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-09-30", "act_planned_end_date": "2026-10-01", "status": "Pending" },
        { "id": 1148, "activity_id": 27, "activity_name": "EXC (3 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-02", "act_planned_end_date": "2026-10-04", "status": "Pending" }
      ]
    }
  ]
};

const TurbinePlannedSchedules = () => {
  return (
    <div className="turbine-page">
      <div className="turbine-card">
        
        <div className="turbine-header">
          <div>
            <h1 className="turbine-title">
              Weekly Activity Schedule
            </h1>
            <p className="turbine-subtitle">
              Showing planned activities from <strong>{rawData.week_start}</strong> to <strong>{rawData.week_end}</strong>
            </p>
          </div>
          
          <div className="turbine-stats-container">
            <div className="turbine-stat-pill">
              <span className="turbine-stat-label">Total Turbines:</span>
              <span className="turbine-stat-value">{rawData.turbines.length}</span>
            </div>
            <div className="turbine-stat-pill">
              <span className="turbine-stat-label">Total Activities:</span>
              <span className="turbine-stat-value">
                {rawData.turbines.reduce((acc, curr) => acc + curr.activities.length, 0)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="turbine-table-container">
          <table className="turbine-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Turbine</th>
                <th style={{ width: '25%' }}>Activity Name</th>
                <th style={{ width: '15%' }}>Category</th>
                <th style={{ width: '15%' }}>Start Date</th>
                <th style={{ width: '15%' }}>End Date</th>
                <th style={{ width: '15%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rawData.turbines.flatMap((t, tIndex) => 
                t.activities.map((a, aIndex) => {
                  const statusClass = a.status === 'Pending' ? 'turbine-status-pending' : (a.status === 'Completed' ? 'turbine-status-completed' : 'turbine-status-other');
                  return (
                  <tr key={a.id} className={`turbine-row ${aIndex % 2 === 0 ? 'turbine-row-even' : 'turbine-row-odd'}`}>
                    <td className="turbine-cell-turbine" style={{ fontWeight: aIndex === 0 ? '700' : '400' }}>
                      {aIndex === 0 ? t.turbine : ''}
                    </td>
                    <td className="turbine-cell-activity">
                      {a.activity_name}
                    </td>
                    <td>
                      <span className="turbine-category-badge">
                        {a.category}
                      </span>
                    </td>
                    <td className="turbine-cell-date">{a.act_planned_start_date}</td>
                    <td className="turbine-cell-date">{a.act_planned_end_date}</td>
                    <td>
                      <span className={`turbine-status-badge ${statusClass}`}>
                        <span className="turbine-status-dot"></span>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TurbinePlannedSchedules;
