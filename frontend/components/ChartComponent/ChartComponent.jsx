import React, { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js/auto';
import styles from './styles.module.css';

Chart.register(...registerables);

const ChartComponent = ({ data }) => {
  const { province, accidents, deaths, injuries, collisions } = data;

  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const barChartCtx = barChartRef.current?.getContext('2d');
    if (barChartCtx) {
      const barChart = new Chart(barChartCtx, {
        type: 'bar',
        data: {
          labels: ['Accidents', 'Deaths', 'Injuries', 'Collisions'],
          datasets: [
            {
              label: province,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)',
              hoverBorderColor: 'rgba(54, 162, 235, 1)',
              data: [accidents, deaths, injuries, collisions]
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      return () => barChart.destroy();
    }
  }, [data]);

  useEffect(() => {
    const pieChartCtx = pieChartRef.current?.getContext('2d');
    if (pieChartCtx) {
      const pieChart = new Chart(pieChartCtx, {
        type: 'pie',
        data: {
          labels: ['Accidents', 'Deaths', 'Injuries', 'Collisions'],
          datasets: [{
            data: [accidents, deaths, injuries, collisions],
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0'
            ],
            hoverBackgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0'
            ]
          }]
        },
      });
      return () => pieChart.destroy();
    }
  }, [data]);

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Bar Chart</h3>
      <canvas ref={barChartRef} />
      <h3 className={styles.chartTitle}>Pie Chart</h3>
      <canvas ref={pieChartRef} />
    </div>
  );
};

export default ChartComponent;
