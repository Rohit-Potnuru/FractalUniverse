import {add, subtract, multiply, divide, getMagnitude, euclideanDistance} from '../utils/complexNumbers/operations'

export default class Polynomial {
    constructor(roots, options = {}) {
        this.options = {...options};
        this.roots = roots;
        this.degree = roots.length; // Renamed from 'n' for clarity
    }

    updateRoots(roots) {
        this.roots = roots;
        this.degree = roots.length;
    }

    getRoots() {
        return this.roots;
    }

    // Evaluate the polynomial at a given point
    evaluatePolynomial(z) {
        return this.roots.reduce((result, root) => {
            return multiply(result, subtract(z, root));
        }, [1, 0]);
    }

    // Evaluate the derivative of the polynomial at a given point
    evaluateDerivative(z) {
        if (this.roots.length === 0) {
            return [0, 0]; // Derivative of a constant is 0
        }
        
        // Sum of products of differences for all combinations of roots except one
        let derivativeSum = [0, 0];
        for (let i = 0; i < this.degree; i++) {
            let product = [1, 0]; // Start product for this combination
            for (let j = 0; j < this.degree; j++) {
                if (i !== j) {
                    product = multiply(product, subtract(z, this.roots[j]));
                }
            }
            derivativeSum = add(derivativeSum, product);
        }
        return derivativeSum;
    }
    
    computeNewtonRaphsonStep(z) {
        if(z[0] === Infinity || z[1] === Infinity) return z;
        let fz = this.evaluatePolynomial(z);
        let dfz = this.evaluateDerivative(z);
  
        // Prevent division by zero
        let newZ = subtract(z, divide(fz, dfz));
        if (Math.abs(newZ[0]) === Infinity || Math.abs(newZ[1]) === Infinity) {
            return [z, z];
        }
        return [newZ, fz];
      }

    findRootUsingNewtonMethod(point, maxIterations = 30, error = 1e-6) {
        let currPoint = point;
        let iteration = 0;
        while(iteration < maxIterations) {
            const [nextPoint, fOut]  = this.computeNewtonRaphsonStep(currPoint);
            // console.log(iteration, nextPoint.x);
            if(getMagnitude(fOut) < error) {
                break;
            }
            currPoint = nextPoint;
            iteration++;
        }
        // while(iteration < maxIterations) currPoint;
        return [currPoint, iteration];
    }

    closestRootUsingNewtonMethod(point, maxIterations = 30, error = 1e-6) {
        const [currPoint, iteration] = this.findRootUsingNewtonMethod(point, maxIterations, error);

        let rootIndex = -1;
        let minDistance = Number.MAX_VALUE;
        this.roots.forEach((root, index) => {
            const distance = euclideanDistance(currPoint, root);
            if(distance < minDistance) {
                minDistance = distance;
                rootIndex = index;
            }
        });

        if(rootIndex === -1) return null;

        return [rootIndex, iteration];
    }
}
