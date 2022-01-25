function getBezierCoef(points) {
  // Formula says n+1 points, so n is 1 less
  let n = points.length - 1

  // Built coefficients matrix
  let C = range(n).map((_, z) => {
    let newArr = []
    for (let i = 0; i < n; i++) {
      if (i == z) {
        // 4 * np.identity(n)
        newArr.push(4)
      } else if (i == z - 1) {
        // np.fill_diagonal(C[1:], 1)
        newArr.push(1)
      } else if (i == z + 1) {
        // np.fill_diagonal(C[:, 1:], 1)
        newArr.push(1)
      } else {
        newArr.push(0)
      }
    }

    return newArr
  })

  C[0][0] = 2
  C[n - 1][n - 1] = 7
  C[n - 1][n - 2] = 2

  // Build Points vector
  let P = range(n).map((i) => [
    2 * (2 * points[i].x + points[i + 1].x),
    2 * (2 * points[i].y + points[i + 1].y),
  ])

  P[0] = [points[0].x + 2 * points[1].x, points[0].y + 2 * points[1].y]
  P[n - 1] = [
    8 * points[n - 1].x + points[n].x,
    8 * points[n - 1].y + points[n].y,
  ]

  // Solve the system, find A & B
  let A = linear.solve(C, P)

  let B = range(n - 1).map((i) => [
    2 * points[i + 1].x - A[i + 1][0],
    2 * points[i + 1].y - A[i + 1][1],
  ])
  B.push([0, 0])

  B[n - 1] = [(A[n - 1][0] + points[n].x) / 2, (A[n - 1][1] + points[n].y) / 2]

  return [A, B]
}

function nDegreeBezier(points, t) {
  let n = points.length - 1
  let Bx = 0
  let By = 0
  for (let i = 0; i <= n; i++) {
    Bx += nCr(3, i) * Math.pow(1 - t, n - i) * pow(t, i) * points[i].x
    By += nCr(3, i) * Math.pow(1 - t, n - i) * pow(t, i) * points[i].y
  }

  return createVector(Bx, By)
}

function getNDegreeBezierFunc(points) {
  let n = points.length - 1

  const curveFunc = (t) => {
    let Bx = 0
    let By = 0
    for (let i = 0; i <= n; i++) {
      Bx += nCr(3, i) * Math.pow(1 - t, n - i) * pow(t, i) * points[i].x
      By += nCr(3, i) * Math.pow(1 - t, n - i) * pow(t, i) * points[i].y
    }
    return createVector(Bx, By)
  }

  return curveFunc
}

const matrixToVector = (matrix) => createVector(matrix[0], matrix[1])

function getBezierCubicFromPoints(points) {
  let [A, B] = getBezierCoef(points)
  return range(points.length - 1).map((i) =>
    getNDegreeBezierFunc([
      points[i],
      matrixToVector(A[i]),
      matrixToVector(B[i]),
      points[i + 1],
    ]),
  )
}

function evaluateBezier(points, n) {
  let curves = getBezierCubicFromPoints(points)

  let finalCurve = []

  curves.forEach((func) => {
    for (let t1 = 0; t1 <= 1; t1 += 1 / n) {
      finalCurve.push(func(t1))
    }
  })

  return finalCurve
}
