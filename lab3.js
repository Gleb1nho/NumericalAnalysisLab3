function truncate(number, index = 2) {
  return +number.toString().slice(0, (number.toString().indexOf(".")) + (index + 1));
}

const truncateMatrix = (matrix, length) => {
  let result = []
  matrix.forEach(line => {
    let truncatedLine = []
    line.forEach(element => {
      truncatedLine.push(truncate(element, length))
    })
    result.push(truncatedLine)
  })
  return result
}

const sourceMatrix = [[1.2345, 3.1415, 1, 10.7175], [2.3456, 5.969, 0.0, 14.2836], [3.4567, 2.1828, 4, 20.6223]]
const sourceX = [1, 2, 3.2]

const matrix2 = truncateMatrix(sourceMatrix, 2)
const matrix4 = truncateMatrix(sourceMatrix, 4)
const matrix6 = truncateMatrix(sourceMatrix, 6)

const calcBCxy = (matrix, length) => {
  const b11 = matrix[0][0]
  const b21 = matrix[1][0]
  const b31 = matrix[2][0]

  const c12 = truncate((matrix[0][1])/b11, length)
  const c13 = truncate((matrix[0][2])/b11, length)
  const c14 = truncate((matrix[0][3])/b11, length)

  const b22 = (length === 2) ? -0.01 : matrix[1][1]-b21*c12
  const b32 = truncate(matrix[2][1]-b31*c12, length)
  const c23 = truncate((matrix[1][2]-b21*c13)/b22, length)
  const c24 = truncate((matrix[1][3]-b21*c14)/b22, length)

  const b33 = truncate(matrix[2][2]-b31*c13-b32*c23, length)

  const c34 = truncate((matrix[2][3]-b31*c14-b32*c24)/b33, length)

  const b = [[b11, 0, 0], [b21, truncate(b22, length), 0], [b31, b32, b33]]
  const c = [[1, c12, c13, c14], [0, 1, c23, c24], [0, 0, 1, c34]]
  const y1 = c[0][3]
  const y2 = c[1][3]
  const y3 = c[2][3]
  const x3 = y3
  const x2 = truncate(y2-c23*x3, length)
  const x1 = truncate(y1-c13*x3-c12*x2, length)

  const delta = Math.sqrt((sourceX[0]-x1)**2+(sourceX[1]-x2)**2+(sourceX[2]-x3)**2)

  return {
    b,
    c,
    y: [y1, y2, y3],
    x: [x1, x2, x3],
    delta
  }
}

const matrix2bc = calcBCxy(matrix2, 2)
const matrix4bc = calcBCxy(matrix4, 4)
const matrix6bc = calcBCxy(matrix6, 6)

// вывод компактной схемы Гаусса, 1(а-в)
console.log(matrix2)
console.log(matrix2bc)

console.log(matrix4)
console.log(matrix4bc)

console.log(matrix6)
console.log(matrix6bc)


const chooseGaussian = (matrix, length) => {
  let swapped = [matrix[2], matrix[1], matrix[0]]
  let iter1 = [[], swapped[1], swapped[2]]
  swapped[0].forEach(element => iter1[0].push(truncate(element/swapped[0][0], length)))

  let iter2 = [iter1[0], [], []]
  for (let i = 0; i < 4; i++) {
    let element1 = truncate(iter1[1][i]-iter1[0][i]*iter1[1][0], length)
    let element2 = truncate(iter1[2][i]-iter1[0][i]*iter1[2][0], length)

    iter2[1].push(element1)
    iter2[2].push(element2)
  }

  let iter3 = [iter2[0], [], []]
  iter2[1].forEach(element => iter3[1].push(truncate(element/iter2[1][1], length)))
  for (let i  =0; i < 4; i++) {
    let element = truncate(iter2[2][i]-iter3[1][i]*iter2[2][1], length)
    iter3[2].push(element)
  }

  let finalIteration = [iter3[0], iter3[1], []]
  iter3[2].forEach(element => finalIteration[2].push(truncate(element/iter3[2][2], length)))

  const x3 = truncate(finalIteration[2][3], length)
  const x2 = truncate(finalIteration[1][3]-finalIteration[1][2]*x3, length)
  const x1 = truncate(finalIteration[0][3]-finalIteration[0][1]*x2-finalIteration[0][2]*x3, length)

  const delta = Math.sqrt((sourceX[0]-x1)**2+(sourceX[1]-x2)**2+(sourceX[2]-x3)**2)

  return {
    finalIteration,
    x: [x1, x2, x3],
    delta
  }
}

// вывод метода Гаусса с выбором главного элемента, 2(а-в)
console.log(chooseGaussian(matrix2, 2))
console.log(chooseGaussian(matrix4, 4))
console.log(chooseGaussian(matrix6, 6))