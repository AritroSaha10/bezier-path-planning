// Basically range from function, useful for iteration using map
const range = (n) => Array.from(Array(n).keys())

// Converting an IRL foot to pixel on the canvas
const feetToPixels = (x) => 75 * x;

function factorial(x) {
  if (x < 2) {
    return 1
  }

  return x * factorial(x - 1)
}

function nCr(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r))
}

function reflectPointOverPoint(origin, reflected) {
  return createVector(
    origin.x - (reflected.x - origin.x),
    origin.y - (reflected.y - origin.y),
  )
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max)
}

function fieldCoordsToRealCoords(x, y) {
  return createVector(feetToPixels(x), feetToPixels(12) - feetToPixels(y))
}