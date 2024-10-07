import { Component, OnInit } from '@angular/core';
import { MatrixService } from '../matrix.service';

@Component({
  selector: 'app-matrix-calculator',
  templateUrl: './matrix-calculator.component.html',
  styleUrls: ['./matrix-calculator.component.css']
})

export class MatrixCalculatorComponent {

  matrixAInput: string = ''; // Para recibir el input como string
  matrixBInput: string = '';
  result: number[][] | null = null; // Para mostrar el resultado
  errorMessage: string | null = null; // Para mostrar mensajes de error

  constructor(private matrixService: MatrixService) { }

  // Convertir la entrada de texto a una matriz de números
  parseMatrix(input: string): number[][] {
    return input.split('\n').map(row =>
      row.split(' ').map(num => Number(num) || 0) // Convertir a número, o 0 si no se puede convertir
    );
  }

  // Sumar matrices
  addMatrices() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);
      const matrixB = this.parseMatrix(this.matrixBInput);
      this.result = this.matrixService.addMatrices(matrixA, matrixB);
      this.errorMessage = null; // Limpiar errores si la operación es exitosa
    } catch (error: any) {
      this.result = null; // Limpiar el resultado
      this.errorMessage = error.message; // Mostrar el mensaje de error
    }
  }

  // Restar matrices
  subtractMatrices() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);
      const matrixB = this.parseMatrix(this.matrixBInput);
      this.result = this.matrixService.subtractMatrices(matrixA, matrixB);
      this.errorMessage = null;
    } catch (error: any) {
      this.result = null;
      this.errorMessage = error.message;
    }
  }

  // Multiplicar matrices
  multiplyMatrices() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);
      const matrixB = this.parseMatrix(this.matrixBInput);
      this.result = this.matrixService.multiplyMatrices(matrixA, matrixB);
      this.errorMessage = null;
    } catch (error: any) {
      this.result = null;
      this.errorMessage = error.message;
    }
  }

  // Transponer matriz
  transposeMatrix() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);
      this.result = this.matrixService.transposeMatrix(matrixA);
      this.errorMessage = null;
    } catch (error: any) {
      this.result = null;
      this.errorMessage = error.message;
    }
  }
}
