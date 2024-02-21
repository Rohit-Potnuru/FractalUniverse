import './nf.css';
import React, { useRef, useEffect } from 'react';

const NewtonFractal = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const sizes = {
        width: 900,
        height: 900
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set the size of the canvas
    canvas.width = sizes.width;
    canvas.height = sizes.height;

    const width = canvas.width;
    const height = canvas.height;

    const drawFractal = () => {
      // Define your function and its derivative here
      const f = (z) => {
        // Example: z^3 - 1
        return [Math.pow(z[0], 3) - 3 * z[0] * Math.pow(z[1], 2) - 1, 3 * Math.pow(z[0], 2) * z[1] - Math.pow(z[1], 3)];
      };

      const df = (z) => {
        // Derivative of z^3 - 1
        return [3 * Math.pow(z[0], 2) - 3 * Math.pow(z[1], 2), 6 * z[0] * z[1]];
      };

      console.time('drawFractal');
      // Newton's method
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let zx = 1.5 * (x - width / 2) / (0.5 * width);
          let zy = (y - height / 2) / (0.5 * height);
          const maxIter = 30;
          let iteration = 0;

          while (iteration < maxIter) {
            let z = [zx, zy];
            let fz = f(z);
            let dfz = df(z);
            let znext = [
              z[0] - (fz[0] * dfz[0] + fz[1] * dfz[1]) / (Math.pow(dfz[0], 2) + Math.pow(dfz[1], 2)),
              z[1] - (fz[1] * dfz[0] - fz[0] * dfz[1]) / (Math.pow(dfz[0], 2) + Math.pow(dfz[1], 2))
            ];

            zx = znext[0];
            zy = znext[1];

            if (Math.sqrt(fz[0] * fz[0] + fz[1] * fz[1]) < 1e-6) {
              break;
            }

            iteration++;
          }
          const color = `hsl(${iteration / maxIter * 360}, 100%, 50%)`;
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      console.timeEnd('drawFractal');
    };

    drawFractal();
  }, []);

  return (
    <div className="NewtonFractalWebGl">
        <canvas ref={canvasRef}>
        </canvas>
    </div>
  );
};

export default NewtonFractal;
