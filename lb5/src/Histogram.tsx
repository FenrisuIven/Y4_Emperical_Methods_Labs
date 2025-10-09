import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HistogramProps {
  data: number[];
  title: string;
  range: number;
}

const Histogram = ({ data, title, range }: HistogramProps) => {
  const binCount = 20; // Кількість стовпців
  const binSize = range / binCount;
  const bins: { [key: number]: number } = {};

  for (let i = 0; i <= binCount; i++) {
    bins[i] = 0;
  }

  data.forEach(value => {
    const binIndex = Math.floor(value / binSize);
    if (bins[binIndex] !== undefined) {
      bins[binIndex]++;
    }
  });

  const labels = Object.keys(bins).map(key => `${(Number(key) * binSize).toFixed(1)}-${((Number(key) + 1) * binSize).toFixed(1)}`);
  const counts = Object.values(bins);

  const chartData = {
    labels,
    datasets: [{
      label: 'Кількість елементів',
      data: counts,
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default Histogram;