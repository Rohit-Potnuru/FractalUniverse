import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.css';
import Layout from './Layout';
import ROUTE_FRACTAL_UNIVERSE from './RouteFractalUniverse';
import FractalUniverse from './FractalUniverse';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/fractalUniverse" element={<Layout />}>
          <Route index element={<FractalUniverse />} />
          {Object.keys(ROUTE_FRACTAL_UNIVERSE).map((key) => (
            <Route 
              key={key} 
              path={key} 
              element={ROUTE_FRACTAL_UNIVERSE[key]["component"]} 
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
