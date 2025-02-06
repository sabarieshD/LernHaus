import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartVisualization = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get("http://localhost:5000/student/QuizResponse/results");
        const results = response.data.results;
        
        // Prepare the data for the pie chart
        const scoreRanges = {
          "90-100%": 0,
          "70-90%": 0,
          "40-70%": 0,
          "0-40%": 0,
        };
console.log(results);
        // Process the results to categorize them into score ranges
        results.forEach((quizResult) => {
          const percentage = (quizResult.score / quizResult.totalScore) * 100;

          if (percentage >= 90) scoreRanges["90-100%"]++;
          else if (percentage >= 70) scoreRanges["70-90%"]++;
          else if (percentage >= 40) scoreRanges["40-70%"]++;
          else scoreRanges["0-40%"]++;
        });

        // Convert the scoreRanges object into an array of data points for the Pie chart
        const chartData = Object.keys(scoreRanges).map((range) => ({
          name: range,
          value: scoreRanges[range],
        }));

        setData(chartData);
      } catch (error) {
        console.error("Error fetching quiz results:", error);
      }
    };

    fetchResults();
  }, []);

  return (
    <PieChart width={250} height={250}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        outerRadius={80}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartVisualization;
