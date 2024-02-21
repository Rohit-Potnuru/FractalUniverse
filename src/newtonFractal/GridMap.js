import ComplexPoint  from './shape/ComplexPoint';

export default class GridMap {
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
    
    // initializeGridWithComplexPoints(m, n) {
    //     let grid = new Array(m);
    
    //     for (let i = 0; i < m; i++) {
    //       grid[i] = new Array(n); // Fill each row with 0s or any default value you prefer
    //       for (let j = 0; j < n; j++) {
    //         grid[i][j] = new ComplexPoint([i, j]);
    //       }
    //     }
    //     return grid;
    // }

    // reset() {
    //     this.gridPointMap = this.initializeGridWithComplexPoints(this.width, this.height);
    // }

    // transform(polynomial) {
    //     // for(let i = 0; i < this.width; i++) {
    //     //     for(let j = 0; j < this.height; j++) {
    //     //         console.log(i, j, this.gridPointMap[i][j]);
    //     //         this.gridPointMap[i][j] = polynomial.findRootUsingNewtonMethod(this.gridPointMap[i][j]);
    //     //     }
    //     // }
    //     this.gridPointMap = this.gridPointMap.map(row => row.map(element => polynomial.findRootUsingNewtonMethod(element)));
    // }

    getIndexOfNearestPoint(pointA, points) {
        return points.reduce((closestIndex, currentPoint, currentIndex) => {
            const currentDistance = pointA.euclideanDistance(currentPoint);
            const closestDistance = pointA.euclideanDistance(points[closestIndex]);
    
            return currentDistance < closestDistance ? currentIndex : closestIndex;
        }, 0);
    }
      
    mapGridToNearestPointIndices(points) {
        let m = this.width, n = this.height;
        let result = new Array(m);
        for (let i = 0; i < m; i++) {
            result[i] = new Array(n);
            for (let j = 0; j < n; j++) {
                result[i][j] = this.getIndexOfNearestPoint(this.gridPointMap[i][j], points);
            }
        }
        return result;
    }

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