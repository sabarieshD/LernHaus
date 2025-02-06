import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./TimeOnSite.css"
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

const TimeOnSite = () => {
  // Sample data for the time on site chart
  const timeOnSiteData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], // Month labels
    datasets: [
      {
        label: "Time on Site",
        data: [100, 110, 120, 130, 121, 135], // Monthly time on site data (in hours)
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
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
          text: "Time on Site (hours)",
        },
      },
    },
  };

  return (
      <div className="data-container" style={{backgroundColor:'white', borderRadius:'8px',padding:'15px', boxShadow:' 0 4px 8px rgba(0, 0, 0, 0.1)'}}>
        <div className="chart-container">
          <h4 style={{fontSize:'x-large'}}>Quiz Performance</h4>
          <Line data={timeOnSiteData} options={options} />
        </div>
      </div>

  );
};

export default TimeOnSite;
