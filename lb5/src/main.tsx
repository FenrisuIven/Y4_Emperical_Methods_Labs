import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Distribution from "./classes/Distribution.ts";

const dist = new Distribution(19 * 20);
const logDist = dist.GenerateLogDistribution();
console.log(logDist);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App logDist={logDist}/>
  </StrictMode>,
)
