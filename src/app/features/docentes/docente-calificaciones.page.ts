// src/app/features/docentes/docente-calificaciones.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlumnosService } from '../alumnos/alumnos.service';
import { AuthService } from '../../shared/auth.service';
import { Alumno } from '../../shared/models';

type AlumnoCalificacion = Alumno & {
  notas: (number | null)[];
  promedio: number | null;
  estado: string;
};

type RegistroAlumno = {
  id_alumno: number;
  nombre: string;
  tareas: string[];
  notas: (number | null)[];
  promedio: number | null;
  estado: string;
};

type RegistroStorage = {
  [idAlumno: string]: RegistroAlumno;
};

const STORAGE_KEY = 'colegio.calificaciones';

@Component({
  standalone: true,
  selector: 'app-docente-calificaciones',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container mt-4">

    <h2 class="mb-3">Registro de Calificaciones</h2>

    <div *ngIf="cargando" class="alert alert-info">Cargando alumnos…</div>
    <div *ngIf="error" class="alert alert-danger">No se pudieron cargar los datos.</div>

    <ng-container *ngIf="!cargando && !error">

      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" (click)="agregarTarea()">
            Crear nueva tarea
          </button>
          <button class="btn btn-sm btn-success" (click)="guardarCambios()">
            Guardar cambios
          </button>
        </div>
        <small class="text-muted">
          Por defecto tienes Tarea 1 y Tarea 2; puedes añadir más tareas con el botón.
        </small>
      </div>

      <table class="table table-bordered table-striped text-center" *ngIf="alumnos.length; else sinAlumnos">
        <thead class="table-primary">
          <tr>
            <th>Estudiante</th>
            <th *ngFor="let t of tareas">{{ t }}</th>
            <th>Promedio</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let a of alumnos">
            <td class="text-start">
              {{ a.apellidos }} {{ a.nombres }}
            </td>

            <td *ngFor="let t of tareas; let j = index">
              <input type="number"
                     class="form-control form-control-sm"
                     [(ngModel)]="a.notas[j]"
                     (ngModelChange)="recalcular(a)"
                     min="0" max="10" step="0.1">
            </td>

            <td>
              {{ a.promedio !== null ? a.promedio : '—' }}
            </td>

            <td [ngClass]="a.estado === 'Aprueba'
                           ? 'text-success fw-bold'
                           : (a.estado === 'Reprueba' ? 'text-danger fw-bold' : '')">
              {{ a.estado || '—' }}
            </td>
          </tr>
        </tbody>
      </table>

      <ng-template #sinAlumnos>
        <div class="alert alert-warning">
          No hay alumnos registrados para este docente.
        </div>
      </ng-template>

    </ng-container>

  </div>
  `
})
export class DocenteCalificacionesPage implements OnInit {

  tareas: string[] = ['Tarea 1', 'Tarea 2'];
  alumnos: AlumnoCalificacion[] = [];

  cargando = false;
  error = false;

  constructor(
    private alumnosSrv: AlumnosService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const idDocente = this.getDocenteId();
    this.cargarAlumnos(idDocente);
  }

  private getDocenteId(): number {
    const usuario = this.auth.currentUser;
    const userName = usuario?.username?.toLowerCase() || '';

    if (userName === 'mariacabrera') return 1;
    if (userName === 'carlosmolina') return 2;
    if (userName === 'luispacheco')  return 3;

    console.warn('getDocenteId: usuario no mapeado, usando 1 por defecto');
    return 1;
  }

  private cargarAlumnos(idDocente: number) {
    this.cargando = true;
    this.error = false;

    this.alumnosSrv.listarPorDocente(idDocente).subscribe({
      next: (lista) => {
        const baseNotas = this.tareas.map(() => null as number | null);

        this.alumnos = (lista || []).map(a => ({
          ...a,
          notas: [...baseNotas],
          promedio: null,
          estado: ''
        }));

        this.cargando = false;
      },
      error: (err) => {
        console.error('[DocenteCalificaciones] error cargando alumnos', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }

  agregarTarea() {
    const num = this.tareas.length + 1;
    const nombre = `Tarea ${num}`;
    this.tareas.push(nombre);

    this.alumnos.forEach(a => {
      a.notas.push(null);
      this.recalcular(a);
    });
  }

  recalcular(a: AlumnoCalificacion) {
    const valores = a.notas.filter(v => v !== null && v !== undefined) as number[];

    if (!valores.length) {
      a.promedio = null;
      a.estado = '';
      return;
    }

    const suma = valores.reduce((acc, v) => acc + Number(v), 0);
    const prom = suma / valores.length;

    a.promedio = Number(prom.toFixed(2));
    a.estado  = prom >= 7 ? 'Aprueba' : 'Reprueba';
  }

  guardarCambios() {
    const data: RegistroStorage = {};

    for (const a of this.alumnos) {
      data[String(a.id_alumno)] = {
        id_alumno: a.id_alumno,
        nombre: `${a.apellidos} ${a.nombres}`,
        tareas: [...this.tareas],
        notas: [...a.notas],
        promedio: a.promedio,
        estado: a.estado
      };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    alert('Calificaciones guardadas en el registro del sistema ✔');
  }
}
