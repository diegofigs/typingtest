import React from 'react';
import { Line } from 'react-chartjs-2';
import dark from 'themes/constant/dark';

const timeFormat = 'HH:mm:ss a';

export default function Results({ events }) {
  const timestamps = events.map(({ t }) => new Date(t));
  const wpm = events.map(({ wpm }, i) => ({ t: timestamps[i], y: wpm }));
  const raw = events.map(({ raw }, i) => ({ t: timestamps[i], y: raw }));
  const errors = events.map(({ errors }, i) => ({ t: timestamps[i], y: errors }));

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: 'WPM',
        data: wpm,
        fill: false,
        backgroundColor: dark.highlight,
        borderColor: dark.highlight,
      },
      {
        label: 'Raw WPM',
        data: raw,
        fill: false,
        backgroundColor: dark.text,
        borderColor: dark.text,
      },
      {
        label: 'Errors',
        data: errors,
        fill: false,
        backgroundColor: dark.wrong,
        borderColor: dark.wrong,
      }
    ],
  }
  
  const options = {
    tooltips: {
      mode: 'x',
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          distribution: 'series',
          time: {
            parser: timeFormat,
            unit: 'second',
            tooltipFormat: timeFormat
          },
          scaleLabel: {
            display: true,
            labelString: 'Seconds'
          }
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };


  return (
    <div>
      <h2>Results</h2>
      <Line data={data} options={options} />
    </div>
  );
}