import React, { useState } from 'react';
import { Box, Paper, Grid, FormControl, InputLabel, Select, MenuItem, Typography, Button, TextField, IconButton } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import '../styles/TurbinePlannedSchedules.css';

const rawData = {
  "week_start": "2026-09-28",
  "week_end": "2026-10-04",
  "turbines": [
    {
      "project": "Envision TN",
      "windfarm": "Udangudi Wind Park",
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
      "project": "Envision TN",
      "windfarm": "Udangudi Wind Park",
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
      "project": "Envision TN",
      "windfarm": "Udangudi Wind Park",
      "turbine": "LOC-0044",
      "planned_master_id": 70,
      "total_week_activities": 2,
      "activities": [
        { "id": 1147, "activity_id": 26, "activity_name": "SOIL (2 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-09-30", "act_planned_end_date": "2026-10-01", "status": "Pending" },
        { "id": 1148, "activity_id": 27, "activity_name": "EXC (3 days)", "category": "FOUNDATION", "act_planned_start_date": "2026-10-02", "act_planned_end_date": "2026-10-04", "status": "Pending" }
      ]
    },
    {
      "project": "Envision TN",
      "windfarm": "Udangudi Wind Park",
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
      "project": "Envision TN",
      "windfarm": "Udangudi Wind Park",
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
      "project": "Envision TN",
      "windfarm": "Udangudi Wind Park",
      "turbine": "DWK036",
      "planned_master_id": 103,
      "total_week_activities": 2,
      "activities": [
        { "id": 2021, "activity_id": 50, "activity_name": "T1 Installation", "category": "WTG", "act_planned_start_date": "2026-10-01", "act_planned_end_date": "2026-10-02", "status": "Pending" },
        { "id": 2022, "activity_id": 51, "activity_name": "Tower Installation", "category": "WTG", "act_planned_start_date": "2026-10-03", "act_planned_end_date": "2026-10-04", "status": "Pending" }
      ]
    },
    {
      "project": "Envision TN",
      "windfarm": "Udangudi Wind Park",
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
      "project": "Envision TN",
      "windfarm": "Udangudi Wind Park",
      "turbine": "DWK032",
      "planned_master_id": 105,
      "total_week_activities": 2,
      "activities": [
        { "id": 2041, "activity_id": 50, "activity_name": "T1 Installation", "category": "WTG", "act_planned_start_date": "2026-10-01", "act_planned_end_date": "2026-10-02", "status": "Pending" },
        { "id": 2042, "activity_id": 51, "activity_name": "Tower Installation", "category": "WTG", "act_planned_start_date": "2026-10-03", "act_planned_end_date": "2026-10-04", "status": "Pending" }
      ]
    }
  ]
};

const TurbinePlannedSchedules = () => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [expandedTurbines, setExpandedTurbines] = useState({});

  const toggleTurbine = (turbine) => {
    setExpandedTurbines(prev => ({ ...prev, [turbine]: !prev[turbine] }));
  };

  return (
    <div className="turbine-page">
      <div className="turbine-card">

        <Box sx={{ mb: 3 }}>
          <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CalendarMonthIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Turbine Installation Planning Workspace</Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
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
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ flex: 1, minWidth: 220 }}>
                <InputLabel>Category Scope</InputLabel>
                <Select
                  label="Category Scope"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="FOUNDATION">FOUNDATION</MenuItem>
                  <MenuItem value="WTG">WTG</MenuItem>
                </Select>
              </FormControl>
              <Button variant="outlined" color="error" sx={{ height: '40px', minWidth: 120 }}>Clear Filters</Button>
            </Box>
          </Paper>


        </Box>

        <div className="turbine-table-container">
          <table className="turbine-table">
            <thead>
              <tr>
                <th style={{ width: '5%', color: 'white', backgroundColor: '#0b499e' }}></th>
                <th style={{ width: '15%', color: 'white', backgroundColor: '#0b499e' }}>Turbine Sr No</th>
                <th style={{ width: '20%', color: 'white', backgroundColor: '#0b499e' }}>Category</th>
                <th style={{ width: '20%', color: 'white', backgroundColor: '#0b499e' }}>Planned Start Date</th>
                <th style={{ width: '20%', color: 'white', backgroundColor: '#0b499e' }}>Planned End Date</th>
                <th style={{ width: '20%', color: 'white', backgroundColor: '#0b499e' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {rawData.turbines.map((t) => {
                const filteredActivities = t.activities.filter(a => categoryFilter === '' || a.category === categoryFilter);
                if (filteredActivities.length === 0) return null;

                const isExpanded = expandedTurbines[t.turbine];
                const firstAct = filteredActivities[0];
                const lastAct = filteredActivities[filteredActivities.length - 1];

                const mainDuration = Math.round((new Date(lastAct.act_planned_end_date) - new Date(firstAct.act_planned_start_date)) / (1000 * 60 * 60 * 24)) + 1;

                return (
                  <React.Fragment key={t.turbine}>
                    <tr
                      className="turbine-row"
                      onClick={() => toggleTurbine(t.turbine)}
                      style={{ backgroundColor: '#eaf2f8', cursor: 'pointer' }}
                    >
                      <td style={{ textAlign: 'center' }}>
                        <IconButton size="small" sx={{ padding: '2px', backgroundColor: '#ffffff', border: '1px solid #ccc' }}>
                          {isExpanded ? <KeyboardArrowUpIcon fontSize="small" /> : <KeyboardArrowDownIcon fontSize="small" />}
                        </IconButton>
                      </td>
                      <td style={{ fontWeight: '600' }}>{t.turbine}</td>
                      <td>{firstAct.category}</td>
                      <td style={{ color: '#2e7d32', fontWeight: '500' }}>{firstAct.act_planned_start_date.split('-').reverse().join('-')}</td>
                      <td style={{ color: '#d32f2f', fontWeight: '500' }}>{lastAct.act_planned_end_date.split('-').reverse().join('-')}</td>
                      <td style={{ fontWeight: '500' }}>{mainDuration} Days</td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan="6" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
                          <div style={{ border: '1px dashed #0b499e', borderRadius: '4px', padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: '#0b499e', fontWeight: '600', fontSize: '15px' }}>
                              Activity Schedule for Location Block: {t.turbine}
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#eaf2f8' }}>
                                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0b499e', borderBottom: 'none' }}>Seq</th>
                                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0b499e', borderBottom: 'none' }}>Activity</th>
                                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0b499e', borderBottom: 'none' }}>Planned Start Date</th>
                                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0b499e', borderBottom: 'none' }}>Planned Completion Date</th>
                                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0b499e', borderBottom: 'none' }}>Duration</th>
                                  <th style={{ padding: '12px 16px', textAlign: 'left', color: '#0b499e', borderBottom: 'none' }}>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredActivities.map((a, aIndex) => {
                                  const actDuration = Math.round((new Date(a.act_planned_end_date) - new Date(a.act_planned_start_date)) / (1000 * 60 * 60 * 24)) + 1;
                                  const statusClass = a.status === 'Pending' ? 'turbine-status-pending' : (a.status === 'Completed' ? 'turbine-status-completed' : 'turbine-status-other');
                                  return (
                                    <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                      <td style={{ padding: '12px 16px', fontWeight: '600' }}>{aIndex + 1}</td>
                                      <td style={{ padding: '12px 16px' }}>{a.activity_name.split(' (')[0]}</td>
                                      <td style={{ padding: '12px 16px', color: '#2e7d32', fontWeight: '600' }}>{a.act_planned_start_date.split('-').reverse().join('-')}</td>
                                      <td style={{ padding: '12px 16px', color: '#d32f2f', fontWeight: '600' }}>{a.act_planned_end_date.split('-').reverse().join('-')}</td>
                                      <td style={{ padding: '12px 16px', fontWeight: '500' }}>{actDuration} Days</td>
                                      <td style={{ padding: '12px 16px' }}>
                                        <span className={`turbine-status-badge ${statusClass}`}>
                                          <span className="turbine-status-dot"></span>
                                          {a.status}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TurbinePlannedSchedules;
