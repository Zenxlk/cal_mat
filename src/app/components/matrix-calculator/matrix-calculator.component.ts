import { Component, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatrixService } from '../matrix.service';

export interface Step {
  text: string; // Texto de la operación
  completed: boolean; // Estado de la operación
}
@Component({
  selector: 'app-matrix-calculator',
  templateUrl: './matrix-calculator.component.html',
  styleUrls: ['./matrix-calculator.component.css']
})
export class MatrixCalculatorComponent implements AfterViewInit {
  matrixAInput: string = '';
  matrixBInput: string = '';
  result: number[][] | null = null;
  determinant: number | null = null;
  errorMessage: string | null = null;
  calculation: string | null = null;
  animatedResult: string = ''; // Para mostrar el resultado con animación
  steps: { text: string; completed: boolean }[] = [];
  currentStepIndex: number = 0; // Inicializa el índice de pasos
  showAnimatedResult: boolean = false;

  ngAfterViewInit() {
    // Esto se ejecutará después de que la vista se haya inicializado
    if (!this.typingInProgress) {
      this.showNextStep();
    }
    this.cdRef.detectChanges();
  }

  constructor(private matrixService: MatrixService, private cdRef: ChangeDetectorRef) { }

  parseMatrix(input: string): number[][] {
    return input.split('\n').map(row =>
      row.split(' ').map(num => Number(num) || 0)
    );
  }

  private typingInProgress: boolean = false; // Controla si el efecto de tipeo está en progreso

  private async typeWriterEffect(text: string) {
    if (this.typingInProgress) return;

    this.typingInProgress = true;
    const stepElement = document.querySelectorAll('.operation-steps > div')[this.currentStepIndex];
    let currentText = ''; // Variable para almacenar el texto actual

    const typeNextCharacter = (index: number = 0) => {
      if (index < text.length) {
        currentText += text[index]; // Agregar el siguiente carácter
        stepElement.innerHTML = currentText; // Actualizar el HTML
        index++;
        setTimeout(() => {
          typeNextCharacter(index);
        }, 50);
      } else {
        this.typingInProgress = false;
        this.steps[this.currentStepIndex].completed = true;
        this.currentStepIndex++;

        if (this.currentStepIndex < this.steps.length) {
          this.showNextStep();
        }

        this.cdRef.detectChanges();
      }
    };

    typeNextCharacter();
  }

  private async showNextStep() {
    // Mostrar el texto del siguiente paso y ejecutar el efecto de escritura
    if (this.currentStepIndex < this.steps.length) {
      const nextStepText = this.steps[this.currentStepIndex].text;
      await this.typeWriterEffect(nextStepText); // Llama a typeWriterEffect con el texto del siguiente paso
    }
  }


  formatMatrix(matrix: number[][]): string {
    return matrix.map(row => `[${row.join(', ')}]`).join('<br>');
  }

  private async displaySteps(stepsContent: Step[]) {
    for (const content of stepsContent) {
      this.steps.push(content);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundos antes del siguiente paso
    }
  }


  async addMatrices() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);
      const matrixB = this.parseMatrix(this.matrixBInput);
      this.result = this.matrixService.addMatrices(matrixA, matrixB);

      // Inicializar los pasos con formato de matrices
      this.steps = [
        { text: 'Paso 1: Matriz A:', completed: false },
        { text: this.formatMatrix(matrixA), completed: false },
        { text: 'Paso 2: Matriz B:', completed: false },
        { text: this.formatMatrix(matrixB), completed: false },
        { text: 'Paso 3: Realizar la suma de A + B', completed: false },
      ];

      this.result = this.matrixService.addMatrices(matrixA, matrixB);
      this.calculation = 'Suma de matrices A y B';
      this.determinant = null;
      this.errorMessage = null;

      // Reiniciar el índice de pasos
      this.currentStepIndex = 0;

    } catch (error: any) {
      this.resetResults();
      this.errorMessage = error.message;
    }
  }

  async subtractMatrices() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);
      const matrixB = this.parseMatrix(this.matrixBInput);
      this.result = this.matrixService.subtractMatrices(matrixA, matrixB);

      // Inicializar los pasos con formato de matrices
      this.steps = [
        { text: 'Paso 1: Matriz A:', completed: false },
        { text: this.formatMatrix(matrixA), completed: false },
        { text: 'Paso 2: Matriz B:', completed: false },
        { text: this.formatMatrix(matrixB), completed: false },
        { text: 'Paso 3: Realizar la resta de A - B', completed: false }, // Corregir el texto aquí
      ];

      this.calculation = 'Resta de matrices A y B';
      this.determinant = null;
      this.errorMessage = null;

      // Reiniciar el índice de pasos
      this.currentStepIndex = 0;

      // Iniciar la visualización de los pasos
      this.showNextStep();
    } catch (error: any) {
      this.resetResults();
      this.errorMessage = error.message;
    }
  }

  async multiplyMatrices() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);
      const matrixB = this.parseMatrix(this.matrixBInput);

      // Calcular el resultado de la multiplicación primero
      this.result = this.matrixService.multiplyMatrices(matrixA, matrixB);

      // Inicializar los pasos con formato de matrices
      this.steps = [
        { text: 'Paso 1: Matriz A:', completed: false },
        { text: this.formatMatrix(matrixA), completed: false },
        { text: 'Paso 2: Matriz B:', completed: false },
        { text: this.formatMatrix(matrixB), completed: false },
        { text: 'Paso 3: Realizar la multiplicación de A * B', completed: false },
        { text: this.formatMatrix(this.result), completed: false }
      ];

      this.calculation = 'Multiplicación de matrices A y B';
      this.determinant = null;
      this.errorMessage = null;

      // Reiniciar el índice de pasos
      this.currentStepIndex = 0;

      // Iniciar la visualización de los pasos
      this.showNextStep();
    } catch (error: any) {
      this.resetResults();
      this.errorMessage = error.message;
    }
  }

  async transposeMatrix() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);
      this.result = this.matrixService.transposeMatrix(matrixA);
      const rows = matrixA.length;
      const cols = matrixA[0].length;

      // Inicializar los pasos con formato de matrices
      this.steps = [
        { text: 'Paso 1: Matriz A:', completed: false },
        { text: this.formatMatrix(matrixA), completed: false },
        { text: 'Paso 2: Transponer la matriz A, intercambiando filas por columnas:', completed: false },
      ];

      // Agregar pasos específicos para cada elemento de la matriz
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          this.steps.push({
            text: `Mover el elemento A(${i + 1}, ${j + 1}) = ${matrixA[i][j]} a la posición A(${j + 1}, ${i + 1})`,
            completed: false
          });
        }
      }

      this.steps.push({ text: this.formatMatrix(this.result), completed: false }); // Resultado final

      this.calculation = 'Transpuesta de matriz A';
      this.errorMessage = null;

      this.currentStepIndex = 0;

      this.showNextStep();
    } catch (error: any) {
      this.resetResults();
      this.errorMessage = error.message;
    }
  }

  async determinant2x2() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);
      const a = matrixA[0][0];
      const b = matrixA[0][1];
      const c = matrixA[1][0];
      const d = matrixA[1][1];

      // Limpiamos pasos anteriores
      this.steps = [];
      this.result = null;
      this.animatedResult = '';
      this.errorMessage = null;

      // Inicializar los pasos con formato de matrices
      this.steps = [
        { text: `Paso 1: Matriz A:`, completed: false },
        { text: `\n${this.formatMatrix(matrixA)}`, completed: false },
        { text: `Paso 2: Fórmula para el determinante de una matriz 2x2: `, completed: false },
        { text: `det(A) = (a * d) - (b * c)`, completed: false },
        { text: `Paso 3: Sustituir los valores: (${a} * ${d}) - (${b} * ${c})`, completed: false },
      ];

      this.determinant = this.matrixService.determinant2x2(matrixA); // Calcular el determinante
      this.calculation = 'Determinante de matriz A (2x2)';

      // Reiniciar el índice de pasos
      this.currentStepIndex = 0;

      // Iniciar la visualización de los pasos
      this.showNextStep();
    } catch (error: any) {
      this.resetResults();
      this.errorMessage = error.message;
    }
  }


  async determinant3x3() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);

      // Validar que la matriz sea 3x3
      if (matrixA.length !== 3 || matrixA[0].length !== 3) {
        this.steps = [{
          text: `Error: La matriz debe ser 3x3 para calcular el determinante.`,
          completed: true
        }];
        this.determinant = this.matrixService.determinant3x3(matrixA);
        this.currentStepIndex = 0;
        this.showNextStep();
        return;
      }

      // Limpiamos pasos anteriores
      this.steps = [];
      this.result = null;
      this.animatedResult = '';
      this.errorMessage = null;

      // Matriz con letras para la visualización
      const matrixLetters = [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i']
      ];

      // Generar la representación de las matrices una al lado de la otra
      let matricesJuntas = "";
      for (let i = 0; i < matrixA.length; i++) {
        matricesJuntas += `[${matrixLetters[i].join(', ')}]  [${matrixA[i].join(', ')}] <br>`;
      }

      // Inicializar los pasos con formato de matrices
      this.steps = [
        { text: `Paso 1: Matriz A:`, completed: false },
        { text: ` \n${matricesJuntas}`, completed: false }, // Mostrar matrices juntas
        { text: `Paso 2: Fórmula para el determinante de una matriz 3x3: `, completed: false },
        { text: `det(A) = a(ei − fh) − b(di − fg) + c(dh − eg)`, completed: false },
        // ... pasos intermedios para calcular el determinante ...
        { text: `Paso final: Resultado: ${this.matrixService.determinant3x3(matrixA)}`, completed: false }, // Agregar el resultado como un paso
      ];

      this.determinant = this.matrixService.determinant3x3(matrixA); // Calcular el determinante
      this.calculation = 'Determinante de matriz A (3x3)';

      // Reiniciar el índice de pasos
      this.currentStepIndex = 0;

      // Iniciar la visualización de los pasos
      this.showNextStep();
    } catch (error: any) {
      this.resetResults();
      this.errorMessage = error.message;
    }
  }

  async inverse2x2() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);
      const a = matrixA[0][0];
      const b = matrixA[0][1];
      const c = matrixA[1][0];
      const d = matrixA[1][1];

      // Limpiamos pasos anteriores
      this.steps = [];
      this.result = null;
      this.animatedResult = '';
      this.errorMessage = null;

      // Calcular la inversa (para usar en los pasos)
      const inversa = this.matrixService.inverse2x2(matrixA);
      const det = this.matrixService.determinant2x2(matrixA);

      // Inicializar los pasos con formato de matrices
      this.steps = [
        { text: `Paso 1: Matriz A:`, completed: false },
        { text: `\n${this.formatMatrix(matrixA)}`, completed: false },
        { text: `Paso 2: Fórmula para la inversa de una matriz 2x2:`, completed: false },
        { text: `A<sup>-1</sup> = (1 / det(A)) * adj(A)`, completed: false },
        { text: `donde det(A) es el determinante de A y adj(A) es la adjunta de A.`, completed: false },
        { text: `Paso 3: Calcular el determinante de A: det(A) = (${a} * ${d}) - (${b} * ${c}) = ${det}`, completed: false },
        { text: `Paso 4: Calcular la adjunta de A:`, completed: false },
        { text: `adj(A) = `, completed: false },
        { text: `[${d}, -${b}] <br> [-${c}, ${a}]`, completed: false },
        { text: `Paso 5: Multiplicar la adjunta de A por (1 / det(A)):`, completed: false },
        { text: `(1 / ${det}) * [${d}, -${b}] <br> (1 / ${det}) * [-${c}, ${a}]`, completed: false },
      ];

      this.calculation = 'Inversa de matriz A (2x2)';

      // Reiniciar el índice de pasos
      this.currentStepIndex = 0;
      this.resetResults();

      // Limitar los decimales de la matriz inversa
      this.result = inversa.map(fila => fila.map(elemento => parseFloat(elemento.toFixed(3))));

      // Iniciar la visualización de los pasos
      this.showNextStep();
    } catch (error: any) {
      this.resetResults();
      this.errorMessage = error.message;
    }
  }
  async inverse3x3() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);

      // Validar que la matriz sea 3x3
      if (matrixA.length !== 3 || matrixA[0].length !== 3) {
        this.steps = [{
          text: `Error: La matriz debe ser 3x3 para calcular la inversa.`,
          completed: true
        }];
        this.currentStepIndex = 0;
        this.showNextStep();
        return;
      }

      // Limpiamos pasos anteriores
      this.steps = [];
      this.result = null;
      this.animatedResult = '';
      this.errorMessage = null;

      // Calcular la inversa (para usar en los pasos)
      let inversa = this.matrixService.inverse3x3(matrixA); // Asegúrate de que matrixService tenga esta función
      // Limitar los decimales de la matriz inversa
      inversa = inversa.map(fila => fila.map(elemento => parseFloat(elemento.toFixed(3))));

      // Matriz con letras para la visualización
      const matrixLetters = [
        ['a', 'b', 'c'],
        ['d', 'e', 'f'],
        ['g', 'h', 'i']
      ];

      // Generar la representación de las matrices una al lado de la otra
      let matricesJuntas = "";
      for (let i = 0; i < matrixA.length; i++) {
        matricesJuntas += `[${matrixLetters[i].join(', ')}]  [${matrixA[i].join(', ')}] <br>`;
      }

      // Inicializar los pasos con formato de matrices
      this.steps = [
        { text: `Paso 1: Matriz A:`, completed: false },
        { text: ` \n${matricesJuntas}`, completed: false }, // Mostrar matrices juntas
        { text: `Paso 2: Fórmula para la inversa de una matriz 3x3: A<sup>-1</sup> = (1 / det(A)) * adj(A)`, completed: false },
        { text: `donde det(A) es el determinante de A y adj(A) es la adjunta de A.`, completed: false },
        // ... pasos intermedios para calcular la inversa ...
        { text: `Paso final: Resultado: A<sup>-1</sup> =`, completed: false }
      ];

      this.result = inversa; // Actualizar this.result para mostrarlo en la sección de resultados
      this.calculation = 'Inversa de matriz A (3x3)';

      // Reiniciar el índice de pasos
      this.currentStepIndex = 0;

      // Iniciar la visualización de los pasos
      this.showNextStep();
    } catch (error: any) {
      this.resetResults();
      this.errorMessage = error.message;
    }
  }


  async gaussianElimination2x2() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);
      const a = parseFloat(matrixA[0][0].toFixed(2));
      const b = parseFloat(matrixA[0][1].toFixed(2));
      const c = parseFloat(matrixA[1][0].toFixed(2));
      const d = parseFloat(matrixA[1][1].toFixed(2));

      // Limpiamos pasos anteriores
      this.steps = [];
      this.result = null;
      this.animatedResult = '';
      this.errorMessage = null;

      // Realizar la eliminación gaussiana (para usar en los pasos)
      let eliminacion = this.matrixService.gaussianElimination2x2(matrixA);

      // Limitar los valores de la matriz de eliminación a dos decimales
      eliminacion = eliminacion.map(row => row.map(value => parseFloat(value.toFixed(2))));

      // Calcular el factor para la eliminación
      const factor = parseFloat((-c / a).toFixed(2));

      // Matriz intermedia después de la eliminación
      const matrizIntermedia = [
        [a, b],
        [0, parseFloat((d + b * factor).toFixed(2))]
      ];

      // Inicializar los pasos con formato de matrices
      this.steps = [
        { text: `Paso 1: Matriz A:`, completed: false },
        { text: `\n${this.formatMatrix(matrixA)}`, completed: false },
        { text: `Paso 2: Aplicar la eliminación gaussiana para obtener una matriz triangular superior:`, completed: false },
        { text: `Multiplicar la primera fila por ${factor} y sumarla a la segunda fila:`, completed: false },
        { text: `[${a}, ${b}]`, completed: false },
        { text: `[${c} + (${a} * ${factor}), ${d} + (${b} * ${factor})]`, completed: false },
        { text: `Matriz intermedia:`, completed: false },
        { text: `\n${this.formatMatrix(matrizIntermedia)}`, completed: false }
      ];

      this.result = eliminacion; // Actualizar this.result para mostrarlo en la sección de resultados
      this.calculation = 'Eliminación Gaussiana de matriz A (2x2)';

      // Reiniciar el índice de pasos
      this.currentStepIndex = 0;
      this.resetResults();

      // Iniciar la visualización de los pasos
      this.showNextStep();
    } catch (error: any) {
      this.resetResults();
      this.errorMessage = error.message;
    }
  }

  async gaussianElimination3x3() {
    try {
      const matrixA = this.parseMatrix(this.matrixAInput);

      // Validar que la matriz sea 3x3
      if (matrixA.length !== 3 || matrixA[0].length !== 3) {
        this.steps = [{
          text: `Error: La matriz debe ser 3x3 para realizar la eliminación gaussiana.`,
          completed: true
        }];
        this.currentStepIndex = 0;
        this.showNextStep();
        return;
      }

      // Limpiamos pasos anteriores
      this.steps = [];
      this.result = null;
      this.animatedResult = '';
      this.errorMessage = null;

      // Realizar la eliminación gaussiana (para usar en los pasos)
      let eliminacion = this.matrixService.gaussianElimination3x3(matrixA);

      eliminacion = eliminacion.map(row => row.map(value => parseFloat(value.toFixed(2))));


      // Inicializar los pasos con formato de matrices
      this.steps = [
        { text: `Paso 1: Matriz A:`, completed: false },
        { text: `\n${this.formatMatrix(matrixA)}`, completed: false },
        { text: `Paso 2: Aplicar la eliminación gaussiana para obtener una matriz triangular superior:`, completed: false },
        // ... pasos intermedios para la eliminación gaussiana ...
        { text: `Paso final: Resultado`, completed: false }
      ];

      this.result = eliminacion; // Actualizar this.result para mostrarlo en la sección de resultados
      this.calculation = 'Eliminación Gaussiana de matriz A (3x3)';

      // Reiniciar el índice de pasos
      this.currentStepIndex = 0;

      // Iniciar la visualización de los pasos
      this.showNextStep();
    } catch (error: any) {
      this.resetResults();
      this.errorMessage = error.message;
    }
  }

  formatResult(matrix: number[][]): string {
    return matrix.map(row => row.join(', ')).join(' | ');
  }


  private resetResults() {
    this.result = null;
    this.animatedResult = '';
    this.calculation = null;
  }
  addStep(text: string) {
    this.steps.push({ text, completed: false }); // Añade un nuevo paso
  }

  completeStep(index: number) {
    if (this.steps[index]) {
      this.steps[index].completed = true; // Marca el paso como completado
    }
  }
}
