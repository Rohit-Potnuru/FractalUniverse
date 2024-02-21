import './newtonFractal.css';
import React, { useRef, useEffect, useState} from 'react';
import { clearCanvas } from './draw/Canvas';
import GridMap  from './GridMap';
import InputCheckBox from '../utils/components/InputCheckBox';
import ComplexPoint from './shape/ComplexPoint';
import Polynomial from './PolynomialComplex';

function NewtonFractalView() {
    const canvasRef = useRef(null);
    const hashPageRendered = useRef(false);

    //Mouse Variables
    const [moveObjects, setMoveObjects] = useState(false);
    const [selectedCursorObjects, setSelectedCursorObjects] = useState([]);

    const [points, setPoints] = useState([
        new ComplexPoint([1, 0]),
        new ComplexPoint([-0.5, 0.5 * Math.sqrt(3)]),
        new ComplexPoint([-0.5, -0.5 * Math.sqrt(3)])
        // new ComplexPoint([150, 300]),
        // new ComplexPoint([550, 600])
    ]);
    const [pointsColor, setPointsColor] = useState([[255, 0, 0, 255], 
                                                    [0, 255, 0, 255],
                                                    [0, 0, 255, 255],
                                                    [255, 255, 0, 255]])
    const [polynomial, setPolynomial] = useState(null);
    const [bgGridMap, setbgGridMap] = useState(null);
    
    useEffect(() => {
        const sizes = {
            width: 900,
            height: 900
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set the size of the canvas
        canvas.width = sizes.width;
        canvas.height = sizes.height;

        const polynomial = new Polynomial(points);
        setPolynomial(polynomial);

        const bgGridMap = new GridMap(sizes, polynomial);
        setbgGridMap(bgGridMap);

        clearCanvas(ctx, canvas);
        //Rendering Grid
        bgGridMap.renderColorGrid(ctx, canvas, points, pointsColor);
        points.map(point => point.render2D(ctx, canvas));

        hashPageRendered.current = true;
    }, []);

    useEffect(() => {
        if(hashPageRendered.current && bgGridMap != null && polynomial != null) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            clearCanvas(ctx, canvas);
    
            //Rendering Grid
            bgGridMap.renderColorGrid(ctx, canvas, points, pointsColor);
            points.forEach((point) => point.render2D(ctx));
        }
    }, [points, bgGridMap, selectedCursorObjects]);

    const handleMouseDown = (e) => {
        if(!moveObjects) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        let flag = true;
        setPoints(points.map(point => {
          let pos = point.getX();
          const distance = Math.sqrt((mouseX - pos[0]) ** 2 + (mouseY - pos[1]) ** 2);
          if(distance < point.getRadius() && flag) {
            flag = false;
            point.setDragging(true);
            setSelectedCursorObjects([...selectedCursorObjects, point]);
          }
          return point;
        }));
    };

    const handleMouseUp = () => {
        if(!moveObjects) return;
        selectedCursorObjects.forEach(Object => {
            Object.setDragging(false);
        });
        setSelectedCursorObjects([]);
    };
    
    const handleMouseMove = (e) => {
        if(!moveObjects) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        if(selectedCursorObjects.length > 0) {
            setSelectedCursorObjects(selectedCursorObjects.map(Object => {
                if(Object.isDragging()) {
                    Object.move([mouseX, mouseY]);
                }
                return Object;
            }));
        }
    };

    return (
        <div className="NewtonFractalView">
            <div className='NewtonFractalViewInputs'>
                <InputCheckBox name = "Move Objects"
                               InputCheckBoxValue = {[moveObjects, setMoveObjects]}
                               disabled = {false}
                />
            </div>
            
            <div className="NewtonFractalViewWebGl">
                <canvas ref={canvasRef} 
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseOut={handleMouseUp}
                ></canvas>
            </div>
        </div>
    );
}

export default NewtonFractalView;