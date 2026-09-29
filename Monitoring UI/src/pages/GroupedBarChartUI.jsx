import React from 'react';
import '../styles/GroupedBarChartUI.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const rawData = {
  "week_start": "2026-09-28",
  "week_end": "2026-10-04",
  "turbines": [
    {
      "turbine": "ANC04",
      "activities": [
        { "activity_name": "SOIL (2 days)", "status": "Pending" },
        { "activity_name": "EXC (3 days)", "status": "Pending" },
        { "activity_name": "PCC (1 days)", "status": "Pending" },
        { "activity_name": "CONDUIT (1 days)", "status": "Pending" },
        { "activity_name": "ANCHOR (2 days)", "status": "Pending" }
      ]
    },
    {
      "turbine": "ANC07",
      "activities": [
        { "activity_name": "SOIL (2 days)", "status": "Pending" },
        { "activity_name": "EXC (3 days)", "status": "Pending" },
        { "activity_name": "PCC (1 days)", "status": "Pending" },
        { "activity_name": "CONDUIT (1 days)", "status": "Pending" },
        { "activity_name": "ANCHOR (2 days)", "status": "Pending" }
      ]
    },
    {
      "turbine": "LOC-0044",
      "activities": [
        { "activity_name": "SOIL (2 days)", "status": "Pending" },
        { "activity_name": "EXC (3 days)", "status": "Pending" }
      ]
    }
  ]
};

const activityKeys = ["SOIL", "EXC", "PCC", "CONDUIT", "ANCHOR"];
const colors = ["#4caf50", "#ff9800", "#2196f3", "#9c27b0", "#f44336"];

const chartData = rawData.turbines.map(t => {
  const obj = { name: t.turbine };
  activityKeys.forEach(k => obj[k] = 0);

  t.activities.forEach(a => {
    const match = a.activity_name.match(/(.+?)\s*\((\d+)\s*days?\)/);
    if (match) {
      const actName = match[1].trim();
      const duration = parseInt(match[2], 10);
      obj[actName] = duration;
    }
  });
  return obj;
});

const GroupedBarChartUI = () => {
  return (
    <div className="grouped-bar-container">
      <div className="grouped-bar-content">
        <h2 className="grouped-bar-title">
          Grouped Horizontal Bar Chart - Activity Durations (Days)
        </h2>
        
        <div className="grouped-bar-chart-wrapper">
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="#f1f5f9" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              {activityKeys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} barSize={12} radius={[0, 4, 4, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GroupedBarChartUI;
