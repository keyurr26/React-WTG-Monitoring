import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import '../styles/WeeklyActivityDashboard.css';
import { ChevronDown, ChevronUp, Calendar, Target, Settings, Clock, Activity } from 'lucide-react';
import { Box, Paper, FormControl, InputLabel, Select, MenuItem, Typography, Button } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export const weeksData = [
  {
    week_id: "28 Sep 2026 - 04 Oct 2026",
    week_start: "2026-09-28",
    week_end: "2026-10-04",
    turbines: [
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
      },
      {
        "turbine": "DWK035",
        "planned_master_id": 101,
        "total_week_activities": 5,
        "activities": [
          { "id": 2001, "activity_id": 50, "activity_name": "T1 Installation", "category": "WTG", "act_planned_start_date": "2026-10-01", "act_planned_end_date": "2026-10-02", "status": "Pending" },
          { "id": 2002, "activity_id": 51, "activity_name": "Tower Installation", "category": "WTG", "act_planned_start_date": "2026-10-03", "act_planned_end_date": "2026-10-04", "status": "Pending" },
          { "id": 2003, "activity_id": 52, "activity_name": "Nacelle Installation", "category": "WTG", "act_planned_start_date": "2026-10-05", "act_planned_end_date": "2026-10-05", "status": "Pending" },
          { "id": 2004, "activity_id": 53, "activity_name": "Rotor Hub Installation", "category": "WTG", "act_planned_start_date": "2026-10-06", "act_planned_end_date": "2026-10-07", "status": "Pending" },
          { "id": 2005, "activity_id": 54, "activity_name": "Blade Installation", "category": "WTG", "act_planned_start_date": "2026-10-08", "act_planned_end_date": "2026-10-09", "status": "Pending" }
        ]
      },
      {
        "turbine": "DWK177",
        "planned_master_id": 102,
        "total_week_activities": 3,
        "activities": [
          { "id": 2011, "activity_id": 50, "activity_name": "T1 Installation", "category": "WTG", "act_planned_start_date": "2026-10-01", "act_planned_end_date": "2026-10-02", "status": "Pending" },
          { "id": 2012, "activity_id": 51, "activity_name": "Tower Installation", "category": "WTG", "act_planned_start_date": "2026-10-03", "act_planned_end_date": "2026-10-04", "status": "Pending" },
          { "id": 2013, "activity_id": 52, "activity_name": "Nacelle Installation", "category": "WTG", "act_planned_start_date": "2026-10-05", "act_planned_end_date": "2026-10-05", "status": "Pending" }
        ]
      },
      {
        "turbine": "DWK036",
        "planned_master_id": 103,
        "total_week_activities": 2,
        "activities": [
          { "id": 2021, "activity_id": 50, "activity_name": "T1 Installation", "category": "WTG", "act_planned_start_date": "2026-10-01", "act_planned_end_date": "2026-10-02", "status": "Pending" },
          { "id": 2022, "activity_id": 51, "activity_name": "Tower Installation", "category": "WTG", "act_planned_start_date": "2026-10-03", "act_planned_end_date": "2026-10-04", "status": "Pending" }
        ]
      },
      {
        "turbine": "DWK176",
        "planned_master_id": 104,
        "total_week_activities": 3,
        "activities": [
          { "id": 2031, "activity_id": 50, "activity_name": "T1 Installation", "category": "WTG", "act_planned_start_date": "2026-10-01", "act_planned_end_date": "2026-10-02", "status": "Pending" },
          { "id": 2032, "activity_id": 51, "activity_name": "Tower Installation", "category": "WTG", "act_planned_start_date": "2026-10-03", "act_planned_end_date": "2026-10-04", "status": "Pending" },
          { "id": 2033, "activity_id": 52, "activity_name": "Nacelle Installation", "category": "WTG", "act_planned_start_date": "2026-10-05", "act_planned_end_date": "2026-10-05", "status": "Pending" }
        ]
      },
      {
        "turbine": "DWK032",
        "planned_master_id": 105,
        "total_week_activities": 2,
        "activities": [
          { "id": 2041, "activity_id": 50, "activity_name": "T1 Installation", "category": "WTG", "act_planned_start_date": "2026-10-01", "act_planned_end_date": "2026-10-02", "status": "Pending" },
          { "id": 2042, "activity_id": 51, "activity_name": "Tower Installation", "category": "WTG", "act_planned_start_date": "2026-10-03", "act_planned_end_date": "2026-10-04", "status": "Pending" }
        ]
      }
    ]
  },
  {
    week_id: "05 Oct 2026 - 11 Oct 2026",
    week_start: "2026-10-05",
    week_end: "2026-10-11",
    turbines: [
      {
        "turbine": "ANC04",
        "planned_master_id": 68,
        "total_week_activities": 3,
        "activities": [
          { "id": 1201, "activity_id": 31, "activity_name": "REINFORCEMENT (3 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-05", "act_planned_end_date": "2026-10-07", "status": "Pending" },
          { "id": 1202, "activity_id": 32, "activity_name": "FOUNDATION (2 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-08", "act_planned_end_date": "2026-10-09", "status": "Pending" },
          { "id": 1203, "activity_id": 33, "activity_name": "POURING (1 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-10", "act_planned_end_date": "2026-10-10", "status": "Pending" }
        ]
      },
      {
        "turbine": "DWK035",
        "planned_master_id": 101,
        "total_week_activities": 1,
        "activities": [
          { "id": 2010, "activity_id": 54, "activity_name": "Blade Installation", "category": "WTG", "act_planned_start_date": "2026-10-05", "act_planned_end_date": "2026-10-06", "status": "Pending" }
        ]
      }
    ]
  },
  {
    week_id: "12 Oct 2026 - 18 Oct 2026",
    week_start: "2026-10-12",
    week_end: "2026-10-18",
    turbines: [
      {
        "turbine": "ANC04",
        "planned_master_id": 68,
        "total_week_activities": 2,
        "activities": [
          { "id": 1301, "activity_id": 34, "activity_name": "CUBE RESULT (5 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-12", "act_planned_end_date": "2026-10-16", "status": "Pending" },
          { "id": 1302, "activity_id": 35, "activity_name": "BACKFILLING (2 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-17", "act_planned_end_date": "2026-10-18", "status": "Pending" }
        ]
      }
    ]
  }
];

// Date helpers
const parseDateStr = (dateStr) => {
  if (!dateStr) return new Date();
  const [y, m, d] = dateStr.split('T')[0].split('-');
  return new Date(y, m - 1, d);
};

const formatDate = (dateStr) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const d = parseDateStr(dateStr);
  return d.toLocaleDateString('en-GB', options);
};

const getDaysDiff = (start, end) => {
  const s = parseDateStr(start);
  const e = parseDateStr(end);
  const diffTime = Math.abs(e - s);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const getDatesInRange = (start, end) => {
  const dates = [];
  let curr = new Date(start);
  curr.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (curr <= last) {
    dates.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }
  return dates;
};

const activityColorMap = {
  // FOUNDATION
  'SOIL': '#6366f1',
  'EXC': '#22c55e',
  'PCC': '#f59e0b',
  'CONDUIT': '#3b82f6',
  'ANCHOR': '#ef4444',
  'REINFORCEMENT': '#a855f7',
  'FOUNDATION': '#06b6d4',
  'POURING': '#f97316',
  'CUBE RESULT': '#4f46e5',
  'BACKFILLING': '#65a30d',

  // WTG
  'T1 Installation': '#6366f1',
  'Tower Installation': '#22c55e',
  'Nacelle Installation': '#f59e0b',
  'Rotor Hub Installation': '#3b82f6',
  'Blade Installation': '#a855f7',
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
  const [selectedWeekId, setSelectedWeekId] = useState(weeksData[0].week_id);
  const [colWidth, setColWidth] = useState(120);
  const dragRef = useRef({ isDragging: false, startX: 0, startWidth: 0 });

  const handleMouseDown = useCallback((e) => {
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startWidth: colWidth
    };
    document.body.style.cursor = 'col-resize';
  }, [colWidth]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragRef.current.isDragging) return;
      const delta = e.clientX - dragRef.current.startX;
      const newWidth = Math.max(60, dragRef.current.startWidth + delta);
      setColWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (dragRef.current.isDragging) {
        dragRef.current.isDragging = false;
        document.body.style.cursor = 'default';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // Pinch-to-zoom on trackpad or Ctrl+Scroll wheel triggers ctrlKey
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY * -0.5;
        setColWidth(prev => Math.min(400, Math.max(40, prev + delta)));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);


  const rawData = useMemo(() => {
    return weeksData.find(w => w.week_id === selectedWeekId) || weeksData[0];
  }, [selectedWeekId]);

  const [categoryFilter, setCategoryFilter] = useState('');

  const { categories, availableCategories, stats, timelineDates, computedStartStr, computedEndStr, filteredTurbines } = useMemo(() => {
    let totalActivities = 0;
    let pendingCount = 0;
    const catMap = {};
    let minDate = parseDateStr(rawData.week_start);
    let maxDate = parseDateStr(rawData.week_end);

    const allCategories = new Set();
    rawData.turbines.forEach(t => t.activities.forEach(a => allCategories.add(a.category)));

    const filteredTurbinesList = [];

    rawData.turbines.forEach(t => {
      const tActs = t.activities.filter(a => categoryFilter === '' || a.category === categoryFilter);
      if (tActs.length === 0) return;

      const newT = { ...t, activities: [] };

      tActs.forEach(a => {
        totalActivities++;
        if (a.status === 'Pending') pendingCount++;

        const sd = new Date(a.act_planned_start_date);
        const ed = new Date(a.act_planned_end_date);
        if (sd < minDate) minDate = sd;
        if (ed > maxDate) maxDate = ed;

        if (!catMap[a.category]) catMap[a.category] = { count: 0, turbines: {} };
        catMap[a.category].count++;

        if (!catMap[a.category].turbines[newT.turbine]) {
          catMap[a.category].turbines[newT.turbine] = [];
        }

        const duration = getDaysDiff(a.act_planned_start_date, a.act_planned_end_date);
        const newA = { ...a, duration };
        catMap[a.category].turbines[newT.turbine].push(newA);
        newT.activities.push(newA);
      });

      filteredTurbinesList.push(newT);
    });

    const finalStart = minDate;
    const finalEnd = maxDate;

    const timelineDatesList = getDatesInRange(finalStart, finalEnd);

    return {
      categories: catMap,
      availableCategories: Array.from(allCategories),
      stats: {
        totalTurbines: filteredTurbinesList.length,
        totalActivities,
        foundationActivities: catMap['FOUNDATION']?.count || 0,
        pendingCount
      },
      timelineDates: timelineDatesList,
      computedStartStr: minDate.toISOString().split('T')[0],
      computedEndStr: maxDate.toISOString().split('T')[0],
      filteredTurbines: filteredTurbinesList
    };
  }, [categoryFilter, rawData]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        <Box sx={{ mb: 3 }}>
          <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarMonthIcon sx={{ mr: 1, color: '#3b82f6' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '18px', color: '#1e293b' }}>Turbine Installation Planning Workspace</Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 3, color: '#64748b' }}>
              Select Scope Boundaries, Cluster, and Category to manage deployment targets and generate baseline activity charts.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <FormControl size="small" sx={{ flex: 1, minWidth: 140 }}>
                <InputLabel>Project</InputLabel>
                <Select label="Project" defaultValue="Envision TN">
                  <MenuItem value="Envision TN">Envision TN</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ flex: 1, minWidth: 180 }}>
                <InputLabel>Windfarm</InputLabel>
                <Select label="Windfarm" defaultValue="Udangudi Wind Park">
                  <MenuItem value="Udangudi Wind Park">Udangudi Wind Park</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ flex: 1, minWidth: 200 }}>
                <InputLabel>Cluster</InputLabel>
                <Select label="Cluster" defaultValue="Udangudi North Cluster">
                  <MenuItem value="Udangudi North Cluster">Udangudi North Cluster</MenuItem>
                  <MenuItem value="Udangudi South Cluster">Udangudi South Cluster</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                color="error"
                onClick={() => setCategoryFilter('')}
                sx={{ height: 40 }}
              >
                Clear Filters
              </Button>
            </Box>
          </Paper>
        </Box>


        <div className="dashboard-card timeline-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="timeline-title" style={{ margin: 0 }}>
              <Activity size={20} style={{ marginRight: '8px', color: '#3b82f6' }} />
              Weekly Timeline Overview
            </h2>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel>Category Scope</InputLabel>
                <Select
                  label="Category Scope"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {availableCategories.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 250 }}>
                <InputLabel>Select Week</InputLabel>
                <Select
                  label="Select Week"
                  value={selectedWeekId}
                  onChange={(e) => setSelectedWeekId(e.target.value)}
                >
                  {weeksData.map(w => (
                    <MenuItem key={w.week_id} value={w.week_id}>{w.week_id}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="timeline-scroll-container" ref={scrollContainerRef}>
            <div className="timeline-wrapper">
              <div className="timeline-header" style={{ display: 'grid', gridTemplateColumns: `120px repeat(${timelineDates.length}, minmax(${colWidth}px, 1fr))` }}>
                <div className="timeline-turbine-label">Turbine</div>
                {timelineDates.map((d, i) => (
                  <div key={i} className="timeline-date" style={{ position: 'relative' }}>
                    <div
                      style={{ position: 'absolute', left: -5, top: 0, bottom: 0, width: 10, cursor: 'col-resize', zIndex: 20 }}
                      onMouseDown={handleMouseDown}
                    ></div>
                    <div className="timeline-date-day">{d.getDate()}</div>
                    <div>{d.toLocaleString('en-US', { month: 'short' })} {d.getFullYear()}</div>
                  </div>
                ))}
              </div>

              {filteredTurbines.map(t => (
                <div key={t.turbine} className="timeline-row" style={{ display: 'grid', gridTemplateColumns: `120px repeat(${timelineDates.length}, minmax(${colWidth}px, 1fr))` }}>
                  <div className="timeline-row-label">{t.turbine}</div>
                  {/* Background grid lines drawn directly into the parent grid cells */}
                  {timelineDates.map((_, i) => (
                    <div key={`bg-${i}`} className="timeline-grid-line" style={{ gridColumn: `${i + 2}`, gridRow: 1 }}></div>
                  ))}

                  <div className="timeline-bars-container" style={{ gridColumn: `2 / span ${timelineDates.length}`, gridRow: 1 }}>
                    {t.activities.map((a, i) => {
                      const sDate = parseDateStr(a.act_planned_start_date);
                      const eDate = parseDateStr(a.act_planned_end_date);
                      const totalDays = timelineDates.length;

                      const offsetTime = sDate - timelineDates[0];
                      const offsetDays = Math.round(offsetTime / (1000 * 60 * 60 * 24));

                      const durationTime = eDate - sDate;
                      const durationDays = Math.round(durationTime / (1000 * 60 * 60 * 24)) + 1;

                      if (eDate < timelineDates[0] || sDate > timelineDates[timelineDates.length - 1]) return null;

                      const leftPct = (offsetDays / totalDays) * 100;
                      const widthPct = (durationDays / totalDays) * 100;

                      const baseName = a.activity_name.split(' (')[0];
                      const color = activityColorMap[baseName] || activityColorMap[baseName.toUpperCase()] || activityColors[i % activityColors.length];

                      return (
                        <div
                          key={a.id}
                          className="timeline-bar"
                          style={{
                            left: `${leftPct}%`,
                            width: `${widthPct}%`,
                            backgroundColor: color
                          }}
                          title={`${baseName} (${durationDays} days)`}
                        >
                          {baseName} ({durationDays} {durationDays === 1 ? 'day' : 'days'})
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeeklyActivityDashboard;
