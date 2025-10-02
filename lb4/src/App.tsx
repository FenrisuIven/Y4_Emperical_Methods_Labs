import {Chart} from 'react-chartjs-2';

function App({noisedPoints}:{noisedPoints: [number, number][]}) {
  return (
    <>
      <Chart
        type='scatter'
        data={
          {
            datasets: [{
              label: 'Noised Points',
              data: noisedPoints,
            }]
          }
      }
      />
    </>
  )
}

export default App
