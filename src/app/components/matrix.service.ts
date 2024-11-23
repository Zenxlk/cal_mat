import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MatrixService {
  steps: string[] = [];

  constructor() { }

  getSteps(): string[] {
    return this.steps;
  }

  clearSteps(): void {
    this.steps = [];
  }

  // Verificar que las matrices no estén vacías y tengan dimensiones compatibles
  private validateMatrices(matrixA: number[][], matrixB: number[][], operation: string): void {

    // Validaciones de vacíos en los campos
    if (matrixA.length === 0 || matrixB.length === 0) {
      throw new Error('Hay matrices vacías. Ingrese campos.');
    }

    // Validar que todas las filas de la matriz A tengan la misma longitud
    if (!matrixA.every(row => row.length === matrixA[0].length)) {
      throw new Error('La matriz A debe ser rectangular. Todas las filas deben tener la misma longitud.');
    }

    // Validar que todas las filas de la matriz B tengan la misma longitud
    if (!matrixB.every(row => row.length === matrixB[0].length)) {
      throw new Error('La matriz B debe ser rectangular. Todas las filas deben tener la misma longitud.');
    }

    // Validar compatibilidad para la suma y resta
    if (operation === 'add' || operation === 'subtract') {
      if (matrixA.length !== matrixB.length || matrixA[0].length !== matrixB[0].length) {
        throw new Error('Las matrices deben tener las mismas dimensiones para sumar o restar.');
      }
    }

    // Validar compatibilidad para la multiplicación
    if (operation === 'multiply') {
      if (matrixA[0].length !== matrixB.length) {
        throw new Error('El número de columnas de la matriz A no debe ser igual al número de filas de la matriz B para multiplicar.');
      }
    }
  }

  // Suma de matrices con registro de pasos
  addMatrices(matrixA: number[][], matrixB: number[][]): number[][] {
    this.clearSteps();
    this.steps.push("Iniciando suma de matrices...");
    this.validateMatrices(matrixA, matrixB, 'add');
    const result: number[][] = [];
    for (let i = 0; i < matrixA.length; i++) {
      result[i] = [];
      for (let j = 0; j < matrixA[i].length; j++) {
        result[i][j] = matrixA[i][j] + matrixB[i][j];
        this.steps.push(`Sumando A[${i}][${j}] + B[${i}][${j}] = ${matrixA[i][j]} + ${matrixB[i][j]} = ${result[i][j]}`);
      }
    }
    return result;
  }


  // Resta de matrices con registro de pasos
  subtractMatrices(matrixA: number[][], matrixB: number[][]): number[][] {
    this.clearSteps();
    this.steps.push("Iniciando resta de matrices...");
    this.validateMatrices(matrixA, matrixB, 'subtract');
    const result: number[][] = [];
    for (let i = 0; i < matrixA.length; i++) {
      result[i] = [];
      for (let j = 0; j < matrixA[i].length; j++) {
        result[i][j] = matrixA[i][j] - matrixB[i][j];
        this.steps.push(`Restando A[${i}][${j}] - B[${i}][${j}] = ${matrixA[i][j]} - ${matrixB[i][j]} = ${result[i][j]}`);
      }
    }
    return result;
  }

  // Multiplicación de matrices con registro de pasos
  multiplyMatrices(matrixA: number[][], matrixB: number[][]): number[][] {
    this.clearSteps();
    this.steps.push("Iniciando multiplicación de matrices...");
    this.validateMatrices(matrixA, matrixB, 'multiply');

    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const colsB = matrixB[0].length;
    const result: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) {
          const oldValue = result[i][j];
          result[i][j] += matrixA[i][k] * matrixB[k][j];
          this.steps.push(`Multiplicando A[${i}][${k}] * B[${k}][${j}] = ${matrixA[i][k]} * ${matrixB[k][j]} = ${matrixA[i][k] * matrixB[k][j]} -> Suma acumulada: ${oldValue} + ${matrixA[i][k] * matrixB[k][j]} = ${result[i][j]}`);
        }
      }
    }
    return result;
  }

  // Transpuesta de una matriz
  transposeMatrix(matrix: number[][]): number[][] {
    if (!matrix || matrix.length === 0) {
      throw new Error('La matriz no debe estar vacía.');
    }

    const result: number[][] = [];
    for (let i = 0; i < matrix[0].length; i++) {
      result[i] = [];
      for (let j = 0; j < matrix.length; j++) {
        result[i][j] = matrix[j][i];
      }
    }
    return result;
  }

  // Determinante de una matriz 2x2
  determinant2x2(matrix: number[][]): number {
    if (matrix.length !== 2 || matrix[0].length !== 2) {
      throw new Error('La matriz debe ser de 2x2.');
    }
    return (matrix[0][0] * matrix[1][1]) - (matrix[0][1] * matrix[1][0]);
  }

  // Determinante de una matriz 3x3
  determinant3x3(matrix: number[][]): number {
    if (matrix.length !== 3 || matrix[0].length !== 3) {
      throw new Error('La matriz debe ser de 3x3.');
    }
    const a = matrix[0][0], b = matrix[0][1], c = matrix[0][2];
    const d = matrix[1][0], e = matrix[1][1], f = matrix[1][2];
    const g = matrix[2][0], h = matrix[2][1], i = matrix[2][2];
    return a * ((e * i) - (f * h)) - b * ((d * i) - (f * g)) + c * ((d * h) - (e * g));
  }

  // Función para calcular la inversa de una matriz 2x2
  inverse2x2(matrix: number[][]): number[][] {
    if (matrix.length !== 2 || matrix[0].length !== 2 || matrix[1].length !== 2) {
      throw new Error('La matriz debe ser de 2x2.');
    }

    // Calcular el determinante de la matriz 2x2
    const det = this.determinant2x2(matrix);
    if (det === 0) {
      throw new Error('La matriz no tiene inversa (determinante es 0).');
    }

    // Calcular la matriz adjunta (cofactores)
    const adjunta = [
      [matrix[1][1], -matrix[0][1]],
      [-matrix[1][0], matrix[0][0]],
    ];

    // Dividir cada elemento de la adjunta por el determinante
    const inversa = adjunta.map(row => row.map(value => value / det));

    return inversa;
  }


  // Inversa de una matriz 3x3
  inverse3x3(matrix: number[][]): number[][] {
    const det = this.determinant3x3(matrix);
    if (det === 0) {
      throw new Error('La matriz no tiene inversa (determinante es 0).');
    }

    // Calcular la matriz de cofactores
    const cofactores = [];
    for (let i = 0; i < 3; i++) {
      const fila = [];
      for (let j = 0; j < 3; j++) {
        const submatriz = this.submatriz(matrix, i, j);
        fila.push(Math.pow(-1, i + j) * this.determinant2x2(submatriz));
      }
      cofactores.push(fila);
    }

    // Calcular la adjunta (transpuesta de la matriz de cofactores)
    const adjunta = this.transposeMatrix(cofactores);

    // Calcular la inversa
    const inversa = [];
    for (let i = 0; i < 3; i++) {
      const fila = [];
      for (let j = 0; j < 3; j++) {
        fila.push(adjunta[i][j] / det);
      }
      inversa.push(fila);
    }

    return inversa;
  }

  // Función auxiliar para obtener la submatriz 2x2
  private submatriz(matrix: number[][], fila: number, columna: number): number[][] {
    const submatriz = [];
    for (let i = 0; i < 3; i++) {
      if (i !== fila) {
        const filaSubmatriz = [];
        for (let j = 0; j < 3; j++) {
          if (j !== columna) {
            filaSubmatriz.push(matrix[i][j]);
          }
        }
        submatriz.push(filaSubmatriz);
      }
    }
    return submatriz;
  }

  // Método de reducción gaussiana para matrices 2x2
  gaussianElimination2x2(matrix: number[][]): number[][] {
    if (matrix.length !== 2 || matrix[0].length !== 2) {
      throw new Error('La matriz debe ser de 2x2.');
    }

    // Paso 1: Asegurarse de que el primer pivote no sea cero
    if (matrix[0][0] === 0) {
      [matrix[0], matrix[1]] = [matrix[1], matrix[0]];  // Intercambio de filas
    }

    // Paso 2: Hacer el pivote en la primera columna igual a 1
    const factor1 = matrix[0][0];
    matrix[0] = matrix[0].map(value => value / factor1);

    // Paso 3: Hacer que el segundo valor de la primera columna sea 0
    const factor2 = matrix[1][0];
    matrix[1] = matrix[1].map((value, index) => value - factor2 * matrix[0][index]);

    return matrix;
  }
  // Método de reducción gaussiana para matrices 3x3
  gaussianElimination3x3(matrix: number[][]): number[][] {
    if (matrix.length !== 3 || matrix[0].length !== 3) {
      throw new Error('La matriz debe ser de 3x3.');
    }

    const A = [...matrix.map(row => [...row])]; // Copiar la matriz para no modificarla

    // Paso 1: Asegurarse de que el primer pivote no sea cero
    if (A[0][0] === 0) {
      for (let i = 1; i < 3; i++) {
        if (A[i][0] !== 0) {
          [A[0], A[i]] = [A[i], A[0]]; // Intercambio de filas
          break;
        }
      }
      if (A[0][0] === 0) {
        throw new Error('La matriz no se puede triangularizar.');
      }
    }

    // Paso 2: Hacer el pivote en la primera columna igual a 1
    const factor1 = A[0][0];
    A[0] = A[0].map(value => value / factor1);

    // Paso 3: Hacer que el segundo y tercer valor de la primera columna sean 0
    for (let i = 1; i < 3; i++) {
      const factor = A[i][0];
      A[i] = A[i].map((value, index) => value - factor * A[0][index]);
    }

    // Paso 4: Asegurarse de que el segundo pivote no sea cero
    if (A[1][1] === 0) {
      if (A[2][1] !== 0) {
        [A[1], A[2]] = [A[2], A[1]]; // Intercambio de filas
      } else {
        throw new Error('La matriz no se puede triangularizar.');
      }
    }

    // Paso 5: Hacer el pivote en la segunda columna igual a 1
    const factor2 = A[1][1];
    A[1] = A[1].map(value => value / factor2);

    // Paso 6: Hacer que el tercer valor de la segunda columna sea 0
    const factor3 = A[2][1];
    A[2] = A[2].map((value, index) => value - factor3 * A[1][index]);

    return A;
  }

}
