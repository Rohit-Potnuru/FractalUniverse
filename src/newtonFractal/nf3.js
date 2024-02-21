import React, { useState, useEffect, useRef } from 'react';

const NewtonFractal3 = () => {
    const [root, setRoot] = useState({ x: 150, y: 150 });
    const canvasRef = useRef(null);

    const drawFractal = (ctx, width, height) => {
        ctx.clearRect(0, 0, width, height);

        for (let px = 0; px < width; px++) {
            for (let py = 0; py < height; py++) {
                let x0 = (px - width / 2) / 100;
                let y0 = (py - height / 2) / 100;
                let x = x0;
                let y = y0;
                const maxIter = 30;
                let iter = 0;

                while (iter < maxIter) {
                    const xTemp = x * x - y * y + root.x / 100 - 1.5;
                    y = 2 * x * y + root.y / 100;
                    x = xTemp;
                    iter++;

                    if (x * x + y * y > 4) break;
                }

                const brightness = 255 * iter / maxIter;
                ctx.fillStyle = `rgb(${brightness}, ${brightness}, 255)`;
                ctx.fillRect(px, py, 1, 1);
            }
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        drawFractal(ctx, width, height);
    }, [root]);

    const handleMouseMove = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        setRoot({ x, y });
    };

    return (
        <canvas ref={canvasRef} width="300" height="300" onMouseMove={handleMouseMove} />
    );
};

export default NewtonFractal3;
