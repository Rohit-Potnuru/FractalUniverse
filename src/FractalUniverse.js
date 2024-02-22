import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import ROUTE_FRACTAL_UNIVERSE from "./RouteFractalUniverse";

function FractalUniverse() {
    return (
        <div>
            <h1>Fractals</h1>
            <nav>
                <ul>
                    {
                        Object.keys(ROUTE_FRACTAL_UNIVERSE).map((key) => (
                            <li key={key}> {/* Apply the key prop here */}
                                <Link to={"/fractalUniverse/" + key}>
                                    {ROUTE_FRACTAL_UNIVERSE[key]["name"]}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </nav>
            <Outlet />
        </div>
    );
}

export default FractalUniverse;