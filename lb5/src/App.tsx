import Histogram from './Histogram';
import Distribution from "./classes/Distribution.ts";

const App = ({ num, distributionSize, maxRange }:{
  num: number,
  distributionSize: number,
  maxRange?: number
}) => {
  const dist = new Distribution(distributionSize);

  const normalData = dist.GenerateNormal({
    mean: num / 2,
    stdDev: num / 6,
    count: distributionSize,
    maxRange: maxRange || num
  });
  const exponentialData = dist.GenerateExponential({
    lambda: 2 / num,
    count: distributionSize,
    maxRange: maxRange || num,
  });

  return (
    <div className="App">
      <div className="chart-container">
        <div className="chart">
          <Histogram data={[{
            data: normalData,
            range: maxRange || num,
            color: 'rgba(53, 162, 235, 0.5)'
          }, {
            data: exponentialData,
            range: maxRange || num,
            color: 'rgba(255, 99, 132, 0.5)'
          }]} title="Показниковий та нормальний розподіли"/>
        </div>
        <div className="chart">
          <Histogram data={[{
            data: normalData,
            range: maxRange || num,
            color: 'rgba(53, 162, 235, 0.5)'
          }]} title="Нормальний розподіл"/>
        </div>
        <div className="chart">
          <Histogram data={[{
            data: exponentialData,
            range: maxRange || num,
            color: 'rgba(255, 99, 132, 0.5)'
          }]} title='Показниковий розподіл' />
        </div>
      </div>
    </div>
  );
};

export default App;