import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const N = 19;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App num={N} distributionSize={20 * N}/>
  </StrictMode>,
)
