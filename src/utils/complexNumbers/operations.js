function add([a, b], [c, d]) {
    return [a + c, b + d];
}

function subtract([a, b], [c, d]) {
    return [a - c, b - d];
}

function multiply([a, b], [c, d]) {
    return [(a * c - b * d), (a * d + b * c)];
}

function divide([a, b], [c, d]) {
    const denominator = (Math.pow(c, 2) + Math.pow(d, 2));
    return [(a * c + b * d) / denominator, (b * c - a * d) / denominator];
}

function getMagnitude([a, b]) {
  return Math.sqrt(a * a + b * b);
}

function euclideanDistance([a, b], [c, d]) {
    return Math.sqrt(Math.pow(a - c, 2) + Math.pow(b - d, 2));
}
export {add, subtract, multiply, divide, getMagnitude, euclideanDistance};