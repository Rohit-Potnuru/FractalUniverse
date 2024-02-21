import './newtonFractal.css';
import React, { useRef, useEffect } from 'react';
import ComplexPoint from './shape/ComplexPoint';
import {add, subtract, multiply, getMagnitude} from '../utils/complexNumbers/operations'
import Polynomial from './Polynomial';

const NewtonFractal2 = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const roots = [[1, 0], [-0.5, 0.5 * Math.sqrt(3)], [-0.5, -0.5 * Math.sqrt(3)]];

    const polynomial = new Polynomial(roots);

    const drawFractal = () => {
      console.time('drawFractal');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const zoom = 2000;
      // Newton's method
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let zx = (x - width / 2) / (zoom);
          let zy = (y - height / 2) / (zoom);
          const maxIter = 100;

          const [rootIndex, iteration] = polynomial.closestRootUsingNewtonMethod([zx, zy], maxIter)

          const color = `hsl(${iteration / maxIter * 360}, 100%, 50%)`;
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
      console.timeEnd('drawFractal');
    };

    drawFractal();
  }, []);

  return <canvas ref={canvasRef} width={600} height={600} />;
};

export default NewtonFractal2;
