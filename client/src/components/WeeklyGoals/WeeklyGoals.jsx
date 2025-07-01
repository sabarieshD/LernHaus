import React from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import "./Styles.css"; // Import the CSS file

const weeklyGoalsData = [
  { name: "Site Visit", value: 79, fill: "#3498db" },
  { name: "Support", value: 85, fill: "#f1c40f" },
  { name: "Revenue", value: 70, fill: "#2ecc71" },
];

const courseEnrollmentData = [
  { day: "Sun", free: 4000, paid: 8000, sale: 3000 },
  { day: "Mon", free: 7000, paid: 6000, sale: 4000 },
  { day: "Tue", free: 8000, paid: 7000, sale: 3000 },
  { day: "Wed", free: 6500, paid: 5000, sale: 4000 },
  { day: "Thu", free: 7200, paid: 4300, sale: 2000 },
  { day: "Fri", free: 5000, paid: 6500, sale: 6000 },
  { day: "Sat", free: 7800, paid: 7500, sale: 5000 },
];

const WeeklyGoals = () => {
  return (
    <div className="weekly-goals-container">
      {/* Weekly Goals */}
      <div className="weekly-goal-card">
        <h3 className="text-lg font-semibold mb-4">Weekly Goals</h3>
        <div className="radial-chart-container">
          <RadialBarChart
            width={250}
            height={250}
            cx={120}
            cy={120}
            innerRadius={20}
            outerRadius={120}
            barSize={10}
            data={weeklyGoalsData}
          >
            <RadialBar minAngle={15} label={false} background clockWise dataKey="value" />
            <Tooltip />
          </RadialBarChart>
          <div className="radial-chart-legend">
            {weeklyGoalsData.map((goal) => (
              <div key={goal.name} className="flex items-center mb-2">
                <div className="legend-circle" style={{ backgroundColor: goal.fill }}></div>
                <span className="ml-2 text-sm font-medium">{goal.name} - {goal.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Course Enrollment */}
      <div className="weekly-goal-card">
        <div className="enrollment-header">
          <h3 className="text-lg font-semibold">Course Enrollment</h3>
          <select className="enrollment-dropdown">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last Year</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={courseEnrollmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="paid" fill="#2980b9" name="Paid Course" />
            <Bar dataKey="sale" fill="#e67e22" name="On Sale Course" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyGoals;
