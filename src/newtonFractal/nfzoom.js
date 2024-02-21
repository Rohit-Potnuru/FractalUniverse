// src/Fractal.js
import React, { useRef, useEffect, useState } from 'react';

const drawFractal = (ctx, scale, offsetX, offsetY) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  
  ctx.clearRect(0, 0, width, height); // Clear the canvas
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let a = (x - width / 2 - offsetX) / scale;
      let b = (y - height / 2 - offsetY) / scale;
      const ca = a;
      const cb = b;
      let n = 0;
      while (n < 100) {
        const aa = a * a - b * b;
        const bb = 2 * a * b;
        a = aa + ca;
        b = bb + cb;
        if (Math.abs(a + b) > 16) {
          break;
        }
        n++;
      }
      const bright = map(n, 0, 100, 0, 255);
      ctx.fillStyle = n === 100 ? '#000' : `rgb(${bright}, ${bright}, ${bright})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
};

const map = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};


const Fractal = () => {
    const canvasRef = useRef(null);
    const [scale, setScale] = useState(200); // Initial scale
  
    useEffect(() => {
        console.time('BandelBrot Set');
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      drawFractal(context, scale, 0, 0); // Adjust as needed
      console.timeEnd('BandelBrot Set');
    }, [scale]);
  
    useEffect(() => {
      const handleWheel = (e) => {
        e.preventDefault();
        const zoomFactor = 1.1;
        if (e.deltaY < 0) {
          // Zoom in
          setScale((prevScale) => prevScale * zoomFactor);
        } else {
          // Zoom out
          setScale((prevScale) => prevScale / zoomFactor);
        }
      };
  
      const canvas = canvasRef.current;
      // Attach the event listener with `{ passive: false }` to allow preventDefault
      canvas.addEventListener('wheel', handleWheel, { passive: false });
  
      return () => {
        // Don't forget to clean up the event listener
        canvas.removeEventListener('wheel', handleWheel);
      };
    }, []); // Empty dependency array ensures this effect runs once on mount
  
    return (
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
      />
    );
  };
  
  export default Fractal;
