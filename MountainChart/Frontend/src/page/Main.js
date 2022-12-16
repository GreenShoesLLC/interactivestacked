import MountainChart from 'component/chart/MounitanChart';

const Main = () => {

  return (
    <>
      <MountainChart  
        chartName={'MountainChart-1'}/>
      <MountainChart 
        chartName={'MountainChart-2'}/>
    </>
  )
}

export default Main;