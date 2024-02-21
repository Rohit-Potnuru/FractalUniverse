import './ConvexHullView.css';
import React, { useRef, useEffect, useState} from 'react';
import { Stack } from '@mui/system';
import InputSlider from '../utils/components/InputSlider';
import MultipleSelect from '../utils/components/InputSelect';
import { generatePoints } from '../utils/points';
import { DrawPoints2D } from './draw/DrawPoints2D';
import { clearCanvas } from './draw/Canvas';
import DrawHull from './draw/DrawHull';
import ConvexHullAlgorithms from './algorithms/ConvexHullAlgorithms';


function ConvexHullView() {
    const canvasRef = useRef(null);
    const [stepSlider, setStepSliders] = useState(0);
    const [stepSliderRange, setStepSliderRange] = useState([0, 100]);
    const [numPoints, setNumPoints] = useState(100);
    const [minNumPoints, maxNumPoints] = [3, 2500];
    const [points, setPoints] = useState([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState("Chan's Algorithm");
    const [algorithmSteps, setAlgorithmSteps] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [mValue, setMValue] = useState(3);

    useEffect(() => {
        const sizes = {
            width: 850,
            height: 850
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Set the size of the canvas
        canvas.width = sizes.width;
        canvas.height = sizes.height;

        const outerBoundary = 30;
        const dimensionBoundaries = [[0 + outerBoundary, sizes.width - outerBoundary], 
                                     [0 + outerBoundary, sizes.height - outerBoundary]];
        const points = generatePoints(numPoints, dimensionBoundaries);
        setPoints(points);

        clearCanvas(ctx, canvas);
        DrawPoints2D(ctx, points);
        if(selectedAlgorithm === "Chan's Algorithm") {
            setStepSliders(0);
            setAlgorithmSteps([]);
            setStepSliderRange([0, 100]);
        }
        else {
            let {hull, hullSteps} = ConvexHullAlgorithms[selectedAlgorithm](points, {recordSteps: true});
            setStepSliders(0);
            setAlgorithmSteps(hullSteps);
            setStepSliderRange([0, hullSteps.length - 1]);
        }
    }, [numPoints, selectedAlgorithm, mValue]);

    function AnimationAlgorithm(ctx, canvas, step) {
        if(algorithmSteps.length > step) {
            const algorithmStep = algorithmSteps[step];
            clearCanvas(ctx, canvas);
            DrawPoints2D(ctx, points);
            for(let i = 0; i < algorithmStep.length; i++) {
                algorithmStep[i].render(ctx, canvas);
            }
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        AnimationAlgorithm(ctx, canvas, stepSlider);
    }, [stepSlider]);

    const handleButtonClick = async () => {
        setIsProcessing(true);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let convexHullPoints = [];
        try {
            let options = {};
            if(selectedAlgorithm === "Chan's Algorithm") {
                options = {mValue: mValue};
                convexHullPoints = await ConvexHullAlgorithms[selectedAlgorithm](ctx, canvas, points, options);
                DrawPoints2D(ctx, points);
                DrawHull(ctx, convexHullPoints, {lineWidth : 4});
            }
            else {
                let numSteps = stepSliderRange[1];
                let speed = numSteps < 200? numSteps < 50? 40:5 : 1;
                for(let i = 0; i <= stepSliderRange[1]; i++) {
                    await new Promise(resolve => setTimeout(resolve, speed));
                    AnimationAlgorithm(ctx, canvas, i);
                }
            }
            
            console.log("Algorithm Finished");
            console.log(convexHullPoints);
        }
        catch (error) {
            console.error("An error occurred while generating the convex hull:", error);
        }
        setIsProcessing(false);
    }

    return (
        <div className="ConvexHullView">
            <div className='convexHullInputs'>
                <Stack spacing={2} direction="row">
                    <InputSlider name = "Steps"
                                inputSliderValue = {[stepSlider, setStepSliders]}
                                range = {stepSliderRange}
                                props = {{disabled : isProcessing,}}
                    />
                    <InputSlider name = "Number of Points"
                                inputSliderValue = {[numPoints, setNumPoints]}
                                range = {[minNumPoints, maxNumPoints]}
                                props = {{disabled : isProcessing,}}
                    />
                </Stack>
                <MultipleSelect name = "Convex Hull Algorithm"
                                sValue = {[selectedAlgorithm, setSelectedAlgorithm]}
                                sMenu = {Object.keys(ConvexHullAlgorithms)}
                />
                {(selectedAlgorithm === "Chan's Algorithm") && 
                    <InputSlider name = "m Value"
                        inputSliderValue = {[mValue, setMValue]}
                        range = {[2, 2500]}
                        props = {{sideNameFlag : true,
                                  disabled : isProcessing,}}
                    />
                }
                
                <button 
                    onClick={handleButtonClick}
                    disabled={isProcessing}
                >
                    {isProcessing ? "Processing..." : "Animate Convex Hull"}
                </button>
            </div>
            
            <div className="convexHullWebGl">
                <canvas ref={canvasRef} ></canvas>
            </div>
        </div>
    );
}

export default ConvexHullView;