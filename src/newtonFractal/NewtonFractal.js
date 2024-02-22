import './newtonFractal.css';
import React, { useRef, useEffect, useState} from 'react';
import { clearCanvas } from './draw/Canvas';
import Polynomial from './Polynomial';
import Fractal from './Fractal';

function NewtonFractalView() {
    const attractionBasinCanvasRef = useRef(null);
    const iterNewtonFractalCanvasRef = useRef(null);
    const hashPageRendered = useRef(false);

    //Mouse Variables
    const [moveObjects, setMoveObjects] = useState(false);
    const [selectedCursorObjects, setSelectedCursorObjects] = useState([]);

    const [points, setPoints] = useState([[1, 0], [-0.5, 0.5 * Math.sqrt(3)],[-0.5, -0.5 * Math.sqrt(3)]]);
    const [pointsColor, setPointsColor] = useState([[255, 0, 0, 255], 
                                                    [0, 255, 0, 255],
                                                    [0, 0, 255, 255],
                                                    [255, 255, 0, 255]])
    const [polynomial, setPolynomial] = useState(null);
    const [fractal, setFractal] = useState(null);

    useEffect(() => {
        const sizes = {
            width: 600,
            height: 600
        }

        const polynomial = new Polynomial(points);
        setPolynomial(polynomial);

        const fractal = new Fractal(sizes, polynomial);
        setFractal(fractal);

        const iterNewtonFractalCanvas = iterNewtonFractalCanvasRef.current;
        const iterNewtonFractalCtx = iterNewtonFractalCanvas.getContext("2d");

        // Set the size of the canvas
        iterNewtonFractalCanvas.width = sizes.width;
        iterNewtonFractalCanvas.height = sizes.height;

        //Rendering Grid
        clearCanvas(iterNewtonFractalCtx, iterNewtonFractalCanvas);
        fractal.renderIterationNewtonFractal(iterNewtonFractalCtx, iterNewtonFractalCanvas);


        const attractionBasinCanvas = attractionBasinCanvasRef.current;
        const attractionBasinCtx = attractionBasinCanvas.getContext("2d");

        attractionBasinCanvas.width = sizes.width;
        attractionBasinCanvas.height = sizes.height;

        clearCanvas(attractionBasinCtx, attractionBasinCanvas);
        fractal.renderBasinOfAttraction(attractionBasinCtx, attractionBasinCanvas, pointsColor);

        hashPageRendered.current = true;
    }, []);

    useEffect(() => {
        if(hashPageRendered.current && fractal != null && polynomial != null) {

            const iterNewtonFractalCanvas = iterNewtonFractalCanvasRef.current;
            const iterNewtonFractalCtx = iterNewtonFractalCanvas.getContext("2d");
    
            //Rendering Grid
            clearCanvas(iterNewtonFractalCtx, iterNewtonFractalCanvas);
            fractal.renderIterationNewtonFractal(iterNewtonFractalCtx, iterNewtonFractalCanvas);
    
            const attractionBasinCanvas = attractionBasinCanvasRef.current;
            const attractionBasinCtx = attractionBasinCanvas.getContext("2d");
            
            clearCanvas(attractionBasinCtx, attractionBasinCanvas);
            fractal.renderBasinOfAttraction(attractionBasinCtx, attractionBasinCanvas, pointsColor);
        }
    }, [points, fractal, selectedCursorObjects]);

    // const handleMouseDown = (e) => {
    //     if(!moveObjects) return;
    //     const rect = canvasRef.current.getBoundingClientRect();
    //     const mouseX = e.clientX - rect.left;
    //     const mouseY = e.clientY - rect.top;
    //     let flag = true;
    //     setPoints(points.map(point => {
    //       let pos = point.getX();
    //       const distance = Math.sqrt((mouseX - pos[0]) ** 2 + (mouseY - pos[1]) ** 2);
    //       if(distance < point.getRadius() && flag) {
    //         flag = false;
    //         point.setDragging(true);
    //         setSelectedCursorObjects([...selectedCursorObjects, point]);
    //       }
    //       return point;
    //     }));
    // };

    // const handleMouseUp = () => {
    //     if(!moveObjects) return;
    //     selectedCursorObjects.forEach(Object => {
    //         Object.setDragging(false);
    //     });
    //     setSelectedCursorObjects([]);
    // };
    
    // const handleMouseMove = (e) => {
    //     if(!moveObjects) return;
    //     const rect = canvasRef.current.getBoundingClientRect();
    //     const mouseX = e.clientX - rect.left;
    //     const mouseY = e.clientY - rect.top;
    //     if(selectedCursorObjects.length > 0) {
    //         setSelectedCursorObjects(selectedCursorObjects.map(Object => {
    //             if(Object.isDragging()) {
    //                 Object.move([mouseX, mouseY]);
    //             }
    //             return Object;
    //         }));
    //     }
    // };

    return (
        <div className="NewtonFractalView">
            {/* <div className='NewtonFractalViewInputs'>
                <InputCheckBox name = "Move Objects"
                               InputCheckBoxValue = {[moveObjects, setMoveObjects]}
                               disabled = {false}
                />
            </div> */}
            <div className="NewtonFractalViewWebGl">
                <canvas ref={iterNewtonFractalCanvasRef} 
                    // onMouseDown={handleMouseDown}
                    // onMouseMove={handleMouseMove}
                    // onMouseUp={handleMouseUp}
                    // onMouseOut={handleMouseUp}
                ></canvas>
                <canvas ref={attractionBasinCanvasRef} 
                    // onMouseDown={handleMouseDown}
                    // onMouseMove={handleMouseMove}
                    // onMouseUp={handleMouseUp}
                    // onMouseOut={handleMouseUp}
                ></canvas>
            </div>
        </div>
    );
}

export default NewtonFractalView;