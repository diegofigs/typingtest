import React from 'react';
import { Line } from 'react-chartjs-2';
import dark from 'themes/constant/dark';

const timeFormat = 'HH:mm:ss a';

export default function Results({ events }) {
  const { timestamps, wpm, raw, errors } = events.reduce((stats, event) => {
    const t = new Date(event.t);
    return {
      timestamps: [...stats.timestamps, t],
      wpm: [...stats.wpm, { t, y: event.wpm }],
      raw: [...stats.raw, { t, y: event.raw }],
      errors: [...stats.errors, { t, y: event.errors }],
    };
  }, { timestamps: [], wpm: [], raw: [], errors: []});

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