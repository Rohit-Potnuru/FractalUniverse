import ComplexPoint from './shape/ComplexPoint';

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
            let differenceFromRoot = z.subtract(root);
            return result.multiply(differenceFromRoot);
        }, new ComplexPoint([1, 0]));
    }

    // Evaluate the derivative of the polynomial at a given point
    evaluateDerivative(z) {
        if (this.roots.length === 0) {
            return new ComplexPoint([0, 0]); // Derivative of a constant is 0
        }
        
        // Sum of products of differences for all combinations of roots except one
        let derivativeSum = new ComplexPoint([0, 0]);
        for (let i = 0; i < this.degree; i++) {
            let product = new ComplexPoint([1, 0]); // Start product for this combination
            for (let j = 0; j < this.degree; j++) {
                if (i !== j) {
                    product = product.multiply(z.subtract(this.roots[j]));
                }
            }
            derivativeSum = derivativeSum.add(product);
        }
        return derivativeSum;
    }
    
    computeNewtonRaphsonStep(point) {
        if(point.x[0] === Infinity || point.x[1] === Infinity) return point;
        let currentValue = this.evaluatePolynomial(point);
        let derivateValue = this.evaluateDerivative(point);

        // Prevent division by zero
        if (derivateValue.getMagnitude() === 0) {
            return [point, point];
        }

        return [point.subtract(currentValue.divide(derivateValue)), currentValue];
    }

    findRootUsingNewtonMethod(point, maxIterations = 30, error = 1e-6) {
        let currPoint = point;
        let iteration = 0;
        while(iteration < maxIterations) {
            const [nextPoint, fOut]  = this.computeNewtonRaphsonStep(currPoint);
            // console.log(iteration, nextPoint.x);
            if(fOut.getMagnitude() < error) {
                break;
            }
            currPoint = nextPoint;
            iteration++;
        }
        return [currPoint, iteration];
    }
}
