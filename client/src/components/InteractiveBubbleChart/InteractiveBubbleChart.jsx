import React, { useState, useEffect } from "react";
import BubbleChart from "@weknow/react-bubble-chart-d3";
import "./Styles.css"; // Import the CSS file

const initialBubbleData = [
  { label: "HTML", value: 20 },
  { label: "CSS", value: 15 },
  { label: "JavaScript", value: 30 },
  { label: "Blockchain", value: 25 },
  { label: "AWS", value: 18 },
  { label: "Python", value: 22 },
  { label: "SQL", value: 17 },
  { label: "Marketing", value: 12 },
  { label: "AI", value: 27 },
];

const handleBubbleClick = (label) => {
  alert(`Clicked on ${label}`);
};

const InteractiveBubbleChart = () => {
  const [chartSize, setChartSize] = useState({ width: 400, height: 400 });
  const [bubbleData, setBubbleData] = useState(initialBubbleData);

  useEffect(() => {
    // Function to update chart size & bubble values dynamically
    const updateChartSize = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 480) {
        setChartSize({ width: 280, height: 280 });
        setBubbleData(initialBubbleData.map(item => ({ ...item, value: item.value * 0.7 })));
      } else if (screenWidth < 768) {
        setChartSize({ width: 350, height: 350 });
        setBubbleData(initialBubbleData.map(item => ({ ...item, value: item.value * 0.85 })));
      } else {
        setChartSize({ width: 400, height: 400 });
        setBubbleData(initialBubbleData);
      }
    };

    updateChartSize();
    window.addEventListener("resize", updateChartSize);
    
    return () => {
      window.removeEventListener("resize", updateChartSize);
    };
  }, []);

  return (
    <div className="bubble-chart-container">
      <h3 className="bubble-chart-title">Trending Keywords</h3>
      <BubbleChart
        graph={{
          zoom: 1,
          offsetX: 0,
          offsetY: 0,
        }}
        width={chartSize.width} 
        height={chartSize.height}
        showLegend={false}
        data={bubbleData}
        onClick={(label) => handleBubbleClick(label)}
      />
    </div>
  );
};

export default InteractiveBubbleChart;
