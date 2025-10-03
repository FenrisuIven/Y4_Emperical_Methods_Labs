import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {LinearRegression} from "./classes/LinearRegression.ts";

const N = 19;
const k = -2;
const b = 4;
const start = N - 10;
const end = N + 10;

const LR = new LinearRegression({
  equation: 'k * x + b',
  N,
  slope: k,
  offset: b
});
LR.CalculatePoints({ start, end });
LR.CalculateNoisedPoints();
const { k: lrK, b: lrB } = LR.CalculateLinearRegressionCoefficients();

console.log({ eq: LR.equationString.replace('k', `${k}`).replace('b', `${b}`) });
console.log(LR.desmosCalculatedPoints);
console.log(LR.desmosNoisedPoints);
console.log({ k, b, lrK, lrB });

const noisedLR = new LinearRegression({
  equation: 'k * x + b',
  N,
  slope: lrK,
  offset: lrB
});
noisedLR.CalculatePoints({ start, end });
console.log({ noisedEq: noisedLR.equationString.replace('k', `${lrK}`).replace('b', `${lrB}`) });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App points={LR.Points} noisedPoints={LR.NoisedPoints} regressedPoints={noisedLR.Points}/>
  </StrictMode>,
)
