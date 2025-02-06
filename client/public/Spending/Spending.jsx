import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./TOS.css"

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Spending = () => {
  // Sample data for the spending chart
  const spendingData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // Month labels
    datasets: [
      {
        label: "Spending",
        data: [1500, 1700, 1600, 1800, 1971, 1900], // Monthly spending data
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Makes the line smooth
      },
    ],
  };

  // Chart options for customization
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Spending ($)",
        },
      },
    },
  };

  return (
      <div className="data-container">
        <div className="chart-container">
          <h4>Spending Analytics</h4>
          <Line data={spendingData} options={options} />
        </div>
      </div>
  );
};

export default Spending;
