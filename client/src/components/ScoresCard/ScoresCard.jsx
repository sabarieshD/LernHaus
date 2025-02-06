import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './ScoresCard.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend);

const ScoresCard = () => {
  const [data] = useState({
    labels: ['90-100%', '70-90%', '40-70%', '0-40%'],
    datasets: [
      {
        data: [5, 8, 12, 4], // Static data
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#F44336'],
        hoverBackgroundColor: ['#66BB6A', '#42A5F5', '#FFCA28', '#EF5350'],
      },
    ],
  });

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          font: {
            size: 10,
            weight: 'bold',
          },
          padding: 20,
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    cutout: "70%", // Increase the ring width
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };
  

  return (
    <div className="dashboard">
      <div className="header">
        <h3>Assignment Scores</h3>
      </div>
      <div className="content">
        <div className="chart">
          <Doughnut data={data} options={options} />
        </div>
        <div className="stats">
          <div className="stat">
            <div className="color" style={{ backgroundColor: '#4CAF50' }}></div>
            <p>90-100%</p>
            <h4>{data.datasets[0].data[0]} Courses</h4>
          </div>
          <div className="stat">
            <div className="color" style={{ backgroundColor: '#2196F3' }}></div>
            <p>70-90%</p>
            <h4>{data.datasets[0].data[1]} Courses</h4>
          </div>
          <div className="stat">
            <div className="color" style={{ backgroundColor: '#FFC107' }}></div>
            <p>40-70%</p>
            <h4>{data.datasets[0].data[2]} Courses</h4>
          </div>
          <div className="stat">
            <div className="color" style={{ backgroundColor: '#F44336' }}></div>
            <p>0-40%</p>
            <h4>{data.datasets[0].data[3]} Courses</h4>
          </div>
        </div>
       
      </div>
    </div>
  );
};

export default ScoresCard;