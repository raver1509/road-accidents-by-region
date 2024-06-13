import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const ChartComponent = ({ data }) => {
  const chartData = {
    labels: ['Accidents', 'Deaths', 'Injuries', 'Collisions'],
    datasets: [
      {
        label: `Data for ${data.province}`,
        data: [data.accidents, data.deaths, data.injuries, data.collisions],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default ChartComponent;
