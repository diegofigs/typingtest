import React from 'react';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@theme';

const timeFormat = 'HH:mm:ss a';
const labelFormat = 'mm:ss';
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
          unit: 'second',
          displayFormats: {
            second: labelFormat
          },
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

export default function Results({ events }) {
  const theme = useTheme();
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
        backgroundColor: theme.highlight,
        borderColor: theme.highlight,
      },
      {
        label: 'Raw WPM',
        data: raw,
        fill: false,
        backgroundColor: theme.background.main,
        borderColor: theme.background.main,
      },
      {
        label: 'Errors',
        data: errors,
        fill: false,
        backgroundColor: theme.wrong,
        borderColor: theme.wrong,
      }
    ],
  };


  return (
    <div>
      <h2>Results</h2>
      <Line data={data} options={options} />
    </div>
  );
}