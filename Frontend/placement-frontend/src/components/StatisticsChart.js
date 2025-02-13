import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatisticsChart = () => {
  const data = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        label: "NOC Requests",
        data: [12, 5, 3], // Example data
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "NOC Request Statistics",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default StatisticsChart;