import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HistogramProps {
  data: number[];
  range: number;
  color: string;
}

const Histogram = ({ data, title }: { data: HistogramProps[], title: string }) => {
  const binCount = 20; // Кількість стовпців

  let labels: string[] | null = null;
  const chartData:{ datasets: {
      label: string,
      data: number[],
      backgroundColor: string,
      borderColor: string,
      borderWidth: number,
    }[] } = { datasets: [] }

  data.forEach((dist, idx) => {
    const binSize = dist.range / binCount;
    const bins: { [key: number]: number } = {};

    for (let i = 0; i <= binCount; i++) {
      bins[i] = 0;
    }

    dist.data.forEach(value => {
      const binIndex = Math.floor(value / binSize);
      if (bins[binIndex] !== undefined) {
        bins[binIndex]++;
      }
    });


    if (!labels){
      labels = Object.keys(bins).map(key => `${(Number(key) * binSize).toFixed(1)}-${((Number(key) + 1) * binSize).toFixed(1)}`);
    }
    const counts = Object.values(bins);
    chartData.datasets.push({
      label: `Кількість елементів розподілу №${idx + 1}`,
      data: counts,
      backgroundColor: dist.color,
      borderColor: dist.color,
      borderWidth: 1,
    })
  })

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title
      }
    },
  };

  if (!labels) {
    labels = [];
  }

  return <Bar data={{labels, ...chartData}} options={options} />;
};

export default Histogram;