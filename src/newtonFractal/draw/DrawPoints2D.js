const defaultPointSize = 3;
const defaultColor = 'white';

const DrawPoint2D = (ctx, x, y, pointSize = defaultPointSize, color = defaultColor) => {
    ctx.fillStyle = color; // Point color
    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
};

const DrawPoints2D = (ctx, points, pointSize = defaultPointSize, color = defaultColor) => {
    points.forEach(([x, y]) => DrawPoint2D(ctx, x, y, pointSize, color));
}

export default DrawPoint2D;
export {DrawPoint2D, DrawPoints2D};