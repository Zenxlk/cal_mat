import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MatrixService {

  constructor() { }

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
        throw new Error('El número de columnas de la matriz A debe ser igual al número de filas de la matriz B para multiplicar.');
      }
    }
  }

  // Suma de matrices
  addMatrices(matrixA: number[][], matrixB: number[][]): number[][] {
    this.validateMatrices(matrixA, matrixB, 'suma');
    const result: number[][] = [];
    for (let i = 0; i < matrixA.length; i++) {
      result[i] = [];
      for (let j = 0; j < matrixA[i].length; j++) {
        result[i][j] = matrixA[i][j] + matrixB[i][j];
      }
    }
    return result;
  }

  // Resta de matrices
  subtractMatrices(matrixA: number[][], matrixB: number[][]): number[][] {
    this.validateMatrices(matrixA, matrixB, 'subtract');
    const result: number[][] = [];
    for (let i = 0; i < matrixA.length; i++) {
      result[i] = [];
      for (let j = 0; j < matrixA[i].length; j++) {
        result[i][j] = matrixA[i][j] - matrixB[i][j];
      }
    }
    return result;
  }

  // Multiplicación de matrices
  multiplyMatrices(matrixA: number[][], matrixB: number[][]): number[][] {
    this.validateMatrices(matrixA, matrixB, 'multiply');

    const rowsA = matrixA.length;
    const colsA = matrixA[0].length;
    const rowsB = matrixB.length;
    const colsB = matrixB[0].length;

    // Verificar si se puede multiplicar
    if (colsA !== rowsB) {
      throw new Error('El número de columnas de la Matriz A debe coincidir con el número de filas de la Matriz B.');
    }

    // Inicializar matriz de resultado con ceros
    const result: number[][] = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

    // Multiplicar las matrices
    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        for (let k = 0; k < colsA; k++) {
          result[i][j] += matrixA[i][k] * matrixB[k][j];
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
}
