import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const N = 19;
const k = -2;
const b = 4;

const y = (x: number) => k * x + b;

const interval = [-N + 10, N + 10]
console.log(`y = ${k}x + ${b}`);
const points: [number, number][] = [];
for (let x = interval[0]; x <= interval[1]; x++) {
  points.push([x, y(x)]);
}
console.log('Points:', points.map(p => `(${p[0]},${p[1]})`).join(', '));

const noisedPoints: [number, number][] = [];
const noiseStd = N / 5;
for (let i = 0; i < points.length; i++) {
  const [x, y] = points[i];
  const noise = (Math.random() - 0.5) * noiseStd;
  noisedPoints.push([x, y + noise]);
}
console.log('Points:', noisedPoints.map(p => `(${p[0]},${p[1]})`).join(', '));

const linearRegression = (x: number[], y: number[]) => {
  const n = x.length;
  const sumX = x.reduce((a,b)=>a+b, 0);
  const sumY = y.reduce((a,b)=>a+b, 0);
  const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
  const sumX2 = x.reduce((acc, val) => acc + val*val, 0);

  const k = (n*sumXY - sumX*sumY) / (n*sumX2 - sumX*sumX);
  const b = (sumY - k*sumX) / n;

  return {k, b};
}

const reg = linearRegression(points.map(point => point[0]), noisedPoints.map(point => point[1]));
console.log({reg})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App noisedPoints={noisedPoints}/>
  </StrictMode>,
)
