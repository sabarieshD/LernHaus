import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const StatsComponents = () => {
  const progressData = [
    { title: "Monthly Revenue Target", target: "$1.2M", reached: "$823K", percentage: 69 },
    { title: "Monthly Visitor Target", target: "$7.5M", reached: "$4.8M", percentage: 64 },
  ];

  const lineChartData = [
    { name: "launch", sale: 2000, regular: 1500 },
    { name: "week 4", sale: 3000, regular: 1000 },
    { name: "week 8", sale: 1500, regular: 2000 },
    { name: "week 12", sale: 2200, regular: 1400 },
  ];

  return (
    <div className="mt-5 bg-gray-100 min-h-[70vh] mb-5">
      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {progressData.map((item, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6 flex items-center">
            <div className="w-24 h-24 mr-6">
              <CircularProgressbar
                value={item.percentage}
                text={`${item.percentage}%`}
                styles={buildStyles({
                  textSize: "16px",
                  pathColor: "#3498db",
                  textColor: "#000",
                  trailColor: "#e0e0e0",
                })}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600">
                Target: <span className="font-semibold">{item.target}</span>
              </p>
              <p className="text-gray-600">
                Reached: <span className="font-semibold">{item.reached}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Average Enrollment Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" /> {/* Horizontal grid lines added */}
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sale" stroke="#3498db" strokeWidth={3} dot={{ r: 5 }} />
            <Line type="monotone" dataKey="regular" stroke="#e67e22" strokeWidth={3} dot={{ r: 5 }} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsComponents;
