import React, { useState, useMemo } from 'react';
import '../styles/WeeklyActivityDashboard.css';
import { ChevronDown, ChevronUp, Calendar, Target, Settings, Clock, Activity } from 'lucide-react';

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

// Date helpers
const formatDate = (dateStr) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', options); 
};

const getDaysDiff = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = Math.abs(e - s);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
};

const getDatesInRange = (start, end) => {
  const dates = [];
  let curr = new Date(start);
  const last = new Date(end);
  while (curr <= last) {
    dates.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};

const activityColors = [
  '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#0ea5e9'
];

const Accordion = ({ title, defaultOpen = true, headerColor = '#f8fafc', titleStyle = {}, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="accordion-wrapper">
      <button 
        className="accordion-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: headerColor,
          borderBottom: isOpen ? '1px solid #e2e8f0' : 'none'
        }}
      >
        <div style={titleStyle}>{title}</div>
        {isOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
      </button>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

const WeeklyActivityDashboard = () => {
  
  const { categories, stats, timelineDates, minDateStr, maxDateStr } = useMemo(() => {
    let totalActivities = 0;
    let pendingCount = 0;
    const catMap = {};
    let minDate = new Date(rawData.week_start);
    let maxDate = new Date(rawData.week_end);
    
    rawData.turbines.forEach(t => {
      t.activities.forEach(a => {
        totalActivities++;
        if (a.status === 'Pending') pendingCount++;
        
        const sd = new Date(a.act_planned_start_date);
        const ed = new Date(a.act_planned_end_date);
        if (sd < minDate) minDate = sd;
        if (ed > maxDate) maxDate = ed;
        
        if (!catMap[a.category]) catMap[a.category] = { count: 0, turbines: {} };
        catMap[a.category].count++;
        
        if (!catMap[a.category].turbines[t.turbine]) {
          catMap[a.category].turbines[t.turbine] = [];
        }
        
        const duration = getDaysDiff(a.act_planned_start_date, a.act_planned_end_date);
        catMap[a.category].turbines[t.turbine].push({ ...a, duration });
      });
    });
    
    const timelineDatesList = getDatesInRange(minDate, maxDate);

    return { 
      categories: catMap, 
      stats: {
        totalTurbines: rawData.turbines.length,
        totalActivities,
        foundationActivities: catMap['FOUNDATION']?.count || 0,
        pendingCount
      },
      timelineDates: timelineDatesList,
      minDateStr: minDate.toISOString().split('T')[0],
      maxDateStr: maxDate.toISOString().split('T')[0]
    };
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        
        <div className="dashboard-card">
          <div className="dashboard-header-flex">
            <div>
              <h1 className="dashboard-title">Weekly Activity Plan</h1>
              <div className="dashboard-date-pill">
                <Calendar size={16} style={{ marginRight: '8px' }} />
                {formatDate(rawData.week_start)} &nbsp;&mdash;&nbsp; {formatDate(rawData.week_end)}
              </div>
            </div>
            
            <div className="dashboard-stats-flex">
              <div className="dashboard-stat-card stat-turbines">
                <span className="stat-label">Total Turbines</span>
                <span className="stat-value">{stats.totalTurbines}</span>
              </div>
              <div className="dashboard-stat-card stat-activities">
                <span className="stat-label">Total Activities</span>
                <span className="stat-value">{stats.totalActivities}</span>
              </div>
              <div className="dashboard-stat-card stat-foundation">
                <span className="stat-label">Foundation</span>
                <span className="stat-value">{stats.foundationActivities}</span>
              </div>
              <div className="dashboard-stat-card stat-pending">
                <span className="stat-label">Pending</span>
                <span className="stat-value">{stats.pendingCount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card timeline-section">
          <h2 className="timeline-title">
            <Activity size={20} style={{ marginRight: '8px', color: '#3b82f6' }} />
            Weekly Timeline Overview
          </h2>
          
          <div className="timeline-wrapper">
            <div className="timeline-header" style={{ display: 'grid', gridTemplateColumns: `120px repeat(${timelineDates.length}, 1fr)` }}>
              <div className="timeline-turbine-label">Turbine</div>
              {timelineDates.map((d, i) => (
                <div key={i} className="timeline-date">
                  <div className="timeline-date-day">{d.getDate()}</div>
                  <div>{d.toLocaleString('en-US', { month: 'short' })}</div>
                </div>
              ))}
            </div>
            
            {rawData.turbines.map(t => (
              <div key={t.turbine} className="timeline-row" style={{ display: 'grid', gridTemplateColumns: `120px repeat(${timelineDates.length}, 1fr)` }}>
                <div className="timeline-row-label">{t.turbine}</div>
                
                <div className="timeline-grid-bg" style={{ display: 'grid', gridColumn: `2 / span ${timelineDates.length}`, gridTemplateColumns: `repeat(${timelineDates.length}, 1fr)` }}>
                  {timelineDates.map((_, i) => (
                    <div key={i} className="timeline-grid-line"></div>
                  ))}
                </div>

                <div className="timeline-bars-container" style={{ gridColumn: `2 / span ${timelineDates.length}` }}>
                  {t.activities.map((a, i) => {
                    const sDate = new Date(a.act_planned_start_date);
                    const eDate = new Date(a.act_planned_end_date);
                    const totalDays = timelineDates.length;
                    const offsetDays = getDaysDiff(timelineDates[0], sDate) - 1; 
                    const durationDays = getDaysDiff(sDate, eDate);
                    
                    const leftPct = (offsetDays / totalDays) * 100;
                    const widthPct = (durationDays / totalDays) * 100;
                    const color = activityColors[i % activityColors.length];

                    return (
                      <div 
                        key={a.id} 
                        className="timeline-bar"
                        style={{
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                          backgroundColor: color
                        }}
                        title={`${a.activity_name} (${a.duration} days)`}
                      >
                        {a.activity_name}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {Object.entries(categories).map(([categoryName, catData]) => (
          <Accordion 
            key={categoryName} 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Target size={20} style={{ marginRight: '10px', color: '#1e40af' }} />
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>{categoryName}</span>
                <span style={{ marginLeft: '12px', backgroundColor: '#e2e8f0', color: '#475569', fontSize: '12px', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                  {catData.count} Activities
                </span>
              </div>
            }
            headerColor="#f8fafc"
          >
            {Object.entries(catData.turbines).map(([turbineName, activities]) => (
              <Accordion 
                key={turbineName} 
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Settings size={18} style={{ marginRight: '8px', color: '#64748b' }} />
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#334155' }}>{turbineName}</span>
                    <span style={{ marginLeft: '12px', color: '#64748b', fontSize: '14px' }}>
                      — {activities.length} Activities
                    </span>
                  </div>
                }
                headerColor="#ffffff"
                defaultOpen={true}
              >
                <div className="dashboard-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Activity</th>
                        <th>ID</th>
                        <th>Planned Start</th>
                        <th>Planned End</th>
                        <th>Duration</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((a, i) => (
                        <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: i % 2 === 0 ? '#fff' : '#fafafb' }}>
                          <td style={{ fontWeight: '500', color: '#0f172a' }}>{a.activity_name.split(' (')[0]}</td>
                          <td style={{ color: '#64748b' }}>#{a.id}</td>
                          <td style={{ color: '#334155' }}>{formatDate(a.act_planned_start_date)}</td>
                          <td style={{ color: '#334155' }}>{formatDate(a.act_planned_end_date)}</td>
                          <td style={{ color: '#334155' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <Clock size={14} style={{ marginRight: '6px', color: '#94a3b8' }} />
                              {a.duration} {a.duration > 1 ? 'Days' : 'Day'}
                            </div>
                          </td>
                          <td>
                            <span style={{ 
                              padding: '4px 10px', 
                              borderRadius: '20px', 
                              fontSize: '12px',
                              fontWeight: '600',
                              backgroundColor: 
                                a.status === 'Completed' ? '#dcfce7' : 
                                a.status === 'In Progress' ? '#dbeafe' : 
                                a.status === 'Delayed' ? '#fee2e2' : '#f1f5f9',
                              color: 
                                a.status === 'Completed' ? '#166534' : 
                                a.status === 'In Progress' ? '#1e40af' : 
                                a.status === 'Delayed' ? '#991b1b' : '#475569',
                            }}>
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Accordion>
            ))}
          </Accordion>
        ))}

      </div>
    </div>
  );
};

export default WeeklyActivityDashboard;
