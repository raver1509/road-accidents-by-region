import React from 'react';
import { Bar } from 'react-chartjs-2';

const SumChartComponent = ({ voivodeship, data2023, data2018 }) => {
  // Find province data for both years
  const provinceData2023 = data2023.find(item => item.province === voivodeship);
  const provinceData2018 = data2018.find(item => item.province === voivodeship);

  // Calculate sum of deaths and injuries for 2018 and 2023
  const sum2018 = provinceData2018 ? provinceData2018.deaths + provinceData2018.injuries : 0;
  const sum2023 = provinceData2023 ? provinceData2023.deaths + provinceData2023.injuries : 0;

  // Prepare data for chart
  const chartData = {
    labels: [`${voivodeship} (2018)`, `${voivodeship} (2023)`],
    datasets: [{
      label: 'Sum of Deaths and Injuries',
      data: [sum2018, sum2023],
      backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)'],
      borderColor: ['rgba(75,192,192,1)', 'rgba(255,99,132,1)'],
      borderWidth: 1
    }]
  };

  // Chart options
  const options = {
    scales: {
      yAxes: [{ ticks: { beginAtZero: true } }],
    },
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return <Bar data={chartData} options={options} />;
};

export default SumChartComponent;
