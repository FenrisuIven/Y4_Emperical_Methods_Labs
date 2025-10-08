import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const options = {
  responsive: true,
};

export default function App({logDist}:{logDist: number[]}) {
  const freq = logDist.map(val => (val / logDist.length).toFixed(2));
  return <Bar options={options} data={{
    labels: logDist,
    datasets: [{
      label: 'Log Distribution',
      data: freq,
      backgroundColor: 'rgb(255, 99, 132)'
    }]
  }} />;
}
