import Point  from './Point';

export default class ComplexPoint extends Point {
    constructor(x, options = {}) {
        super(x, options);
        // Ensure the point is 2-dimensional for complex numbers
        if (this.dimension !== 2) {
            throw new Error('ComplexPoint requires 2 dimensions');
        }
    }

    // Adds a ComplexPoint to this one and returns the result as a new ComplexPoint
    add(other) {
        if (other.dimension !== 2) {
            throw new Error('Can only add another 2-dimensional point');
        }
        const newX = [this.x[0] + other.x[0], this.x[1] + other.x[1]];
        return new ComplexPoint(newX, this.options);
    }

    // Subtracting a ComplexPoint to this one and returns the result as a new ComplexPoint
    subtract(other) {
        if (other.dimension !== 2) {
            throw new Error('Can only subtract another 2-dimensional point');
        }
        const newX = [this.x[0] - other.x[0], this.x[1] - other.x[1]];
        return new ComplexPoint(newX, this.options);
    }

    // Multiplies this ComplexPoint by another and returns the result as a new ComplexPoint
    multiply(other) {
        if (other.dimension !== 2) {
            throw new Error('Can only multiply by another 2-dimensional point');
        }
        // (a+bi)(c+di) = (ac-bd) + (ad+bc)i
        const realPart = this.x[0] * other.x[0] - this.x[1] * other.x[1];
        const imaginaryPart = this.x[0] * other.x[1] + this.x[1] * other.x[0];
        const newX = [realPart, imaginaryPart];
        return new ComplexPoint(newX, this.options);
    }

    // Divides this ComplexPoint by another and returns the result as a new ComplexPoint
    divide(other) {
        if (other.dimension !== 2) {
            throw new Error('Can only divide by another 2-dimensional point');
        }
        // Ensure the denominator is not zero (i.e., ensure other is not the zero complex number)
        if (other.x[0] === 0 && other.x[1] === 0) {
            throw new Error('Cannot divide by zero');
        }
        const a = this.x[0], b = this.x[1];
        const c = other.x[0], d = other.x[1];
        
        // (a+bi)/(c+di) = (ac+bd)/(c^2+d^2) + ((bc-ad)/(c^2+d^2))i
        const realPart = (a * c + b * d) / (c * c + d * d);
        const imaginaryPart = (b * c - a * d) / (c * c + d * d);
        
        const newX = [realPart, imaginaryPart];
        return new ComplexPoint(newX, this.options);
    }

    // Example of a method specific to ComplexPoints
    getMagnitude() {
        // Magnitude of a complex number sqrt(a^2 + b^2)
        return Math.sqrt(this.x[0] ** 2 + this.x[1] ** 2);
    }

    euclideanDistance(complexPoint) {
        // Extract real and imaginary parts
        const real1 = this.x[0];
        const imag1 = this.x[1];
        const real2 = complexPoint.x[0];
        const imag2 = complexPoint.x[1];
      
        // Calculate the difference in real and imaginary parts
        const realDiff = real2 - real1;
        const imagDiff = imag2 - imag1;
      
        // Calculate the Euclidean distance
        const distance = Math.sqrt(realDiff * realDiff + imagDiff * imagDiff);
      
        return distance;
    }

    transform(transform_fn) {
        return new ComplexPoint(transform_fn(this.x), this.options);
    }

    // Override the render2D to include rendering specifics for ComplexPoints if needed
    render2D(ctx, canvas) {
        super.render2D(ctx, canvas); // Call the original method to draw the point
    }
}