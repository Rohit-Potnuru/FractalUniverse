import './App.css';
import NewtonFractalView from "./newtonFractal/NewtonFractal";
import NewtonFractal from "./newtonFractal/nf";
import NewtonFractal2 from './newtonFractal/nf2';
import NewtonFractal3 from './newtonFractal/nf3';
import Fractal from './newtonFractal/nfzoom';

function App() {
  return (
    <div className="App">
      
      <NewtonFractalView></NewtonFractalView>
      {/* <NewtonFractal></NewtonFractal>
      <NewtonFractal3></NewtonFractal3> */}
      <NewtonFractal2></NewtonFractal2>
      {/* <Fractal></Fractal> */}
    </div>
  );
}

export default App;
