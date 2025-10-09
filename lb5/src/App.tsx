import Histogram from './Histogram';

// Генерація нормального розподілу (метод Бокса-Мюллера)
function generateNormal(
  mean: number,     // середнє значення
  stdDev: number,   // стандартне відхилення
  count: number,    // кількість елементів
  maxRange: number  // максимальне значення
): number[] {
  const data: number[] = [];

  while (data.length < count) {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    const value = z * stdDev + mean;

    if (value >= 0 && value <= maxRange) {
      data.push(value);
    }
  }

  return data;
}

// Генерація показникового розподілу
function generateExponential(
  lambda: number,   // параметр розподілу
  count: number,    // кількість елементів
  maxRange: number  // максимальне значення
): number[] {
  const data: number[] = [];

  while (data.length < count) {
    const value = -Math.log(1 - Math.random()) / lambda;

    if (value >= 0 && value <= maxRange) {
      data.push(value);
    }
  }

  return data;
}


const App = ({ num, distributionSize, maxRange }:{
  num: number,
  distributionSize: number,
  maxRange?: number
}) => {
  const normalData = generateNormal(num / 2, num / 6, distributionSize, maxRange || num);
  const exponentialData = generateExponential(2 / num, distributionSize, maxRange || num);

  return (
    <div className="App">
      <div className="chart-container">
        <div className="chart">
          <Histogram data={normalData} title="Нормальний розподіл" range={maxRange || num} />
        </div>
        <div className="chart">
          <Histogram data={exponentialData} title="Показниковий розподіл" range={maxRange || num} />
        </div>
      </div>
    </div>
  );
};

export default App;