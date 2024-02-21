export default class Point {
    static MAX_DIMENSION = 3;
    static MIN_DIMENSION = 1;
    constructor(x, options = {}) {
        const {
            isDragging = false,
            color = 'white',
            radius = 4
        } = options;

        this.options = {...options, color, radius, isDragging};
        if(Array.isArray(x) && Point.MIN_DIMENSION <= x.length && x.length <= Point.MAX_DIMENSION) {
            this.x = x;
            this.dimension = x.length;
        }
        else {
            throw new Error('Invalid point dimension');
        }
    }

    isDragging() {
        return this.options.isDragging;
    }

    setDragging(value) {
        this.options.isDragging = value;
    }

    getX() {
        return this.x;
    }

    move(x) {
        this.setX(x);
    }

    setX(x) {
        if(Array.isArray(x) && x.length === this.dimension) {
            this.x = x;
        }
        else {
            throw new Error('Invalid point dimension');
        }
    }

    getDimension() {
        return this.dimension;
    }

    getRadius() {
        return this.options.radius;
    }

    render2D(ctx, canvas, transform_fn = (x) => {return x}) {
        if(this.dimension === 2) {
            ctx.fillStyle = this.options.color; // Point color
            ctx.beginPath();
            let x = transform_fn(this.x);
            ctx.arc(x[0], x[1], this.options.radius, 0, Math.PI * 2, true);
            ctx.fill();   
        }
    }
}