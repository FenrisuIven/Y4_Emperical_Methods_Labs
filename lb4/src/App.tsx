import {useMemo} from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      beginAtZero: true,
    },
    x: {
      type: 'linear' as const,
      display: true,
      beginAtZero: true
    },
  },
};

function App({ points, noisedPoints, regressedPoints }:{
  points: Array<[number, number]>,
  noisedPoints: Array<[number, number]>,
  regressedPoints?: Array<[number, number]>
}) {
  const noised = useMemo(() => noisedPoints, [])
  const normal = useMemo(() => points, [])
  const regressed = useMemo(() => regressedPoints || [], [])

  return (
    <>
      <Line
        options={options}
        data={
          {
            datasets: [{
              label: 'Noised Points',
              data: noised,
              borderColor: 'rgb(255, 99, 132, 0.5)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }, {
              label: 'Points',
              data: normal,
              borderColor: 'rgba(53, 162, 235, 0.5)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }, {
              label: 'Regressed Line',
              data: regressed,
              borderColor: 'rgba(75, 250, 175, 0.5)',
              backgroundColor: 'rgba(75, 250, 175, 0.5)',
            }]
          }
      }
      />
    </>
  )
}

export default App
