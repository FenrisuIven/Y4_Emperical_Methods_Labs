import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import {LinearRegression} from "./classes/LinearRegression.ts";

const N = 19;
const k = -2;
const b = 4;

const LR = new LinearRegression({
  equation: 'k * x + b',
  N,
  slope: k,
  offset: b
});
LR.CalculatePoints();
LR.CalculateNoisedPoints();

console.log({ eq: LR.equation, str: LR.equationString });
console.log(LR.desmosCalculatedPoints);
console.log(LR.desmosNoisedPoints);
console.log(LR.CalculateLinearRegressionCoefficients());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App noisedPoints={LR.NoisedPoints}/>
  </StrictMode>,
)
