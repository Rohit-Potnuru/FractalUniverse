import ComplexPoint  from './shape/ComplexPoint';

export default class Fractal {
    constructor(scale, polynomial, options = {}) {

        const {
            widthScale = 1,
            heightScale = 1
        } = scale;

        this.widthScale = widthScale;
        this.heightScale = heightScale;
        this.polynomial = polynomial;

        this.options = {...options};
    }

    drawFractal(ctx, canvas) {
        console.time('drawFractal');
        const width = canvas.width;
        const height = canvas.height
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const zoom = 2000;
        // Newton's method
        for (let x = 0; x < width; x++) {
          for (let y = 0; y < height; y++) {
            let zx = (x - width / 2) / (zoom);
            let zy = (y - height / 2) / (zoom);
            const maxIter = 100;
  
            const [rootIndex, iteration] = this.polynomial.closestRootUsingNewtonMethod([zx, zy], maxIter)
  
            const color = `hsl(${iteration / maxIter * 360}, 100%, 50%)`;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
          }
        }
        console.timeEnd('drawFractal');
    };

    renderColorGrid(ctx, canvas, points, colorPoints, transform_fn = (x) => {return x}) {
        if(points.length > colorPoints.length) {
            throw new Error('Invalid points and colorPoints');
        }
    
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;

        const widthScale = this.widthScale;
        const heightScale = this.heightScale;
    
        // Pre-calculate and cache the roots for efficiency
        const roots = this.polynomial.getRoots().map(root => new ComplexPoint(root.getX()));
    
        console.time('point');
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                // Bringing i, j values to (-1, 1) scale
                let x = ((i - width * 0.5)/ (width * 0.5)) * widthScale;
                let y = ((j - height * 0.5)/ (height * 0.5)) * heightScale;
                const currPoint = new ComplexPoint(transform_fn([x, y]));
                const [rootPoint, iteration] = this.polynomial.findRootUsingNewtonMethod(currPoint);
    
                // Use a more efficient root matching strategy
                let rootIndex = -1;
                let minDistance = Number.MAX_VALUE;
                roots.forEach((root, index) => {
                    const distance = rootPoint.euclideanDistance(root);
                    if(distance < minDistance) {
                        minDistance = distance;
                        rootIndex = index;
                    }
                });
    
                if(rootIndex === -1) continue; // In case no root is found
    
                const [r, g, b, a] = colorPoints[rootIndex];
                const pixelIndex = (j * width + i) * 4;
                data[pixelIndex] = r;     // Red
                data[pixelIndex + 1] = g; // Green
                data[pixelIndex + 2] = b; // Blue
                data[pixelIndex + 3] = a; // Alpha
            }
        }
        console.timeEnd('point');
        
        ctx.putImageData(imageData, 0, 0);
    }
    
}